use axum::{extract::State, http::Response, response::IntoResponse, routing::get, Router, Server};
use dotenv::dotenv;
use serde_json::json;
use std::{
    sync::{Arc, Mutex},
    time::{Duration, SystemTime, UNIX_EPOCH},
};
use sysinfo::{Components, CpuRefreshKind, MemoryRefreshKind, Networks, RefreshKind, System};

use crate::disks::disks::DiskStats;

mod disks;

#[derive(Clone, serde::Serialize)]
struct HistorySlice {
    cpu: Vec<f32>,
    mem: (u64, u64),
    net: (u64, u64),
    disks: (u64, u64),
    temps: Vec<f32>,
    timestamp: u128,
}

#[derive(Clone)]
struct AppState {
    data: Arc<Mutex<Vec<HistorySlice>>>,
}

impl Default for AppState {
    fn default() -> Self {
        AppState {
            data: Arc::new(Mutex::new(Vec::new())),
        }
    }
}

#[tokio::main]
async fn main() {
    dotenv().ok();
    let refresh_interval = std::env::var("SERVER_REFRESH_INTERVAL").unwrap().parse::<u64>().unwrap();
    let steps = std::env::var("SERVER_STEPS").unwrap().parse::<u64>().unwrap();
    let port = std::env::var("SERVER_PORT").unwrap();
    let app_state = AppState::default();

    let router = Router::new()
        .route("/api/static", get(static_sysinfo_get))
        .route("/api/history", get(history_sysinfo_get))
        .route("/api/dynamic", get(dynamic_sysinfo_get))
        .with_state(app_state.clone());

    // Update system usage in the background
    tokio::task::spawn_blocking(move || {
        let mut sys = System::new();
        let mut components = Components::new_with_refreshed_list();
        let mut networks = Networks::new_with_refreshed_list();
        let mut disk_stats = DiskStats::new();

        loop {
            sys.refresh_cpu();
            sys.refresh_memory();
            components.refresh();
            networks.refresh();
            disk_stats.refresh();

            let cpu_usage: Vec<_> = sys.cpus().iter().map(|cpu| cpu.cpu_usage()).collect();
            let mem_usage = sys.used_memory();
            let swap_usage = sys.used_swap();
            let temps: Vec<_> = components
                .iter()
                .map(|component| component.temperature())
                .collect();
            let (net_down, net_up) =
                networks
                    .iter()
                    .fold((0, 0), |(down, up), (_name, network)| {
                        (down + network.received(), up + network.transmitted())
                    });

            {
                let disks_diff = disk_stats.diff();
                let mut data = app_state.data.lock().unwrap();

                // Get the current time
                let current_time = SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_millis();

                // Find the index of the first element within the last 60 seconds
                let first_index_to_keep = match data.iter().position(|item| {
                    item.timestamp >= current_time - (steps * refresh_interval) as u128
                }) {
                    Some(index) => index,
                    None => 0,
                };

                // Remove elements before the first index to keep
                data.drain(..first_index_to_keep);
                let slice = HistorySlice {
                    cpu: cpu_usage,
                    mem: (mem_usage, swap_usage),
                    net: (net_down, net_up),
                    disks: (disks_diff.read, disks_diff.write),
                    temps,
                    timestamp: SystemTime::now()
                        .duration_since(UNIX_EPOCH)
                        .unwrap()
                        .as_millis(),
                };

                (*data).push(slice);
            }

            std::thread::sleep(Duration::from_millis(refresh_interval));
        }
    });

    let server = Server::bind(&format!("0.0.0.0:{}", port).parse().unwrap())
        .serve(router.into_make_service());
    let addr = server.local_addr();
    println!("Listening on {addr}");

    server.await.unwrap();
}

#[axum::debug_handler]
async fn dynamic_sysinfo_get(State(state): State<AppState>) -> impl IntoResponse {
    let data = state.data.lock().unwrap().clone();

    Response::builder()
        .header(axum::http::header::ORIGIN, "*")
        .header(axum::http::header::ACCESS_CONTROL_ALLOW_ORIGIN, "*")
        .header("content-type", "application/json")
        .body(serde_json::to_string(&(data.last())).unwrap())
        .unwrap()
}
#[axum::debug_handler]
async fn history_sysinfo_get(State(state): State<AppState>) -> impl IntoResponse {
    let data = state.data.lock().unwrap().clone();

    Response::builder()
        .header(axum::http::header::ORIGIN, "*")
        .header(axum::http::header::ACCESS_CONTROL_ALLOW_ORIGIN, "*")
        .header("content-type", "application/json")
        .body(serde_json::to_string(&data).unwrap())
        .unwrap()
}

async fn static_sysinfo_get() -> impl IntoResponse {
    let sys = System::new_with_specifics(
        RefreshKind::new()
            .with_cpu(CpuRefreshKind::everything())
            .with_memory(MemoryRefreshKind::everything()),
    );

    let components = Components::new_with_refreshed_list();

    Response::builder()
        .header(axum::http::header::ORIGIN, "*")
        .header(axum::http::header::ACCESS_CONTROL_ALLOW_ORIGIN, "*")
        .header("content-type", "application/json")
        .body(
            json!({
                "boot_time": System::boot_time(),
                "uptime": System::uptime(),
                "name": System::name(),
                "kernel_version": System::kernel_version(),
                "os_version": System::os_version(),
                "host_name": System::host_name(),
                "total_memory": sys.total_memory(),
                "total_swap": sys.total_swap(),
                "cpu": {
                    "name": sys.cpus()[0].name(),
                    "vendor_id": sys.cpus()[0].vendor_id(),
                    "brand": sys.cpus()[0].brand(),
                },
                "components": components
                .iter()
                .map(|component| component.label())
                .collect::<Vec<_>>()
            })
            .to_string(),
        )
        .unwrap()
}

use axum::{extract::State, http::Response, response::IntoResponse, routing::get, Router, Server};
use serde_json::{json, Value};
use std::{
    sync::{Arc, Mutex},
    time::{Duration, Instant},
};
use sysinfo::{Components, CpuRefreshKind, MemoryRefreshKind, Networks, RefreshKind, System};

use crate::disks::disks::DiskStats;

mod disks;

#[derive(Clone)]
struct AppState {
    latest: Arc<Mutex<Instant>>,
    data: Arc<Mutex<Value>>,
}

impl Default for AppState {
    fn default() -> Self {
        AppState {
            latest: Arc::new(Mutex::new(Instant::now())),
            data: Arc::new(Mutex::new(json!({}))),
        }
    }
}

#[tokio::main]
async fn main() {
    let app_state = AppState::default();

    let router = Router::new()
        .route("/api/dynamic", get(dynamic_sysinfo_get))
        .route("/api/static", get(static_sysinfo_get))
        .with_state(app_state.clone());

    // Update system usage in the background
    tokio::task::spawn_blocking(move || {
        let mut sys = System::new();
        let mut components = Components::new_with_refreshed_list();
        let mut networks = Networks::new_with_refreshed_list();
        let mut disk_stats = DiskStats::new();

        loop {
            let now = Instant::now();
            let latest = app_state.latest.lock().unwrap().clone();

            if (now - latest).as_millis() < 10000 {
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
                    let mut data = app_state.data.lock().unwrap();
                    *data = json!({
                        "cpu_usage": cpu_usage,
                        "mem_usage": mem_usage,
                        "swap_usage": swap_usage,
                        "temps": temps,
                        "network": {
                            "down": net_down,
                            "up": net_up
                        },
                        "disks": disk_stats.diff()
                    });
                }
            }

            std::thread::sleep(Duration::from_millis(200));
        }
    });

    let server = Server::bind(&"0.0.0.0:3001".parse().unwrap()).serve(router.into_make_service());
    let addr = server.local_addr();
    println!("Listening on {addr}");

    server.await.unwrap();
}

#[axum::debug_handler]
async fn dynamic_sysinfo_get(State(state): State<AppState>) -> impl IntoResponse {
    let data = state.data.lock().unwrap().clone();

    {
        let mut latest = state.latest.lock().unwrap();
        *latest = Instant::now()
    }

    Response::builder()
        .header(axum::http::header::ORIGIN, "*")
        .header(axum::http::header::ACCESS_CONTROL_ALLOW_ORIGIN, "*")
        .header("content-type", "application/json")
        .body(data.to_string())
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

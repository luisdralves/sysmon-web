type StaticData = {
  boot_time: number;
  components: string[];
  cpu: {
    brand: string;
    name: string;
    vendor_id: string;
  };
  host_name: string;
  kernel_version: string;
  name: string;
  os_version: string;
  total_memory: number;
  total_swap: number;
  uptime: number;
};

type DynamicData = {
  cpu_usage: number[];
  disks: {
    read: number;
    write: number;
  };
  mem_usage: number;
  network: {
    down: number;
    up: number;
  };
  swap_usage: number;
  temps: number[];
};

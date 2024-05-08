type StaticData = {
  boot_time: number;
  components: string[];
  cpu: {
    brand: string;
    name: string;
    vendor_id: string;
    threads: number;
  };
  host_name: string;
  kernel_version: string;
  name: string;
  os_version: string;
  total_memory: number;
  total_swap: number;
  uptime: number;
};

type HistorySlice = {
  cpu: number[];
  mem: [number, number];
  net: [number, number];
  disks: [number, number];
  temps: number[];
  timestamp: number;
};

type HistoryNormalized = {
  data: HistorySlice[];
  maxes: Record<'net' | 'disks' | 'temps', number>;
};

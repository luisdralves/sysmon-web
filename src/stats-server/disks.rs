pub mod disks {
    use std::{
        fs::File,
        io::{Read, Seek, SeekFrom},
    };

    pub struct DiskUsage {
        pub read: u64,
        pub write: u64,
    }

    impl DiskUsage {
        fn new() -> Self {
            DiskUsage { read: 0, write: 0 }
        }
    }

    pub struct DiskStats {
        fd: File,
        prev: DiskUsage,
    }

    impl DiskStats {
        pub fn new() -> Self {
            let fd = File::open("/proc/diskstats").unwrap();
            DiskStats {
                fd,
                prev: DiskUsage::new(),
            }
        }

        pub fn refresh(&mut self) -> DiskUsage {
            let mut curr = DiskUsage::new();
            let mut io_data = String::new();
            self.fd.read_to_string(&mut io_data).unwrap();
            for line in io_data.lines() {
                let fields: Vec<_> = line.split_whitespace().collect();
                curr.read += fields[5].parse::<u64>().unwrap() * 512 * 8;
                curr.write += fields[9].parse::<u64>().unwrap() * 512 * 8;
            }
            self.fd.seek(SeekFrom::Start(0)).unwrap();
            curr
        }

        pub fn diff(&mut self) -> DiskUsage {
            let curr = self.refresh();
            let diff = DiskUsage {
                read: curr.read - self.prev.read,
                write: curr.write - self.prev.write,
            };
            self.prev = curr;
            diff
        }
    }
}

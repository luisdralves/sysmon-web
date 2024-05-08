import { siAtom } from '@/atoms';
import { useAtomValue } from 'jotai';
import { ChartCard } from './common/card';

export const Disks = () => {
  const isSi = useAtomValue(siAtom);

  return (
    <ChartCard
      title='Disk activity'
      legend={{
        labels: ['Read', 'Write'],
      }}
      hueOffset={120}
      formatOptions={{ units: 'B/s', ...(isSi && { si: true }) }}
      dataKey={'disks'}
      total={2}
    />
  );
};

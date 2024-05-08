import { siAtom } from '@/atoms';
import { useQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import { ChartCard } from './common/card';

export const Disks = () => {
  const { data: historyData } = useQuery<HistorySlice[]>({ queryKey: ['history'] });
  const isSi = useAtomValue(siAtom);

  if (!historyData) {
    return <div />;
  }

  return (
    <ChartCard
      title='Disk activity'
      // @ts-expect-error: write a better union later
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

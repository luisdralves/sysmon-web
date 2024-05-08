import { siAtom } from '@/atoms';
import { useQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import { ChartCard } from './common/card';

export const Network = () => {
  const { data: historyData } = useQuery<HistorySlice[]>({ queryKey: ['history'] });
  const isSi = useAtomValue(siAtom);

  if (!historyData) {
    return <div />;
  }

  return (
    <ChartCard
      title='Network'
      // @ts-expect-error: write a better union later
      legend={{
        labels: ['Down', 'Up'],
      }}
      hueOffset={60}
      formatOptions={{ units: 'B/s', ...(isSi && { si: true }) }}
      dataKey={'net'}
      total={2}
    />
  );
};

import { siAtom } from '@/atoms';
import { useAtomValue } from 'jotai';
import { ChartCard } from './common/card';

export const Network = () => {
  const isSi = useAtomValue(siAtom);

  return (
    <ChartCard
      title='Network'
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

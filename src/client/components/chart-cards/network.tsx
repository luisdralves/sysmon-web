import { siAtom } from '@/atoms';
import { useQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import { ChartCard } from './common/card';

export const Network = () => {
  const { data: dynamicData } = useQuery<DynamicData>({ queryKey: ['dynamic'] });
  const isSi = useAtomValue(siAtom);

  if (!dynamicData) {
    return <div />;
  }

  return (
    <ChartCard
      title='Network'
      legend={{
        labels: ['Down', 'Up'],
      }}
      hueOffset={60}
      formatOptions={{ units: 'B/s', ...(isSi && { si: true }) }}
      data={[dynamicData.network.down, dynamicData.network.up]}
      total={2}
    />
  );
};

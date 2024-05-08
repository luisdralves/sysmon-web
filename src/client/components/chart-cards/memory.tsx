import { siAtom } from '@/atoms';
import { useQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import { ChartCard } from './common/card';

export const Memory = () => {
  const { data: staticData } = useQuery<StaticData>({ queryKey: ['static'] });
  const isSi = useAtomValue(siAtom);

  if (!staticData) {
    return <div />;
  }

  return (
    <ChartCard
      title='Memory'
      legend={{
        totals: [staticData.total_memory, staticData.total_swap],
        labels: ['Memory', 'Swap'],
      }}
      domain={[0, Math.max(staticData.total_memory, staticData.total_swap)]}
      hardDomain
      formatOptions={{ units: 'B', ...(isSi && { si: true }) }}
      dataKey={'mem'}
      total={2}
    />
  );
};

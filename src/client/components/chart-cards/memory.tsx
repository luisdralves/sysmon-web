import { siAtom } from '@/atoms';
import { formatValue } from '@/utils/format';
import { useQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { ChartCard } from './common/card';

export const Memory = () => {
  const { data: staticData } = useQuery<StaticData>({ queryKey: ['static'] });
  const { data: dynamicData } = useQuery<DynamicData>({ queryKey: ['dynamic'] });
  const isSi = useAtomValue(siAtom);
  const formatOptions = { units: 'B', ...(isSi && { si: true }) };

  const formatedTotals = useMemo(() => {
    if (!staticData) {
      return [];
    }
    return [formatValue(staticData.total_memory, formatOptions), formatValue(staticData.total_swap, formatOptions)];
  }, [staticData, formatOptions]);

  if (!staticData || !dynamicData) {
    return <div />;
  }

  return (
    <ChartCard
      title='Memory'
      legend={{
        values: [
          `${formatValue(dynamicData.mem_usage, formatOptions)} / ${formatedTotals[0]}`,
          `${formatValue(dynamicData.swap_usage, formatOptions)} / ${formatedTotals[1]}`,
        ],
        labels: ['Memory', 'Swap'],
      }}
      domain={[0, Math.max(staticData.total_memory, staticData.total_swap)]}
      hardDomain
      formatOptions={formatOptions}
      data={[dynamicData.mem_usage, dynamicData.swap_usage]}
      total={2}
    />
  );
};

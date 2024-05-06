import { formatValue } from '@/utils/format';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { ChartCard } from './common/card';

const formatOptions = { units: 'B' };

export const Memory = () => {
  const { data: staticData } = useQuery<StaticData>({ queryKey: ['static'] });
  const { data: dynamicData } = useQuery<DynamicData>({ queryKey: ['dynamic'] });

  const formatedTotals = useMemo(() => {
    if (!staticData) {
      return [];
    }
    return [formatValue(staticData.total_memory, formatOptions), formatValue(staticData.total_swap, formatOptions)];
  }, [staticData]);

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

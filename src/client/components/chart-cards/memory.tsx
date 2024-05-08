import { siAtom } from '@/atoms';
import { formatValue } from '@/utils/format';
import { useQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { ChartCard } from './common/card';

export const Memory = () => {
  const { data: staticData } = useQuery<StaticData>({ queryKey: ['static'] });
  const { data: historyData } = useQuery<HistorySlice[]>({ queryKey: ['history'] });
  const isSi = useAtomValue(siAtom);
  const formatOptions = { units: 'B', ...(isSi && { si: true }) };

  const formatedTotals = useMemo(() => {
    if (!staticData) {
      return [];
    }
    return [formatValue(staticData.total_memory, formatOptions), formatValue(staticData.total_swap, formatOptions)];
  }, [staticData, formatOptions]);

  const last = useMemo(() => historyData?.at(-1), [historyData]);

  if (!staticData || !historyData || !last) {
    return <div />;
  }

  return (
    <ChartCard
      title='Memory'
      legend={{
        values: [
          `${formatValue(last.mem[0], formatOptions)} / ${formatedTotals[0]}`,
          `${formatValue(last.mem[1], formatOptions)} / ${formatedTotals[1]}`,
        ],
        labels: ['Memory', 'Swap'],
      }}
      domain={[0, Math.max(staticData.total_memory, staticData.total_swap)]}
      hardDomain
      formatOptions={formatOptions}
      dataKey={'mem'}
      total={2}
    />
  );
};

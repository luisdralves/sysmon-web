import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { ChartCard } from './index';

export const Memory = () => {
  const { data: staticData } = useQuery<StaticData>({ queryKey: ['static'] });
  const { data: dynamicData } = useQuery<DynamicData>({ queryKey: ['dynamic'] });
  const [history, setHistory] = useState<number[][]>(new Array(150).fill([]));

  useEffect(() => {
    if (dynamicData) {
      setHistory(history => {
        const newHistory = history.slice(1);
        newHistory.push([dynamicData.mem_usage, dynamicData.swap_usage]);

        return newHistory;
      });
    }
  }, [dynamicData]);

  if (!staticData || !dynamicData) {
    return <div />;
  }

  return (
    <ChartCard
      title='Memory'
      legend={{
        values: [staticData.total_memory, staticData.total_swap],
        labels: ['Total memory', 'Total swap'],
      }}
      domain={[0, Math.max(staticData.total_memory, staticData.total_swap)]}
      formatOptions={{ units: 'B' }}
      data={history}
      total={2}
    />
  );
};

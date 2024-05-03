import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { ChartCard } from './index';

export const Network = () => {
  const { data: dynamicData } = useQuery<DynamicData>({ queryKey: ['dynamic'] });
  const [history, setHistory] = useState<number[][]>(new Array(Number(import.meta.env.CLIENT_GRAPH_STEPS)).fill([]));

  useEffect(() => {
    if (dynamicData) {
      setHistory(history => {
        const newHistory = history.slice(1);
        newHistory.push([dynamicData.network.down, dynamicData.network.up]);

        return newHistory;
      });
    }
  }, [dynamicData]);

  if (!dynamicData) {
    return <div />;
  }

  return (
    <ChartCard
      title='Network'
      legend={{
        values: [dynamicData.network.down, dynamicData.network.up],
        labels: ['Down', 'Up'],
      }}
      hueOffset={60}
      formatOptions={{ units: 'B/s' }}
      data={history}
      total={2}
    />
  );
};

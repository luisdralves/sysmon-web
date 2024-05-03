import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { ChartCard } from './index';

export const Disks = () => {
  const { data: dynamicData } = useQuery<DynamicData>({ queryKey: ['dynamic'] });
  const [history, setHistory] = useState<number[][]>(new Array(Number(import.meta.env.CLIENT_GRAPH_STEPS)).fill([]));

  useEffect(() => {
    if (dynamicData) {
      setHistory(history => {
        const newHistory = history.slice(1);
        newHistory.push([dynamicData.disks.read, dynamicData.disks.write]);

        return newHistory;
      });
    }
  }, [dynamicData]);

  if (!dynamicData) {
    return <div />;
  }

  return (
    <ChartCard
      title='Disk activity'
      legend={{
        values: [dynamicData.disks.read, dynamicData.disks.write],
        labels: ['Read', 'Write'],
      }}
      hueOffset={120}
      formatOptions={{ units: 'B/s' }}
      data={history}
      total={2}
    />
  );
};

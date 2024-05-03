import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { ChartCard } from './index';

export const Temps = () => {
  const { data: staticData } = useQuery<StaticData>({ queryKey: ['static'] });
  const { data: dynamicData } = useQuery<DynamicData>({ queryKey: ['dynamic'] });
  const [history, setHistory] = useState<number[][]>(new Array(150).fill([]));

  useEffect(() => {
    if (dynamicData) {
      setHistory(history => {
        const newHistory = history.slice(1);
        newHistory.push(dynamicData.temps);

        return newHistory;
      });
    }
  }, [dynamicData]);

  if (!staticData || !dynamicData) {
    return <div />;
  }

  return (
    <ChartCard
      title='Temperatures'
      legend={{
        values: dynamicData.temps,
        labels: staticData.components,
      }}
      formatOptions={{ si: true, prefix: false, units: 'ºC' }}
      data={history}
      total={staticData.components.length}
    />
  );
};

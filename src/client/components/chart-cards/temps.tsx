import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { ChartCard } from './index';

export const Temps = () => {
  const { data: staticData } = useQuery<StaticData>({ queryKey: ['static'] });
  const { data: dynamicData } = useQuery<DynamicData>({ queryKey: ['dynamic'] });
  const [history, setHistory] = useState<number[][]>(new Array(Number(import.meta.env.CLIENT_GRAPH_STEPS)).fill([]));

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
      domain={[0, (max: number) => Math.max(100, Math.ceil(1.25*max))]}
      formatOptions={{ si: true, prefix: false, units: 'ºC' }}
      data={history}
      total={staticData.components.length}
    />
  );
};

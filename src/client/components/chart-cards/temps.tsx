import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
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

  const total_sensors = useMemo(() => history.at(-1)?.length ?? 0, [history]);

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
      formatOptions={{ units: 'ºC' }}
      data={history}
      total={total_sensors}
    />
  );
};

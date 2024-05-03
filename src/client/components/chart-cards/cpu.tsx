import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { ChartCard } from './index';

export const Cpu = () => {
  const { data: staticData } = useQuery<StaticData>({ queryKey: ['static'] });
  const { data: dynamicData } = useQuery<DynamicData>({ queryKey: ['dynamic'] });
  const [history, setHistory] = useState<number[][]>(new Array(Number(import.meta.env.CLIENT_GRAPH_STEPS)).fill([]));

  useEffect(() => {
    if (dynamicData) {
      setHistory(history => {
        const newHistory = history.slice(1);
        newHistory.push(dynamicData.cpu_usage);

        return newHistory;
      });
    }
  }, [dynamicData]);

  if (!staticData || !dynamicData) {
    return <div />;
  }

  const total_cpus = dynamicData.cpu_usage.length;

  return (
    !!total_cpus && (
      <ChartCard
        title='CPU'
        subtitle={
          <h3>
            {staticData.cpu.brand}
            <small>{` (${total_cpus} threads)`}</small>
          </h3>
        }
        domain={[0, 100]}
        formatOptions={{ prefix: false, units: '%' }}
        data={history}
        total={total_cpus}
      />
    )
  );
};

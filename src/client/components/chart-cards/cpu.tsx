import { useQuery } from '@tanstack/react-query';
import { ChartCard } from './common/card';

export const Cpu = () => {
  const { data: staticData } = useQuery<StaticData>({ queryKey: ['static'] });
  const { data: historyData } = useQuery<HistorySlice[]>({ queryKey: ['history'] });

  if (!staticData || !historyData) {
    return <div />;
  }

  const total_cpus = historyData[0].cpu.length;

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
        hardDomain
        formatOptions={{ prefix: false, units: '%' }}
        dataKey={'cpu'}
        total={total_cpus}
      />
    )
  );
};

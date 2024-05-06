import { useQuery } from '@tanstack/react-query';
import { ChartCard } from './common/card';

export const Cpu = () => {
  const { data: staticData } = useQuery<StaticData>({ queryKey: ['static'] });
  const { data: dynamicData } = useQuery<DynamicData>({ queryKey: ['dynamic'] });

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
        hardDomain
        formatOptions={{ prefix: false, units: '%' }}
        data={dynamicData.cpu_usage}
        total={total_cpus}
      />
    )
  );
};

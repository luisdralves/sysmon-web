import { useQuery } from '@tanstack/react-query';
import { ChartCard } from './common/card';

export const Cpu = () => {
  const { data: staticData } = useQuery<StaticData>({ queryKey: ['static'] });

  if (!staticData) {
    return <div />;
  }

  return (
    <ChartCard
      title='CPU'
      subtitle={
        <h3>
          {staticData.cpu.brand}
          <small>{` (${staticData.cpu.threads} threads)`}</small>
        </h3>
      }
      domain={[0, 100]}
      hardDomain
      formatOptions={{ prefix: false, units: '%' }}
      dataKey={'cpu'}
      total={staticData.cpu.threads}
    />
  );
};

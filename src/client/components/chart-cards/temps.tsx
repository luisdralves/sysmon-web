import { useQuery } from '@tanstack/react-query';
import { ChartCard } from './common/card';

export const Temps = () => {
  const { data: staticData } = useQuery<StaticData>({ queryKey: ['static'] });
  const { data: dynamicData } = useQuery<DynamicData>({ queryKey: ['dynamic'] });

  if (!staticData || !dynamicData) {
    return <div />;
  }

  return (
    <ChartCard
      title='Temperatures'
      legend={{
        labels: staticData.components,
      }}
      domain={[0, 100]}
      formatOptions={{ si: true, prefix: false, units: 'ºC' }}
      data={dynamicData.temps}
      total={staticData.components.length}
    />
  );
};

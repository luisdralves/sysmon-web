import { useQuery } from '@tanstack/react-query';
import { ChartCard } from './common/card';

export const Temps = () => {
  const { data: staticData } = useQuery<StaticData>({ queryKey: ['static'] });

  if (!staticData) {
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
      dataKey={'temps'}
      total={staticData.components.length}
    />
  );
};

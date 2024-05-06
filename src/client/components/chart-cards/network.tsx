import { useQuery } from '@tanstack/react-query';
import { ChartCard } from './common/card';

export const Network = () => {
  const { data: dynamicData } = useQuery<DynamicData>({ queryKey: ['dynamic'] });

  if (!dynamicData) {
    return <div />;
  }

  return (
    <ChartCard
      title='Network'
      legend={{
        labels: ['Down', 'Up'],
      }}
      hueOffset={60}
      formatOptions={{ units: 'B/s' }}
      data={[dynamicData.network.down, dynamicData.network.up]}
      total={2}
    />
  );
};

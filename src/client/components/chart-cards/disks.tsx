import { useQuery } from '@tanstack/react-query';
import { ChartCard } from './common/card';

export const Disks = () => {
  const { data: dynamicData } = useQuery<DynamicData>({ queryKey: ['dynamic'] });

  if (!dynamicData) {
    return <div />;
  }

  return (
    <ChartCard
      title='Disk activity'
      legend={{
        labels: ['Read', 'Write'],
      }}
      hueOffset={120}
      formatOptions={{ units: 'B/s' }}
      data={[dynamicData.disks.read, dynamicData.disks.write]}
      total={2}
    />
  );
};

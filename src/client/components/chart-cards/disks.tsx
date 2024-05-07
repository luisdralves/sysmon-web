import { siAtom } from '@/atoms';
import { useQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import { ChartCard } from './common/card';

export const Disks = () => {
  const { data: dynamicData } = useQuery<DynamicData>({ queryKey: ['dynamic'] });
  const isSi = useAtomValue(siAtom);

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
      formatOptions={{ units: 'B/s', ...(isSi && { si: true }) }}
      data={[dynamicData.disks.read, dynamicData.disks.write]}
      total={2}
    />
  );
};

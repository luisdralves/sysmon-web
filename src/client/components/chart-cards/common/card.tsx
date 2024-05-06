import { Legend, type LegendProps } from '@/components/chart-cards/common/legend';
import type { FormatOptions } from '@/utils/format';
import type { ReactNode } from 'react';
import { CanvasChart } from './chart';

type Props = {
  title: ReactNode;
  subtitle?: ReactNode;
  legend?: Omit<LegendProps, 'values'> & Partial<Pick<LegendProps, 'values'>>;
  formatOptions?: FormatOptions;
  domain?: [number, number];
  hueOffset?: number;
  data: number[];
  total: number;
};

export const ChartCard = ({ data, domain, legend, hueOffset = 0, title, subtitle, formatOptions, total }: Props) => {
  return (
    <div className='chart-card'>
      <h2>{title}</h2>

      {subtitle}

      {legend && <Legend hueOffset={hueOffset} formatOptions={formatOptions} values={data} {...legend} />}

      <CanvasChart data={data} hueOffset={hueOffset} domain={domain} total={total} formatOptions={formatOptions} />
    </div>
  );
};

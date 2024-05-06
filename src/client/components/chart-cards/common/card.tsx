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
  hardDomain?: boolean;
  hueOffset?: number;
  data: number[];
  total: number;
};

export const ChartCard = ({ data, legend, hueOffset = 0, title, subtitle, formatOptions, ...rest }: Props) => {
  return (
    <div className='chart-card'>
      <h2>{title}</h2>

      {subtitle}

      {legend && <Legend hueOffset={hueOffset} formatOptions={formatOptions} values={data} {...legend} />}

      <CanvasChart data={data} hueOffset={hueOffset} formatOptions={formatOptions} {...rest} />
    </div>
  );
};

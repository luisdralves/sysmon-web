import { Legend, type LegendProps } from '@/components/chart-cards/common/legend';
import type { FormatOptions } from '@/utils/format';
import type { ReactNode } from 'react';
import { CanvasChart } from './chart';

type Props = {
  title: ReactNode;
  subtitle?: ReactNode;
  legend?: LegendProps;
  formatOptions?: FormatOptions;
  domain?: [number, number];
  hardDomain?: boolean;
  hueOffset?: number;
  dataKey: Exclude<keyof HistorySlice, 'timestamp'>;
  total: number;
};

export const ChartCard = ({ dataKey, legend, hueOffset = 0, title, subtitle, formatOptions, ...rest }: Props) => {
  return (
    <div className='chart-card'>
      <h2>{title}</h2>

      {subtitle}

      {legend && (
        <Legend
          hueOffset={hueOffset}
          formatOptions={formatOptions}
          {...legend}
          {...(!('values' in legend) && { dataKey })}
        />
      )}

      <CanvasChart dataKey={dataKey} hueOffset={hueOffset} formatOptions={formatOptions} {...rest} />
    </div>
  );
};

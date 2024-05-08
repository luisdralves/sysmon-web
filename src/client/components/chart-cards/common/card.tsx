import { Legend, type LegendByDataProps, type LegendByKeyProps } from '@/components/chart-cards/common/legend';
import type { FormatOptions } from '@/utils/format';
import type { ReactNode } from 'react';
import { CanvasChart } from './chart';

type Props = {
  title: ReactNode;
  subtitle?: ReactNode;
  legend?: Omit<LegendByKeyProps, 'dataKey'> | LegendByDataProps;
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

      {legend && (dataKey || 'values' in legend) && (
        // @ts-expect-error: not inferable, but safe
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

import { getTextColor } from '@/utils/colors';
import { type FormatOptions, formatValue } from '@/utils/format';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import './index.css';

type LegendCommonProps = {
  labels: string[];
  formatOptions?: FormatOptions;
  hueOffset?: number;
};

type LegendByKeyProps = LegendCommonProps & {
  dataKey: Exclude<keyof HistorySlice, 'timestamp'>;
};

type LegendByDataProps = LegendCommonProps & {
  values: string[] | number[];
};

export type LegendProps = LegendByDataProps | LegendByKeyProps;

export const LegendByData = ({ labels, formatOptions, hueOffset = 0, values }: LegendByDataProps) => (
  <div className='legend-wrapper'>
    {labels.map((label, index) => (
      <div key={labels[index]}>
        <small style={{ color: getTextColor((hueOffset + (360 * index) / values.length) % 360) }}>{label}</small>
        <h4>
          {(() => {
            const value = values[index];
            return typeof value === 'string' ? value : formatValue(value, formatOptions);
          })()}
        </h4>
      </div>
    ))}
  </div>
);

export const LegendByKey = ({ dataKey, ...rest }: LegendByKeyProps) => {
  const { data: historyData } = useQuery<HistorySlice[]>({ queryKey: ['history'] });
  const values = useMemo(() => historyData?.at(-1)?.[dataKey], [historyData, dataKey]);
  if (values) {
    return <LegendByData {...rest} values={values} />;
  }
};

export const Legend = (props: LegendProps) => {
  if ('values' in props) {
    return <LegendByData {...props} />;
  }

  return <LegendByKey {...props} />;
};

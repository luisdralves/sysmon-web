import { getTextColor } from '@/utils/colors';
import { type FormatOptions, formatValue } from '@/utils/format';
import { useQuery } from '@tanstack/react-query';
import { memo, useMemo } from 'react';
import './index.css';

export type LegendCommonProps = {
  labels: string[];
  formatOptions?: FormatOptions;
  hueOffset?: number;
};

export type LegendByKeyProps = LegendCommonProps & {
  dataKey: Exclude<keyof HistorySlice, 'timestamp'>;
  totals?: number[];
};

export type LegendByDataProps = LegendCommonProps & {
  values: string[] | number[];
};

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

export const LegendByKey = memo(({ dataKey, totals, formatOptions, ...rest }: LegendByKeyProps) => {
  const { data: dynamicData } = useQuery<HistorySlice>({ queryKey: ['dynamic'] });
  const values = useMemo(
    () =>
      dynamicData?.[dataKey]?.map((value, index) => {
        if (totals) {
          return `${formatValue(value, formatOptions)} / ${formatValue(totals[index], formatOptions)}`;
        }

        return formatValue(value, formatOptions);
      }),
    [dynamicData, dataKey, formatOptions, totals],
  );

  if (values) {
    return <LegendByData {...rest} values={values} />;
  }
});

export const Legend = (props: LegendByDataProps | LegendByKeyProps) => {
  if ('values' in props) {
    return <LegendByData {...props} />;
  }

  return <LegendByKey {...props} />;
};

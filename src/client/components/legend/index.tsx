import { getTextColor } from '@/utils/colors';
import { type FormatOptions, formatValue } from '@/utils/format';
import './index.css';

export type LegendProps = {
  labels: string[];
  values: number[];
  formatOptions?: FormatOptions;
  hueOffset?: number;
};

export const Legend = ({ labels, values, formatOptions, hueOffset = 0 }: LegendProps) => (
  <div className='legend-wrapper'>
    {labels.map((label, index) => (
      <div key={labels[index]}>
        <small style={{ color: getTextColor((hueOffset + (360 * index) / values.length) % 360) }}>{label}</small>
        <h4>{formatValue(values[index], formatOptions)}</h4>
      </div>
    ))}
  </div>
);

import { getTextColor } from '@/utils/colors';
import { type FormatOptions, formatValue } from '@/utils/format';
import './index.css';

export type LegendProps = {
  labels: string[];
  values: string[] | number[];
  formatOptions?: FormatOptions;
  hueOffset?: number;
};

export const Legend = ({ labels, values, formatOptions, hueOffset = 0 }: LegendProps) => (
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

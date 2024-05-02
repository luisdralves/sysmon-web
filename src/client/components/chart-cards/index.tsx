import { Legend, type LegendProps } from '@/components/legend';
import { getFillColor, getStrokeColor } from '@/utils/colors';
import { type FormatOptions, formatValue } from '@/utils/format';
import type { ReactNode } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import type { AxisDomain } from 'recharts/types/util/types';

type Props = {
  title: ReactNode;
  subtitle?: ReactNode;
  legend?: LegendProps;
  formatOptions?: FormatOptions;
  domain?: AxisDomain;
  hueOffset?: number;
  data: number[][];
  total: number;
};

export const ChartCard = ({ data, domain, legend, hueOffset = 0, title, subtitle, formatOptions, total }: Props) => {
  return (
    <div className='chart-card'>
      <h2>{title}</h2>

      {subtitle}

      {legend && <Legend hueOffset={hueOffset} formatOptions={formatOptions} {...legend} />}

      <ResponsiveContainer>
        <AreaChart
          width={500}
          height={300}
          data={data}
          margin={{
            bottom: -16,
            left: 40,
          }}
        >
          <CartesianGrid vertical={false} stroke='var(--color-neutral1)' />

          <YAxis
            axisLine={false}
            domain={domain}
            stroke='var(--color-neutral1)'
            tick={{ fill: 'var(--color-neutral2)' }}
            tickFormatter={value => formatValue(value, formatOptions)}
          />

          {Array.from({ length: total }).map((_, index) => (
            // biome-ignore lint/correctness/useJsxKeyInIterable: order irrelevant
            <Area
              isAnimationActive={false}
              type='monotone'
              dataKey={index}
              fill={getFillColor(((index * 360) / total + hueOffset) % 360)}
              stroke={getStrokeColor(((index * 360) / total + hueOffset) % 360)}
              strokeWidth={2}
              dot={false}
            />
          ))}

          <XAxis tick={false} stroke='var(--color-neutral0)' strokeWidth={2} transform='translate(0 1)' />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

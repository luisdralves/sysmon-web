import { type FormatOptions, formatValue } from '@/utils/format';

type Props = {
  formatOptions?: FormatOptions;
  max: number;
};

export const YAxis = ({ max, formatOptions }: Props) => (
  <div className='y-axis'>
    {Array.from({ length: 5 }).map((_, index) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: supress react console error
      <div key={index}>{formatValue((max * (4 - index)) / 4, formatOptions)}</div>
    ))}
  </div>
);

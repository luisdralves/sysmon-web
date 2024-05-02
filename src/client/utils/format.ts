const prefixes = ['', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];

export type FormatOptions = { decimals?: number; prefix?: boolean; si?: boolean; units?: string };

export const formatValue = (value: number, { decimals = 1, prefix = true, si, units = 'B' }: FormatOptions = {}) => {
  if (!value) {
    return `0\u2009${units}`;
  }

  if (!prefix) {
    return `${value}\u2009${units}`;
  }

  const k = si ? 1000 : 1024;
  const i = Math.floor(Math.log(value) / Math.log(k));

  return `${Number((value / k ** i).toFixed(Math.max(0, decimals)))}\u2009${prefixes[i]}${
    i > 0 && !si ? 'i' : ''
  }${units}`;
};

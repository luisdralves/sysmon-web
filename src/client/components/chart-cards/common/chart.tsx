import { useAnimationFrame } from '@/hooks/use-animation-frame';
import { getFillColor, getStrokeColor } from '@/utils/colors';
import { type FormatOptions, formatValue } from '@/utils/format';
import { useEffect, useMemo, useRef, useState } from 'react';
import './chart.css';

const stepWindow = Number(import.meta.env.CLIENT_GRAPH_STEPS);
const stepPeriod = Number(import.meta.env.CLIENT_REFETCH_INTERVAL);
const width = 640;
const height = 480;
const xMargin = 4;
const fps = 30;
const framePeriod = 1000 / fps;

type Props = {
  total: number;
  data: number[];
  domain?: [number, number];
  formatOptions?: FormatOptions;
  hueOffset?: number;
};

const xFromTimestamp = (timestamp: number) =>
  ((timestamp - Date.now()) / stepPeriod) * (width / stepWindow) + width + (width / stepWindow) * 2;

const YAxis = ({ max, formatOptions }: Pick<Props, 'formatOptions'> & { max: number }) => (
  <div className='y-axis'>
    {Array.from({ length: 5 }).map((_, index) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: supress react console error
      <div key={index}>{formatValue((max * (4 - index)) / 4, formatOptions)}</div>
    ))}
  </div>
);

const CartesianGrid = () => (
  <svg
    className='cartesian-grid'
    version='1.1'
    xmlns='http://www.w3.org/2000/svg'
    width='100%'
    height='100%'
    viewBox={`0 0 ${width} ${height}`}
    preserveAspectRatio='none'
    vectorEffect='non-scaling-stroke'
  >
    <title>{'Cartesian grid'}</title>

    {Array.from({ length: 5 }).map((_, index) => (
      <line
        x1={'0'}
        x2={'100%'}
        // biome-ignore lint/suspicious/noArrayIndexKey: supress react console error
        key={index}
        y1={Math.max(1, Math.min(height - 1, (height * index) / 4))}
        y2={Math.max(1, Math.min(height - 1, (height * index) / 4))}
        stroke='var(--color-neutral1)'
        strokeWidth={1}
      />
    ))}
  </svg>
);

export const CanvasChart = ({ total, hueOffset = 0, domain, data, formatOptions }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  const ignored = useRef(0);
  const now = useMemo(() => Date.now(), []);
  const [history, setHistory] = useState<[number, number[]][]>([[now, []]]);
  const max = useMemo(() => {
    if (domain) {
      return domain[1];
    }

    return 1.25 * history.reduce((max, [_, values]) => Math.max(max, ...values), 0);
  }, [history, domain]);

  useEffect(() => {
    if (data) {
      setHistory(history => {
        const firstValidIndex = history.findIndex(([timestamp]) => xFromTimestamp(timestamp) >= -xMargin);
        const newHistory = history.slice(firstValidIndex);
        newHistory.push([Date.now(), data]);

        return newHistory;
      });
    }
  }, [data]);

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) {
      return;
    }

    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  useAnimationFrame(dt => {
    ignored.current += dt;
    if (ignored.current < framePeriod) {
      return;
    }
    ignored.current = 0;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < total; i++) {
      ctx.fillStyle = getFillColor(hueOffset + (360 * Number(i)) / total);
      ctx.strokeStyle = getStrokeColor(hueOffset + (360 * Number(i)) / total);
      ctx.beginPath();
      ctx.moveTo(-xMargin, height);
      ctx.lineTo(-xMargin, height - (height * (history[0][1][i] ?? 0)) / max);
      for (const [timestamp, values] of history) {
        const x = xFromTimestamp(timestamp);
        const y = height - (height * (values[i] ?? 0)) / max;

        ctx.lineTo(x, y);
      }
      ctx.lineTo(width + xMargin, height - (height * (history[0][1][i] ?? 0)) / max);
      ctx.lineTo(width + xMargin, height);
      ctx.stroke();
      ctx.fill();
      ctx.closePath();
    }
  });

  return (
    <div className='chart'>
      <YAxis max={max} formatOptions={formatOptions} />

      <div className='canvas-wrapper'>
        <CartesianGrid />

        <canvas ref={canvasRef} width={width} height={height} />
      </div>
    </div>
  );
};

import { historyAtom } from '@/atoms';
import { useAnimationFrame } from '@/hooks/use-animation-frame';
import { getFillColor, getStrokeColor } from '@/utils/colors';
import type { FormatOptions } from '@/utils/format';
import { useAtomValue } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import './index.css';
import { YAxis } from './y-axis';

const stepWindow = Number(import.meta.env.SERVER_STEPS);
const stepPeriod = Number(import.meta.env.CLIENT_REFETCH_INTERVAL);
const xMargin = 4;

type Props = {
  total: number;
  dataKey: Exclude<keyof HistorySlice, 'timestamp'>;
  domain?: [number, number];
  hardDomain?: boolean;
  formatOptions?: FormatOptions;
  hueOffset?: number;
};

const xFromTimestamp = (timestamp: number, width: number) =>
  ((timestamp - Date.now()) / stepPeriod) * (width / stepWindow) + width + (width / stepWindow) * 2;

export const CanvasChart = ({ total, hueOffset = 0, domain, hardDomain, dataKey, formatOptions }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  const history = useAtomValue(historyAtom);
  const [lockedTargetMax, setLockedTargetMax] = useState(domain?.[1] ?? 0);
  const max = useRef(lockedTargetMax);

  const [width, setWidth] = useState(640);
  const [height, setHeight] = useState(480);

  // Sync canvas size to actual element dimensions
  useEffect(() => {
    const onResize = () => {
      const dimensions = canvasRef.current.getBoundingClientRect();
      const newWidth = dimensions.width * window.devicePixelRatio;
      setWidth(newWidth);
      setHeight(dimensions.height * window.devicePixelRatio);
    };

    onResize();

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Redraw chart
  useAnimationFrame(() => {
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx || !history.current) {
      return;
    }

    const targetMax = (() => {
      if (domain && hardDomain) {
        return domain[1];
      }

      const historyMax = history.current.maxes[dataKey as keyof typeof history.current.maxes] ?? 0;

      if (!domain || historyMax > domain[1]) {
        return historyMax;
      }

      return domain[1];
    })();

    if (lockedTargetMax !== targetMax) {
      setLockedTargetMax(targetMax);
    }

    if (!hardDomain) {
      max.current = (4 * max.current + targetMax) / 5;
    }

    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = window.devicePixelRatio;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const mappedHeight = Math.floor((height * max.current) / targetMax);
    if (mappedHeight) {
      for (let i = mappedHeight; i >= 0; i -= mappedHeight / 4) {
        const clamped = Math.max(Math.min(i, height - 1), 1);
        ctx.strokeStyle = getComputedStyle(canvasRef.current).getPropertyValue('--color-background1');
        ctx.beginPath();
        ctx.moveTo(-xMargin, clamped);
        ctx.lineTo(width + xMargin, clamped);
        ctx.stroke();
        ctx.closePath();
      }
    }

    ctx.lineWidth = 2 * window.devicePixelRatio;

    const drawSeries = (type: 'fill' | 'stroke') => {
      for (let i = 0; i < total; i++) {
        if (type === 'fill') ctx.fillStyle = getFillColor(hueOffset + (360 * Number(i)) / total);
        if (type === 'stroke') ctx.strokeStyle = getStrokeColor(hueOffset + (360 * Number(i)) / total);

        ctx.beginPath();
        ctx.moveTo(-xMargin, height);
        ctx.lineTo(-xMargin, height - (height * (history.current.data[0][dataKey][i] ?? 0)) / max.current);

        for (const { timestamp, [dataKey]: values } of history.current.data) {
          const x = xFromTimestamp(timestamp, width);
          const y = height - (height * (values[i] ?? 0)) / max.current;

          ctx.lineTo(x, y);
        }

        ctx.lineTo(width + xMargin, height - (height * (history.current.data[0][dataKey][i] ?? 0)) / max.current);
        ctx.lineTo(width + xMargin, height);

        if (type === 'fill') ctx.fill();
        if (type === 'stroke') ctx.stroke();

        ctx.closePath();
      }
    };

    drawSeries('fill');
    drawSeries('stroke');
  });

  return (
    <div className='chart'>
      <YAxis max={lockedTargetMax} formatOptions={formatOptions} />

      <div className='canvas-wrapper'>
        <canvas ref={canvasRef} width={width} height={height} />
      </div>
    </div>
  );
};

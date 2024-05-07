import { useAnimationFrame } from '@/hooks/use-animation-frame';
import { getFillColor, getStrokeColor } from '@/utils/colors';
import type { FormatOptions } from '@/utils/format';
import { useEffect, useMemo, useRef, useState } from 'react';
import './index.css';
import { YAxis } from './y-axis';

const stepWindow = Number(import.meta.env.CLIENT_GRAPH_STEPS);
const stepPeriod = Number(import.meta.env.CLIENT_REFETCH_INTERVAL);
const xMargin = 4;
const fps = 30;

type Props = {
  total: number;
  data: number[];
  domain?: [number, number];
  hardDomain?: boolean;
  formatOptions?: FormatOptions;
  hueOffset?: number;
};

const xFromTimestamp = (timestamp: number, width: number) =>
  ((timestamp - Date.now()) / stepPeriod) * (width / stepWindow) + width + (width / stepWindow) * 2;

export const CanvasChart = ({ total, hueOffset = 0, domain, hardDomain, data, formatOptions }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  const now = useMemo(() => Date.now(), []);
  const history = useRef<[number, number[]][]>([[now, []]]);
  const [historyMax, setHistoryMax] = useState(0);
  const targetMax = useMemo(() => {
    if (domain && hardDomain) {
      return domain[1];
    }

    if (!domain || historyMax > domain[1]) {
      return 1.25 * historyMax;
    }

    return domain[1];
  }, [domain, hardDomain, historyMax]);
  const max = useRef(targetMax);

  const [width, setWidth] = useState(640);
  const [height, setHeight] = useState(480);

  // Record data changes
  useEffect(() => {
    if (data) {
      while (xFromTimestamp(history.current[0][0], width) < -xMargin) {
        history.current.shift();
      }

      history.current.push([Date.now(), data]);
      setHistoryMax(history.current.reduce((max, [_, values]) => Math.max(max, ...values), 0));
    }
  }, [data, width]);

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
    if (!ctx) {
      return;
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
        ctx.lineTo(-xMargin, height - (height * (history.current[0][1][i] ?? 0)) / max.current);

        for (const [timestamp, values] of history.current) {
          const x = xFromTimestamp(timestamp, width);
          const y = height - (height * (values[i] ?? 0)) / max.current;

          ctx.lineTo(x, y);
        }

        ctx.lineTo(width + xMargin, height - (height * (history.current[0][1][i] ?? 0)) / max.current);
        ctx.lineTo(width + xMargin, height);

        if (type === 'fill') ctx.fill();
        if (type === 'stroke') ctx.stroke();

        ctx.closePath();
      }
    };

    drawSeries('fill');
    drawSeries('stroke');
  }, fps);

  return (
    <div className='chart'>
      <YAxis max={targetMax} formatOptions={formatOptions} />

      <div className='canvas-wrapper'>
        <canvas ref={canvasRef} width={width} height={height} />
      </div>
    </div>
  );
};

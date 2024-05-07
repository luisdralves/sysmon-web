import { highFpsAtom } from '@/atoms';
import { useAtomValue } from 'jotai';
import { useEffect, useRef } from 'react';

export const useAnimationFrame = (callback: (dt: number) => void, fps?: number) => {
  const ignored = useRef(0);
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  const highFps = useAtomValue(highFpsAtom);
  const autoFps = fps ?? (highFps ? 30 : 4);

  useEffect(() => {
    const animate: FrameRequestCallback = time => {
      if (previousTimeRef.current !== undefined) {
        const deltaTime = time - previousTimeRef.current;
        ignored.current += deltaTime;

        if (ignored.current > 1000 / autoFps) {
          ignored.current = 0;
          callback(deltaTime);
        }
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [callback, autoFps]);
};

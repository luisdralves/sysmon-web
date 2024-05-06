import { useEffect, useRef } from 'react';

export const useAnimationFrame = (callback: (dt: number) => void, fps = 60) => {
  const ignored = useRef(0);
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  useEffect(() => {
    const animate: FrameRequestCallback = time => {
      if (previousTimeRef.current !== undefined) {
        const deltaTime = time - previousTimeRef.current;
        ignored.current += deltaTime;

        if (ignored.current > 1000 / fps) {
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
  }, [callback, fps]);
};

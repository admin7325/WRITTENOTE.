import { useCallback, useRef } from 'react';

export function useLongPress(onLongPress: () => void, ms: number = 500) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPress = useRef(false);
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);

  const start = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    isLongPress.current = false;
    
    if ('touches' in e && e.touches.length > 0) {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    }

    timerRef.current = setTimeout(() => {
      isLongPress.current = true;
      onLongPress();
    }, ms);
  }, [onLongPress, ms]);

  const move = useCallback((e: React.TouchEvent) => {
    if (timerRef.current && e.touches.length > 0) {
      const dx = Math.abs(e.touches[0].clientX - touchStartX.current);
      const dy = Math.abs(e.touches[0].clientY - touchStartY.current);
      // Cancel long press if user scrolls or moves touch significantly
      if (dx > 10 || dy > 10) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }
  }, []);

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  return {
    onMouseDown: start,
    onTouchStart: start,
    onTouchMove: move,
    onTouchEnd: stop,
    onMouseUp: stop,
    onMouseLeave: stop,
    isLongPress,
  };
}

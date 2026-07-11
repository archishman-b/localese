import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Enables iOS-style swipe-from-left-edge to go back.
 * Only triggers when the touch starts within 35px of the left edge.
 */
export function useSwipeBack(enabled = true) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!enabled) return;

    let startX = 0;
    let startY = 0;
    let startTime = 0;

    const onTouchStart = (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      startTime = Date.now();
    };

    const onTouchEnd = (e) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const deltaX = endX - startX;
      const deltaY = Math.abs(endY - startY);
      const elapsed = Date.now() - startTime;

      // Must start within 35px of left edge, swipe right 70px+, mostly horizontal, under 600ms
      if (startX < 35 && deltaX > 70 && deltaY < 80 && elapsed < 600) {
        navigate(-1);
      }
    };

    document.addEventListener('touchstart', onTouchStart, { passive: true });
    document.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchend', onTouchEnd);
    };
  }, [navigate, enabled]);
}

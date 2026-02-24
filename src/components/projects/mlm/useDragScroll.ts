import { useEffect, useRef, type RefObject } from 'react';

export function useDragScroll(containerRef: RefObject<HTMLDivElement | null>) {
  const isGrabbing = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const scrollLeftStart = useRef(0);
  const scrollTopStart = useRef(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Center scroll on mount
    el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
    el.scrollTop = Math.max(0, (el.scrollHeight - el.clientHeight) / 4);

    const onMouseDown = (e: MouseEvent) => {
      // Don't drag if clicking on interactive elements
      if ((e.target as HTMLElement).closest('button, input, select, [data-interactive]')) return;
      isGrabbing.current = true;
      startX.current = e.clientX;
      startY.current = e.clientY;
      scrollLeftStart.current = el.scrollLeft;
      scrollTopStart.current = el.scrollTop;
      el.style.cursor = 'grabbing';
      e.preventDefault();
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isGrabbing.current) return;
      const dx = e.clientX - startX.current;
      const dy = e.clientY - startY.current;
      el.scrollLeft = scrollLeftStart.current - dx;
      el.scrollTop = scrollTopStart.current - dy;
    };

    const onMouseUp = () => {
      isGrabbing.current = false;
      el.style.cursor = 'grab';
    };

    // Touch support
    const onTouchStart = (e: TouchEvent) => {
      if ((e.target as HTMLElement).closest('button, input, select, [data-interactive]')) return;
      const touch = e.touches[0];
      isGrabbing.current = true;
      startX.current = touch.clientX;
      startY.current = touch.clientY;
      scrollLeftStart.current = el.scrollLeft;
      scrollTopStart.current = el.scrollTop;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isGrabbing.current) return;
      const touch = e.touches[0];
      const dx = touch.clientX - startX.current;
      const dy = touch.clientY - startY.current;
      el.scrollLeft = scrollLeftStart.current - dx;
      el.scrollTop = scrollTopStart.current - dy;
    };

    const onTouchEnd = () => {
      isGrabbing.current = false;
    };

    el.style.cursor = 'grab';
    el.addEventListener('mousedown', onMouseDown);
    el.addEventListener('mousemove', onMouseMove);
    el.addEventListener('mouseup', onMouseUp);
    el.addEventListener('mouseleave', onMouseUp);
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: true });
    el.addEventListener('touchend', onTouchEnd);

    return () => {
      el.removeEventListener('mousedown', onMouseDown);
      el.removeEventListener('mousemove', onMouseMove);
      el.removeEventListener('mouseup', onMouseUp);
      el.removeEventListener('mouseleave', onMouseUp);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [containerRef]);
}

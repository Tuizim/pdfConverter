import { useCallback, useRef } from 'react';
import type { UseIntersectionOnceResult } from './useIntersectionOnce.model';

// Dispara `onVisible` uma única vez, quando o elemento entra na viewport, e
// para de observar em seguida. Usado para renderizar miniaturas sob demanda
// em grades grandes, em vez de renderizar todas de uma vez.
export function useIntersectionOnce(onVisible: () => void): UseIntersectionOnceResult {
  const onVisibleRef = useRef(onVisible);
  onVisibleRef.current = onVisible;

  const ref = useCallback((node: Element | null) => {
    if (!node) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) {
        onVisibleRef.current();
        observer.disconnect();
      }
    });
    observer.observe(node);
  }, []);

  return { ref };
}

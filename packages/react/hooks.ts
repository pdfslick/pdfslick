/// <reference lib="dom" />
import { useCallback, useEffect, useRef, useState, type DependencyList } from "react";

type Rect = { width: number; height: number };

/**
 * Minimal `ResizeObserver`-based measure hook. Returns a stable callback ref to
 * attach to an element plus the element's content-box size. Replaces
 * `react-use`'s `useMeasure` (we only consume `width`), so `@pdfslick/react`
 * carries no `react-use`/`js-cookie` transitive dependency.
 */
export function useMeasure<T extends HTMLElement = HTMLElement>(): [
  (el: T | null) => void,
  Rect
] {
  const [rect, setRect] = useState<Rect>({ width: 0, height: 0 });
  const observerRef = useRef<ResizeObserver | null>(null);

  const ref = useCallback((el: T | null) => {
    observerRef.current?.disconnect();
    observerRef.current = null;

    if (el && typeof ResizeObserver !== "undefined") {
      observerRef.current = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (entry) {
          const { width, height } = entry.contentRect;
          setRect({ width, height });
        }
      });
      observerRef.current.observe(el);
    }
  }, []);

  useEffect(() => () => observerRef.current?.disconnect(), []);

  return [ref, rect];
}

/**
 * Minimal debounce hook mirroring `react-use`'s `useDebounce(fn, ms, deps)`:
 * runs `fn` once `deps` have been stable for `ms`. The `[isReady, cancel]`
 * tuple `react-use` returns is unused here, so this resolves to `void`.
 */
export function useDebounce(
  fn: () => void,
  ms: number,
  deps: DependencyList
): void {
  useEffect(() => {
    const timeout = setTimeout(fn, ms);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

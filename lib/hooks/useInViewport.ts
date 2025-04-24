import { useEffect, useRef, useState } from 'react';

interface UseInViewportOptions {
  threshold?: number;
  rootMargin?: string;
}

/**
 * Custom hook to detect if an element is in the viewport
 * @param options Configuration options for the IntersectionObserver
 * @returns [ref, isInViewport] - A ref to attach to the element and a boolean indicating if it's in viewport
 */
export function useInViewport<T extends HTMLElement = HTMLDivElement>(
  options: UseInViewportOptions = {}
): [React.RefObject<T>, boolean] {
  const { threshold = 0.1, rootMargin = '0px' } = options;
  const ref = useRef<T>(null);
  const [isInViewport, setIsInViewport] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === 'undefined') {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Update state when intersection status changes
        setIsInViewport(entry.isIntersecting);
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  return [ref, isInViewport];
}

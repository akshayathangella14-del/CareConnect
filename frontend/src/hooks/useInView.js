import { useEffect, useRef, useState } from 'react';

export default function useInView(options = {}) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || isInView) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.18, rootMargin: '0px 0px -40px 0px', ...options }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [isInView]);

  return [ref, isInView];
}

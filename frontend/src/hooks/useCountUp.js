import { useEffect, useState } from 'react';

export default function useCountUp(target, enabled, duration = 1400) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!enabled) return undefined;
    const start = performance.now();
    let frame;

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [enabled, target, duration]);

  return value;
}

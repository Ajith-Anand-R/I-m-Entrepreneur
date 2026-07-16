import React, { useEffect, useRef, useState } from 'react';
import { useScrollReveal } from './useScrollReveal';

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  target,
  suffix = '',
  prefix = '',
  duration = 1800,
  className = '',
}) => {
  const [count, setCount] = useState(0);
  const { ref, isVisible } = useScrollReveal({ threshold: 0.5 });
  const started = useRef(false);

  useEffect(() => {
    if (!isVisible || started.current) return;
    started.current = true;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) { setCount(target); return; }

    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      // ease out expo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isVisible, target, duration]);

  return (
    <span ref={ref as React.RefObject<HTMLSpanElement>} className={className}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

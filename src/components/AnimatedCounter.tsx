import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

/**
 * Count-up number animation hook.
 * Returns animated value + a ref to attach to the trigger element.
 */
export const useCountUp = (
  target: number,
  duration = 1600,
  delay = 0,
): { value: number; ref: React.RefObject<HTMLDivElement> } => {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null!);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let timeoutId: ReturnType<typeof setTimeout>;
    let animId: number;

    timeoutId = setTimeout(() => {
      const start = performance.now();
      const update = (now: number) => {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out quart
        const eased = 1 - Math.pow(1 - progress, 4);
        setValue(Math.round(eased * target));
        if (progress < 1) animId = requestAnimationFrame(update);
      };
      animId = requestAnimationFrame(update);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(animId);
    };
  }, [inView, target, duration, delay]);

  return { value, ref };
};

/**
 * Typewriter text reveal hook.
 */
export const useTypewriter = (text: string, speed = 40, startDelay = 500): string => {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    setDisplayed('');
    let i = 0;
    const timeout = setTimeout(() => {
      const id = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) clearInterval(id);
      }, speed);
      return () => clearInterval(id);
    }, startDelay);
    return () => clearTimeout(timeout);
  }, [text, speed, startDelay]);

  return displayed;
};

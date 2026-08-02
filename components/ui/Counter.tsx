'use client';

import { useEffect, useRef, useState } from 'react';

type Props = {
  to: number;
  /** Rendered after the number, e.g. "+". */
  suffix?: string;
  duration?: number;
};

/**
 * Counts up to `to` the first time it scrolls into view.
 *
 * The final value is rendered on the server and for reduced-motion users, so the
 * number is never missing or wrong — the animation only replaces it briefly.
 */
export function Counter({ to, suffix = '', duration = 1600 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(to);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    setValue(0);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();

        const start = performance.now();
        let frame = 0;
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          // easeOutCubic — fast off the mark, settles gently on the final value
          const eased = 1 - Math.pow(1 - t, 3);
          setValue(Math.round(to * eased));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
      },
      { threshold: 0.4 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [to, duration]);

  return (
    <span ref={ref}>
      {value.toLocaleString('en-US')}
      {suffix}
    </span>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import type { ElementType, ReactNode } from 'react';

import styles from './Reveal.module.css';

type Props = {
  children: ReactNode;
  /** Stagger in ms, for revealing a row of cards one after another. */
  delay?: number;
  as?: ElementType;
  className?: string;
};

/**
 * Fades and lifts its children into view once, when they first scroll near the
 * viewport. Content is visible from the start for anyone with reduced motion or
 * without JS — the animation only ever removes an offset, never adds one.
 */
export function Reveal({ children, delay = 0, as: Tag = 'div', className }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
    );
    io.observe(el);

    /*
     * Safety net: content must never be left invisible because an observer callback
     * didn't fire — during a fast programmatic scroll, in a screenshot tool, or in any
     * browser that behaves unexpectedly. Reveal everything after a beat regardless.
     */
    const failsafe = window.setTimeout(() => setShown(true), 2500);

    return () => {
      io.disconnect();
      window.clearTimeout(failsafe);
    };
  }, []);

  return (
    <Tag
      ref={ref}
      className={[styles.reveal, shown ? styles.shown : '', className].filter(Boolean).join(' ')}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}

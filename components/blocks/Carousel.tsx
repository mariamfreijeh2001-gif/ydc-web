'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

import { ArrowLeftIcon, ArrowRightIcon } from '@/components/ui/Icon';
import styles from './Carousel.module.css';

type Props = {
  children: ReactNode;
  label: string;
  /** `light` renders arrows for a dark background. */
  tone?: 'dark' | 'light';
  /** Cards visible at desktop width. Fractional values leave the next card peeking. */
  perView?: number;
};

/**
 * Scroll-snap carousel. Native horizontal scrolling does the work — the arrows just
 * page it — so it stays swipeable on touch and keyboard-scrollable without JS.
 */
export function Carousel({ children, label, tone = 'dark', perView = 4 }: Props) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    sync();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    return () => {
      el.removeEventListener('scroll', sync);
      window.removeEventListener('resize', sync);
    };
  }, [sync]);

  const page = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const first = el.querySelector('li');
    const step = first ? first.getBoundingClientRect().width + 22 : el.clientWidth * 0.8;
    el.scrollBy({ left: step * dir, behavior: 'smooth' });
  };

  return (
    <div
      className={`${styles.root} ${styles[tone]}`}
      style={{ '--per-view': perView } as React.CSSProperties}
    >
      <ul className={styles.track} ref={trackRef} aria-label={label}>
        {children}
      </ul>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.arrow}
          onClick={() => page(-1)}
          disabled={atStart}
          aria-label="Previous"
        >
          <ArrowLeftIcon width={18} height={18} />
        </button>
        <button
          type="button"
          className={styles.arrow}
          onClick={() => page(1)}
          disabled={atEnd}
          aria-label="Next"
        >
          <ArrowRightIcon width={18} height={18} />
        </button>
      </div>
    </div>
  );
}

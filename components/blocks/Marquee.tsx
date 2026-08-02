'use client';

import { Children, type ReactNode } from 'react';

import styles from './Marquee.module.css';

type Props = {
  children: ReactNode;
  label: string;
  /** Seconds for one full pass. Larger = slower. */
  duration?: number;
  /** Cards visible across the track at desktop width. */
  perView?: number;
  direction?: 'left' | 'right';
};

/**
 * Continuous, seamless auto-scroller.
 *
 * The children are rendered twice and the track is translated by exactly half its
 * width, so the second copy lands where the first began and the loop is invisible —
 * which also means it keeps going no matter how few items there are.
 *
 * Hovering or focusing pauses it, and `prefers-reduced-motion` turns it into an
 * ordinary swipeable row rather than animating.
 */
export function Marquee({
  children,
  label,
  duration = 60,
  perView = 4,
  direction = 'left',
}: Props) {
  const items = Children.toArray(children);

  return (
    <div
      className={styles.root}
      style={
        {
          '--duration': `${duration}s`,
          '--per-view-desktop': perView,
        } as React.CSSProperties
      }
    >
      <div
        className={`${styles.track} ${direction === 'right' ? styles.reverse : ''}`}
        role="region"
        aria-label={label}
      >
        {[0, 1].map((copy) => (
          <ul key={copy} className={styles.group} aria-hidden={copy === 1 || undefined}>
            {items.map((child, i) => (
              <li key={i} className={styles.item}>
                {child}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

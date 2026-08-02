'use client';

import { useState } from 'react';

import { ArrowUpRightIcon } from '@/components/ui/Icon';
import styles from './FlipCard.module.css';

type Props = {
  index: number;
  step: string;
  title: string;
  text: string;
};

/**
 * Journey step as a flip card.
 *
 * Hover or keyboard focus flips it on pointer devices; on touch, tapping toggles it.
 * Both faces stay in the DOM so the detail is always available to search engines and
 * screen readers — `aria-expanded` on the button reports the current state, and with
 * reduced motion the card cross-fades instead of rotating.
 */
export function FlipCard({ index, step, title, text }: Props) {
  const [flipped, setFlipped] = useState(false);

  return (
    <button
      type="button"
      className={`${styles.card} ${flipped ? styles.flipped : ''}`}
      onClick={() => setFlipped((v) => !v)}
      aria-expanded={flipped}
    >
      <span className={styles.inner}>
        <span className={styles.face}>
          <span className={styles.index}>{String(index).padStart(2, '0')}</span>
          <span className={styles.step}>{step}</span>
          <span className={styles.title}>{title}</span>
          <span className={styles.more}>
            Read more
            <ArrowUpRightIcon width={13} height={13} />
          </span>
        </span>

        <span className={`${styles.face} ${styles.back}`}>
          <span className={styles.step}>{step}</span>
          <span className={styles.text}>{text}</span>
        </span>
      </span>
    </button>
  );
}

'use client';

import { useEffect, useState } from 'react';

import { ArrowUpRightIcon } from '@/components/ui/Icon';
import styles from './FlipCard.module.css';

type Props = {
  index: number;
  step: string;
  title: string;
  text: string;
};

/**
 * A journey step.
 *
 * On a pointer device wide enough for a row of cards it flips on hover or keyboard
 * focus to reveal the detail. Everywhere else — phones, tablets, anything without
 * hover — it renders as a plain card with the detail already visible, because a card
 * that has to be tapped to reveal its own content is worse than one that just shows it.
 *
 * The static version is what renders on the server and before hydration, so it is the
 * baseline rather than the fallback: no layout shift, no hydration mismatch, and the
 * text is present for search engines either way.
 */
export function FlipCard({ index, step, title, text }: Props) {
  const [canFlip, setCanFlip] = useState(false);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px) and (hover: hover) and (pointer: fine)');
    const update = () => setCanFlip(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const number = String(index).padStart(2, '0');

  if (!canFlip) {
    return (
      <div className={styles.static}>
        <span className={styles.index}>{number}</span>
        <span className={styles.step}>{step}</span>
        <h3 className={styles.staticTitle}>{title}</h3>
        <p className={styles.staticText}>{text}</p>
      </div>
    );
  }

  return (
    <button
      type="button"
      className={`${styles.card} ${flipped ? styles.flipped : ''}`}
      onClick={() => setFlipped((v) => !v)}
      aria-expanded={flipped}
    >
      <span className={styles.inner}>
        <span className={styles.face}>
          <span className={styles.index}>{number}</span>
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

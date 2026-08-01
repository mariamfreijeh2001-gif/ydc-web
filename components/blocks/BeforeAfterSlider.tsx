'use client';

import Image from 'next/image';
import { useCallback, useRef, useState } from 'react';

import styles from './BeforeAfterSlider.module.css';

type Props = {
  before: string;
  after: string;
  alt?: string;
  priority?: boolean;
};

/**
 * Draggable before/after comparison. The handle is a real range input, so it is
 * keyboard-operable and announced correctly without any extra ARIA plumbing.
 */
export function BeforeAfterSlider({ before, after, alt = '', priority = false }: Props) {
  const [pos, setPos] = useState(50);
  const frameRef = useRef<HTMLDivElement>(null);

  const setFromClientX = useCallback((clientX: number) => {
    const el = frameRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(100, Math.max(0, next)));
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    // Ignore the range input's own events; it updates state directly.
    if ((e.target as HTMLElement).tagName === 'INPUT') return;
    setFromClientX(e.clientX);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (e.buttons !== 1) return;
    if ((e.target as HTMLElement).tagName === 'INPUT') return;
    setFromClientX(e.clientX);
  };

  return (
    <div className={styles.root}>
      <div
        className={styles.frame}
        ref={frameRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
      >
        {/* After sits underneath; Before is clipped to the handle position. */}
        <Image
          src={after}
          alt={alt ? `${alt} — after` : 'After'}
          fill
          priority={priority}
          sizes="(max-width: 1024px) 100vw, 640px"
          className={styles.img}
        />

        {/*
          Clip rather than resize: the Before layer stays at full frame size so both
          photos remain in register no matter where the handle sits.
        */}
        <div className={styles.beforeLayer} style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <Image
            src={before}
            alt={alt ? `${alt} — before` : 'Before'}
            fill
            priority={priority}
            sizes="(max-width: 1024px) 100vw, 640px"
            className={styles.img}
          />
        </div>

        <span className={`${styles.tag} ${styles.tagBefore}`}>Before</span>
        <span className={`${styles.tag} ${styles.tagAfter}`}>After</span>

        <div className={styles.divider} style={{ left: `${pos}%` }} aria-hidden="true">
          <span className={styles.knob} />
        </div>

        <input
          className={styles.range}
          type="range"
          min={0}
          max={100}
          step={0.5}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label="Reveal more of the before or after photo"
        />
      </div>
    </div>
  );
}

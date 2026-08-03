'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import styles from './EveStage.module.css';

/**
 * Eve's tracking head, which tracks you back.
 *
 * The camera on the real unit watches the drill and the jaw and follows them as they
 * move, so having it follow the pointer is the one bit of interaction on this page that
 * actually says something true about the machine.
 *
 * Only on a real pointer: a phone has nothing to follow, and `prefers-reduced-motion`
 * turns it off entirely. Both are checked before a single listener is attached.
 */
export function EveStage({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, active: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const canTilt = window.matchMedia('(hover: hover) and (pointer: fine)');
    const stillness = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!canTilt.matches || stillness.matches) return;

    let frame = 0;
    const onMove = (e: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const r = el.getBoundingClientRect();
        // -1 .. 1 from the centre of the panel.
        const x = ((e.clientX - r.left) / r.width - 0.5) * 2;
        const y = ((e.clientY - r.top) / r.height - 0.5) * 2;
        setTilt({ x, y, active: true });
      });
    };
    const onLeave = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      setTilt({ x: 0, y: 0, active: false });
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`${styles.stage} ${tilt.active ? styles.live : ''}`}
      style={
        {
          '--tilt-x': `${(-tilt.y * 9).toFixed(2)}deg`,
          '--tilt-y': `${(tilt.x * 12).toFixed(2)}deg`,
          '--shift-x': `${(tilt.x * 10).toFixed(2)}px`,
          '--shift-y': `${(tilt.y * 8).toFixed(2)}px`,
        } as React.CSSProperties
      }
    >
      <span className={styles.disc} aria-hidden="true" />
      <span className={styles.discRing} aria-hidden="true" />
      <span className={styles.shadow} aria-hidden="true" />
      {/*
        Served as-is: the source is a small thumbnail upsampled once at build time, so the
        browser downscales into place, and Next's optimiser was picking variants far below
        the rendered size.
      */}
      <Image
        src={src}
        alt={alt}
        width={624}
        height={834}
        unoptimized
        priority
        className={styles.robot}
      />
    </div>
  );
}

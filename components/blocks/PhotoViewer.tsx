'use client';

import Image from 'next/image';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

import { ArrowLeftIcon, ArrowRightIcon, CloseIcon, ExpandIcon } from '@/components/ui/Icon';
import { IMAGE_QUALITY } from '@/components/ui/image';
import styles from './PhotoViewer.module.css';

export type Photo = { src: string; alt: string };

type Ctx = { photos: Photo[]; open: (i: number) => void };

const ViewerContext = createContext<Ctx | null>(null);

/**
 * Wraps a run of page content so every `<PhotoFrame>` inside it shares one lightbox and
 * one set of arrow keys — the photos read as a set rather than as unrelated pictures.
 *
 * Children are passed through untouched, so the sections inside stay server components
 * and only the frames and the lightbox itself ship any JavaScript.
 */
export function PhotoViewer({ photos, children }: { photos: Photo[]; children: ReactNode }) {
  const [index, setIndex] = useState<number | null>(null);

  const close = useCallback(() => setIndex(null), []);
  const step = useCallback(
    (dir: 1 | -1) =>
      setIndex((i) => (i === null ? null : (i + dir + photos.length) % photos.length)),
    [photos.length],
  );

  useEffect(() => {
    if (index === null) return;
    document.body.classList.add('is-locked');
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('is-locked');
      window.removeEventListener('keydown', onKey);
    };
  }, [index, close, step]);

  const current = index === null ? null : photos[index];

  return (
    <ViewerContext.Provider value={{ photos, open: setIndex }}>
      {children}

      {current ? (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label={current.alt}
          onClick={close}
        >
          <button type="button" className={styles.close} onClick={close} aria-label="Close">
            <CloseIcon width={22} height={22} />
          </button>

          {photos.length > 1 ? (
            <button
              type="button"
              className={`${styles.nav} ${styles.prev}`}
              onClick={(e) => {
                e.stopPropagation();
                step(-1);
              }}
              aria-label="Previous photo"
            >
              <ArrowLeftIcon width={20} height={20} />
            </button>
          ) : null}

          {/* Stops a click on the photo itself from dismissing the dialog. */}
          <figure className={styles.stage} onClick={(e) => e.stopPropagation()}>
            <Image
              src={current.src}
              alt={current.alt}
              fill
              sizes="92vw"
              className={styles.stageImg}
              quality={IMAGE_QUALITY}
            />
          </figure>

          {photos.length > 1 ? (
            <button
              type="button"
              className={`${styles.nav} ${styles.next}`}
              onClick={(e) => {
                e.stopPropagation();
                step(1);
              }}
              aria-label="Next photo"
            >
              <ArrowRightIcon width={20} height={20} />
            </button>
          ) : null}

          {photos.length > 1 ? (
            <p className={styles.counter}>
              {index! + 1} / {photos.length}
            </p>
          ) : null}
        </div>
      ) : null}
    </ViewerContext.Provider>
  );
}

/**
 * One picture in the set: zooms slightly under the pointer, shows what it does, and
 * opens the lightbox when clicked. A button rather than a div, so it is reachable by
 * keyboard and announces itself.
 */
export function PhotoFrame({
  index,
  className,
  sizes,
  priority = false,
}: {
  index: number;
  className?: string;
  sizes: string;
  priority?: boolean;
}) {
  const ctx = useContext(ViewerContext);
  if (!ctx) return null;

  const photo = ctx.photos[index];
  if (!photo) return null;

  return (
    <button
      type="button"
      className={`${styles.frame} ${className ?? ''}`}
      onClick={() => ctx.open(index)}
      aria-label={`Enlarge: ${photo.alt}`}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        priority={priority}
        sizes={sizes}
        className={styles.img}
        quality={IMAGE_QUALITY}
      />
      <span className={styles.scrim} aria-hidden="true" />
      <span className={styles.cue} aria-hidden="true">
        <ExpandIcon width={18} height={18} />
      </span>
    </button>
  );
}

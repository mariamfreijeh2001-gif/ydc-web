'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

import { ArrowLeftIcon, ArrowRightIcon, CloseIcon } from '@/components/ui/Icon';
import styles from './Gallery.module.css';
import { IMAGE_QUALITY } from '@/components/ui/image';

type Props = {
  images: string[];
  /** Used to build meaningful alt text, e.g. "All on 4 – N.D". */
  caption: string;
};

export function Gallery({ images, caption }: Props) {
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (dir: 1 | -1) =>
      setOpen((i) => (i === null ? null : (i + dir + images.length) % images.length)),
    [images.length],
  );

  useEffect(() => {
    if (open === null) return;
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
  }, [open, close, step]);

  if (!images.length) return null;

  return (
    <>
      <ul className={styles.grid}>
        {images.map((src, i) => (
          <li key={src} className={styles.item}>
            <button
              type="button"
              className={styles.thumb}
              onClick={() => setOpen(i)}
              aria-label={`View photo ${i + 1} of ${images.length}`}
            >
              <Image
                src={src}
                alt={`${caption} — photo ${i + 1}`}
                fill
                sizes="(max-width: 767px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className={styles.img}
                quality={IMAGE_QUALITY}
              />
            </button>
          </li>
        ))}
      </ul>

      {open !== null ? (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label={`${caption} — photo ${open + 1} of ${images.length}`}
          onClick={close}
        >
          <button type="button" className={styles.close} onClick={close} aria-label="Close">
            <CloseIcon width={24} height={24} />
          </button>

          {images.length > 1 ? (
            <button
              type="button"
              className={`${styles.nav} ${styles.prev}`}
              onClick={(e) => {
                e.stopPropagation();
                step(-1);
              }}
              aria-label="Previous photo"
            >
              <ArrowLeftIcon width={22} height={22} />
            </button>
          ) : null}

          <div className={styles.stage} onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[open]}
              alt={`${caption} — photo ${open + 1}`}
              fill
              sizes="90vw"
              className={styles.full}
              priority
              quality={IMAGE_QUALITY}
            />
          </div>

          {images.length > 1 ? (
            <button
              type="button"
              className={`${styles.nav} ${styles.next}`}
              onClick={(e) => {
                e.stopPropagation();
                step(1);
              }}
              aria-label="Next photo"
            >
              <ArrowRightIcon width={22} height={22} />
            </button>
          ) : null}
        </div>
      ) : null}
    </>
  );
}

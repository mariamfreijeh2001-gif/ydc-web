import Image from 'next/image';
import type { ReactNode } from 'react';

import { IMAGE_QUALITY } from '@/components/ui/image';
import styles from './PageHero.module.css';

type Props = {
  title: string;
  intro?: string;
  /** Full-bleed banner image. Omit for the plain centred hero (/technologies/). */
  image?: string;
  /** `overlay` is the notched-panel hero; `centered` is text-only. */
  variant?: 'overlay' | 'centered';
  children?: ReactNode;
};

/**
 * Notched hero, matching the live /services/ and /before-after/ pages: a rounded
 * image panel with a white block carved out of its bottom-left corner holding the
 * page title. The two corner pieces are the concave joins where that block meets the
 * panel's left and bottom edges — the theme ships them as `triangle.svg`; here they're
 * a radial-gradient so they inherit the surrounding background colour.
 */
export function PageHero({ title, intro, image, variant = 'overlay', children }: Props) {
  if (variant === 'centered' || !image) {
    return (
      <section className={styles.centered}>
        <div className={styles.centeredInner}>
          <h1 className={styles.centeredTitle}>{title}</h1>
          {intro ? <p className={styles.centeredIntro}>{intro}</p> : null}
          {children}
        </div>
      </section>
    );
  }

  return (
    <section className={styles.hero}>
      <div className={styles.frame}>
        {/*
          The notch is a sibling of the clipped panel, not a child: if both the image
          and the notch are clipped by the same rounded corner, their anti-aliasing
          differs by a fraction of a pixel and the photo bleeds through as a hairline.
        */}
        <div className={styles.panel}>
          <Image
            src={image}
            alt=""
            fill
            priority
            sizes="100vw"
            quality={IMAGE_QUALITY}
            className={styles.image}
          />
        </div>

        <div className={styles.notch}>
          <h1 className={styles.title}>{title}</h1>
          {intro ? <p className={styles.intro}>{intro}</p> : null}
          {children}
        </div>
      </div>
    </section>
  );
}

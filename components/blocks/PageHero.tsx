import Image from 'next/image';
import type { ReactNode } from 'react';

import styles from './PageHero.module.css';

type Props = {
  title: string;
  intro?: string;
  /** Full-bleed banner image. Omit for the plain centred hero (/technologies/). */
  image?: string;
  /** `overlay` places the title on top of the image; `centered` is text-only. */
  variant?: 'overlay' | 'centered';
  children?: ReactNode;
};

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
    <section className={styles.overlay}>
      <div className={styles.media}>
        <Image
          src={image}
          alt=""
          fill
          priority
          sizes="100vw"
          className={styles.image}
          aria-hidden="true"
        />
        <div className={styles.scrim} />
      </div>
      <div className={styles.overlayInner}>
        <h1 className={styles.overlayTitle}>{title}</h1>
        {intro ? <p className={styles.overlayIntro}>{intro}</p> : null}
        {children}
      </div>
    </section>
  );
}

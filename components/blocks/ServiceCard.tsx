import Image from 'next/image';
import Link from 'next/link';

import type { Service } from '@/lib/content';
import styles from './ServiceCard.module.css';
import { IMAGE_QUALITY } from '@/components/ui/image';

type Props = {
  service: Service;
  /** `compact` is the shorter card used on the home page grid. */
  size?: 'default' | 'compact';
  priority?: boolean;
};

/**
 * Dark rounded card: taxonomy eyebrow + title at the top, full-bleed image behind,
 * "View Details" pill anchored bottom-left. The whole card is the link; the pill is
 * decorative so there's only one tab stop per card.
 */
export function ServiceCard({ service, size = 'default', priority = false }: Props) {
  const href = `/services/${service.slug}/`;

  return (
    <Link href={href} className={`${styles.card} ${styles[size]}`}>
      {service.image ? (
        <Image
          src={service.image}
          alt=""
          fill
          priority={priority}
          /*
           * Landscape (~16:9) photos cover-cropped into a portrait card, so the source
           * must be ~2.4x the card's width to fill its height without upscaling —
           * `sizes` describes the box, not the post-crop need. Kept in `vw` because
           * Next only derives a sensible srcset from viewport-relative units.
           */
          sizes="(max-width: 767px) 190vw, (max-width: 1024px) 115vw, 75vw"
          className={styles.image}
          quality={IMAGE_QUALITY}
        />
      ) : null}

      <span className={styles.veil} />

      <span className={styles.body}>
        <span className={styles.eyebrow}>{service.category}</span>
        <span className={styles.title}>{service.title}</span>
      </span>

      <span className={styles.cta} aria-hidden="true">
        View Details
      </span>
    </Link>
  );
}

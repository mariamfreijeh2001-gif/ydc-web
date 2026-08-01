import Image from 'next/image';
import Link from 'next/link';

import type { Service } from '@/lib/content';
import styles from './ServiceCard.module.css';

type Props = {
  service: Service;
  /** `dark` is the teal-on-teal treatment used inside the About Us carousel. */
  tone?: 'image' | 'dark';
  priority?: boolean;
};

/**
 * Dark rounded card: taxonomy eyebrow + title at the top, full-bleed image behind,
 * "View Details" pill anchored bottom-left. The whole card is the link; the pill is
 * decorative so there's only one tab stop per card.
 */
export function ServiceCard({ service, tone = 'image', priority = false }: Props) {
  const href = `/services/${service.slug}/`;

  return (
    <Link href={href} className={`${styles.card} ${tone === 'dark' ? styles.dark : ''}`}>
      {tone === 'image' && service.image ? (
        <Image
          src={service.image}
          alt=""
          fill
          priority={priority}
          sizes="(max-width: 767px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={styles.image}
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

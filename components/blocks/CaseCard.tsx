import Image from 'next/image';
import Link from 'next/link';

import type { PatientCase } from '@/lib/content';
import styles from './CaseCard.module.css';

type Props = {
  item: PatientCase;
  /** `compact` drops the title overlay — used by the home "Our Patients" carousel. */
  variant?: 'default' | 'compact';
  priority?: boolean;
};

export function CaseCard({ item, variant = 'default', priority = false }: Props) {
  const href = `/before_and_after_/${item.slug}/`;

  return (
    <Link href={href} className={`${styles.card} ${styles[variant]}`}>
      {item.cover ? (
        <Image
          src={item.cover}
          alt={`${item.title} — patient result`}
          fill
          priority={priority}
          sizes="(max-width: 767px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={styles.image}
        />
      ) : null}

      {variant === 'default' ? (
        <>
          <span className={styles.veil} />
          <span className={styles.title}>{item.title}</span>
          <span className={styles.cta} aria-hidden="true">
            View Details
          </span>
        </>
      ) : (
        <span className={styles.compactLabel}>
          <span className="visually-hidden">{item.title}</span>
        </span>
      )}
    </Link>
  );
}

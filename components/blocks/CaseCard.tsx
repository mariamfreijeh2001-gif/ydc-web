import Image from 'next/image';
import Link from 'next/link';

import type { PatientCase } from '@/lib/content';
import { ArrowUpRightIcon } from '@/components/ui/Icon';
import styles from './CaseCard.module.css';
import { IMAGE_QUALITY } from '@/components/ui/image';

type Props = {
  item: PatientCase;
  /**
   * `default` is the tall listing card. `portrait` is the home marquee card: a 3:4
   * frame that suits the face photography, with the procedure revealed on hover.
   */
  variant?: 'default' | 'compact' | 'portrait';
  priority?: boolean;
};

export function CaseCard({ item, variant = 'default', priority = false }: Props) {
  const href = `/before_and_after_/${item.slug}/`;

  return (
    <Link href={href} className={`${styles.card} ${styles[variant]}`}>
      {item.cover ? (
        <Image
          src={item.cover}
          alt={`${item.procedure} — patient result`}
          fill
          priority={priority}
          /* Square/portrait covers cropped into a portrait card — see ServiceCard. */
          sizes="(max-width: 767px) 140vw, (max-width: 1024px) 80vw, 55vw"
          className={styles.image}
          quality={IMAGE_QUALITY}
        />
      ) : null}

      {variant === 'portrait' ? (
        <>
          <span className={styles.veil} />
          <span className={styles.portraitBody}>
            {/* Treatment only — patient initials are deliberately not shown. */}
            <span className={styles.portraitProcedure}>{item.procedure}</span>
            <span className={styles.portraitView} aria-hidden="true">
              View case
              <ArrowUpRightIcon width={13} height={13} />
            </span>
          </span>
        </>
      ) : variant === 'default' ? (
        <>
          <span className={styles.veil} />
          <span className={styles.title}>{item.procedure}</span>
          <span className={styles.cta} aria-hidden="true">
            View Details
          </span>
        </>
      ) : (
        <span className={styles.compactLabel}>
          <span className="visually-hidden">{item.procedure}</span>
        </span>
      )}
    </Link>
  );
}

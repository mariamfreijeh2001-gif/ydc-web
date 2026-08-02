import Image from 'next/image';
import Link from 'next/link';

import type { PatientCase } from '@/lib/content';
import { ArrowUpRightIcon } from '@/components/ui/Icon';
import { IMAGE_QUALITY } from '@/components/ui/image';
import styles from './CaseCard.module.css';

type Props = {
  item: PatientCase;
  /**
   * `default` is the tall listing card. `portrait` is the home marquee card: a 3:4
   * frame that suits the face photography.
   */
  variant?: 'default' | 'portrait';
  priority?: boolean;
};

/**
 * A patient case card carries two destinations: the whole card opens the case, and the
 * treatment chip opens the service that treatment belongs to.
 *
 * The card-wide link is stretched with a pseudo-element rather than wrapping the
 * markup, so the chip can sit above it as a second link without nesting one anchor
 * inside another.
 */
export function CaseCard({ item, variant = 'default', priority = false }: Props) {
  const href = `/before_and_after_/${item.slug}/`;

  return (
    <article className={`${styles.card} ${styles[variant]}`}>
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

      <span className={styles.veil} />

      <div className={styles.body}>
        {item.serviceSlug ? (
          <Link href={`/services/${item.serviceSlug}/`} className={styles.chip}>
            {item.procedure}
          </Link>
        ) : (
          <span className={styles.chip}>{item.procedure}</span>
        )}

        <Link href={href} className={styles.view}>
          View case
          <ArrowUpRightIcon width={13} height={13} />
        </Link>
      </div>
    </article>
  );
}

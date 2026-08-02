import Image from 'next/image';

import { Marquee } from '@/components/blocks/Marquee';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { StarIcon } from '@/components/ui/Icon';
import { IMAGE_QUALITY } from '@/components/ui/image';
import { reviews } from '@/lib/content';
import styles from './Reviews.module.css';

type Props = {
  /** `marquee` scrolls the cards continuously; `grid` is the static 3-up layout. */
  variant?: 'grid' | 'marquee';
};

function ReviewCard({ review }: { review: (typeof reviews)[number] }) {
  return (
    <figure className={styles.card}>
      <div className={styles.stars} aria-label={`${review.rating} out of 5 stars`}>
        {Array.from({ length: review.rating }).map((_, i) => (
          <StarIcon key={i} width={17} height={17} />
        ))}
      </div>

      <blockquote className={styles.quote}>{review.text}</blockquote>

      <figcaption className={styles.author}>
        {review.avatar ? (
          <Image
            src={review.avatar}
            alt=""
            width={80}
            height={80}
            sizes="40px"
            quality={IMAGE_QUALITY}
            className={styles.avatar}
          />
        ) : null}
        <span className={styles.name}>{review.name}</span>
      </figcaption>
    </figure>
  );
}

/** "Top Reviews" — Google testimonials. */
export function Reviews({ variant = 'grid' }: Props) {
  const head = (
    <div className={styles.head}>
      <h2>Top Reviews</h2>
      <p className={styles.sub}>More than 250 five-star reviews on Google</p>
    </div>
  );

  if (variant === 'marquee') {
    return (
      <Section tone="alt" className={styles.section}>
        <Container>{head}</Container>
        {/* Runs the other way to the patients row above, so the page doesn't drift. */}
        <Marquee label="Patient reviews" duration={80} perView={3.4} direction="right">
          {reviews.map((review) => (
            <ReviewCard key={review.name} review={review} />
          ))}
        </Marquee>
      </Section>
    );
  }

  return (
    <Section tone="alt" className={styles.section}>
      <Container>
        {head}
        <ul className={styles.grid}>
          {reviews.map((review) => (
            <li key={review.name}>
              <ReviewCard review={review} />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

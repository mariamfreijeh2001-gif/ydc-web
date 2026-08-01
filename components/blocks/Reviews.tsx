import Image from 'next/image';

import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { StarIcon } from '@/components/ui/Icon';
import { reviews } from '@/lib/content';
import styles from './Reviews.module.css';

/** "Top Reviews" — 3-up then 2-up grid of Google testimonials. */
export function Reviews() {
  return (
    <Section tone="alt" className={styles.section}>
      <Container>
        <div className={styles.head}>
          <h2>Top Reviews</h2>
          <p className={styles.sub}>More than 250 five-star reviews on Google</p>
        </div>

        <ul className={styles.grid}>
          {reviews.map((review) => (
            <li key={review.name} className={styles.card}>
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
                    width={40}
                    height={40}
                    className={styles.avatar}
                  />
                ) : null}
                <span className={styles.name}>{review.name}</span>
              </figcaption>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

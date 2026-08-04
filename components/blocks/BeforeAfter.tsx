import Image from 'next/image';

import { IMAGE_QUALITY } from '@/components/ui/image';
import styles from './BeforeAfter.module.css';

/**
 * The two photographs side by side, rather than joined at a draggable seam.
 *
 * A seam slider only reads as a comparison when the subject sits in the same place in
 * both frames. Correlating every pair in the library showed that only 2 of 13 are
 * registered closely enough — mean correlation 0.35, and one pair is actually negatively
 * correlated. Sliding a seam across two differently-framed photographs makes the mouth
 * appear to jump, which looks like a fault rather than a result.
 *
 * Shown as a pair, each photograph gets its own frame at the same aspect ratio, so they
 * line up as a matched set without pretending to be one continuous image. It also needs
 * no JavaScript, and both halves are visible at once instead of one at a time.
 */
export function BeforeAfter({
  before,
  after,
  alt,
  priority = false,
}: {
  before: string;
  after: string;
  alt: string;
  priority?: boolean;
}) {
  const shots = [
    { src: before, label: 'Before', tone: styles.tagBefore },
    { src: after, label: 'After', tone: styles.tagAfter },
  ];

  return (
    <figure className={styles.pair}>
      {shots.map((shot, i) => (
        <div key={shot.label} className={styles.frame}>
          <Image
            src={shot.src}
            alt={`${alt} — ${shot.label.toLowerCase()}`}
            fill
            priority={priority && i === 0}
            sizes="(max-width: 767px) 92vw, 46vw"
            className={styles.img}
            quality={IMAGE_QUALITY}
          />
          <figcaption className={`${styles.tag} ${shot.tone}`}>{shot.label}</figcaption>
        </div>
      ))}
    </figure>
  );
}

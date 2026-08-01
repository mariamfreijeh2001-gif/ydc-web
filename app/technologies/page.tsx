import type { Metadata } from 'next';
import Image from 'next/image';

import { PageHero } from '@/components/blocks/PageHero';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { technologies } from '@/content/pages/technologies';
import styles from './page.module.css';
import { IMAGE_QUALITY } from '@/components/ui/image';

export const metadata: Metadata = {
  title: 'Our technologies',
  description: technologies.intro.slice(0, 155),
  alternates: { canonical: '/technologies/' },
};

export default function TechnologiesPage() {
  return (
    <>
      <PageHero title={technologies.title} intro={technologies.intro} variant="centered" />

      <Section space="tight">
        <Container>
          <ul className={styles.rows}>
            {technologies.items.map((item, i) => (
              /* Alternate the media side, starting with the image on the right. */
              <li key={item.title} className={`${styles.row} ${i % 2 ? styles.reversed : ''}`}>
                <div className={styles.body}>
                  <h2 className={styles.title}>{item.title}</h2>
                  <p className={styles.text}>{item.text}</p>
                </div>
                <div className={styles.media}>
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={420}
                    height={420}
                    sizes="(max-width: 767px) 70vw, 340px"
                    className={styles.img}
                    priority={i === 0}
                    quality={IMAGE_QUALITY}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
}

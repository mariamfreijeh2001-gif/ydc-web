import type { Metadata } from 'next';

import { CaseCard } from '@/components/blocks/CaseCard';
import { PageHero } from '@/components/blocks/PageHero';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { cases } from '@/lib/content';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Before & after',
  description:
    'Explore some of our success stories with images of patients before and after surgery — All-on-4, All-on-6, crowns, bridges and gingivectomy results.',
  alternates: { canonical: '/before-after/' },
};

const HERO_IMAGE = '/media/2024/10/Untitled-design-2024-10-09T174822.416-e1728485467520.webp';

export default function BeforeAfterPage() {
  return (
    <>
      <PageHero
        title="Before And After"
        intro="Explore some of our success stories with images of patients before and after surgery"
        image={HERO_IMAGE}
      />

      <Section space="tight">
        <Container>
          <div className={styles.head}>
            <h2 className={styles.heading}>Before and After</h2>
            <p className={styles.sub}>Dental Services for Your Smile</p>
          </div>

          <ul className={styles.grid}>
            {cases.map((item, i) => (
              <li key={item.slug}>
                <CaseCard item={item} priority={i < 3} />
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
}

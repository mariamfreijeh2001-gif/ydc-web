import type { Metadata } from 'next';

import { CaseCard } from '@/components/blocks/CaseCard';
import { PageHero } from '@/components/blocks/PageHero';
import { PatientOrigins } from '@/components/blocks/PatientOrigins';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Reveal } from '@/components/ui/Reveal';
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
          {/*
            An introduction that says what these cases are and, just as importantly, what
            they are not: photographs of real patients, shown with permission, never
            retouched, and never labelled with a name or initials.
          */}
          <div className={styles.head}>
            <div>
              <p className={styles.eyebrow}>Patient cases</p>
              <h2 className={styles.heading}>Real mouths, photographed in our own chair</h2>
            </div>
            <div className={styles.headBody}>
              <p className={styles.sub}>
                Every case below was treated at Younes Dental Clinic and photographed here,
                in the same light, against the same wall — before, during and after. Nothing
                is retouched and nothing is a stock photograph, which is why some of these
                faces are blurred: the smile is the patient&rsquo;s to show, and their
                identity is theirs to keep.
              </p>
              <p className={styles.sub}>
                Most are full-arch implant work — All-on-3, All-on-4, All-on-6 — the
                treatments people travel furthest for. Open any case to drag through the
                before and after and see every stage in between.
              </p>
            </div>
          </div>

          <ul className={styles.grid}>
            {cases.map((item, i) => (
              <li key={item.slug}>
                <Reveal delay={(i % 3) * 80}>
                  <CaseCard item={item} priority={i < 3} />
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/*
        Where these patients travelled from. The same map as About Us — this is the page
        where that fact carries the most weight, because the results are right above it.
      */}
      <PatientOrigins
        eyebrow="Patients from around the world"
        heading="Most of these journeys started outside Lebanon"
        text="Patients come to us from the United States, Canada, Europe, the MENA region and Australia — many for full-arch treatment they were told was not possible at home, and most of it completed inside a single visit."
      />
    </>
  );
}

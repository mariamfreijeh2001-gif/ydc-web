import type { Metadata } from 'next';
import Link from 'next/link';

import { Carousel } from '@/components/blocks/Carousel';
import { CaseCard } from '@/components/blocks/CaseCard';
import { Reviews } from '@/components/blocks/Reviews';
import { ServiceCard } from '@/components/blocks/ServiceCard';
import { VideoHero } from '@/components/blocks/VideoHero';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { ArrowUpRightIcon } from '@/components/ui/Icon';
import { cases, services } from '@/lib/content';
import { site } from '@/content/site';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Younes Dental Clinic',
  description: site.description,
  alternates: { canonical: '/' },
};

const HERO_LINES = ['Prioritize your dental health', 'State of the art dentistry'];

const PULL_QUOTE = 'The best way to maintain a healthy smile is to be proactive!';

const INTRO =
  'At Younes Dental, we prioritize comfort, care, and efficiency to provide brighter, healthier smiles using the latest technology and training. Our comprehensive and affordable services range from dental implants and veneers to Clear Aligners, traditional orthodontics, and preventative care for the whole family. We value building long-lasting relationships with our patients for lifelong smiles.';

/** The six services the live homepage features, in its order. */
const FEATURED = ['allon6', 'all-on-4', 'zaygoma', 'aligners', 'zir-maxveneers', 'zir-arch'];

export default function HomePage() {
  const featured = FEATURED.map((slug) => services.find((s) => s.slug === slug)).filter(
    (s): s is NonNullable<typeof s> => Boolean(s),
  );

  return (
    <>
      <VideoHero src="/media/2024/11/Clinic-Intro.mp4" lines={HERO_LINES} />

      {/* Pull-quote + intro paragraph */}
      <Section space="tight">
        <Container>
          <div className={styles.intro}>
            <p className={styles.pullQuote}>{PULL_QUOTE}</p>
            <p className={styles.introBody}>{INTRO}</p>
          </div>
        </Container>
      </Section>

      {/* Our Services — wider container than the surrounding copy, as on the live site */}
      <Section space="tight">
        <Container size="wide">
          <header className={styles.sectionHead}>
            <h2>Our Services</h2>
            <Link href="/services/" className={styles.viewAll}>
              View All Services
              <ArrowUpRightIcon width={14} height={14} />
            </Link>
          </header>

          <ul className={styles.serviceGrid}>
            {featured.map((service, i) => (
              <li key={service.slug}>
                <ServiceCard service={service} priority={i < 3} />
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Our Patients */}
      <Section space="tight">
        <Container size="wide">
          <header className={styles.sectionHead}>
            <h2>Our Patients</h2>
            <Link href="/before-after/" className={styles.viewAll}>
              View All Cases
              <ArrowUpRightIcon width={14} height={14} />
            </Link>
          </header>

          {/*
            The live site shows 3.5 cards with the next peeking, which only reads as a
            carousel when there are more cards than fit. With the published set smaller
            than that, fill the row instead of leaving dead space on the right.
          */}
          <Carousel
            label="Patient before and after cases"
            perView={cases.length > 3 ? 3.5 : cases.length}
          >
            {cases.map((item) => (
              <li key={item.slug}>
                <CaseCard item={item} variant="compact" />
              </li>
            ))}
          </Carousel>
        </Container>
      </Section>

      <Reviews />
    </>
  );
}

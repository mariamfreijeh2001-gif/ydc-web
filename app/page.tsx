import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { CaseCard } from '@/components/blocks/CaseCard';
import { FlipCard } from '@/components/blocks/FlipCard';
import { Reviews } from '@/components/blocks/Reviews';
import { ServiceCard } from '@/components/blocks/ServiceCard';
import { VideoHero } from '@/components/blocks/VideoHero';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { Counter } from '@/components/ui/Counter';
import { ArrowUpRightIcon, CheckIcon } from '@/components/ui/Icon';
import { IMAGE_QUALITY } from '@/components/ui/image';
import { Reveal } from '@/components/ui/Reveal';
import { home } from '@/content/pages/home';
import { contact, site } from '@/content/site';
import { cases, doctors, services } from '@/lib/content';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Younes Dental Clinic',
  description: site.description,
  alternates: { canonical: '/' },
};

export default function HomePage() {
  const featured = home.services.featured
    .map((slug) => services.find((s) => s.slug === slug))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  // Only the Younes family appear in the "family of surgeons" section.
  const family = home.family.members
    .map((name) => doctors.find((d) => d.name === name))
    .filter((d): d is NonNullable<typeof d> => Boolean(d));

  return (
    <>
      <VideoHero src={home.hero.video} lines={[...home.hero.lines]} eyebrow={home.hero.eyebrow} />

      {/* Statement + intro, with the stats built into the same band */}
      <Section id="intro" space="tight">
        <Container>
          <div className={styles.intro}>
            <Reveal className={styles.introLead}>
              <p className={styles.eyebrow}>{home.intro.eyebrow}</p>
              <blockquote className={styles.quote}>
                <span className={styles.quoteMark} aria-hidden="true">
                  “
                </span>
                {home.intro.quote}
              </blockquote>
              <span className={styles.quoteRule} aria-hidden="true" />
            </Reveal>

            <Reveal delay={120} className={styles.introBodyWrap}>
              <p className={styles.introBody}>{home.intro.body}</p>
              <Link href={home.services.cta.href} className={styles.introLink}>
                {home.services.cta.label}
                <ArrowUpRightIcon width={14} height={14} />
              </Link>
            </Reveal>
          </div>

          <Reveal delay={200}>
            <ul className={styles.stats}>
              {home.stats.map((stat) => (
                <li key={stat.label} className={styles.stat}>
                  <span className={styles.statValue}>
                    <Counter to={stat.value} suffix={stat.suffix} />
                  </span>
                  <span className={styles.statLabel}>{stat.label}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </Section>

      {/* Our Services */}
      <Section space="tight">
        <Container size="wide">
          <Reveal as="header" className={styles.sectionHead}>
            <h2>{home.services.heading}</h2>
            <Link href={home.services.cta.href} className={styles.viewAll}>
              {home.services.cta.label}
              <ArrowUpRightIcon width={14} height={14} />
            </Link>
          </Reveal>

          <ul className={styles.serviceGrid}>
            {featured.map((service, i) => (
              <li key={service.slug}>
                <Reveal delay={(i % 4) * 80}>
                  <ServiceCard service={service} size="compact" priority={i < 4} />
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* A family of surgeons */}
      <Section tone="alt" space="tight">
        <Container>
          <div className={styles.family}>
            <Reveal className={styles.familyBody}>
              <p className={styles.eyebrow}>{home.family.eyebrow}</p>
              <h2 className={styles.familyHeading}>{home.family.heading}</h2>
              <p className={styles.familyText}>{home.family.body}</p>
              <Button href={home.family.cta.href} variant="primary" size="sm">
                {home.family.cta.label}
              </Button>
            </Reveal>

            <Reveal delay={120} className={styles.familyFaces}>
              {family.map((doctor, i) => (
                <figure key={doctor.name} className={styles.face} style={{ zIndex: 10 - i }}>
                  <Image
                    src={doctor.photo}
                    alt={doctor.name}
                    fill
                    sizes="(max-width: 767px) 40vw, 220px"
                    quality={IMAGE_QUALITY}
                    className={styles.faceImg}
                  />
                  <figcaption className={styles.faceName}>{doctor.name}</figcaption>
                </figure>
              ))}
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Our Patients */}
      <Section space="tight">
        <Container size="wide">
          <Reveal as="header" className={styles.sectionHead}>
            <h2>{home.patients.heading}</h2>
            <Link href={home.patients.cta.href} className={styles.viewAll}>
              {home.patients.cta.label}
              <ArrowUpRightIcon width={14} height={14} />
            </Link>
          </Reveal>

          {/*
            One row of cases, not a scroller — a marquee only reads as a carousel with
            more than a screenful, and it just looped the same faces past.
          */}
          <ul className={styles.patientGrid}>
            {cases.slice(0, home.patients.limit).map((item, i) => (
              <li key={item.slug}>
                <Reveal delay={i * 90}>
                  <CaseCard item={item} variant="portrait" />
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* In-house lab */}
      <Section space="tight">
        <Container>
          <div className={styles.lab}>
            <Reveal className={styles.labMedia}>
              <Image
                src={home.lab.image}
                alt=""
                width={620}
                height={620}
                sizes="(max-width: 1024px) 80vw, 520px"
                quality={IMAGE_QUALITY}
                className={styles.labImg}
              />
            </Reveal>

            <Reveal delay={120} className={styles.labBody}>
              <p className={styles.eyebrow}>{home.lab.eyebrow}</p>
              <h2 className={styles.labHeading}>{home.lab.heading}</h2>
              <p className={styles.labText}>{home.lab.body}</p>
              <ul className={styles.labPoints}>
                {home.lab.points.map((point) => (
                  <li key={point}>
                    <CheckIcon width={17} height={17} />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <Button href={home.lab.cta.href} variant="outline" size="sm">
                {home.lab.cta.label}
              </Button>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Journey */}
      <Section tone="dark" space="tight">
        <Container>
          <Reveal className={styles.journeyHead}>
            <p className={styles.eyebrowLight}>{home.journey.eyebrow}</p>
            <h2>{home.journey.heading}</h2>
          </Reveal>

          <ol className={styles.journey}>
            {home.journey.steps.map((step, i) => (
              <li key={step.step}>
                <Reveal delay={i * 90}>
                  <FlipCard index={i + 1} step={step.step} title={step.title} text={step.text} />
                </Reveal>
              </li>
            ))}
          </ol>

          <Reveal delay={200} className={styles.journeyCta}>
            <p className={styles.journeyCtaText}>{home.journey.cta.text}</p>
            <div className={styles.journeyCtaActions}>
              <Button href={contact.whatsappHref} variant="accent">
                {home.journey.cta.primary.label}
              </Button>
              <Button href={home.journey.cta.secondary.href} variant="outline-light">
                {home.journey.cta.secondary.label}
              </Button>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Reviews variant="marquee" />
    </>
  );
}

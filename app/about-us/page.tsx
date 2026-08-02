import type { Metadata } from 'next';
import Image from 'next/image';

import { Carousel } from '@/components/blocks/Carousel';
import { DoctorCard } from '@/components/blocks/DoctorCard';
import { PatientOrigins } from '@/components/blocks/PatientOrigins';
import { PhotoFrame, PhotoViewer, type Photo } from '@/components/blocks/PhotoViewer';
import { Reviews } from '@/components/blocks/Reviews';
import { ServiceCard } from '@/components/blocks/ServiceCard';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { about } from '@/content/pages/about';
import { doctors, services } from '@/lib/content';
import styles from './page.module.css';
import { IMAGE_QUALITY } from '@/components/ui/image';

export const metadata: Metadata = {
  title: 'About Us',
  description: about.hero.text.slice(0, 155),
  alternates: { canonical: '/about-us/' },
};

/*
 * Every photograph on the page, in reading order, so the lightbox can step through them
 * as one set. Alt text is descriptive rather than decorative now that each one is a
 * control a visitor can open.
 */
const PHOTOS: Photo[] = [
  { src: about.welcome.image, alt: 'A patient being treated at Younes Dental Clinic' },
  { src: about.mission.main, alt: 'Dr Ali Younes with a patient after treatment' },
  { src: about.mission.collage[0], alt: 'Close-up of a finished smile' },
  { src: about.mission.collage[1], alt: 'The Younes Dental Clinic team' },
];

export default function AboutPage() {
  return (
    <PhotoViewer photos={PHOTOS}>
      {/* Hero with floating card */}
      {/* Wide container, like the other page heroes — 40px gutters, not the 1280 box. */}
      <Section space="none" className={styles.heroSection}>
        <Container size="wide">
          <div className={styles.hero}>
            <Image
              src={about.hero.image}
              alt=""
              fill
              priority
              sizes="100vw"
              className={styles.heroImg}
              quality={IMAGE_QUALITY}
            />
            <div className={styles.heroCard}>
              <p className={styles.eyebrow}>{about.hero.eyebrow}</p>
              <h1 className={styles.heroTitle}>{about.hero.title}</h1>
              <p className={styles.heroText}>{about.hero.text}</p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Welcome */}
      <Section space="tight">
        <Container>
          <div className={styles.welcome}>
            <Reveal>
              <PhotoFrame
                index={0}
                className={styles.welcomeMedia}
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
            </Reveal>
            <div className={styles.welcomeBody}>
              <h2>{about.welcome.heading}</h2>
              <p className={styles.body}>{about.welcome.text}</p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Mission + collage */}
      <Section space="tight">
        <Container>
          <div className={styles.mission}>
            <div className={styles.missionBody}>
              <h2>{about.mission.heading}</h2>
              <p className={styles.body}>{about.mission.text}</p>
              <ul className={styles.collage}>
                {about.mission.collage.map((src, i) => (
                  <li key={src} className={styles.collageItem}>
                    <Reveal delay={120 + i * 110}>
                      <PhotoFrame
                        index={2 + i}
                        className={styles.collageFrame}
                        sizes="(max-width: 1024px) 45vw, 26vw"
                      />
                    </Reveal>
                  </li>
                ))}
              </ul>
            </div>
            <Reveal className={styles.missionReveal}>
              <PhotoFrame
                index={1}
                className={styles.missionMedia}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Team */}
      <Section space="tight">
        <Container>
          <div className={styles.teamHead}>
            <p className={styles.eyebrowCenter}>{about.team.eyebrow}</p>
            <h2>{about.team.heading}</h2>
          </div>

          <ul className={styles.team}>
            {doctors.slice(0, 3).map((doctor, i) => (
              <li key={doctor.name}>
                <Reveal delay={i * 90}>
                  <DoctorCard doctor={doctor} />
                </Reveal>
              </li>
            ))}
          </ul>

          <div className={styles.teamCta}>
            <Button href={about.team.cta.href} variant="accent" size="sm">
              {about.team.cta.label}
            </Button>
          </div>
        </Container>
      </Section>

      {/* Dark teal services carousel */}
      <Section tone="dark" space="tight">
        <div className={styles.darkInner}>
          <h2 className={styles.darkHeading}>{about.services.heading}</h2>
          <Carousel label="Our services" tone="light">
            {services.map((service) => (
              <li key={service.slug}>
                <ServiceCard service={service} size="compact" />
              </li>
            ))}
          </Carousel>
        </div>
      </Section>

      <PatientOrigins
        eyebrow={about.origins.eyebrow}
        heading={about.origins.heading}
        text={about.origins.text}
      />

      <Reviews variant="marquee" />
    </PhotoViewer>
  );
}

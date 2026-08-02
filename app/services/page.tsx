import type { Metadata } from 'next';
import Image from 'next/image';

import { PageHero } from '@/components/blocks/PageHero';
import { ServiceCard } from '@/components/blocks/ServiceCard';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Accordion } from '@/components/ui/Accordion';
import { Reveal } from '@/components/ui/Reveal';
import page from '@/content/pages/services.json';
import { servicesByCategory } from '@/lib/content';
import styles from './page.module.css';
import { IMAGE_QUALITY } from '@/components/ui/image';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Explore our services to see how we can help you maintain a healthy, beautiful smile — dental implants, All-on-4, veneers, aligners, braces and preventative care.',
  alternates: { canonical: '/services/' },
};

export default function ServicesPage() {
  const groups = servicesByCategory();

  return (
    <>
      <PageHero title={page.hero.title} intro={page.hero.intro} image={page.hero.image} />

      {/*
       * One continuous listing rather than a stack of separate sections: the categories
       * are dividers inside it, so the whole catalogue reads as a single grid and the
       * four-column rhythm never breaks between groups.
       */}
      <Section space="tight">
        <Container>
          {groups.map((group, gi) => (
            <div key={group.category} className={styles.group}>
              <div className={styles.groupHead}>
                <h2 className={styles.groupTitle}>{group.category}</h2>
                <span className={styles.groupCount}>
                  {group.items.length} {group.items.length === 1 ? 'treatment' : 'treatments'}
                </span>
                <span className={styles.groupRule} />
              </div>

              <ul className={styles.grid}>
                {group.items.map((service, i) => (
                  <li key={service.slug}>
                    <Reveal delay={i * 70}>
                      <ServiceCard service={service} size="compact" priority={gi === 0 && i < 4} />
                    </Reveal>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Container>
      </Section>

      {/* Why Choose Us */}
      <Section tone="alt" space="tight" className={styles.compactSection}>
        <Container>
          {/*
           * Heading beside the paragraph instead of stacked above it — the intro runs to
           * four lines, and centring it under the heading was what pushed this section
           * past a screen height.
           */}
          <div className={styles.splitHead}>
            <div>
              <p className={styles.eyebrow}>{page.why.eyebrow}</p>
              <h2 className={styles.splitHeading}>{page.why.heading}</h2>
            </div>
            <p className={styles.splitText}>{page.why.text}</p>
          </div>

          <ul className={styles.reasons}>
            {page.why.reasons.map((reason, i) => (
              <li key={reason.title}>
                <Reveal delay={i * 60} className={styles.reasonReveal}>
                  <article className={styles.reason}>
                    {reason.icon ? (
                      <span className={styles.reasonIconWrap}>
                        <Image
                          src={reason.icon}
                          alt=""
                          width={40}
                          height={40}
                          className={styles.reasonIcon}
                          quality={IMAGE_QUALITY}
                        />
                      </span>
                    ) : null}
                    <h3 className={styles.reasonTitle}>{reason.title}</h3>
                    <p className={styles.reasonText}>{reason.text}</p>
                  </article>
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* How It Works */}
      <Section space="tight" className={styles.compactSection}>
        <Container>
          <div className={styles.stepsHead}>
            <p className={styles.eyebrow}>{page.how.eyebrow}</p>
            <h2 className={styles.splitHeading}>{page.how.heading}</h2>
          </div>

          <ol className={styles.steps}>
            {page.how.steps.map((step, i) => (
              <li key={step.title}>
                <Reveal delay={i * 90} className={styles.stepReveal}>
                  <article className={styles.step}>
                    <span className={styles.stepNo}>{String(i + 1).padStart(2, '0')}</span>
                    {step.icon ? (
                      <Image
                        src={step.icon}
                        alt=""
                        width={56}
                        height={56}
                        className={styles.stepIcon}
                        quality={IMAGE_QUALITY}
                      />
                    ) : null}
                    <h3 className={styles.stepTitle}>{step.title}</h3>
                    <p className={styles.stepText}>{step.text}</p>
                  </article>
                </Reveal>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* FAQ */}
      <Section tone="alt" space="tight">
        <Container>
          <div className={styles.faqHead}>
            <p className={styles.eyebrow}>{page.faq.eyebrow}</p>
            <h2>{page.faq.heading}</h2>
          </div>
          <Accordion items={page.faq.items} />
        </Container>
      </Section>
    </>
  );
}

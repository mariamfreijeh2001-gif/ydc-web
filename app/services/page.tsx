import type { Metadata } from 'next';
import Image from 'next/image';

import { PageHero } from '@/components/blocks/PageHero';
import { ServiceCard } from '@/components/blocks/ServiceCard';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Accordion } from '@/components/ui/Accordion';
import page from '@/content/pages/services.json';
import { servicesByCategory } from '@/lib/content';
import styles from './page.module.css';

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

      {groups.map((group, gi) => (
        <Section key={group.category} space="tight" className={styles.group}>
          <Container>
            <h2 className={styles.groupTitle}>{group.category}</h2>
            <ul className={styles.grid}>
              {group.items.map((service, i) => (
                <li key={service.slug}>
                  <ServiceCard service={service} priority={gi === 0 && i < 3} />
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ))}

      {/* Why Choose Us */}
      <Section tone="alt">
        <Container>
          <div className={styles.whyHead}>
            <p className={styles.eyebrow}>{page.why.eyebrow}</p>
            <h2>{page.why.heading}</h2>
            <p className={styles.whyText}>{page.why.text}</p>
          </div>

          <ul className={styles.reasons}>
            {page.why.reasons.map((reason) => (
              <li key={reason.title} className={styles.reason}>
                {reason.icon ? (
                  <Image
                    src={reason.icon}
                    alt=""
                    width={48}
                    height={48}
                    className={styles.reasonIcon}
                  />
                ) : null}
                <h3 className={styles.reasonTitle}>{reason.title}</h3>
                <p className={styles.reasonText}>{reason.text}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* How It Works */}
      <Section>
        <Container>
          <div className={styles.whyHead}>
            <p className={styles.eyebrow}>{page.how.eyebrow}</p>
            <h2>{page.how.heading}</h2>
          </div>

          <ol className={styles.steps}>
            {page.how.steps.map((step) => (
              <li key={step.title} className={styles.step}>
                {step.icon ? (
                  <Image src={step.icon} alt="" width={64} height={64} className={styles.stepIcon} />
                ) : null}
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepText}>{step.text}</p>
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

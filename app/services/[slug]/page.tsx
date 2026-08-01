import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import { ServiceCard } from '@/components/blocks/ServiceCard';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Accordion } from '@/components/ui/Accordion';
import { Button } from '@/components/ui/Button';
import { CheckIcon, MoonIcon, StarIcon } from '@/components/ui/Icon';
import { Tabs } from '@/components/ui/Tabs';
import { getService, relatedServices, services } from '@/lib/content';
import styles from './page.module.css';
import { IMAGE_QUALITY } from '@/components/ui/image';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};

  const description =
    service.intro?.blocks.find((b) => b.kind === 'paragraph')?.text.slice(0, 155) ??
    `${service.title} at Younes Dental Clinic.`;

  return {
    title: service.title,
    description,
    alternates: { canonical: `/services/${service.slug}/` },
    openGraph: {
      title: `${service.title} | Younes Dental Clinic`,
      description,
      images: service.image ? [service.image] : undefined,
    },
  };
}

const PRICING_ICONS = { moon: MoonIcon, star: StarIcon } as const;

export default async function ServiceDetailPage({ params }: Params) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const related = relatedServices(slug);

  return (
    <>
      {/* Title + featured image */}
      <Section space="none" className={styles.head}>
        <Container>
          <h1 className={styles.title}>{service.title}</h1>
          {service.image ? (
            <div className={styles.featured}>
              <Image
                src={service.image}
                alt={service.title}
                fill
                priority
                /*
                 * Some featured photos are far wider than 16:9, so covering the banner
                 * crops them heavily and needs a source well past the banner's own
                 * width — `sizes` has to describe the crop, not the box.
                 */
                sizes="(max-width: 767px) 200vw, 150vw"
                className={styles.featuredImg}
                quality={IMAGE_QUALITY}
              />
            </div>
          ) : null}
        </Container>
      </Section>

      {/* Intro */}
      {service.intro ? (
        <Section space="tight">
          <Container>
            <h2 className={styles.introHeading}>{service.intro.heading}</h2>
            <div className={styles.prose}>
              {service.intro.blocks.map((block, i) =>
                block.kind === 'subheading' ? (
                  <h3 key={i} className={styles.proseSub}>
                    {block.text}
                  </h3>
                ) : (
                  <p key={i}>{block.text}</p>
                ),
              )}
            </div>
          </Container>
        </Section>
      ) : null}

      {/* Why choose — three feature cards */}
      {service.features ? (
        <Section space="tight">
          <Container>
            {service.features.eyebrow ? (
              <p className={styles.eyebrow}>{service.features.eyebrow}</p>
            ) : null}
            <ul className={styles.features}>
              {service.features.items.map((item) => (
                <li key={item.title} className={styles.feature}>
                  {item.icon ? (
                    /*
                     * Rendered at its own pixel size (capped at 120), which is what the
                     * live theme does — one icon is 120x120, the others 80x80. Sized
                     * inline so no stylesheet rule can stretch a small icon up.
                     */
                    <Image
                      src={item.icon}
                      alt=""
                      width={item.iconW ?? 120}
                      height={item.iconH ?? 120}
                      sizes={`${Math.min(item.iconW ?? 120, 120)}px`}
                      style={{
                        width: Math.min(item.iconW ?? 120, 120),
                        height: 'auto',
                      }}
                      className={styles.featureIcon}
                      quality={IMAGE_QUALITY}
                    />
                  ) : null}
                  <h3 className={styles.featureTitle}>{item.title}</h3>
                  <p className={styles.featureText}>{item.text}</p>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      {/* Who can get this — image + contraindication list */}
      {service.candidates ? (
        <Section space="tight">
          <Container>
            <div className={styles.split}>
              {service.candidates.image ? (
                <div className={styles.splitMedia}>
                  <Image
                    src={service.candidates.image}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 130vw, 105vw"
                    className={styles.splitImg}
                    quality={IMAGE_QUALITY}
                  />
                </div>
              ) : null}

              <div className={styles.splitBody}>
                {service.candidates.heading ? <h2>{service.candidates.heading}</h2> : null}
                {service.candidates.text ? (
                  <p className={styles.splitText}>{service.candidates.text}</p>
                ) : null}
                {service.candidates.listHeading ? (
                  <h3 className={styles.listHeading}>{service.candidates.listHeading}</h3>
                ) : null}
                <ul className={styles.checkList}>
                  {service.candidates.items.map((item) => (
                    <li key={item}>
                      <CheckIcon width={16} height={16} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Container>
        </Section>
      ) : null}

      {/* Restorative options — image + accent panel */}
      {service.restorative ? (
        <Section space="tight">
          <Container>
            <div className={styles.split}>
              {service.restorative.image ? (
                <div className={styles.splitMedia}>
                  <Image
                    src={service.restorative.image}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 130vw, 105vw"
                    className={styles.splitImg}
                    quality={IMAGE_QUALITY}
                  />
                </div>
              ) : null}

              <div className={styles.panel}>
                {service.restorative.eyebrow ? (
                  <p className={styles.panelEyebrow}>{service.restorative.eyebrow}</p>
                ) : null}
                <h2>{service.restorative.heading}</h2>
                {service.restorative.paragraphs.map((p, i) => (
                  <p key={i} className={styles.panelText}>
                    {p}
                  </p>
                ))}
                {service.restorative.cta ? (
                  <Button href={service.restorative.cta.href} variant="primary" size="sm">
                    {service.restorative.cta.label}
                  </Button>
                ) : null}
              </div>
            </div>
          </Container>
        </Section>
      ) : null}

      {/* Visit tabs */}
      {service.visits?.length ? (
        <Section space="tight">
          <Container>
            <Tabs tabs={service.visits} />
          </Container>
        </Section>
      ) : null}

      {/* Pricing */}
      {service.pricing?.plans.length ? (
        <Section space="tight">
          <Container>
            <div className={styles.pricingHead}>
              <h2 className={styles.pricingTitle}>{service.pricing.heading}</h2>
              {service.pricing.subheading ? (
                <p className={styles.pricingSub}>{service.pricing.subheading}</p>
              ) : null}
              {service.pricing.note ? (
                <p className={styles.pricingNote}>{service.pricing.note}</p>
              ) : null}
            </div>

            <ul className={styles.plans}>
              {service.pricing.plans.map((plan, i) => {
                const PlanIcon = plan.icon
                  ? PRICING_ICONS[plan.icon as keyof typeof PRICING_ICONS]
                  : null;
                return (
                  <li key={plan.title} className={`${styles.plan} ${i % 2 ? styles.planDark : ''}`}>
                    {PlanIcon ? (
                      <span className={styles.planIcon}>
                        <PlanIcon width={22} height={22} />
                      </span>
                    ) : null}
                    <h3 className={styles.planTitle}>{plan.title}</h3>
                    <p className={styles.planPrice}>{plan.price}</p>
                    <p className={styles.planNote}>{plan.note}</p>
                  </li>
                );
              })}
            </ul>
          </Container>
        </Section>
      ) : null}

      {/* Related */}
      <Section space="tight">
        <Container>
          <h2 className={styles.relatedTitle}>Related Services</h2>
          <ul className={styles.relatedGrid}>
            {related.map((item) => (
              <li key={item.slug}>
                <ServiceCard service={item} />
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* FAQ */}
      {service.faq.length ? (
        <Section space="tight">
          <Container>
            <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
            <Accordion items={service.faq} />
          </Container>
        </Section>
      ) : null}
    </>
  );
}

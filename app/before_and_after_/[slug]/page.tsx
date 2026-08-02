import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { BeforeAfterSlider } from '@/components/blocks/BeforeAfterSlider';
import { Gallery } from '@/components/blocks/Gallery';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { ArrowLeftIcon, ArrowUpRightIcon } from '@/components/ui/Icon';
import { cases, getCase, getService } from '@/lib/content';
import styles from './page.module.css';
import { IMAGE_QUALITY } from '@/components/ui/image';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return cases.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const item = getCase(slug);
  if (!item) return {};

  const description = item.body.slice(0, 155);
  return {
    title: `${item.procedure} — before & after`,
    description,
    alternates: { canonical: `/before_and_after_/${item.slug}/` },
    openGraph: {
      title: `${item.procedure} — before & after | Younes Dental Clinic`,
      description,
      images: item.cover ? [item.cover] : undefined,
    },
  };
}

export default async function CasePage({ params }: Params) {
  const { slug } = await params;
  const item = getCase(slug);
  if (!item) notFound();

  // Cases are examples of a treatment, so they link back to that treatment's service.
  const service = item.serviceSlug ? getService(item.serviceSlug) : undefined;

  return (
    <>
      <Section space="none" className={styles.head}>
        <Container>
          <Link href="/before-after/" className={styles.back}>
            <ArrowLeftIcon width={15} height={15} />
            All cases
          </Link>

          {/*
            The heading is the treatment, never patient initials, and it links through
            to the service page for that treatment.
          */}
          <h1 className={styles.title}>
            {service ? (
              <Link href={`/services/${service.slug}/`} className={styles.titleLink}>
                {item.procedure}
                <ArrowUpRightIcon className={styles.titleArrow} width={22} height={22} />
              </Link>
            ) : (
              item.procedure
            )}
          </h1>
          <p className={styles.meta}>
            {service ? <span className={styles.chip}>{service.category}</span> : null}
            <time dateTime={item.date}>
              {new Date(item.date).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </time>
          </p>

          {item.cover ? (
            <div className={styles.cover}>
              <Image
                src={item.cover}
                alt={`${item.procedure} — patient result`}
                fill
                priority
                sizes="(max-width: 1280px) 100vw, 1280px"
                className={styles.coverImg}
                quality={IMAGE_QUALITY}
              />
            </div>
          ) : null}
        </Container>
      </Section>

      {/* Comparison slider + description */}
      <Section space="tight">
        <Container>
          <div className={styles.split}>
            {item.before && item.after ? (
              <BeforeAfterSlider before={item.before} after={item.after} alt={`${item.procedure} — patient result`} />
            ) : null}

            <div className={styles.body}>
              <h2 className={styles.bodyHeading}>{item.heading}</h2>
              {item.body.split('\n\n').map((para, i) => (
                <p key={i} className={styles.bodyText}>
                  {para}
                </p>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Gallery */}
      {item.gallery.length ? (
        <Section space="tight">
          <Container>
            <h2 className="visually-hidden">Photo gallery</h2>
            <Gallery images={item.gallery} caption={item.procedure} />
          </Container>
        </Section>
      ) : null}
    </>
  );
}

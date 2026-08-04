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
      {/*
        The portrait beside the title, not a full-width square beneath it. At container
        width the square was 1280px tall — the page opened on a crop of the patient's
        forehead and the treatment name was gone before you could read it.
      */}
      <Section space="none" className={styles.head}>
        <Container>
          <Link href="/before-after/" className={styles.back}>
            <ArrowLeftIcon width={15} height={15} />
            All cases
          </Link>

          <div className={styles.headGrid}>
            {item.cover ? (
              <div className={styles.cover}>
                <Image
                  src={item.cover}
                  alt={`${item.procedure} — patient result`}
                  fill
                  priority
                  sizes="(max-width: 767px) 90vw, 40vw"
                  className={styles.coverImg}
                  quality={IMAGE_QUALITY}
                />
              </div>
            ) : null}

            <div className={styles.headBody}>
              <p className={styles.eyebrow}>Patient case</p>
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
              {/*
                The whole story, here rather than in a column beside the slider. Every
                case's copy is a single paragraph, so there was nothing to split into a
                lede without cutting it mid-thought — and moving it up lets the
                before-and-after have the page to itself, which is what people came for.
              */}
              {item.body ? <p className={styles.headLede}>{item.body}</p> : null}
            </div>
          </div>
        </Container>
      </Section>

      {/* The comparison, full width — it is the reason the page exists. */}
      {item.before && item.after ? (
        <Section space="tight">
          <Container>
            <div className={styles.compareHead}>
              <h2 className={styles.compareTitle}>Before and after</h2>
              <p className={styles.compareHint}>Drag the handle to compare</p>
            </div>
            <BeforeAfterSlider
              before={item.before}
              after={item.after}
              alt={`${item.procedure} — patient result`}
            />
          </Container>
        </Section>
      ) : null}

      {/* Gallery */}
      {item.gallery.length ? (
        <Section space="tight">
          <Container>
            <div className={styles.galleryHead}>
              <h2 className={styles.galleryTitle}>Every stage, photographed</h2>
              <p className={styles.galleryCount}>
                {item.gallery.length} photos · tap any to enlarge
              </p>
            </div>
            <Gallery images={item.gallery} caption={item.procedure} />
          </Container>
        </Section>
      ) : null}
    </>
  );
}

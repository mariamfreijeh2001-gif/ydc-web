import type { Metadata } from 'next';
import Image from 'next/image';

import { ContactForm } from '@/components/blocks/ContactForm';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { ArrowUpRightIcon } from '@/components/ui/Icon';
import { clinics, contact } from '@/content/site';
import styles from './page.module.css';
import { IMAGE_QUALITY } from '@/components/ui/image';

export const metadata: Metadata = {
  title: 'Contacts',
  description:
    'Visit Younes Dental Clinic in Jeita or Sour. Address, opening hours, directions and a contact form — or reach us by phone, e-mail or WhatsApp.',
  alternates: { canonical: '/contacts/' },
};

const ASK_IMAGE = '/media/2024/08/Beige-Minimalist-Carousel-Instagram-Post-33.webp';

export default function ContactsPage() {
  return (
    <>
      {/* Our Locations */}
      <Section space="tight">
        <Container>
          <h1 className={styles.pageTitle}>Our Locations</h1>

          <ul className={styles.clinics}>
            {clinics.map((clinic, i) => (
              <li key={clinic.name} className={styles.clinic}>
                <div className={styles.clinicMedia}>
                  <Image
                    src={clinic.image}
                    alt={clinic.name}
                    fill
                    priority={i === 0}
                    sizes="(max-width: 1024px) 100vw, 46vw"
                    className={styles.cover}
                    quality={IMAGE_QUALITY}
                  />
                </div>

                <h2 className={styles.clinicName}>{clinic.name}</h2>

                <div className={styles.clinicMeta}>
                  <div>
                    <p className={styles.label}>Address:</p>
                    <p className={styles.value}>{clinic.address}</p>
                  </div>
                  <div>
                    <p className={styles.label}>Service Times:</p>
                    <p className={styles.value}>{clinic.serviceTimes}</p>
                  </div>
                </div>

                <a
                  className={styles.directions}
                  href={clinic.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get Directions
                  <ArrowUpRightIcon width={13} height={13} />
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Contact information + map */}
      <Section space="tight">
        <Container>
          <div className={styles.info}>
            <div className={styles.infoBody}>
              <h2 className={styles.infoTitle}>Contact Information</h2>
              <p className={styles.infoText}>
                Learn more about our clinic and doctors and why they are trusted by so many families
                in our community.
              </p>

              <div className={styles.clinicMeta}>
                <div>
                  <p className={styles.label}>Address:</p>
                  <p className={styles.value}>{clinics[0].address}</p>
                </div>
                <div>
                  <p className={styles.label}>Service Times:</p>
                  <p className={styles.value}>{clinics[0].serviceTimes}</p>
                </div>
              </div>
            </div>

            <div className={styles.map}>
              <iframe
                src={clinics[0].mapEmbed}
                title="Map showing Younes Dental Clinic, Jeita"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* Ask a question */}
      <Section space="tight">
        <Container>
          <div className={styles.ask}>
            <div className={styles.askMedia}>
              <Image
                src={ASK_IMAGE}
                alt=""
                width={520}
                height={520}
                sizes="(max-width: 1024px) 60vw, 420px"
                className={styles.askImg}
                quality={IMAGE_QUALITY}
              />
            </div>

            <div className={styles.askBody}>
              <h2 className={styles.infoTitle}>Ask a Question</h2>
              <p className={styles.askIntro}>
                If you have any questions, you can contact us. Please, fill out the form below.
              </p>
              <ContactForm />
              <p className={styles.askDirect}>
                Prefer to talk now? <a href={contact.phoneHref}>{contact.phoneDisplay}</a> ·{' '}
                <a href={contact.emailHref}>{contact.email}</a>
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

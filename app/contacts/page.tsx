import type { Metadata } from 'next';
import Image from 'next/image';

import { ClinicLocator } from '@/components/blocks/ClinicLocator';
import { ContactForm } from '@/components/blocks/ContactForm';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { AtIcon, PhoneIcon, WhatsAppIcon } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import { contact, publishedClinics } from '@/content/site';
import styles from './page.module.css';
import { IMAGE_QUALITY } from '@/components/ui/image';

export const metadata: Metadata = {
  title: 'Contacts',
  description:
    'Visit Younes Dental Clinic in Jeita, Sour or Antelias. Addresses, opening hours, directions and a contact form — or reach us by phone, e-mail or WhatsApp.',
  alternates: { canonical: '/contacts/' },
};

const ASK_IMAGE = '/media/2024/08/Beige-Minimalist-Carousel-Instagram-Post-33.webp';

export default function ContactsPage() {
  return (
    <>
      {/* Our Locations */}
      <Section space="tight">
        <Container>
          <div className={styles.head}>
            <p className={styles.eyebrow}>Our clinics</p>
            <h1 className={styles.pageTitle}>Three clinics across Lebanon</h1>
            <p className={styles.headText}>
              Jeita, Sour and Antelias — same team, same treatments, same equipment. All three
              are on the map below; pick whichever is nearest, or call and we&rsquo;ll tell you
              which is easiest to reach from where you are.
            </p>
          </div>

          {/* Phone, e-mail and WhatsApp up front, for anyone who came here to get in touch. */}
          <ul className={styles.quick}>
            <li>
              <a className={styles.quickLink} href={contact.phoneHref}>
                <span className={styles.quickIcon}>
                  <PhoneIcon width={17} height={17} />
                </span>
                <span>
                  <span className={styles.quickLabel}>Call us</span>
                  <span className={styles.quickValue}>{contact.phoneDisplay}</span>
                </span>
              </a>
            </li>
            <li>
              <a className={styles.quickLink} href={contact.whatsappHref} target="_blank" rel="noopener noreferrer">
                <span className={styles.quickIcon}>
                  <WhatsAppIcon width={17} height={17} />
                </span>
                <span>
                  <span className={styles.quickLabel}>WhatsApp</span>
                  <span className={styles.quickValue}>{contact.whatsapp}</span>
                </span>
              </a>
            </li>
            <li>
              <a className={styles.quickLink} href={contact.emailHref}>
                <span className={styles.quickIcon}>
                  <AtIcon width={17} height={17} />
                </span>
                <span>
                  <span className={styles.quickLabel}>E-mail</span>
                  <span className={styles.quickValue}>{contact.email}</span>
                </span>
              </a>
            </li>
          </ul>

          <Reveal>
            <ClinicLocator clinics={publishedClinics} />
          </Reveal>
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

import type { Metadata } from 'next';

import { DoctorCard } from '@/components/blocks/DoctorCard';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { doctors } from '@/lib/content';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Doctors',
  description:
    'Meet the dentists and implant surgeons of Younes Dental Ortho Implant Center — Dr Ali Younes, Dr Samer Dawoud, Dr Jamal Younes and Dr Hassanain Younes.',
  alternates: { canonical: '/doctors/' },
};

export default function DoctorsPage() {
  return (
    <Section space="tight" className={styles.section}>
      <Container>
        <h1 className="visually-hidden">Our Doctors</h1>
        <ul className={styles.grid}>
          {doctors.map((doctor) => (
            <li key={doctor.name}>
              <DoctorCard doctor={doctor} />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

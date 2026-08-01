import Image from 'next/image';

import type { Doctor } from '@/lib/content';
import { SocialGlyph } from '@/components/ui/Icon';
import styles from './DoctorCard.module.css';
import { IMAGE_QUALITY } from '@/components/ui/image';

export function DoctorCard({ doctor }: { doctor: Doctor }) {
  const links = [
    { icon: 'linkedin' as const, href: doctor.linkedin, label: `${doctor.name} on LinkedIn` },
    { icon: 'instagram' as const, href: doctor.instagram, label: `${doctor.name} on Instagram` },
  ].filter((l) => l.href && l.href !== '#');

  return (
    <article className={styles.card}>
      <h3 className={styles.name}>{doctor.name}</h3>
      <p className={styles.role}>{doctor.role}</p>

      <div className={styles.photo}>
        <Image
          src={doctor.photo}
          alt={doctor.name}
          fill
          sizes="(max-width: 767px) 60vw, 260px"
          className={styles.img}
          quality={IMAGE_QUALITY}
        />
      </div>

      {links.length ? (
        <ul className={styles.socials}>
          {links.map((link) => (
            <li key={link.icon}>
              <a
                href={link.href}
                aria-label={link.label}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.social}
              >
                <SocialGlyph icon={link.icon} width={14} height={14} />
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

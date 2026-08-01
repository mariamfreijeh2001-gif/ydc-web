import Link from 'next/link';

import { contact, copyright, footerMission, footerNav, socials } from '@/content/site';
import { AtIcon, PhoneIcon, SocialGlyph, WhatsAppIcon } from '@/components/ui/Icon';
import styles from './SiteFooter.module.css';

export function SiteFooter() {
  // Rendered at build time. The live site's footer shows the build year the same way.
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          <nav className={styles.nav} aria-label="Footer">
            <ul>
              {footerNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={styles.navLink}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <p className={styles.mission}>{footerMission}</p>

          <div className={styles.contact}>
            <address className={styles.address}>
              {contact.addressLines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </address>

            <ul className={styles.contactList}>
              <li>
                <a href={contact.phoneHref}>
                  <PhoneIcon width={16} height={16} />
                  {contact.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={contact.emailHref}>
                  <AtIcon width={16} height={16} />
                  {contact.email}
                </a>
              </li>
              <li>
                <a href={contact.whatsappHref} target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon width={16} height={16} />
                  {contact.whatsapp}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.bar}>
          <p className={styles.copy}>{copyright(year)}</p>

          <ul className={styles.socials}>
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className={styles.social}
                >
                  <SocialGlyph icon={s.icon} width={15} height={15} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

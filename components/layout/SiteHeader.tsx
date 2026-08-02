'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { contact, nav, site } from '@/content/site';
import { AtIcon, CloseIcon, MenuIcon, PhoneIcon } from '@/components/ui/Icon';
import styles from './SiteHeader.module.css';
import { IMAGE_QUALITY } from '@/components/ui/image';

const LOGO = '/media/2024/05/ydc_logo_transparent.webp';

/** `/` only matches itself; every other entry also matches its sub-routes. */
function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(href);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the drawer whenever the route changes.
  useEffect(() => setOpen(false), [pathname]);

  // Lock background scroll while the drawer is open, and allow Esc to dismiss.
  useEffect(() => {
    document.body.classList.toggle('is-locked', open);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('is-locked');
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo} aria-label={`${site.name} — home`}>
          <Image src={LOGO} alt={site.name} width={230} height={44} priority
  quality={IMAGE_QUALITY}
/>
        </Link>

        <nav className={styles.nav} aria-label="Main">
          <ul className={styles.navList}>
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={styles.navLink}
                  aria-current={isActive(pathname, item.href) ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          className={styles.toggle}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <CloseIcon width={22} height={22} /> : <MenuIcon width={22} height={22} />}
        </button>
      </div>

      {/*
        Off-canvas drawer, mirroring the theme's mobile menu. The viewport-sized shell
        clips the parked drawer so it can't widen the document.
      */}
      <div className={`${styles.shell} ${open ? styles.shellOpen : ''}`}>
        <div
          className={`${styles.scrim} ${open ? styles.scrimOpen : ''}`}
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
        <div id="mobile-menu" className={`${styles.drawer} ${open ? styles.drawerOpen : ''}`}>
          <div className={styles.drawerHead}>
            <span className={styles.drawerTitle}>Menu</span>
            <button
              type="button"
              className={styles.drawerClose}
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >
              <CloseIcon width={22} height={22} />
            </button>
          </div>

          <nav aria-label="Mobile">
            <ul className={styles.drawerList}>
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={styles.drawerLink}
                    aria-current={isActive(pathname, item.href) ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.drawerContact}>
            <a href={contact.phoneHref}>
              <PhoneIcon width={17} height={17} />
              {contact.phoneDisplay}
            </a>
            <a href={contact.emailHref}>
              <AtIcon width={17} height={17} />
              {contact.email}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

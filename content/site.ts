/**
 * Global site data: navigation, contact details, socials, footer copy.
 * Every value here is transcribed from the live WordPress header/footer templates.
 */

export type NavItem = { label: string; href: string };

export const site = {
  name: 'Younes Dental Clinic',
  legalName: 'Younes Dental Ortho Implant Center',
  url: 'https://younes.dental',
  tagline: 'Ortho Implant Center',
  description:
    'Younes Dental Clinic — dental implants, All-on-4, veneers, aligners and orthodontics in Lebanon. Advanced technology, same-day implants and full-arch restorations.',
} as const;

/** Header navigation — order matches the live site exactly. */
export const nav: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services/' },
  { label: 'About Us', href: '/about-us/' },
  { label: 'Contacts', href: '/contacts/' },
  { label: 'Our technologies', href: '/technologies/' },
  { label: 'Before & after', href: '/before-after/' },
];

/** Footer navigation — a shorter list than the header, as on the live site. */
export const footerNav: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about-us/' },
  { label: 'Services', href: '/services/' },
  { label: 'Contacts', href: '/contacts/' },
];

export const contact = {
  phone: '+96181258176',
  phoneDisplay: '+96181258176',
  phoneHref: 'tel:+96181258176',
  email: 'info@younes.clinic',
  emailHref: 'mailto:info@younes.clinic',
  whatsapp: '+96181258176',
  whatsappHref:
    'https://wa.me/96181258176?text=Hello%2C%20I%20was%20checking%20out%20your%20website%20and%20I%20have%20a%20question.',
  whatsappLabel: 'How can I help you?',
  /** Footer address block — one line per clinic. */
  addressLines: [
    'Lebanese Marine & Wildlife Museum, Jieta Grotto road, Jieta',
    'Center Marine 6th floor, Sour',
    'Demco Towers, Antelias Highway, Antelias',
  ],
} as const;

/**
 * A clinic is only rendered on /contacts/ once it has an address — see the note on
 * the Antelias entry below. Everything except `name` is therefore optional.
 */
export type Clinic = {
  name: string;
  image?: string;
  address?: string;
  serviceTimes?: string;
  directionsUrl?: string;
  mapEmbed?: string;
};

export const clinics: Clinic[] = [
  {
    name: 'Jeita Clinic',
    image: '/media/2024/01/contacts-2.webp',
    address: 'Lebanese Marine & Wildlife Museum, Jieta Grotto road, Jeita',
    serviceTimes: 'Monday till Thursday, 9 am till 5 pm',
    directionsUrl:
      'https://www.google.com/maps/place/Younes+Dental+Ortho+Implant+Center+-+Dr+Ali+Younes/@33.9486484,35.6313896,17z/data=!3m1!4b1!4m5!3m4!1s0x151f3fd9bfc4402b:0xde80bc6b32bcfd5f!8m2!3d33.9486371!4d35.6335657',
    mapEmbed: 'https://maps.google.com/maps?q=33.9486371,35.6335657&z=15&output=embed',
  },
  {
    name: 'Sour Clinic',
    image: '/media/2024/01/contacts-3.webp',
    address: 'Center Marine 6th floor',
    serviceTimes: 'Monday till Thursday, 9 am till 5 pm',
    directionsUrl:
      'https://www.google.com/maps/place/Younes+dental+clinic/@33.2696731,35.2006683,17z/data=!3m1!4b1!4m6!3m5!1s0x151e7d9161f722c5:0xe117d9b7e31521a8!8m2!3d33.2696731!4d35.2006683!16s%2Fg%2F11byygwzts?entry=ttu',
    mapEmbed: 'https://maps.google.com/maps?q=33.2696731,35.2006683&z=15&output=embed',
  },
  {
    /*
     * Antelias never appeared on the WordPress site. The address is confirmed; opening
     * hours and an interior photo are still outstanding, and the card renders without
     * them rather than repeating the other clinics' hours as an assumption.
     * The map links are a search on the address itself, not asserted coordinates.
     */
    name: 'Antelias Clinic',
    address: 'Demco Towers, Antelias Highway, Antelias',
    directionsUrl:
      'https://www.google.com/maps/search/?api=1&query=Demco%20Towers%2C%20Antelias%20Highway%2C%20Antelias%2C%20Lebanon',
    mapEmbed:
      'https://maps.google.com/maps?q=Demco%20Towers%2C%20Antelias%20Highway%2C%20Antelias%2C%20Lebanon&z=15&output=embed',
  },
];

/** Clinics with enough detail to publish a location card. */
export const publishedClinics = clinics.filter((c) => Boolean(c.address));

export type Social = { label: string; href: string; icon: SocialIcon };
export type SocialIcon = 'facebook' | 'instagram' | 'tiktok' | 'youtube' | 'linkedin';

export const socials: Social[] = [
  { label: 'Facebook', href: 'https://www.facebook.com/younesdentalclinic', icon: 'facebook' },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/younesdentalclinic?igsh=cXE0MWt5c2hkNmxy',
    icon: 'instagram',
  },
  // NOTE: on the live WordPress site the TikTok icon also points at Instagram — very
  // likely a copy-paste slip when the footer was built. Kept as-is so the rebuild is
  // faithful; swap in the real TikTok URL when it's available.
  {
    label: 'TikTok',
    href: 'https://www.instagram.com/younesdentalclinic?igsh=cXE0MWt5c2hkNmxy',
    icon: 'tiktok',
  },
  { label: 'YouTube', href: 'https://www.youtube.com/@jamalyounes46', icon: 'youtube' },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/younes-dental-ortho-implant-center/',
    icon: 'linkedin',
  },
];

export const footerMission =
  'We recognize the vital connection between oral health and your overall well-being, confidence, and appearance. Our goal is to create a friendly and upbeat dental environment where you can always feel at ease in our care.';

export const copyright = (year: number) =>
  `Younes Dental Clinic - © ${year} - All Rights Reserved`;

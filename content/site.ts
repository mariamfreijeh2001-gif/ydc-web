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
  /** Only where the clinic has given us exact coordinates — never inferred. */
  coords?: { lat: number; lng: number };
  directionsUrl?: string;
  mapEmbed?: string;
};

export const clinics: Clinic[] = [
  {
    name: 'Jeita Clinic',
    image: '/media/2024/01/contacts-2.webp',
    address: 'Lebanese Marine & Wildlife Museum, Jieta Grotto road, Jeita',
    serviceTimes: 'Monday till Thursday, 9 am till 5 pm',
    /* From the clinic's own Google listing. */
    coords: { lat: 33.9486371, lng: 35.6335657 },
    directionsUrl:
      'https://www.google.com/maps/place/Younes+Dental+Ortho+Implant+Center+-+Dr+Ali+Younes/@33.9486484,35.6313896,17z/data=!3m1!4b1!4m5!3m4!1s0x151f3fd9bfc4402b:0xde80bc6b32bcfd5f!8m2!3d33.9486371!4d35.6335657',
    mapEmbed: 'https://maps.google.com/maps?q=33.9486371,35.6335657&z=15&output=embed',
  },
  {
    name: 'Sour Clinic',
    image: '/media/2024/01/contacts-3.webp',
    address: 'Center Marine, 6th floor, Tyre',
    serviceTimes: 'Monday till Thursday, 9 am till 5 pm',
    /* Coordinates supplied by the clinic. */
    coords: { lat: 33.26982554386347, lng: 35.20063611731417 },
    directionsUrl:
      'https://www.google.com/maps/search/?api=1&query=33.26982554386347,35.20063611731417',
    mapEmbed:
      'https://maps.google.com/maps?q=33.26982554386347,35.20063611731417&z=16&output=embed',
  },
  {
    /*
     * Antelias never appeared on the WordPress site, so none of this came from the
     * export — the address and hours were supplied by the clinic directly. The photo
     * stands in from Jeita until Antelias has its own; the map searches the address
     * text rather than asserting coordinates we haven't been given.
     */
    name: 'Antelias Clinic — Murex',
    image: '/media/2024/01/contacts-2.webp',
    address: 'Murex, Demco Towers, Antelias Highway, Antelias',
    serviceTimes: 'Monday till Friday, 9 am till 5 pm',
    /*
     * The town of Antelias, not the building — we haven't been given a pin for Demco
     * Towers. It is accurate enough for a country-scale map, where a kilometre is about
     * a pixel, and "Get directions" searches the full address rather than these numbers.
     */
    coords: { lat: 33.9137, lng: 35.5878 },
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
  /*
   * The live WordPress footer pointed its TikTok icon at Instagram — a copy-paste slip
   * carried over from the original build. This is the real account, supplied by the
   * clinic. The tracking parameters from the share link are dropped: they identify the
   * share that produced the URL and are meaningless to anyone else.
   */
  { label: 'TikTok', href: 'https://www.tiktok.com/@draliyounes', icon: 'tiktok' },
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

import doctorsData from '@/content/doctors.json';
import reviewsData from '@/content/reviews.json';

// ---- Types -----------------------------------------------------------------

export type ServiceCategory =
  | 'Dental Implants'
  | 'Orthodontic'
  | 'Therapeutic'
  | 'Imaging'
  | 'Cosmetic';

export type IntroBlock = { text: string; kind: 'paragraph' | 'subheading' };

export type Service = {
  slug: string;
  title: string;
  category: ServiceCategory;
  image: string | null;
  intro: { heading: string; blocks: IntroBlock[] } | null;
  features: {
    eyebrow: string;
    items: {
      icon: string | null;
      /** Natural pixel size — the theme renders each icon at its own dimensions. */
      iconW?: number;
      iconH?: number;
      title: string;
      text: string;
    }[];
  } | null;
  candidates: {
    heading: string;
    text: string;
    listHeading: string;
    items: string[];
    image: string | null;
  } | null;
  restorative: {
    eyebrow: string;
    heading: string;
    paragraphs: string[];
    cta: { label: string; href: string } | null;
    image: string | null;
  } | null;
  visits: { label: string; subtitle: string; points: { title: string; text: string }[] }[] | null;
  faq: { q: string; a: string }[];
};

export type PatientCase = {
  slug: string;
  title: string;
  date: string;
  cover: string | null;
  before: string | null;
  after: string | null;
  heading: string;
  body: string;
  gallery: string[];
  /** Treatment name, e.g. "All on 4". Patient initials are never published. */
  procedure: string;
  /** The service this treatment belongs to, so a case can link through to it. */
  serviceSlug: string | null;
};

export type Doctor = {
  name: string;
  role: string;
  photo: string;
  linkedin: string;
  instagram: string;
};

export type Review = { text: string; name: string; avatar: string | null; rating: number };

// ---- Loaders ---------------------------------------------------------------
//
// `require.context` isn't available in the App Router, and a dynamic `import()` of a
// glob would make these async. The set is small and fixed, so import explicitly —
// this also keeps every page fully static.

import advancedimagingservices from '@/content/services/advancedimagingservices.json';
import aligners from '@/content/services/aligners.json';
import allOn4 from '@/content/services/all-on-4.json';
import allon6 from '@/content/services/allon6.json';
import braces from '@/content/services/braces.json';
import dentalcrowns from '@/content/services/dentalcrowns.json';
import dentalimplant from '@/content/services/dentalimplant.json';
import nightguardservices from '@/content/services/nightguardservices.json';
import teethwhitening from '@/content/services/teethwhitening.json';
import therapeuticdentalservices from '@/content/services/therapeuticdentalservices.json';
import zaygoma from '@/content/services/zaygoma.json';
import zirArch from '@/content/services/zir-arch.json';
import zirMaxveneers from '@/content/services/zir-maxveneers.json';

import allon4nd from '@/content/cases/allon4-n-d.json';
import allon6mm from '@/content/cases/allon6-m-m.json';
import cbgingivectomymf from '@/content/cases/cbgingivectomy-m-f.json';

/** Display order for the /services/ page and the home grid. */
export const CATEGORY_ORDER: ServiceCategory[] = [
  'Dental Implants',
  'Orthodontic',
  'Therapeutic',
  'Imaging',
  'Cosmetic',
];

export const services = [
  dentalimplant,
  zaygoma,
  allOn4,
  allon6,
  braces,
  aligners,
  therapeuticdentalservices,
  nightguardservices,
  advancedimagingservices,
  dentalcrowns,
  teethwhitening,
  zirArch,
  zirMaxveneers,
] as unknown as Service[];

export const cases = [allon4nd, cbgingivectomymf, allon6mm] as unknown as PatientCase[];

export const doctors = doctorsData as Doctor[];
export const reviews = reviewsData as Review[];

// ---- Helpers ---------------------------------------------------------------

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}

export function getCase(slug: string) {
  return cases.find((c) => c.slug === slug);
}

/** Services grouped by category, in the site's canonical order. */
export function servicesByCategory() {
  return CATEGORY_ORDER.map((category) => ({
    category,
    items: services.filter((s) => s.category === category),
  })).filter((g) => g.items.length > 0);
}

/** Up to `limit` other services, used for the "Related Services" row. */
export function relatedServices(slug: string, limit = 3) {
  const current = getService(slug);
  if (!current) return services.slice(0, limit);
  const sameCategory = services.filter((s) => s.slug !== slug && s.category === current.category);
  const rest = services.filter((s) => s.slug !== slug && s.category !== current.category);
  return [...sameCategory, ...rest].slice(0, limit);
}

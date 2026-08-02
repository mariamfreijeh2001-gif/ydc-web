import { site } from '@/content/site';
import type { Service } from '@/lib/content';

/**
 * Per-service structured data.
 *
 * Three graphs, each earning something different in search:
 *  - MedicalProcedure describes the treatment itself and ties it back to the clinic,
 *    which is the entity the site-wide Dentist schema already establishes.
 *  - FAQPage is the one with a visible payoff — the questions can be shown directly
 *    under the result. It is only emitted when the page actually renders those
 *    questions, since marking up content a visitor cannot see is a guidelines breach.
 *  - BreadcrumbList replaces the bare URL in the result with Home › Services › Name.
 */
export function ServiceJsonLd({ service, description }: { service: Service; description: string }) {
  const url = `${site.url}/services/${service.slug}/`;
  const image = service.image ? `${site.url}${service.image}` : undefined;

  const procedure = {
    '@context': 'https://schema.org',
    '@type': 'MedicalProcedure',
    name: service.title,
    description,
    url,
    image,
    procedureType: 'https://schema.org/NoninvasiveProcedure',
    /* The visit tabs are literally the stages of treatment. */
    howPerformed: service.visits?.length
      ? service.visits
          .map((v) => `${v.label} — ${v.subtitle}: ${v.points.map((p) => p.title).join(', ')}`)
          .join(' ')
      : undefined,
    provider: {
      '@type': 'Dentist',
      name: site.legalName,
      url: site.url,
    },
  };

  const faq = service.faq.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: service.faq.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      }
    : null;

  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${site.url}/` },
      { '@type': 'ListItem', position: 2, name: 'Services', item: `${site.url}/services/` },
      { '@type': 'ListItem', position: 3, name: service.title, item: url },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // Built from local content files, never from user input.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify([procedure, faq, breadcrumbs].filter(Boolean)),
      }}
    />
  );
}

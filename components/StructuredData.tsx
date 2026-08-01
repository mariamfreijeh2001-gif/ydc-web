import { clinics, contact, site, socials } from '@/content/site';

/**
 * Schema.org `Dentist` markup so search engines can surface opening hours, the two
 * clinic locations and the aggregate Google rating.
 */
export function StructuredData() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Dentist',
    name: site.legalName,
    alternateName: site.name,
    url: site.url,
    telephone: contact.phone,
    email: contact.email,
    image: `${site.url}/media/2024/05/ydc_logo_transparent.webp`,
    priceRange: '$$',
    medicalSpecialty: 'Dentistry',
    sameAs: socials.map((s) => s.href),
    address: clinics.map((clinic) => ({
      '@type': 'PostalAddress',
      streetAddress: clinic.address,
      addressCountry: 'LB',
    })),
    location: clinics.map((clinic) => ({
      '@type': 'Place',
      name: clinic.name,
      address: { '@type': 'PostalAddress', streetAddress: clinic.address, addressCountry: 'LB' },
    })),
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
        opens: '09:00',
        closes: '17:00',
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      reviewCount: '250',
    },
  };

  return (
    <script
      type="application/ld+json"
      // The payload is built from local constants, never user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

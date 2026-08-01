import type { MetadataRoute } from 'next';

import { site } from '@/content/site';
import { cases, services } from '@/lib/content';

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${site.url}${path}`;

  const staticPages: MetadataRoute.Sitemap = [
    { url: url('/'), changeFrequency: 'monthly', priority: 1 },
    { url: url('/services/'), changeFrequency: 'monthly', priority: 0.9 },
    { url: url('/before-after/'), changeFrequency: 'monthly', priority: 0.9 },
    { url: url('/about-us/'), changeFrequency: 'yearly', priority: 0.7 },
    { url: url('/technologies/'), changeFrequency: 'yearly', priority: 0.7 },
    { url: url('/contacts/'), changeFrequency: 'yearly', priority: 0.7 },
    { url: url('/doctors/'), changeFrequency: 'yearly', priority: 0.6 },
  ];

  return [
    ...staticPages,
    ...services.map((s) => ({
      url: url(`/services/${s.slug}/`),
      changeFrequency: 'yearly' as const,
      priority: 0.8,
    })),
    ...cases.map((c) => ({
      url: url(`/before_and_after_/${c.slug}/`),
      lastModified: new Date(c.date),
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
  ];
}

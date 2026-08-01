/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The WordPress site served every URL with a trailing slash. Keep it so existing
  // links, bookmarks and search-engine results resolve without a redirect hop.
  trailingSlash: true,
  images: {
    /*
     * WebP only. With AVIF enabled the optimiser returned correctly-sized files but
     * Chromium decoded some of them at a fraction of their true size (a 1574px source
     * decoding to 676px), which showed up as soft, upscaled card photography. WebP is
     * universally supported and decodes at full size.
     */
    formats: ['image/webp'],
    // Matches the design breakpoints (767 / 1024) plus retina steps.
    deviceSizes: [390, 640, 767, 828, 1024, 1200, 1440, 1920, 2560],
    imageSizes: [64, 96, 128, 256, 384, 512],
    /*
     * Sources in public/media are already WebP, so next/image's optimiser is a *second*
     * lossy pass. Its default quality of 75 visibly softens the card photography, so
     * allow the higher value used by IMAGE_QUALITY in components/ui/image.ts.
     */
    qualities: [75, 90],
  },
  async redirects() {
    return [
      // Pretty alias for the WordPress case-study path.
      {
        source: '/before-after/:slug',
        destination: '/before_and_after_/:slug',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

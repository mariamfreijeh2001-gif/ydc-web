/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The WordPress site served every URL with a trailing slash. Keep it so existing
  // links, bookmarks and search-engine results resolve without a redirect hop.
  trailingSlash: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    // Matches the design breakpoints (767 / 1024) plus retina steps.
    deviceSizes: [390, 640, 767, 828, 1024, 1200, 1440, 1920],
    imageSizes: [64, 96, 128, 256, 384, 512],
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

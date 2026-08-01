/**
 * Quality passed to every `next/image`.
 *
 * The sources in `public/media` are already WebP produced by `scripts/import.mjs`, so
 * next/image's optimiser applies a second lossy pass on top. At its default quality of
 * 75 that compounds into visible softness and banding on the card photography, so we
 * raise it. Any value used here must also be listed in `images.qualities` in
 * next.config.mjs, or Next rejects the request.
 */
export const IMAGE_QUALITY = 90;

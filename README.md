# Younes Dental Clinic — younes.dental

Next.js rebuild of the clinic's WordPress site (theme `dentissimo` + Elementor), matching
the original design, routes and content.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build — all pages prerender to static HTML
npm start
```

## Stack

- **Next.js 15** (App Router, TypeScript), `trailingSlash: true` so the old WordPress URLs
  still resolve without a redirect hop.
- **CSS Modules + `styles/tokens.css`** — every colour, font size and breakpoint is
  transcribed from the live site's Elementor kit. `tokens.css` is the design contract;
  don't "improve" the numbers in it.
- **`next/font/google`** for Rethink Sans (the theme's typeface), self-hosted at build.
- Content is local typed JSON/TS under `content/` — no CMS.

## Layout

```
app/                    routes (one folder per URL)
components/
  layout/               Header, mobile drawer, Footer, WhatsApp FAB, Container, Section
  ui/                   Button, Icon, Accordion, Tabs
  blocks/               page-level building blocks (heroes, cards, slider, gallery, …)
content/
  site.ts               nav, contact details, socials, clinics, footer copy
  services/*.json       13 services (generated)
  cases/*.json          3 patient cases (generated)
  doctors.json  reviews.json  pages/services.json   (generated)
  pages/about.ts  pages/technologies.ts             (hand-authored copy)
lib/content.ts          typed loaders + helpers (grouping, related services)
public/media/           every image the site uses, mirroring the WP upload paths
scripts/                one-shot importer + screenshot QA tooling
styles/                 tokens.css, globals.css
```

## Content pipeline

`ydc media/` is the temporary WordPress export drop folder. `scripts/import.mjs` reads it
once and writes everything the app needs:

```bash
npm run import
```

It parses the WP REST export (`ydc media/site-archive/data/*.json`), pulls structured
content out of the Elementor markup, then copies every referenced image into
`public/media/`, re-encoding rasters to WebP capped at 1920px (276 MB → 11 MB) and
rewriting the content paths to match. Assets missing from the drop folder are fetched
from the live site.

**`ydc media/` is already gitignored and safe to delete** — the build has no reference to
it. To confirm at any time:

```bash
grep -rI "ydc media\|younes.dental/wp-content" app components content lib public   # expect no hits
```

Re-running the import is idempotent; it skips assets already present in `public/media/`.

## Design QA

Reference screenshots of the live WordPress site live in `.design-ref/live/`
(desktop 1440×900 and mobile 390×844). To compare the rebuild against them:

```bash
npm run dev                       # in one terminal
BASE=http://localhost:3000 node scripts/capture.mjs
```

Screenshots land in `.design-qa/` with filenames matching `.design-ref/live/`, so pages
can be diffed side by side. Both folders are gitignored.

## Contact form

`app/api/contact/route.ts` posts through [Resend](https://resend.com). Set:

| Variable | Purpose |
|---|---|
| `RESEND_API_KEY` | API key. **Without it the form returns a 503** and tells the visitor to email or WhatsApp instead, rather than silently dropping an enquiry. |
| `CONTACT_TO` | Destination inbox (defaults to `info@younes.clinic`). |
| `CONTACT_FROM` | Verified sender address on your Resend domain. |

## Adding a patient case

Three of the 38 archived cases are published. To add another:

1. Add its slug to `CASES` in `scripts/import.mjs`.
2. Run `npm run import` (it will fetch any images not in `public/media/` from the live site).
3. Add the generated `content/cases/<slug>.json` import to `lib/content.ts`.

## Out of scope

The site has **no blog and no shop**. The old WordPress install had two posts and six
WooCommerce products; both were deliberately dropped in the rebuild, so there is no
`/blog` route, no nav entry and no content file for either. Neither was linked from the
live site's navigation.

## Still to settle

These are known and deferred, not oversights:

- **Contact form** — needs `RESEND_API_KEY` (see above) before it can deliver.
- **WhatsApp** — the FAB and footer link point at `wa.me/96181258176`; confirm the number
  and the prefilled message text in `content/site.ts`.
- **Social links** — the live site's footer TikTok icon points at Instagram (a copy-paste
  slip carried over verbatim), and the doctors' LinkedIn/Instagram links were `#`
  placeholders, so those chips stay hidden until real URLs land in `content/doctors.json`.

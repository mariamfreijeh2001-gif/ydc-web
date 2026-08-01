/**
 * One-shot importer: WordPress export  ->  content/ + public/media/
 *
 *   node scripts/import.mjs
 *
 * Reads `ydc media/site-archive/data/*.json` (the WP REST export), writes typed JSON
 * into `content/`, then copies every referenced image out of `ydc media/**` into
 * `public/media/YYYY/MM/`, optimising as it goes. Anything missing locally is fetched
 * from the live site.
 *
 * Once this has run and its output is committed, `ydc media/` can be deleted.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

import {
  decodeEntities,
  textOf,
  originalName,
  uploadPath,
  splitContainers,
  headingsIn,
  paragraphsIn,
  listItemsIn,
  imagesIn,
  widgetSettings,
  bulletPairs,
  iconNamesIn,
} from './lib/wp.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ARCHIVE = path.join(ROOT, 'ydc media', 'site-archive', 'data');
const DROP = path.join(ROOT, 'ydc media');
const CONTENT = path.join(ROOT, 'content');
const PUBLIC_MEDIA = path.join(ROOT, 'public', 'media');
const LIVE = 'https://younes.dental/wp-content/uploads/';

/** Patient cases to publish. The other 35 stay in the archive. */
const CASES = ['allon4-n-d', 'cbgingivectomy-m-f', 'allon6-m-m'];

/** Service display order per category, matching the live /services/ page. */
const CATEGORY_ORDER = ['Dental Implants', 'Orthodontic', 'Therapeutic', 'Imaging', 'Cosmetic'];

/*
 * Assets used by the hand-authored pages, or set through CSS/inline styles rather than
 * markup, so the HTML scan can't find them.
 */
const EXTRA_ASSETS = [
  // Page heroes (Elementor container backgrounds)
  '2024/09/13-e1725452412121.png', // /services/
  '2024/10/Untitled-design-2024-10-09T174822.416-e1728485467520.png', // /before-after/
  '2024/10/Untitled-design-2024-10-09T171941.341.png', // /about-us/

  '2024/05/ydc_logo_transparent.png',
  '2024/11/Clinic-Intro.mp4', // home hero video

  // /about-us/
  '2024/08/Beige-Minimalist-Carousel-Instagram-Post-44-e1724683455273.png',
  '2024/08/Layer2.png',
  '2024/08/photo_2024-08-26_16-33-37-e1724683275733.jpg',
  '2024/08/Trophy-Image-1-scaled-e1724683331276.jpg',

  // /technologies/
  '2024/08/MOVE_2018_TransparentBG2_MID_RGB_1024x1024-600x600-1.png',
  '2024/08/82.png',
  '2024/08/84.png',
  '2024/08/152355959_2610908519200630_831233507284446161_n-1.png',
  '2024/08/85.png',

  // /contacts/
  '2024/01/contacts-2.webp', // Jeita clinic
  '2024/01/contacts-3.webp', // Sour clinic
  '2024/08/Beige-Minimalist-Carousel-Instagram-Post-33.png', // tooth + question mark
];

const used = new Set(EXTRA_ASSETS);
const track = (p) => {
  if (p) used.add(p);
  return p ? `/media/${p}` : null;
};

const readJson = async (name) =>
  JSON.parse(await fs.readFile(path.join(ARCHIVE, `${name}.json`), 'utf8'));

const writeJson = async (rel, data) => {
  const dest = path.join(CONTENT, rel);
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.writeFile(dest, `${JSON.stringify(data, null, 2)}\n`);
};

const featuredOf = (item) => {
  const fm = item._embedded?.['wp:featuredmedia']?.[0];
  return fm?.source_url ? uploadPath(fm.source_url) : null;
};

/**
 * Elementor writes section background images into a generated per-post stylesheet
 * rather than into the markup, so fetch it and map element id -> upload path.
 * Results are cached on disk so re-running the import stays offline-friendly.
 */
const CSS_CACHE = path.join(ROOT, 'ydc media', '.elementor-css');

async function backgroundMap(postId) {
  let css = '';
  const cached = path.join(CSS_CACHE, `post-${postId}.css`);
  try {
    css = await fs.readFile(cached, 'utf8');
  } catch {
    try {
      const res = await fetch(
        `https://younes.dental/wp-content/uploads/elementor/css/post-${postId}.css`,
      );
      if (res.ok) {
        css = await res.text();
        await fs.mkdir(CSS_CACHE, { recursive: true });
        await fs.writeFile(cached, css);
      }
    } catch {
      /* offline: sections just fall back to no background image */
    }
  }

  const map = new Map();
  const re = /\.elementor-element\.elementor-element-([0-9a-f]+)[^{]*\{([^}]*)\}/g;
  for (const m of css.matchAll(re)) {
    const url = m[2].match(/background-image:url\("([^"]+)"\)/)?.[1];
    const p = url ? uploadPath(url) : null;
    if (p && !map.has(m[1])) map.set(m[1], p);
  }
  return map;
}

const categoryOf = (item) =>
  (item._embedded?.['wp:term'] ?? []).flat().find((t) => t.taxonomy === 'service_category')?.name ??
  'Services';

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------

/**
 * Parse `jkit_heading` widgets: title, coloured subtitle, description paragraphs.
 *
 * The wrapper contains nested `<div>`s, so matching to its closing tag is unreliable;
 * split on the widget boundary instead and read the parts out of each segment.
 */
function jkitHeadings(chunk) {
  return chunk
    .split(/(?=class="jeg-elementor-kit jkit-heading)/)
    .slice(1)
    .map((seg) => ({
      title: textOf(seg.match(/class="heading-title"[^>]*>([\s\S]*?)<\/h[1-6]>/)?.[1] ?? ''),
      subtitle: textOf(subtitleOf(seg)),
      body: [
        ...(seg.match(/class="heading-section-description"[^>]*>([\s\S]*?)<\/div>/)?.[1] ?? '')
          .matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g),
      ]
        .map((p) => textOf(p[1]))
        .filter(Boolean),
    }))
    .filter((h) => h.title || h.subtitle);
}

/**
 * The jkit subtitle is emitted as <p> on some widgets and <h3> on others, so the
 * closing tag has to be matched against whatever tag actually opened it.
 */
function subtitleOf(seg) {
  const m = seg.match(/<(p|h[1-6]|div|span)[^>]*class="heading-section-subtitle[^"]*"[^>]*>/);
  if (!m) return '';
  const rest = seg.slice(m.index + m[0].length);
  const end = rest.indexOf(`</${m[1]}>`);
  return end === -1 ? '' : rest.slice(0, end);
}

/**
 * The 13 service pages share one Elementor skeleton (verified by widget audit), with
 * some blocks optional. Walk the containers in order and pick the parts out.
 *
 * `bg` maps an Elementor element id to a background image, since section imagery is set
 * in the generated per-page stylesheet rather than in the markup.
 */
function parseService(item, bg = new Map()) {
  const html = item.content.rendered;
  const chunks = splitContainers(html);

  /*
   * Section imagery lives on empty containers that Elementor may emit as a sibling of
   * the text block rather than inside it. Walk the whole document once, in order, and
   * hand each section the next unclaimed background image.
   */
  const backgrounds = [];
  for (const m of html.matchAll(/data-id="([0-9a-f]+)"/g)) {
    const hit = bg.get(m[1]);
    if (hit && !backgrounds.includes(hit)) backgrounds.push(hit);
  }
  const nextBackground = () => backgrounds.shift() ?? null;

  const service = {
    slug: item.slug,
    title: decodeEntities(item.title.rendered).trim(),
    category: categoryOf(item),
    image: track(featuredOf(item)),
    intro: null,
    features: null,
    candidates: null,
    restorative: null,
    visits: null,
    pricing: null,
    faq: [],
  };

  for (const chunk of chunks) {
    const heads = headingsIn(chunk);
    const paras = paragraphsIn(chunk);
    const imgs = imagesIn(chunk);

    // -- FAQ accordion (Elementor `toggles` repeater)
    if (chunk.includes('elementor-widget-cmsmasters-toggles')) {
      const settings = widgetSettings(chunk, 'cmsmasters-toggles');
      if (settings?.toggles) {
        service.faq = settings.toggles.map((t) => ({
          q: textOf(t.toggle_title),
          a: textOf(t.toggle_content),
        }));
      }
      continue;
    }

    // -- Visit tabs (Elementor `tabs` repeater). Shares a container with the
    //    restorative-options intro on most services.
    if (chunk.includes('elementor-widget-cmsmasters-tabs')) {
      const settings = widgetSettings(chunk, 'cmsmasters-tabs');
      if (settings?.tabs) {
        service.visits = settings.tabs.map((t) => ({
          label: textOf(t.tab_title),
          subtitle: textOf(t.tab_subtitle),
          points: bulletPairs(decodeEntities(t.tab_content ?? '')),
        }));
      }

      const h2 = heads.find((h) => h.level === 2);
      if (h2 && !service.restorative) {
        const cta = chunk.match(
          /<a[^>]+href="([^"]+)"[^>]*>[\s\S]*?elementor-widget-cmsmasters-button__text">([\s\S]*?)<\/span>/,
        );
        service.restorative = {
          eyebrow: heads.find((h) => h.level === 6)?.text ?? '',
          heading: h2.text,
          paragraphs: paras,
          cta: cta ? { label: textOf(cta[2]), href: `/services/${service.slug}/` } : null,
          image: track(nextBackground() ?? imgs[0] ?? null),
        };
      }
      continue;
    }

    // -- Intro: h3 + copy. A standalone bold line is a sub-heading, not a paragraph.
    if (!service.intro && heads.some((h) => h.level === 3) && paras.length) {
      const blocks = [...chunk.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)].map((m) => {
        const raw = m[1];
        const text = textOf(raw);
        const bold = /^\s*<(?:b|strong)[^>]*>[\s\S]*<\/(?:b|strong)>\s*$/.test(raw.trim());
        return { text, kind: bold ? 'subheading' : 'paragraph' };
      });
      service.intro = {
        heading: heads.find((h) => h.level === 3).text,
        blocks: blocks.filter((b) => b.text),
      };
      continue;
    }

    // -- Feature cards: h6 eyebrow + three h4 + text + icon images
    if (!service.features && heads.filter((h) => h.level === 4).length >= 3) {
      const h4s = heads.filter((h) => h.level === 4).map((h) => h.text);
      service.features = {
        eyebrow: heads.find((h) => h.level === 6)?.text ?? '',
        items: h4s.map((title, i) => ({
          icon: track(imgs[i] ?? null),
          title,
          text: paras[i] ?? '',
        })),
      };
      continue;
    }

    // -- "Who can get…" + contraindication list
    if (!service.candidates && chunk.includes('cmsmasters-icon-list')) {
      service.candidates = {
        heading: heads.find((h) => h.level === 2)?.text ?? '',
        text: paras[0] ?? '',
        listHeading: heads.find((h) => h.level === 4)?.text ?? '',
        items: listItemsIn(chunk),
        image: track(nextBackground() ?? imgs[0] ?? null),
      };
      continue;
    }

    // -- Pricing header
    if (!service.pricing && /Pricing Plans/i.test(chunk)) {
      const jk = jkitHeadings(chunk);
      service.pricing = {
        heading: 'Pricing Plans',
        subheading: jk[0]?.subtitle || heads.find((h) => h.level === 3)?.text || '',
        note: jk[0]?.body[0] ?? paras[0] ?? '',
        plans: [],
      };
      continue;
    }

    // -- Pricing plan cards: jkit heading (title / price / note) + an inline icon
    if (service.pricing && /\$/.test(chunk)) {
      const icons = iconNamesIn(chunk);
      jkitHeadings(chunk)
        .filter((h) => h.title && /\$/.test(h.subtitle))
        .forEach((h, i) => {
          service.pricing.plans.push({
            title: h.title,
            price: h.subtitle,
            note: h.body[0] ?? '',
            icon: icons[i] ?? icons[0] ?? null,
          });
        });
    }
  }

  return service;
}

// ---------------------------------------------------------------------------
// Patient cases
// ---------------------------------------------------------------------------

function parseCase(item) {
  const html = item.content.rendered;
  const chunks = splitContainers(html);

  const record = {
    slug: item.slug,
    title: decodeEntities(item.title.rendered).trim(),
    date: item.date,
    cover: track(featuredOf(item)),
    before: null,
    after: null,
    heading: '',
    body: '',
    gallery: [],
  };

  for (const chunk of chunks) {
    if (chunk.includes('cmsmasters-before-after')) {
      const imgs = imagesIn(chunk);
      record.before = track(imgs[0] ?? null);
      record.after = track(imgs[1] ?? null);
      continue;
    }
    if (chunk.includes('cmsmasters-gallery')) {
      // Gallery links point at the full-size original; <img> holds a thumbnail.
      const links = [...chunk.matchAll(/href="([^"]+uploads\/[^"]+\.(?:png|jpe?g|webp))"/gi)]
        .map((m) => uploadPath(m[1]))
        .filter(Boolean);
      const srcs = imagesIn(chunk);
      const all = [...new Set([...links, ...srcs])];
      record.gallery = all.map((p) => track(p)).filter(Boolean);
      continue;
    }
    const h2 = headingsIn(chunk).find((h) => h.level === 2);
    if (h2 && !record.heading) {
      record.heading = h2.text;
      // jkit wraps the body in `heading-section-description`, using either <p> or <div>.
      const desc = chunk.match(/class="heading-section-description"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/)?.[1];
      const paras = paragraphsIn(chunk);
      record.body = paras.length ? paras.join('\n\n') : textOf(desc ?? '');
    }
  }

  // The title carries the procedure name before the patient initials.
  record.procedure = record.title.split(/\s+[–-]\s+/)[0].trim();
  record.initials = record.title.split(/\s+[–-]\s+/).slice(1).join(' – ').trim();

  return record;
}

// ---------------------------------------------------------------------------
// Fixed pages
// ---------------------------------------------------------------------------

/**
 * Custom Elementor icons come in two flavours: an <svg> wrapping a base64 PNG, and a
 * plain vector <svg>. Write the first out as WebP and the second as an .svg file.
 * Returns the public path, or null if the chunk holds no icon.
 */
async function extractIcon(chunk, name) {
  const svg = chunk.match(/<svg[\s\S]*?<\/svg>/)?.[0];
  if (!svg) return null;

  const b64 = svg.match(/href="data:image\/(?:png|jpeg);base64,([A-Za-z0-9+/=]+)"/)?.[1];
  const rel = `icons/${name}.${b64 ? 'webp' : 'svg'}`;
  const dest = path.join(PUBLIC_MEDIA, rel);
  await fs.mkdir(path.dirname(dest), { recursive: true });

  if (b64) {
    const buf = Buffer.from(b64, 'base64');
    await fs.writeFile(
      dest,
      await sharp(buf).resize({ width: 128 }).webp({ quality: 90 }).toBuffer(),
    );
  } else {
    // Ensure a standalone file has the namespace even if Elementor omitted it.
    const withNs = svg.includes('xmlns=')
      ? svg
      : svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
    await fs.writeFile(dest, withNs);
  }
  return `/media/${rel}`;
}

/** Titles + copy from consecutive `jkit_heading` widgets, in document order. */
function jkitBlocks(html) {
  return html
    .split(/(?=class="jeg-elementor-kit jkit-heading)/)
    .slice(1)
    .map((seg) => ({
      title: textOf(seg.match(/class="heading-title"[^>]*>([\s\S]*?)<\/h[1-6]>/)?.[1] ?? ''),
      subtitle: textOf(subtitleOf(seg)),
      body: textOf(
        seg.match(/class="heading-section-description"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/)?.[1] ?? '',
      ),
    }))
    .filter((b) => b.title);
}

function togglesOf(html) {
  const raw = html.match(
    /<div[^>]*\bdata-settings="([^"]*)"[^>]*\bdata-widget_type="cmsmasters-toggles/,
  )?.[1];
  if (!raw) return [];
  try {
    return JSON.parse(decodeEntities(raw)).toggles.map((t) => ({
      q: textOf(t.toggle_title),
      a: textOf(decodeEntities(t.toggle_content)),
    }));
  } catch {
    return [];
  }
}

async function parseServicesPage(pageJson) {
  const html = pageJson.find((p) => p.slug === 'services').content.rendered;
  const blocks = jkitBlocks(html);
  const whyIdx = blocks.findIndex((b) => b.title === 'Why Choose Us');
  const howIdx = blocks.findIndex((b) => b.title === 'How It Works');

  const why = blocks[whyIdx];
  const how = blocks[howIdx];

  /*
   * The six reasons sit between the two section headers. Elementor's column layout
   * hoists the third icon of each row into its own container ahead of the group, so
   * pair each titled container with its own icon and hand the orphans to the titled
   * containers that have none, in order.
   */
  const whyRegion = html.slice(html.indexOf('Why Choose Us'), html.indexOf('How It Works'));
  const reasons = [];
  const orphans = [];
  let n = 0;

  for (const chunk of splitContainers(whyRegion)) {
    const title = textOf(chunk.match(/class="heading-title"[^>]*>([\s\S]*?)<\/h[1-6]>/)?.[1] ?? '');
    const hasIcon = chunk.includes('elementor-widget-icon"');
    if (!title) {
      if (hasIcon) orphans.push(await extractIcon(chunk, `why-${n++}`));
      continue;
    }
    if (title === 'Why Choose Us') continue;

    const block = blocks.find((b) => b.title === title);
    reasons.push({
      title,
      text: block?.subtitle || block?.body || '',
      icon: hasIcon ? await extractIcon(chunk, `why-${n++}`) : null,
    });
  }

  for (const r of reasons) {
    if (!r.icon) r.icon = orphans.shift() ?? null;
  }

  // "How it works" steps come from icon-box widgets after the section header.
  const howRegion = html.slice(html.indexOf('How It Works'));
  const steps = howRegion
    .split(/(?=class="jeg-elementor-kit jkit-icon-box)/)
    .slice(1)
    .map((seg) => ({
      title: textOf(seg.match(/class="title"[^>]*>([\s\S]*?)<\/h[1-6]>/)?.[1] ?? ''),
      text: textOf(seg.match(/class="icon-box-description"[^>]*>([\s\S]*?)<\/p>/)?.[1] ?? ''),
      icon: track(imagesIn(seg)[0] ?? null),
    }))
    .filter((s) => s.title);

  return {
    hero: {
      title: 'Services',
      intro: 'Explore our services to see how we can help you maintain a healthy, beautiful smile.',
      image: track('2024/09/13-e1725452412121.png'),
    },
    why: { eyebrow: why?.title ?? 'Why Choose Us', heading: why?.body ? '' : '', ...whyHeading(why), reasons },
    how: { eyebrow: how?.title ?? 'How It Works', ...howHeading(how), steps },
    faq: { eyebrow: 'Questions & Answers', heading: 'Frequently Ask Question', items: togglesOf(html) },
  };
}

/** The jkit subtitle field packs the heading and body into one string; split them. */
function whyHeading(block) {
  if (!block) return { heading: '', text: '' };
  const text = block.body;
  const heading = block.subtitle.replace(text, '').trim();
  return { heading: heading || 'Dedicated to Your Smile and Well-being', text };
}

function howHeading(block) {
  if (!block) return { heading: '' };
  return { heading: 'Your Journey to a Healthier Smile Begins Here' };
}

// ---------------------------------------------------------------------------
// Doctors + reviews
// ---------------------------------------------------------------------------

function parseDoctors(pageJson) {
  const doctors = pageJson.find((p) => p.slug === 'doctors');
  const html = doctors.content.rendered;
  const out = [];
  for (const chunk of splitContainers(html)) {
    const h4 = headingsIn(chunk).find((h) => h.level === 4);
    const img = imagesIn(chunk)[0];
    if (h4 && img) {
      out.push({
        name: h4.text,
        role: 'Orthodontic Solutions',
        photo: track(img),
        linkedin: '#',
        instagram: '#',
      });
    }
  }
  return out;
}

function parseReviews(pageJson) {
  const about = pageJson.find((p) => p.slug === 'about-us');
  const html = about.content.rendered;
  const out = [];

  // Each review is one `cmsmasters-testimonial` widget; slice on the widget boundary
  // so a greedy match can't run across two of them.
  const widgets = html
    .split('data-widget_type="cmsmasters-testimonial')
    .slice(1)
    .map((w) => w.slice(0, w.indexOf('data-widget_type="')) || w);

  for (const w of widgets) {
    const text = textOf(w.match(/cmsmasters-testimonial__text[^>]*>([\s\S]*?)<\/div>/)?.[1] ?? '');
    const name = textOf(
      w.match(/cmsmasters-testimonial__author-name[^>]*>([\s\S]*?)<\/(?:div|span|h[1-6])>/)?.[1] ?? '',
    );
    // `data-src` holds the full-size lazyload target; `src` is a 30x30 placeholder.
    const avatarUrl =
      w.match(/cmsmasters-testimonial__avatar[\s\S]*?data-src="([^"]+)"/)?.[1] ??
      w.match(/cmsmasters-testimonial__avatar[\s\S]*?\bsrc="([^"]+)"/)?.[1] ??
      '';
    const rating = Number(w.match(/title="(\d)\/5"/)?.[1] ?? 5);

    if (text && name) {
      out.push({ text, name, avatar: track(uploadPath(avatarUrl)), rating });
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// Asset pipeline
// ---------------------------------------------------------------------------

/** Index every file in the drop folder by basename so lookups ignore the YYYY/MM path. */
async function indexDropFolder() {
  const byName = new Map();
  async function walk(dir) {
    let entries;
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (e.name === 'node_modules' || e.name === 'screenshots') continue;
        await walk(p);
      } else if (!byName.has(e.name)) {
        byName.set(e.name, p);
      }
    }
  }
  await walk(DROP);
  return byName;
}

const RASTER = /\.(png|jpe?g)$/i;

/**
 * Long-edge cap for imported rasters. 2560 covers a full-bleed hero on a 1280px
 * container at 2x DPR, which is the largest thing the design asks for.
 */
const MAX_WIDTH = 2560;

/**
 * Copy each referenced asset into public/media.
 *
 * Most source images are photographs saved as multi-megabyte PNGs, so rasters are
 * re-encoded to WebP (alpha preserved) and capped at 1920px. That renames the file, so
 * the returned map is used to rewrite the paths already baked into the parsed content.
 */
async function importAssets(index) {
  const missing = [];
  const renames = new Map();
  let copied = 0;
  let fetched = 0;
  let bytesIn = 0;
  let bytesOut = 0;

  for (const rel of [...used].sort()) {
    const isRaster = RASTER.test(rel);
    const outRel = isRaster ? rel.replace(/\.(png|jpe?g)$/i, '.webp') : rel;
    if (outRel !== rel) renames.set(`/media/${rel}`, `/media/${outRel}`);

    const dest = path.join(PUBLIC_MEDIA, outRel);
    await fs.mkdir(path.dirname(dest), { recursive: true });

    try {
      await fs.access(dest);
      continue; // already imported
    } catch {
      /* fall through */
    }

    const name = originalName(rel);
    let src = index.get(name);

    // `-scaled` is a WordPress large-image variant; try both spellings.
    if (!src) {
      const ext = path.extname(name);
      const stem = name.slice(0, -ext.length);
      src = index.get(`${stem}-scaled${ext}`) ?? index.get(`${stem.replace(/-scaled$/, '')}${ext}`);
    }

    let buf;
    if (src) {
      buf = await fs.readFile(src);
      copied++;
    } else {
      const res = await fetch(LIVE + rel);
      if (!res.ok) {
        missing.push(rel);
        continue;
      }
      buf = Buffer.from(await res.arrayBuffer());
      fetched++;
    }

    bytesIn += buf.length;
    if (isRaster) {
      const img = sharp(buf, { limitInputPixels: false });
      const meta = await img.metadata();
      const sized =
        meta.width && meta.width > MAX_WIDTH
          ? img.resize({ width: MAX_WIDTH, kernel: 'lanczos3' })
          : img;
      /*
       * next/image re-encodes these on the way out, so this is the first of two lossy
       * passes — keep it high or card images visibly degrade. `effort: 6` buys back
       * most of the size that the higher quality costs.
       */
      buf = await sized.webp({ quality: 92, effort: 6, smartSubsample: true }).toBuffer();
    }
    bytesOut += buf.length;

    await fs.writeFile(dest, buf);
  }

  return { copied, fetched, missing, renames, bytesIn, bytesOut };
}

/**
 * Record the real pixel size of each feature icon on the service that owns it.
 *
 * The live theme renders these at their natural size (120x120 for one, 80x80 for the
 * next two on All-on-4), so hard-coding a square box both distorts them and makes
 * next/image request the wrong resolution.
 */
async function attachIconSizes(services) {
  for (const service of services) {
    for (const item of service.features?.items ?? []) {
      if (!item.icon) continue;
      try {
        const meta = await sharp(path.join(ROOT, 'public', item.icon)).metadata();
        item.iconW = meta.width;
        item.iconH = meta.height;
      } catch {
        item.iconW = 120;
        item.iconH = 120;
      }
    }
  }
}

/** Deep-rewrite every `/media/...` string in a parsed content tree. */
function remap(value, renames) {
  if (typeof value === 'string') return renames.get(value) ?? value;
  if (Array.isArray(value)) return value.map((v) => remap(v, renames));
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, remap(v, renames)]));
  }
  return value;
}

// ---------------------------------------------------------------------------

async function main() {
  console.log('Reading archive…');
  const [servicesJson, baJson, pageJson] = await Promise.all([
    readJson('services'),
    readJson('before_and_after_'),
    readJson('page'),
  ]);

  // -- parse everything into memory first; this is what populates `used`.
  const services = [];
  for (const item of servicesJson) {
    services.push(parseService(item, await backgroundMap(item.id)));
  }
  services.sort((a, b) => {
    const ca = CATEGORY_ORDER.indexOf(a.category);
    const cb = CATEGORY_ORDER.indexOf(b.category);
    return ca - cb || a.title.localeCompare(b.title);
  });

  const cases = CASES.map((slug) => {
    const item = baJson.find((x) => x.slug === slug);
    if (!item) throw new Error(`case not found in archive: ${slug}`);
    return parseCase(item);
  });

  const doctors = parseDoctors(pageJson);
  const reviews = parseReviews(pageJson);
  const servicesPage = await parseServicesPage(pageJson);

  // -- assets (renames rasters to .webp)
  console.log(`\nImporting ${used.size} assets…`);
  const index = await indexDropFolder();
  const { copied, fetched, missing, renames, bytesIn, bytesOut } = await importAssets(index);
  console.log(`  copied from drop folder: ${copied}`);
  console.log(`  downloaded from live site: ${fetched}`);
  if (bytesIn) {
    const mb = (n) => (n / 1024 / 1024).toFixed(1);
    console.log(`  re-encoded: ${mb(bytesIn)} MB -> ${mb(bytesOut)} MB`);
  }
  if (missing.length) {
    console.log(`  UNRESOLVED (${missing.length}):`);
    missing.forEach((m) => console.log(`    ${m}`));
  }

  // -- write content with asset paths pointing at the final filenames
  console.log('\nWriting content…');
  const remapped = services.map((s) => remap(s, renames));
  await attachIconSizes(remapped);
  for (const s of remapped) await writeJson(`services/${s.slug}.json`, s);
  console.log(`  services: ${services.length}`);
  for (const c of cases) await writeJson(`cases/${c.slug}.json`, remap(c, renames));
  console.log(`  cases: ${cases.length}`);
  await writeJson('doctors.json', remap(doctors, renames));
  console.log(`  doctors: ${doctors.length}`);
  await writeJson('reviews.json', remap(reviews, renames));
  console.log(`  reviews: ${reviews.length}`);
  await writeJson('pages/services.json', remap(servicesPage, renames));
  console.log(
    `  services page: ${servicesPage.why.reasons.length} reasons, ${servicesPage.how.steps.length} steps, ${servicesPage.faq.items.length} FAQs`,
  );

  // -- manifest so site.ts / page components can be checked against reality
  await writeJson(
    'assets.json',
    Object.fromEntries([...renames].sort(([a], [b]) => a.localeCompare(b))),
  );

  console.log('\nDone.');
}

await main();

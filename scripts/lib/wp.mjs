// Shared helpers for parsing the WordPress/Elementor export.

/** Decode the HTML entities WordPress leaves in titles and copy. */
export function decodeEntities(s = '') {
  return s
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;|&rsquo;/g, '’')
    .replace(/&lsquo;/g, '‘')
    .replace(/&ldquo;/g, '“')
    .replace(/&rdquo;/g, '”')
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—')
    .replace(/&hellip;/g, '…');
}

/** Strip tags and collapse whitespace. */
export function textOf(html = '') {
  return decodeEntities(
    html
      .replace(/<br\s*\/?>/gi, ' ')
      .replace(/<\/(p|div|li|h[1-6])>/gi, ' ')
      .replace(/<[^>]+>/g, '')
  )
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * WordPress rewrites image URLs with a size suffix (`-30x30`, `-1024x768`).
 * Strip it to get back to the original upload filename.
 */
export function originalName(url = '') {
  const file = url.split('/').pop() || '';
  return file.replace(/-\d+x\d+(?=\.\w+$)/, '');
}

/** `.../uploads/2025/12/Foo-30x30.png` -> `2025/12/Foo.png` */
export function uploadPath(url = '') {
  const m = url.match(/uploads\/(\d{4})\/(\d{2})\/([^"'\s?)]+)/);
  if (!m) return null;
  return `${m[1]}/${m[2]}/${originalName(m[3])}`;
}

/** Every uploads URL referenced in a blob of HTML, as `YYYY/MM/name.ext` paths. */
export function collectUploads(html = '') {
  const out = new Set();
  const re = /uploads\/(\d{4})\/(\d{2})\/([^"'\s\\)]+?\.(?:png|jpe?g|webp|gif|svg|mp4))/gi;
  for (const m of html.matchAll(re)) {
    out.add(`${m[1]}/${m[2]}/${originalName(m[3])}`);
  }
  return [...out];
}

/** Split Elementor markup into its top-level containers, preserving order. */
export function splitContainers(html = '') {
  return html.split(/(?=<div class="[^"]*\be-con\b)/);
}

/** All `data-widget_type` values inside a chunk, in document order. */
export function widgetsIn(chunk = '') {
  return [...chunk.matchAll(/data-widget_type="([^"]+)"/g)].map((m) =>
    m[1].replace(/\.default$/, '')
  );
}

/** Headings inside a chunk as `{ level, text }`, in document order. */
export function headingsIn(chunk = '') {
  return [...chunk.matchAll(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/g)].map((m) => ({
    level: Number(m[1]),
    text: textOf(m[2]),
  }));
}

/** Paragraph text inside a chunk. */
export function paragraphsIn(chunk = '') {
  return [...chunk.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)]
    .map((m) => textOf(m[1]))
    .filter(Boolean);
}

/** `<li>` text inside a chunk. */
export function listItemsIn(chunk = '') {
  return [...chunk.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)]
    .map((m) => textOf(m[1]))
    .filter(Boolean);
}

/**
 * Image sources inside a chunk, as `YYYY/MM/name.ext` upload paths.
 * `data-src` is preferred: the theme lazy-loads, so plain `src` is a 30x30 placeholder.
 */
export function imagesIn(chunk = '') {
  const out = [];
  for (const m of chunk.matchAll(/<img[^>]*?>/g)) {
    const tag = m[0];
    const url = tag.match(/\bdata-src="([^"]+)"/)?.[1] ?? tag.match(/\bsrc="([^"]+)"/)?.[1];
    const p = uploadPath(url ?? '');
    if (p && !out.includes(p)) out.push(p);
  }
  return out;
}

/**
 * Elementor stores repeater widgets (tabs, toggles) as an HTML-escaped JSON blob in
 * `data-settings`. Pull it out and parse it — far more reliable than scraping markup.
 */
export function widgetSettings(chunk = '', widgetType) {
  // On the widget element, data-settings comes before data-widget_type.
  const raw = chunk.match(
    new RegExp(`<div[^>]*\\bdata-settings="([^"]*)"[^>]*\\bdata-widget_type="${widgetType}`),
  )?.[1];
  if (!raw) return null;
  try {
    return JSON.parse(decodeEntities(raw));
  } catch {
    return null;
  }
}

/**
 * Turn a `<ul><li><b>Title</b><br><span>body</span></li></ul>` blob — the shape Elementor
 * tab content uses — into `{ title, text }` pairs.
 */
export function bulletPairs(html = '') {
  return [...html.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)].map((m) => {
    const li = m[1];
    const title = textOf(li.match(/<b[^>]*>([\s\S]*?)<\/b>/)?.[1] ?? '');
    const rest = textOf(li.replace(/<b[^>]*>[\s\S]*?<\/b>/g, ''));
    return title ? { title, text: rest } : { title: '', text: textOf(li) };
  });
}

/** Font Awesome icon slug from Elementor's inline SVG class, e.g. `e-far-moon` -> `moon`. */
export function iconNamesIn(chunk = '') {
  return [...chunk.matchAll(/class="e-font-icon-svg e-f[ars]{1,2}-([a-z0-9-]+)"/g)].map((m) => m[1]);
}

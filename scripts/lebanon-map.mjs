/**
 * Generate the dot-matrix map of Lebanon used by the contacts page.
 *
 *   node scripts/lebanon-map.mjs <path-to-world.geojson>
 *
 * Same idea as scripts/world-dots.mjs, at country scale: rasterise the polygons onto a
 * grid and emit the land cells as SVG paths. Two of them — Lebanon itself, and its
 * neighbours as faint context so the country reads as a shape rather than a blob.
 *
 * Writes:
 *   public/media/site/lebanon-dots.svg   the map
 *   content/lebanon-map.json             the bounds, so the page can place a clinic
 *                                        pin from its latitude and longitude
 *
 * A single Google embed cannot show three pins without an API key and a My Maps
 * account, which is why this exists. Each clinic still links out to Google for the
 * actual directions.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/* A window around Lebanon with enough of Syria and the sea to give it an outline. */
const LON_MIN = 34.95;
const LON_MAX = 36.75;
const LAT_MIN = 32.95;
const LAT_MAX = 34.75;
const COLS = 104;

const src = process.argv[2];
if (!src) {
  console.error('usage: node scripts/lebanon-map.mjs <world.geojson>');
  process.exit(1);
}

const geo = JSON.parse(await fs.readFile(src, 'utf8'));

/*
 * A degree of longitude is shorter than a degree of latitude everywhere but the equator.
 * Without this the country comes out visibly too wide.
 */
const MEAN_LAT = ((LAT_MIN + LAT_MAX) / 2) * (Math.PI / 180);
const lonSpan = (LON_MAX - LON_MIN) * Math.cos(MEAN_LAT);
const latSpan = LAT_MAX - LAT_MIN;
const ROWS = Math.round((COLS * latSpan) / lonSpan);

function inRing(lon, lat, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

const inPolygon = (lon, lat, rings) =>
  inRing(lon, lat, rings[0]) && !rings.slice(1).some((hole) => inRing(lon, lat, hole));

function shapesFor(predicate) {
  const out = [];
  for (const feature of geo.features) {
    if (!predicate(feature.properties?.name ?? '')) continue;
    const { type, coordinates } = feature.geometry;
    for (const rings of type === 'Polygon' ? [coordinates] : coordinates) out.push(rings);
  }
  return out;
}

const lebanon = shapesFor((n) => n === 'Lebanon');
const others = shapesFor((n) => n !== 'Lebanon');
if (!lebanon.length) {
  console.error('Lebanon not found in the GeoJSON — check the source file.');
  process.exit(1);
}

const hit = (shapes, lon, lat) => shapes.some((rings) => inPolygon(lon, lat, rings));

const home = [];
const context = [];
for (let row = 0; row < ROWS; row++) {
  const lat = LAT_MAX - ((row + 0.5) / ROWS) * latSpan;
  for (let col = 0; col < COLS; col++) {
    const lon = LON_MIN + ((col + 0.5) / COLS) * (LON_MAX - LON_MIN);
    if (hit(lebanon, lon, lat)) home.push([col, row]);
    else if (hit(others, lon, lat)) context.push([col, row]);
  }
}

/* Integers and relative moves, so the file stays small and compresses well. */
const S = 10;
const R = 3.6;
const ARC = `a${R} ${R} 0 1 0 ${R * 2} 0a${R} ${R} 0 1 0 ${-R * 2} 0`;

function pathFor(cells) {
  let cx = 0;
  let cy = 0;
  return cells
    .map(([col, row]) => {
      const x = Math.round((col + 0.5) * S - R);
      const y = Math.round((row + 0.5) * S);
      const seg = `m${x - cx} ${y - cy}${ARC}`;
      cx = x;
      cy = y;
      return seg;
    })
    .join('');
}

const svg =
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${COLS * S} ${ROWS * S}" ` +
  `preserveAspectRatio="xMidYMid meet">` +
  `<path fill="#004a5e" fill-opacity=".16" d="M0 0${pathFor(context)}"/>` +
  `<path fill="#004a5e" fill-opacity=".62" d="M0 0${pathFor(home)}"/>` +
  `</svg>\n`;

const svgDest = path.join(ROOT, 'public', 'media', 'site', 'lebanon-dots.svg');
await fs.mkdir(path.dirname(svgDest), { recursive: true });
await fs.writeFile(svgDest, svg);

await fs.writeFile(
  path.join(ROOT, 'content', 'lebanon-map.json'),
  `${JSON.stringify(
    { cols: COLS, rows: ROWS, lonMin: LON_MIN, lonMax: LON_MAX, latMin: LAT_MIN, latMax: LAT_MAX },
    null,
    2,
  )}\n`,
);

console.log(
  `${COLS}x${ROWS} grid — ${home.length} cells in Lebanon, ${context.length} in neighbouring land\n` +
    `  public/media/site/lebanon-dots.svg  ${((await fs.stat(svgDest)).size / 1024).toFixed(1)} KB`,
);

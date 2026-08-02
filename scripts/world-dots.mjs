/**
 * Generate the dot-matrix world map used by the patient-origins section.
 *
 *   node scripts/world-dots.mjs <path-to-world.geojson>
 *
 * Rasterises country polygons onto an equirectangular grid and writes:
 *   public/media/site/world-dots.svg   the land cells, as one <path> of dots
 *   content/world-map.json             the projection, so the page can place markers
 *
 * Doing the projection here rather than borrowing a ready-made map image is what lets
 * the page put a marker on Lebanon from its real coordinates and land on the right dot.
 * The result needs no mapping library and no runtime geometry.
 *
 * The GeoJSON is an input, not a dependency — run this once and commit the output.
 * Source used: https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/*
 * Cropped to the inhabited band. Antarctica and the high Arctic are dropped, which
 * removes a lot of empty ocean and — because equirectangular badly exaggerates area
 * near the poles — stops Greenland from dominating the top of the frame.
 */
const LAT_TOP = 72;
const LAT_BOTTOM = -45;
const COLS = 200;

const src = process.argv[2];
if (!src) {
  console.error('usage: node scripts/world-dots.mjs <world.geojson>');
  process.exit(1);
}

const geo = JSON.parse(await fs.readFile(src, 'utf8'));

const ROWS = Math.round((COLS * (LAT_TOP - LAT_BOTTOM)) / 360);

/** Ray casting, on one ring. */
function inRing(lon, lat, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

/** A polygon is its outer ring minus any holes. */
const inPolygon = (lon, lat, rings) =>
  inRing(lon, lat, rings[0]) && !rings.slice(1).some((hole) => inRing(lon, lat, hole));

/* Pre-compute bounding boxes so most cells are rejected without touching a ring. */
const shapes = [];
for (const feature of geo.features) {
  const { type, coordinates } = feature.geometry;
  const polygons = type === 'Polygon' ? [coordinates] : coordinates;
  for (const rings of polygons) {
    let minLon = 180;
    let maxLon = -180;
    let minLat = 90;
    let maxLat = -90;
    for (const [lon, lat] of rings[0]) {
      if (lon < minLon) minLon = lon;
      if (lon > maxLon) maxLon = lon;
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
    }
    shapes.push({ rings, minLon, maxLon, minLat, maxLat });
  }
}

const dots = [];
for (let row = 0; row < ROWS; row++) {
  // Sample at the centre of each cell.
  const lat = LAT_TOP - ((row + 0.5) / ROWS) * (LAT_TOP - LAT_BOTTOM);
  for (let col = 0; col < COLS; col++) {
    const lon = -180 + ((col + 0.5) / COLS) * 360;
    const hit = shapes.some(
      (s) =>
        lon >= s.minLon &&
        lon <= s.maxLon &&
        lat >= s.minLat &&
        lat <= s.maxLat &&
        inPolygon(lon, lat, s.rings),
    );
    if (hit) dots.push([col, row]);
  }
}

/*
 * Ship the map as an SVG file rather than inline elements. Four thousand circles in the
 * document is four thousand nodes to lay out on every resize; as a background image the
 * browser parses it once and the page keeps only the handful of markers on top.
 *
 * One <path> of dots rather than one element per dot, for the same reason.
 */
/*
 * Scale the grid up by 10 so every coordinate is a whole number. Emitting them raw
 * produced things like "12.160000000000002" and a 240 KB file; integers plus relative
 * moves between dots bring it under 60 KB before compression.
 */
const S = 10;
const R = 3.4;
const ARC = `a${R} ${R} 0 1 0 ${R * 2} 0a${R} ${R} 0 1 0 ${-R * 2} 0`;

let cursorX = 0;
let cursorY = 0;
const d = dots
  .map(([col, row]) => {
    const x = Math.round((col + 0.5) * S - R);
    const y = Math.round((row + 0.5) * S);
    const seg = `m${x - cursorX} ${y - cursorY}${ARC}`;
    cursorX = x;
    cursorY = y;
    return seg;
  })
  .join('');

const svg =
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${COLS * S} ${ROWS * S}" ` +
  `preserveAspectRatio="xMidYMid meet"><path fill="#004a5e" fill-opacity=".28" d="${d}"/></svg>\n`;

const svgDest = path.join(ROOT, 'public', 'media', 'site', 'world-dots.svg');
await fs.mkdir(path.dirname(svgDest), { recursive: true });
await fs.writeFile(svgDest, svg);

/* Just the projection, so the page can turn a latitude and longitude into a position. */
const metaDest = path.join(ROOT, 'content', 'world-map.json');
await fs.writeFile(
  metaDest,
  `${JSON.stringify({ cols: COLS, rows: ROWS, latTop: LAT_TOP, latBottom: LAT_BOTTOM }, null, 2)}\n`,
);

console.log(
  `${COLS}x${ROWS} grid, ${dots.length} land cells (${((dots.length / (COLS * ROWS)) * 100).toFixed(1)}% of the grid)\n` +
    `  public/media/site/world-dots.svg  ${((await fs.stat(svgDest)).size / 1024).toFixed(1)} KB`,
);

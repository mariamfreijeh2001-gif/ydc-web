/**
 * Design QA: screenshot the local site at desktop + mobile widths into .design-qa/.
 * Compare these against .design-ref/live/ (captured from the WordPress site).
 *
 *   node scripts/capture.mjs                 # all routes, both viewports
 *   node scripts/capture.mjs / /services/    # only these routes
 *   BASE=http://localhost:3000 node scripts/capture.mjs
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, '.design-qa');
const BASE = process.env.BASE ?? 'http://localhost:3111';

const ALL_ROUTES = [
  '/',
  '/services/',
  '/about-us/',
  '/contacts/',
  '/technologies/',
  '/before-after/',
  '/doctors/',
  '/services/all-on-4/',
  '/services/aligners/',
  '/services/advancedimagingservices/',
  '/before_and_after_/allon4-n-d/',
  '/before_and_after_/cbgingivectomy-m-f/',
  '/before_and_after_/allon6-m-m/',
];

const routes = process.argv.slice(2).length ? process.argv.slice(2) : ALL_ROUTES;

/** Same slug scheme as the live reference capture, so files line up 1:1. */
const slugFor = (route) => {
  const p = route.replace(/\/$/, '');
  return (p === '' ? 'home' : p.replace(/^\//, '').replace(/[^a-z0-9-]/gi, '-')).slice(0, 120);
};

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900, mobile: false },
  { name: 'mobile', width: 390, height: 844, mobile: true },
];

const browser = await chromium.launch();
const failures = [];

for (const vp of VIEWPORTS) {
  await fs.mkdir(path.join(OUT, vp.name), { recursive: true });
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
    isMobile: vp.mobile,
    hasTouch: vp.mobile,
    // Freeze animations so screenshots are deterministic.
    reducedMotion: 'reduce',
  });
  ctx.setDefaultTimeout(30000);
  const page = await ctx.newPage();

  for (const route of routes) {
    const dest = path.join(OUT, vp.name, `${slugFor(route)}.png`);
    try {
      const res = await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 30000 });
      if (res && res.status() >= 400) throw new Error(`HTTP ${res.status()}`);
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 700) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 90));
        }
        window.scrollTo(0, 0);
      });
      // Long enough for the Google Maps embed to paint its tiles.
      await page.waitForTimeout(2500);
      await page.screenshot({ path: dest, fullPage: true });
      console.log(`ok   ${vp.name} ${route}`);
    } catch (e) {
      failures.push(`${vp.name} ${route}: ${e.message.split('\n')[0]}`);
      console.log(`FAIL ${vp.name} ${route} — ${e.message.split('\n')[0]}`);
    }
  }
  await ctx.close();
}

await browser.close();
console.log(failures.length ? `\n${failures.length} failures` : `\n${routes.length * 2} captured`);

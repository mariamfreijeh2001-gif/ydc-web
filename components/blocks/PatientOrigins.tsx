'use client';

import { useState } from 'react';

import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Reveal } from '@/components/ui/Reveal';
import map from '@/content/world-map.json';
import styles from './PatientOrigins.module.css';

/**
 * Where patients travel from.
 *
 * The regions are the ones the clinic already claims in its own copy — "renowned
 * globally, attracting patients from the US, Canada, EU, MENA, and Australia" — and
 * nothing beyond that is asserted. No patient counts, no cities: we don't have that
 * data and a dental practice is not the place to make it up.
 *
 * The map is a dot grid generated from country polygons by scripts/world-dots.mjs,
 * which is also where the projection below comes from.
 *
 * Region names live in the legend rather than on the map. Labelling five markers on a
 * map this wide meant either tiny type or collisions around the eastern Mediterranean,
 * where Lebanon and MENA sit almost on top of each other — and a legend can do
 * something a label can't, which is let you pick out one route at a time.
 */

const W = map.cols * 10;
const H = map.rows * 10;

/** Equirectangular, matching the generated map exactly. */
const px = (lon: number) => ((lon + 180) / 360) * W;
const py = (lat: number) => ((map.latTop - lat) / (map.latTop - map.latBottom)) * H;

const CLINIC = { lat: 33.89, lon: 35.5 };

const ORIGINS = [
  { label: 'Canada', lat: 56.1, lon: -106.3 },
  { label: 'United States', lat: 39.8, lon: -98.6 },
  { label: 'Europe', lat: 50.1, lon: 9.0 },
  { label: 'MENA', lat: 21, lon: 47 },
  { label: 'Australia', lat: -25.3, lon: 133.8 },
];

/**
 * A flight path, bowed away from the straight line so the routes fan out instead of
 * collapsing into one smear across the middle of the map.
 */
function arc(fromLon: number, fromLat: number, toLon: number, toLat: number) {
  const x1 = px(fromLon);
  const y1 = py(fromLat);
  const x2 = px(toLon);
  const y2 = py(toLat);
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.hypot(dx, dy);
  // Perpendicular offset, scaled to the span so long hops bow more than short ones.
  const bow = length * 0.18;
  const cx = (x1 + x2) / 2 + (dy / length) * bow;
  const cy = (y1 + y2) / 2 - (dx / length) * bow;
  return `M${x1.toFixed(1)} ${y1.toFixed(1)}Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
}

const ROUTES = ORIGINS.map((o) => ({ ...o, d: arc(o.lon, o.lat, CLINIC.lon, CLINIC.lat) }));

export function PatientOrigins({
  eyebrow,
  heading,
  text,
}: {
  eyebrow: string;
  heading: string;
  text: string;
}) {
  /*
   * Hovering and pinning are tracked separately on purpose. Browsers fire a synthetic
   * mouseenter before the click on a tap, so a single piece of state driven by both
   * would set the route and immediately toggle it straight back off.
   */
  const [hovered, setHovered] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const active = hovered ?? pinned;

  const cx = px(CLINIC.lon);
  const cy = py(CLINIC.lat);

  return (
    <Section space="tight" tone="alt">
      <Container>
        <div className={styles.head}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h2 className={styles.heading}>{heading}</h2>
          <p className={styles.text}>{text}</p>
        </div>

        <Reveal className={styles.reveal}>
          <div className={`${styles.stage} ${active ? styles.focused : ''}`}>
            <figure className={styles.figure}>
              <svg
                className={styles.svg}
                viewBox={`0 0 ${W} ${H}`}
                role="img"
                aria-label={`World map: patients travel to Lebanon from ${ORIGINS.map((o) => o.label).join(', ')}`}
              >
                <defs>
                  {/* Routes fade in from their origin rather than starting hard. */}
                  <linearGradient id="po-route" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="var(--c-primary)" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="var(--c-primary)" stopOpacity="0.85" />
                  </linearGradient>
                  <radialGradient id="po-glow">
                    <stop offset="0%" stopColor="var(--c-primary)" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="var(--c-primary)" stopOpacity="0" />
                  </radialGradient>
                </defs>

                <circle cx={cx} cy={cy} r={95} fill="url(#po-glow)" className={styles.glow} />

                {ROUTES.map((route, i) => (
                  <g
                    key={route.label}
                    className={`${styles.route} ${active === route.label ? styles.on : ''}`}
                  >
                    <path
                      className={styles.arc}
                      d={route.d}
                      style={{ animationDelay: `${i * 200}ms` }}
                    />
                    {/*
                     * A pulse running the route, offset per region so they don't all
                     * arrive together. offset-path rather than SMIL, so the reduced
                     * motion media query can switch it off.
                     */}
                    <circle
                      className={styles.pulse}
                      r={7}
                      style={{ offsetPath: `path("${route.d}")`, animationDelay: `${i * 1.1}s` }}
                    />
                    <circle
                      className={styles.originDot}
                      cx={px(route.lon)}
                      cy={py(route.lat)}
                      r={8}
                      style={{ animationDelay: `${700 + i * 200}ms` }}
                    />
                  </g>
                ))}

                <g className={styles.clinic}>
                  <circle cx={cx} cy={cy} r={14} className={styles.ring} />
                  <circle
                    cx={cx}
                    cy={cy}
                    r={14}
                    className={styles.ring}
                    style={{ animationDelay: '1.2s' }}
                  />
                  <circle cx={cx} cy={cy} r={10} className={styles.clinicDot} />
                </g>
              </svg>

              {/* Positioned in percentages so it tracks the map at any width. */}
              <span
                className={styles.pin}
                style={{ left: `${(cx / W) * 100}%`, top: `${(cy / H) * 100}%` }}
              >
                Younes Dental, Lebanon
              </span>
            </figure>

            <ul className={styles.legend}>
              {ROUTES.map((route) => (
                <li key={route.label}>
                  <button
                    type="button"
                    className={`${styles.chip} ${active === route.label ? styles.chipOn : ''}`}
                    /* Only a real mouse hovers; a tap must fall through to the click. */
                    onPointerEnter={(e) => {
                      if (e.pointerType === 'mouse') setHovered(route.label);
                    }}
                    onPointerLeave={(e) => {
                      if (e.pointerType === 'mouse') setHovered(null);
                    }}
                    onFocus={() => setHovered(route.label)}
                    onBlur={() => setHovered(null)}
                    onClick={() => {
                      /*
                       * Clear the hover too. Some devices leave a stale hover behind
                       * after a tap, which would keep the route lit even once it has
                       * been un-pinned.
                       */
                      setHovered(null);
                      setPinned((v) => (v === route.label ? null : route.label));
                    }}
                    aria-pressed={active === route.label}
                  >
                    <span className={styles.chipDot} aria-hidden="true" />
                    {route.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

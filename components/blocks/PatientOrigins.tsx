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
 * The map itself is a dot grid generated from country polygons by
 * scripts/world-dots.mjs, which is also where the projection below comes from.
 */

const W = map.cols * 10;
const H = map.rows * 10;

/** Equirectangular, matching the generated map exactly. */
const x = (lon: number) => ((lon + 180) / 360) * W;
const y = (lat: number) => ((map.latTop - lat) / (map.latTop - map.latBottom)) * H;

const CLINIC = { lat: 33.89, lon: 35.5 };

type Origin = {
  label: string;
  lat: number;
  lon: number;
  anchor: 'start' | 'middle' | 'end';
  /** Label offset from the marker, in map units. */
  dx?: number;
  dy?: number;
};

/*
 * MENA sits low and east of the Gulf and labels below its marker: anywhere closer to
 * Lebanon and the two labels print on top of each other.
 */
const ORIGINS: Origin[] = [
  { label: 'Canada', lat: 56.1, lon: -106.3, anchor: 'middle', dy: -26 },
  { label: 'United States', lat: 39.8, lon: -98.6, anchor: 'middle', dy: -26 },
  { label: 'Europe', lat: 50.1, lon: 9.0, anchor: 'middle', dy: -26 },
  { label: 'MENA', lat: 19.5, lon: 51, anchor: 'start', dx: 20, dy: 34 },
  { label: 'Australia', lat: -25.3, lon: 133.8, anchor: 'middle', dy: -26 },
];

/**
 * A flight path, bowed away from the straight line so the routes fan out instead of
 * overlapping into a single smear across the middle of the map.
 */
function arc(fromLon: number, fromLat: number, toLon: number, toLat: number) {
  const x1 = x(fromLon);
  const y1 = y(fromLat);
  const x2 = x(toLon);
  const y2 = y(toLat);
  const dx = x2 - x1;
  const dy = y2 - y1;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  // Perpendicular offset, scaled to the span so long hops bow more than short ones.
  const length = Math.hypot(dx, dy);
  const bow = length * 0.16;
  const cx = mx + (dy / length) * bow;
  const cy = my - (dx / length) * bow;
  return `M${x1.toFixed(1)} ${y1.toFixed(1)}Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
}

export function PatientOrigins({
  eyebrow,
  heading,
  text,
}: {
  eyebrow: string;
  heading: string;
  text: string;
}) {
  const cx = x(CLINIC.lon);
  const cy = y(CLINIC.lat);

  return (
    <Section space="tight" tone="alt">
      <Container>
        <div className={styles.head}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h2 className={styles.heading}>{heading}</h2>
          <p className={styles.text}>{text}</p>
        </div>

        <Reveal className={styles.reveal}>
          <figure className={styles.figure}>
            <svg
              className={styles.svg}
              viewBox={`0 0 ${W} ${H}`}
              role="img"
              aria-label={`World map showing patients travelling to Lebanon from ${ORIGINS.map((o) => o.label).join(', ')}`}
            >
              {ORIGINS.map((origin, i) => (
                <path
                  key={origin.label}
                  className={styles.arc}
                  style={{ animationDelay: `${i * 220}ms` }}
                  d={arc(origin.lon, origin.lat, CLINIC.lon, CLINIC.lat)}
                />
              ))}

              {ORIGINS.map((origin, i) => (
                <g
                  key={origin.label}
                  className={styles.origin}
                  style={{ animationDelay: `${600 + i * 220}ms` }}
                >
                  <circle cx={x(origin.lon)} cy={y(origin.lat)} r={9} className={styles.originDot} />
                  <text
                    x={x(origin.lon) + (origin.dx ?? 0)}
                    y={y(origin.lat) + (origin.dy ?? -26)}
                    textAnchor={origin.anchor}
                    className={styles.label}
                  >
                    {origin.label}
                  </text>
                </g>
              ))}

              <g className={styles.clinic}>
                <circle cx={cx} cy={cy} r={13} className={styles.pulse} />
                <circle cx={cx} cy={cy} r={13} className={styles.pulse} style={{ animationDelay: '1.1s' }} />
                <circle cx={cx} cy={cy} r={9} className={styles.clinicDot} />
                <text x={cx - 20} y={cy - 22} textAnchor="end" className={styles.clinicLabel}>
                  Lebanon
                </text>
              </g>
            </svg>
          </figure>
        </Reveal>
      </Container>
    </Section>
  );
}

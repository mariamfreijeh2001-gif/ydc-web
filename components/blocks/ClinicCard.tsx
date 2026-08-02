import { ArrowUpRightIcon } from '@/components/ui/Icon';
import type { Clinic } from '@/content/site';
import { contact } from '@/content/site';
import styles from './ClinicCard.module.css';

/**
 * One clinic: its own map, then address, opening hours and directions.
 *
 * The map is the card's picture — a photograph of a treatment room looks much the same
 * at all three, whereas the map is the one thing that differs and the one thing anyone
 * came to this page for. Each frame is lazy, so three embeds don't all load on arrival.
 *
 * A server component: there is nothing to toggle any more, so nothing needs shipping.
 */
export function ClinicCard({ clinic }: { clinic: Clinic }) {
  return (
    <article className={styles.card}>
      {clinic.mapEmbed ? (
        <div className={styles.media}>
          <iframe
            className={styles.map}
            src={clinic.mapEmbed}
            title={`Map showing ${clinic.name}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      ) : null}

      <div className={styles.body}>
        <h2 className={styles.name}>{clinic.name}</h2>

        <dl className={styles.meta}>
          <dt className={styles.label}>Address</dt>
          <dd className={styles.value}>{clinic.address}</dd>

          <dt className={styles.label}>Service times</dt>
          <dd className={styles.value}>
            {clinic.serviceTimes ?? <a href={contact.phoneHref}>Call {contact.phoneDisplay}</a>}
          </dd>
        </dl>

        {clinic.directionsUrl ? (
          <a
            className={styles.directions}
            href={clinic.directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Get directions
            <ArrowUpRightIcon width={13} height={13} />
          </a>
        ) : null}
      </div>
    </article>
  );
}

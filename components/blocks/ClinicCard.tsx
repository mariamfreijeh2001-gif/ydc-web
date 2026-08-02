'use client';

import Image from 'next/image';
import { useState } from 'react';

import { ArrowUpRightIcon } from '@/components/ui/Icon';
import { IMAGE_QUALITY } from '@/components/ui/image';
import type { Clinic } from '@/content/site';
import { contact } from '@/content/site';
import styles from './ClinicCard.module.css';

/**
 * One clinic: photograph, address, opening hours, directions, and its own map.
 *
 * The media area toggles between the two rather than stacking them, which keeps three
 * cards level across a row and stops each one growing to twice the height. It opens on
 * the map, because the question this page answers is "where are you".
 *
 * The map only loads once its tab has been opened — three Google embeds mounted on
 * arrival would be three third-party frames loading before anyone asked to see one.
 */
export function ClinicCard({ clinic, priority = false }: { clinic: Clinic; priority?: boolean }) {
  const [tab, setTab] = useState<'map' | 'photo'>('map');
  const [mapSeen, setMapSeen] = useState(true);

  const hasMap = Boolean(clinic.mapEmbed);
  const hasPhoto = Boolean(clinic.image);

  return (
    <article className={styles.card}>
      <div className={styles.media}>
        {hasMap && mapSeen ? (
          <iframe
            className={`${styles.map} ${tab === 'map' ? styles.shown : ''}`}
            src={clinic.mapEmbed}
            title={`Map showing ${clinic.name}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        ) : null}

        {hasPhoto ? (
          <Image
            src={clinic.image!}
            alt={clinic.name}
            fill
            priority={priority}
            sizes="(max-width: 767px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`${styles.photo} ${tab === 'photo' ? styles.shown : ''}`}
            quality={IMAGE_QUALITY}
          />
        ) : null}

        {hasMap && hasPhoto ? (
          <div className={styles.tabs} role="group" aria-label={`${clinic.name} view`}>
            <button
              type="button"
              className={`${styles.tab} ${tab === 'map' ? styles.tabOn : ''}`}
              onClick={() => {
                setTab('map');
                setMapSeen(true);
              }}
              aria-pressed={tab === 'map'}
            >
              Map
            </button>
            <button
              type="button"
              className={`${styles.tab} ${tab === 'photo' ? styles.tabOn : ''}`}
              onClick={() => setTab('photo')}
              aria-pressed={tab === 'photo'}
            >
              Photo
            </button>
          </div>
        ) : null}
      </div>

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

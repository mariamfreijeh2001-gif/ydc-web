'use client';

import { useId, useState } from 'react';

import styles from './Tabs.module.css';

type Tab = {
  label: string;
  subtitle: string;
  points: { title: string; text: string }[];
};

/** Visit-step tabs. Keyboard support follows the WAI-ARIA tabs pattern. */
export function Tabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(0);
  const id = useId();

  if (!tabs.length) return null;

  const onKeyDown = (e: React.KeyboardEvent) => {
    const last = tabs.length - 1;
    let next: number | null = null;
    if (e.key === 'ArrowRight') next = active === last ? 0 : active + 1;
    if (e.key === 'ArrowLeft') next = active === 0 ? last : active - 1;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = last;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    document.getElementById(`${id}-tab-${next}`)?.focus();
  };

  return (
    <div className={styles.root}>
      <div className={styles.list} role="tablist" aria-label="Treatment visits" onKeyDown={onKeyDown}>
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            type="button"
            role="tab"
            id={`${id}-tab-${i}`}
            aria-selected={i === active}
            aria-controls={`${id}-panel-${i}`}
            tabIndex={i === active ? 0 : -1}
            className={`${styles.tab} ${i === active ? styles.tabActive : ''}`}
            onClick={() => setActive(i)}
          >
            <span className={styles.tabLabel}>{tab.label}</span>
            {tab.subtitle ? <span className={styles.tabSub}>{tab.subtitle}</span> : null}
          </button>
        ))}
      </div>

      {tabs.map((tab, i) => (
        <div
          key={tab.label}
          role="tabpanel"
          id={`${id}-panel-${i}`}
          aria-labelledby={`${id}-tab-${i}`}
          hidden={i !== active}
          tabIndex={0}
          className={styles.panel}
        >
          <ul className={styles.points}>
            {tab.points.map((point) => (
              <li key={point.title || point.text} className={styles.point}>
                {point.title ? <strong className={styles.pointTitle}>{point.title}</strong> : null}
                <span className={styles.pointText}>{point.text}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

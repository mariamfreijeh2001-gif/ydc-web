'use client';

import { useState } from 'react';

import { MinusIcon, PlusIcon } from '@/components/ui/Icon';
import styles from './Accordion.module.css';

type Item = { q: string; a: string };

/** FAQ accordion. One panel open at a time, matching the theme's toggles widget. */
export function Accordion({ items }: { items: Item[] }) {
  const [open, setOpen] = useState<number | null>(null);

  if (!items.length) return null;

  return (
    <div className={styles.root}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q} className={styles.item}>
            <h3 className={styles.heading}>
              <button
                type="button"
                className={styles.trigger}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${i}`}
                id={`faq-trigger-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span className={styles.question}>{item.q}</span>
                <span className={styles.icon} aria-hidden="true">
                  {isOpen ? <MinusIcon width={18} height={18} /> : <PlusIcon width={18} height={18} />}
                </span>
              </button>
            </h3>

            <div
              id={`faq-panel-${i}`}
              role="region"
              aria-labelledby={`faq-trigger-${i}`}
              className={styles.panel}
              hidden={!isOpen}
            >
              <p className={styles.answer}>{item.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

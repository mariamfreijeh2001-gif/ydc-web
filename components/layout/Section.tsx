import type { ReactNode } from 'react';
import styles from './Section.module.css';

type Props = {
  children: ReactNode;
  /** Background treatment. `dark` is the deep-teal band used on About Us. */
  tone?: 'default' | 'alt' | 'dark';
  /** Vertical padding. `tight` halves the rhythm, `none` removes it. */
  space?: 'default' | 'tight' | 'none';
  id?: string;
  className?: string;
};

export function Section({
  children,
  tone = 'default',
  space = 'default',
  id,
  className,
}: Props) {
  return (
    <section
      id={id}
      className={[styles.section, styles[tone], styles[`space-${space}`], className]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </section>
  );
}

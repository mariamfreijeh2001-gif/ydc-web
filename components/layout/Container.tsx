import type { ElementType, ReactNode } from 'react';
import styles from './Container.module.css';

type Props = {
  children: ReactNode;
  /** `wide` removes the 1280px cap for full-bleed sections that still need side padding. */
  size?: 'default' | 'narrow' | 'wide';
  as?: ElementType;
  className?: string;
};

export function Container({ children, size = 'default', as: Tag = 'div', className }: Props) {
  return (
    <Tag className={[styles.container, styles[size], className].filter(Boolean).join(' ')}>
      {children}
    </Tag>
  );
}

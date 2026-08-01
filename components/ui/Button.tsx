import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';
import styles from './Button.module.css';

type Variant = 'primary' | 'accent' | 'outline' | 'outline-light' | 'ghost';
type Size = 'md' | 'sm';

type BaseProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
};

type LinkProps = BaseProps & { href: string } & Omit<ComponentProps<typeof Link>, 'href' | 'className'>;
type ButtonProps = BaseProps & { href?: never } & Omit<ComponentProps<'button'>, 'className'>;

function classes(variant: Variant, size: Size, className?: string) {
  return [styles.btn, styles[variant], styles[size], className].filter(Boolean).join(' ');
}

export function Button(props: LinkProps | ButtonProps) {
  const { children, variant = 'primary', size = 'md', className, ...rest } = props;

  if ('href' in rest && rest.href) {
    const { href, ...linkRest } = rest as LinkProps;
    const external = /^(https?:|tel:|mailto:)/.test(href);
    if (external) {
      return (
        <a
          href={href}
          className={classes(variant, size, className)}
          target={href.startsWith('http') ? '_blank' : undefined}
          rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes(variant, size, className)} {...linkRest}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes(variant, size, className)} {...(rest as ButtonProps)}>
      {children}
    </button>
  );
}

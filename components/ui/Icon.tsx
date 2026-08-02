import type { SVGProps } from 'react';
import type { SocialIcon } from '@/content/site';

type IconProps = SVGProps<SVGSVGElement> & { title?: string };

function Svg({ children, title, viewBox = '0 0 24 24', ...rest }: IconProps) {
  return (
    <svg
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      focusable="false"
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

export const PhoneIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6.6 3.5h-2A1.6 1.6 0 0 0 3 5.1c0 8.2 6.7 14.9 14.9 14.9a1.6 1.6 0 0 0 1.6-1.6v-2a1.1 1.1 0 0 0-.85-1.07l-3-.7a1.1 1.1 0 0 0-1.1.4l-.9 1.1a12.3 12.3 0 0 1-5.8-5.8l1.1-.9a1.1 1.1 0 0 0 .4-1.1l-.7-3A1.1 1.1 0 0 0 6.6 3.5Z" />
  </Svg>
);

export const AtIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="3.6" />
    <path d="M15.6 8.4v4.5a2.7 2.7 0 0 0 5.4 0V12a9 9 0 1 0-3.6 7.2" />
  </Svg>
);

export const WhatsAppIcon = ({ title, ...p }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden={title ? undefined : true}
    role={title ? 'img' : undefined}
    focusable="false"
    {...p}
  >
    {title ? <title>{title}</title> : null}
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24a8.19 8.19 0 0 1 5.82 2.42 8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.17c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.53.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.71-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.47c-.16 0-.43.06-.65.31-.22.24-.85.83-.85 2.03s.87 2.35.99 2.51c.12.16 1.71 2.61 4.14 3.66.58.25 1.03.4 1.38.51.58.19 1.11.16 1.53.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.05.14-1.16-.06-.1-.22-.16-.47-.28Z" />
  </svg>
);

export const ArrowUpRightIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M7 17 17 7M8 7h9v9" />
  </Svg>
);

export const ArrowLeftIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M19 12H5m0 0 6-6m-6 6 6 6" />
  </Svg>
);

export const ArrowRightIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 12h14m0 0-6-6m6 6-6 6" />
  </Svg>
);

export const PlusIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
);

export const MinusIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 12h14" />
  </Svg>
);

export const CloseIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M18 6 6 18M6 6l12 12" />
  </Svg>
);

export const MenuIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Svg>
);

export const CheckIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m5 13 4 4L19 7" />
  </Svg>
);

export const StarIcon = ({ title, ...p }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden={title ? undefined : true}
    role={title ? 'img' : undefined}
    focusable="false"
    {...p}
  >
    {title ? <title>{title}</title> : null}
    <path d="m12 2.6 2.9 5.9 6.5.95-4.7 4.58 1.11 6.47L12 17.44 6.19 20.5 7.3 14.03 2.6 9.45l6.5-.95L12 2.6Z" />
  </svg>
);


// ---- Social ---------------------------------------------------------------

const socialPaths: Record<SocialIcon, string> = {
  facebook:
    'M14.5 8.5V6.9c0-.8.2-1.2 1.4-1.2h1.5V2.8c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2H9v3.1h2.5V21h3V11.6h2.5l.4-3.1h-2.9Z',
  instagram:
    'M12 2.2c3.2 0 3.6 0 4.9.07 1.2.05 1.8.25 2.2.42.56.22.96.48 1.38.9.42.42.68.82.9 1.38.17.4.37 1 .42 2.2.06 1.3.07 1.7.07 4.9s-.01 3.6-.07 4.9c-.05 1.2-.25 1.8-.42 2.2-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.4.17-1 .37-2.2.42-1.3.06-1.7.07-4.9.07s-3.6-.01-4.9-.07c-1.2-.05-1.8-.25-2.2-.42-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.17-.4-.37-1-.42-2.2C2.21 15.6 2.2 15.2 2.2 12s.01-3.6.07-4.9c.05-1.2.25-1.8.42-2.2.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.4-.17 1-.37 2.2-.42C8.4 2.21 8.8 2.2 12 2.2Zm0 1.8c-3.14 0-3.5.01-4.74.07-1.14.05-1.76.24-2.17.4-.55.21-.94.47-1.35.88-.41.41-.67.8-.88 1.35-.16.41-.35 1.03-.4 2.17C2.4 10.1 2.39 10.46 2.39 12s.01 1.9.07 3.13c.05 1.14.24 1.76.4 2.17.21.55.47.94.88 1.35.41.41.8.67 1.35.88.41.16 1.03.35 2.17.4 1.24.06 1.6.07 4.74.07s3.5-.01 4.74-.07c1.14-.05 1.76-.24 2.17-.4.55-.21.94-.47 1.35-.88.41-.41.67-.8.88-1.35.16-.41.35-1.03.4-2.17.06-1.24.07-1.6.07-3.13s-.01-1.9-.07-3.13c-.05-1.14-.24-1.76-.4-2.17a3.6 3.6 0 0 0-.88-1.35 3.6 3.6 0 0 0-1.35-.88c-.41-.16-1.03-.35-2.17-.4C15.5 4.01 15.14 4 12 4Zm0 3.14a4.86 4.86 0 1 1 0 9.72 4.86 4.86 0 0 1 0-9.72Zm0 8.01a3.15 3.15 0 1 0 0-6.3 3.15 3.15 0 0 0 0 6.3Zm6.19-8.2a1.13 1.13 0 1 1-2.27 0 1.13 1.13 0 0 1 2.27 0Z',
  tiktok:
    'M16.6 2h-3.02v12.4a2.5 2.5 0 1 1-2.5-2.5c.2 0 .4.03.58.08V8.9a5.9 5.9 0 0 0-.58-.03 5.6 5.6 0 1 0 5.6 5.6V8.2a6.9 6.9 0 0 0 4.02 1.29V6.4a3.9 3.9 0 0 1-4.1-4.4Z',
  youtube:
    'M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.28 5 12 5 12 5s-6.28 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2 26.1 26.1 0 0 0 2 12a26.1 26.1 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.76 1.77C5.72 19 12 19 12 19s6.28 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77A26.1 26.1 0 0 0 22 12a26.1 26.1 0 0 0-.4-4.8ZM10 15.02V8.98L15.2 12 10 15.02Z',
  linkedin:
    'M6.94 5.5a1.94 1.94 0 1 1-3.88 0 1.94 1.94 0 0 1 3.88 0ZM3.2 8.9h3.5V21H3.2V8.9Zm5.7 0h3.35v1.65h.05c.47-.85 1.6-1.75 3.3-1.75 3.53 0 4.18 2.2 4.18 5.07V21h-3.5v-5.4c0-1.29-.02-2.95-1.85-2.95-1.85 0-2.13 1.4-2.13 2.86V21H8.9V8.9Z',
};

export function SocialGlyph({ icon, ...p }: IconProps & { icon: SocialIcon }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" {...p}>
      <path d={socialPaths[icon]} />
    </svg>
  );
}

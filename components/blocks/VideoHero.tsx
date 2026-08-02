import styles from './VideoHero.module.css';

type Props = {
  src: string;
  poster?: string;
  lines: string[];
  /** Small line above the headline. */
  eyebrow?: string;
};

/**
 * Rounded inset video panel. Muted + playsInline are required for autoplay to be
 * permitted on iOS and Chrome; the video is decorative, so it's hidden from
 * assistive tech.
 */
export function VideoHero({ src, poster, lines, eyebrow }: Props) {
  return (
    <section className={styles.hero}>
      <video
        className={styles.video}
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        tabIndex={-1}
      />
      <div className={styles.scrim} />

      <div className={styles.inner}>
        {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
        <h1 className={styles.title}>
          {lines.map((line, i) => (
            <span key={line} className={styles.line} style={{ animationDelay: `${i * 120}ms` }}>
              {line}
            </span>
          ))}
        </h1>
      </div>

    </section>
  );
}

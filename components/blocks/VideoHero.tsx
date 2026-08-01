import styles from './VideoHero.module.css';

type Props = {
  src: string;
  poster?: string;
  lines: string[];
};

/**
 * Full-bleed autoplay/muted/looping clinic video with the two stacked headlines.
 * Muted + playsInline are required for autoplay to be allowed on iOS and Chrome.
 */
export function VideoHero({ src, poster, lines }: Props) {
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
        <h1 className={styles.title}>
          {lines.map((line) => (
            <span key={line} className={styles.line}>
              {line}
            </span>
          ))}
        </h1>
      </div>
    </section>
  );
}

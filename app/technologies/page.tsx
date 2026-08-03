import type { Metadata } from 'next';
import Image from 'next/image';

import { PageHero } from '@/components/blocks/PageHero';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { CheckIcon } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import { technologies } from '@/content/pages/technologies';
import styles from './page.module.css';
import { IMAGE_QUALITY } from '@/components/ui/image';

export const metadata: Metadata = {
  title: 'Our technologies',
  description:
    'Robotic implant surgery with Navident, 3D face scanning, CBCT, photogrammetry and an in-house digital lab — one digital chain from the first scan to the finished tooth.',
  alternates: { canonical: '/technologies/' },
};

export default function TechnologiesPage() {
  const { flagship, flow, alsoInUse } = technologies;

  return (
    <>
      <PageHero title={technologies.title} intro={technologies.intro} variant="centered" />

      {/*
        Eve leads. It is the one piece of equipment here that most patients have never
        seen in a dental practice, and it is what the rest of the page is in service of.
      */}
      <Section tone="dark" space="tight">
        <Container>
          <Reveal>
            <div className={styles.flagship}>
              <div className={styles.flagshipBody}>
                <p className={styles.flagshipEyebrow}>{flagship.eyebrow}</p>
                <h2 className={styles.flagshipName}>{flagship.name}</h2>
                <p className={styles.flagshipLede}>{flagship.lede}</p>
                <p className={styles.flagshipText}>{flagship.text}</p>

                <ul className={styles.flagshipPoints}>
                  {flagship.points.map((point) => (
                    <li key={point}>
                      <CheckIcon width={14} height={14} />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                <Button href="/services/dentalimplant/" variant="accent" size="sm">
                  See implant treatments
                </Button>
              </div>

              {/*
                Eve standing inside the planning rings, rather than the rings alone. The
                supplied photograph is a 300px thumbnail whose subject is only 92x254 —
                shown any larger than its native size it goes soft, so the rings carry the
                panel and the robot sits at 1:1 inside them.
              */}
              <div className={styles.diagram}>
                <span className={styles.ring} aria-hidden="true" />
                <span className={styles.ring} aria-hidden="true" />
                <span className={styles.ring} aria-hidden="true" />
                <span className={styles.axis} aria-hidden="true" />
                {/*
                  Served as-is. It is already a 7.9 KB WebP at 92x254, and putting it
                  through the optimiser had it picking a 33px-wide variant off the
                  srcset — a 2.8x upscale of an image that has no detail to spare.
                */}
                <Image
                  src="/media/site/eve-navident.webp"
                  alt="Eve, the clinic's Navident dynamic navigation unit"
                  width={92}
                  height={254}
                  unoptimized
                  className={styles.robot}
                />
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* One course of treatment, in order. */}
      <Section space="tight">
        <Container>
          <div className={styles.flowHead}>
            <p className={styles.eyebrow}>One digital chain</p>
            <h2 className={styles.flowTitle}>
              From the first scan to the finished tooth, nothing is measured twice
            </h2>
            <p className={styles.flowText}>
              The scan that diagnoses you is the scan your implant is planned on, the plan the
              robot follows, and the file your teeth are milled from. Every handover is a file,
              not a tray of putty and a judgement call.
            </p>
          </div>

          <ol className={styles.flow}>
            {flow.map((item, i) => (
              <li key={item.name} className={styles.step}>
                <Reveal className={styles.stepReveal}>
                  <div className={styles.stepInner}>
                    <div className={styles.stepBody}>
                      <p className={styles.stepMeta}>
                        <span className={styles.stepNo}>{String(i + 1).padStart(2, '0')}</span>
                        <span className={styles.stepLabel}>{item.step}</span>
                      </p>
                      <h3 className={styles.stepName}>{item.name}</h3>
                      <p className={styles.stepText}>{item.text}</p>
                      <p className={styles.stat}>{item.stat}</p>
                    </div>

                    <div className={styles.stepMedia}>
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={460}
                        height={460}
                        sizes="(max-width: 767px) 70vw, 380px"
                        className={styles.stepImg}
                        priority={i === 0}
                        quality={IMAGE_QUALITY}
                      />
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>

          {/* Named, not written up — see the note in the content file. */}
          <div className={styles.also}>
            <h2 className={styles.alsoHeading}>{alsoInUse.heading}</h2>
            <ul className={styles.alsoList}>
              {alsoInUse.items.map((item) => (
                <li key={item} className={styles.chip}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>
    </>
  );
}

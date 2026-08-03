import type { Metadata } from 'next';
import Image from 'next/image';

import { PageHero } from '@/components/blocks/PageHero';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { technologies } from '@/content/pages/technologies';
import styles from './page.module.css';
import { IMAGE_QUALITY } from '@/components/ui/image';

export const metadata: Metadata = {
  title: 'Our technologies',
  description:
    'Robotic implant surgery, dynamic navigation, CBCT and 3D face scanning, and an in-house digital lab — the equipment behind every treatment at Younes Dental Clinic.',
  alternates: { canonical: '/technologies/' },
};

const toolCount = technologies.stages.reduce((n, s) => n + s.tools.length, 0);

export default function TechnologiesPage() {
  return (
    <>
      <PageHero title={technologies.title} intro={technologies.intro} variant="centered" />

      {/*
        Eve leads the page. It is the one piece of equipment most patients have never
        seen in a dental practice, and burying it in a list of fifteen wastes it.
      */}
      <Section tone="dark" space="tight">
        <Container>
          <Reveal>
            <div className={styles.flagship}>
              <div className={styles.flagshipBody}>
                <p className={styles.flagshipEyebrow}>{technologies.flagship.eyebrow}</p>
                <h2 className={styles.flagshipName}>{technologies.flagship.name}</h2>
                <p className={styles.flagshipText}>{technologies.flagship.text}</p>
                <p className={styles.flagshipNote}>{technologies.flagship.note}</p>
                <Button href="/services/dentalimplant/" variant="accent" size="sm">
                  See implant treatments
                </Button>
              </div>

              {/*
                A drawn diagram, not a photograph: we have no picture of the unit in the
                repository yet, and a stock operating theatre would be a worse stand-in.
                The rings read as a drill held on a planned axis. Swap in a real photo of
                the robot the moment there is one.
              */}
              <div className={styles.diagram} aria-hidden="true">
                <span className={styles.ring} />
                <span className={styles.ring} />
                <span className={styles.ring} />
                <span className={styles.axis} />
                <span className={styles.core} />
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* The full stack, grouped by where each tool sits in a course of treatment. */}
      <Section space="tight">
        <Container>
          <div className={styles.workflowHead}>
            <p className={styles.eyebrow}>The digital workflow</p>
            <h2 className={styles.workflowTitle}>
              {toolCount} systems, one chain from scan to finished tooth
            </h2>
            <p className={styles.workflowText}>
              Nothing is handed off to paper or guesswork in between. The scan that
              diagnoses you is the scan the implant is planned on, the plan the robot
              follows, and the file your restoration is milled from.
            </p>
          </div>

          <ol className={styles.stages}>
            {technologies.stages.map((stage, i) => (
              <li key={stage.name} className={styles.stage}>
                <Reveal delay={i * 90} className={styles.stageReveal}>
                  <div className={styles.stageInner}>
                    <div className={styles.stageHead}>
                      <span className={styles.stageNo}>{String(i + 1).padStart(2, '0')}</span>
                      <h3 className={styles.stageName}>{stage.name}</h3>
                      <p className={styles.stageBlurb}>{stage.blurb}</p>
                    </div>

                    <ul className={styles.tools}>
                      {stage.tools.map((tool) => (
                        <li key={tool.name} className={styles.tool}>
                          <span className={styles.toolName}>{tool.name}</span>
                          {'text' in tool && tool.text ? (
                            <span className={styles.toolText}>{tool.text}</span>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* The five the clinic wrote about at length, kept in their own words. */}
      <Section tone="alt" space="tight">
        <Container>
          <div className={styles.detailHead}>
            <p className={styles.eyebrow}>In depth</p>
            <h2 className={styles.workflowTitle}>The systems we lean on most</h2>
          </div>

          <ul className={styles.rows}>
            {technologies.detail.map((item, i) => (
              /* Alternate the media side, starting with the image on the right. */
              <li key={item.title} className={`${styles.row} ${i % 2 ? styles.reversed : ''}`}>
                <div className={styles.body}>
                  <h3 className={styles.title}>{item.title}</h3>
                  <p className={styles.text}>{item.text}</p>
                </div>
                <div className={styles.media}>
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={420}
                    height={420}
                    sizes="(max-width: 767px) 70vw, 340px"
                    className={styles.img}
                    priority={i === 0}
                    quality={IMAGE_QUALITY}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
}

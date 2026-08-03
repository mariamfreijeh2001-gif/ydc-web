import type { Metadata } from "next";
import Image from "next/image";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import {
  CheckIcon,
  GuidedToolIcon,
  MillingDiscIcon,
  ScanFrameIcon,
} from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { technologies } from "@/content/pages/technologies";
import styles from "./page.module.css";
import { IMAGE_QUALITY } from "@/components/ui/image";

export const metadata: Metadata = {
  title: "Our technologies",
  description:
    "Robotic implant surgery with Navident, 3D face scanning, CBCT, photogrammetry and an in-house digital lab — one digital chain from the first scan to the finished tooth.",
  alternates: { canonical: "/technologies/" },
};

/** Keyed off the content file so a fact carries its own icon. */
const FACT_ICONS = {
  guided: GuidedToolIcon,
  scan: ScanFrameIcon,
  mill: MillingDiscIcon,
} as const;

export default function TechnologiesPage() {
  const { flagship, flow, alsoInUse } = technologies;

  return (
    <>
      {/*
        The stock centred hero put a centred title over a left-aligned paragraph, which
        never lined up, and said nothing a reader could hold on to. An editorial split
        instead, closing on the three things this page is actually about.
      */}
      <Section space="tight">
        <Container>
          <div className={styles.intro}>
            <div>
              <p className={styles.eyebrow}>What we work with</p>
              <h1 className={styles.introTitle}>{technologies.title}</h1>
            </div>
            <p className={styles.introText}>{technologies.intro}</p>
          </div>

          <ul className={styles.introFacts}>
            {technologies.facts.map((fact) => {
              const Icon = FACT_ICONS[fact.icon];
              return (
                <li key={fact.label} className={styles.fact}>
                  <span className={styles.factIcon}>
                    <Icon width={22} height={22} />
                  </span>
                  <span className={styles.factLabel}>{fact.label}</span>
                  <span className={styles.factText}>{fact.text}</span>
                </li>
              );
            })}
          </ul>
        </Container>
      </Section>

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

                <Button
                  href="/services/dentalimplant/"
                  variant="accent"
                  size="sm"
                >
                  See implant treatments
                </Button>
              </div>

              {/*
                Same treatment as the equipment further down the page: the object, the
                ground it sits on, and a lift on hover. Nothing else.
              */}
              <div className={styles.eveMedia}>
                <Image
                  src="/media/site/eve-camera@3x.webp"
                  alt="The stereoscopic tracking camera on Eve, the clinic's Navident unit"
                  width={624}
                  height={834}
                  unoptimized
                  priority
                  className={styles.eveImg}
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
              From the first scan to the finished tooth, nothing is measured
              twice
            </h2>
            <p className={styles.flowText}>
              The scan that diagnoses you is the scan your implant is planned
              on, the plan the robot follows, and the file your teeth are milled
              from. Every handover is a file, not a tray of putty and a
              judgement call.
            </p>
          </div>

          <ol className={styles.flow}>
            {flow.map((item, i) => (
              <li key={item.name} className={styles.step}>
                <Reveal className={styles.stepReveal}>
                  <div className={styles.stepInner}>
                    <div className={styles.stepBody}>
                      <p className={styles.stepMeta}>
                        <span className={styles.stepNo}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
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
            <div className={styles.alsoHead}>
              <h2 className={styles.alsoHeading}>{alsoInUse.heading}</h2>
              <p className={styles.alsoText}>
                The equipment behind the five above — ordinary in a good
                practice, and the reason the ones above are never waiting on
                anything.
              </p>
            </div>
            <ul className={styles.alsoList}>
              {alsoInUse.items.map((item) => (
                <li key={item} className={styles.chip}>
                  <span className={styles.chipMark} aria-hidden="true" />
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

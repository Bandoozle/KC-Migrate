import { Reveal } from "@/components/motion/Reveal";
import { ExitPhoto } from "./ExitPhoto";
import styles from "./ExitNarrative.module.css";

const EXIT_PATH = [
  {
    name: "Build value",
    detail: "Valuation and benchmarks set the baseline for what the business is worth, and what it could be.",
  },
  {
    name: "Reduce owner dependence",
    detail: "Leadership, systems and relationships that continue without you in the room.",
  },
  {
    name: "Prepare",
    detail: "Due diligence materials and the data room ready before the first serious conversation.",
  },
  {
    name: "Position",
    detail: "Buyers, investors or successors identified and approached with discretion.",
  },
  {
    name: "Transition",
    detail: "A clean, well-timed handover that protects value and people.",
  },
] as const;

/**
 * Exit as a full-bleed editorial split: harbour photograph with a decisive
 * headline, cream panel with five stages as large typography — no timeline UI.
 */
export function ExitNarrative() {
  return (
    <div className={styles.exit} data-accent="exit">
      <div className={styles.visual}>
        <ExitPhoto />
        <div className={styles.visualCopy}>
          <p className={styles.labelOnPhoto}>Exit strategy & succession</p>
          <h2 id="bd-exit" className={styles.titleOnPhoto}>
            Prepare the business before the decision is urgent.
          </h2>
        </div>
      </div>

      <div className={styles.panel}>
        <div className={styles.panelInner}>
          <Reveal variant="fadeUp">
            <p className={styles.lead}>
              A sale, merger or succession goes best when value is built years ahead. Methodical and confidential, from
              first valuation to handover.
            </p>
          </Reveal>

          <ol className={styles.stages}>
            {EXIT_PATH.map((stage, index) => (
              <Reveal key={stage.name} as="li" variant="fadeUp" delay={40 + index * 40} className={styles.stage}>
                <span className={styles.stageMark} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className={styles.stageBody}>
                  <h3 className={styles.stageName}>{stage.name}</h3>
                  <p className={styles.stageDetail}>{stage.detail}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

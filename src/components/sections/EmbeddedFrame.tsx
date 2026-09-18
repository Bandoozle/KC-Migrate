import styles from "./EmbeddedFrame.module.css";

type EmbeddedFrameProps = {
  title: string;
  src: string;
  minHeight?: number;
};

export function EmbeddedFrame({ title, src, minHeight = 2000 }: EmbeddedFrameProps) {
  return (
    <section className={`section ${styles.section}`}>
      <div className={`container ${styles.frameWrap}`}>
        <iframe
          title={title}
          src={src}
          className={styles.frame}
          style={{ minHeight }}
          loading="lazy"
          allow="fullscreen"
        />
      </div>
    </section>
  );
}

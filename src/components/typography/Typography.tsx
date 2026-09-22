import type { ElementType, HTMLAttributes, ReactNode } from "react";

type ToneProps = {
  as?: ElementType;
  className?: string;
  children?: ReactNode;
} & HTMLAttributes<HTMLElement>;

function cx(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

/** Page-level H1 — use once per page where appropriate. */
export function PageTitle({ as: Tag = "h1", className, children, ...rest }: ToneProps) {
  return (
    <Tag className={cx("page-title", "kosick-page-title", className)} {...rest}>
      {children}
    </Tag>
  );
}

/** Major section H2 — matches “Marketing built to move brands forward.” */
export function SectionTitle({ as: Tag = "h2", className, children, ...rest }: ToneProps) {
  return (
    <Tag className={cx("section-title", "kosick-section-title", className)} {...rest}>
      {children}
    </Tag>
  );
}

/** Lead text under a section title. */
export function SectionDescription({
  as: Tag = "p",
  className,
  children,
  ...rest
}: ToneProps) {
  return (
    <Tag
      className={cx("section-description", "kosick-section-description", className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function SubsectionTitle({ as: Tag = "h3", className, children, ...rest }: ToneProps) {
  return (
    <Tag className={cx("subsection-title", "kosick-subsection-title", className)} {...rest}>
      {children}
    </Tag>
  );
}

export function CardTitle({ as: Tag = "h4", className, children, ...rest }: ToneProps) {
  return (
    <Tag className={cx("card-title", "kosick-card-title", className)} {...rest}>
      {children}
    </Tag>
  );
}

export function Eyebrow({ as: Tag = "p", className, children, ...rest }: ToneProps) {
  return (
    <Tag className={cx("eyebrow", "kosick-eyebrow", className)} {...rest}>
      {children}
    </Tag>
  );
}

export function BodyText({ as: Tag = "p", className, children, ...rest }: ToneProps) {
  return (
    <Tag className={cx("body-text", "kosick-body-text", className)} {...rest}>
      {children}
    </Tag>
  );
}

export function MetaText({ as: Tag = "p", className, children, ...rest }: ToneProps) {
  return (
    <Tag className={cx("meta-text", "kosick-meta-text", className)} {...rest}>
      {children}
    </Tag>
  );
}

/** Convenience: section title + optional description. */
export function SectionIntro({
  title,
  description,
  titleAs = "h2",
  className,
  titleClassName,
  descriptionClassName,
  align = "left",
}: {
  title: ReactNode;
  description?: ReactNode;
  titleAs?: ElementType;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={cx(
        "kosick-section-intro",
        align === "center" && "kosick-section-intro--center",
        className,
      )}
    >
      <SectionTitle as={titleAs} className={titleClassName}>
        {title}
      </SectionTitle>
      {description ? (
        <SectionDescription className={descriptionClassName}>{description}</SectionDescription>
      ) : null}
    </div>
  );
}

/** Page H1 + optional lead. */
export function PageIntro({
  title,
  description,
  titleAs = "h1",
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  titleAs?: ElementType;
  className?: string;
}) {
  return (
    <div className={cx("kosick-page-intro", className)}>
      <PageTitle as={titleAs}>{title}</PageTitle>
      {description ? <SectionDescription>{description}</SectionDescription> : null}
    </div>
  );
}

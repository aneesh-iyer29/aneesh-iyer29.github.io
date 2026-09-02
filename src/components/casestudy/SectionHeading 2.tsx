import type { ReactNode } from "react";

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  size?: "md" | "lg";
  className?: string;
}

/* Eyebrow, serif title, and an optional lede: the heading for a case-study section. */
export function SectionHeading({ eyebrow, title, lede, size = "md", className = "" }: SectionHeadingProps) {
  const titleSize = size === "lg" ? "text-3xl md:text-4xl" : "text-2xl md:text-3xl";
  return (
    <div className={className}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 className={`display ${eyebrow ? "mt-3" : ""} ${titleSize} leading-[1.1] text-foreground`}>{title}</h2>
      {lede ? <p className="mt-4 max-w-prose text-base leading-relaxed text-muted-foreground">{lede}</p> : null}
    </div>
  );
}

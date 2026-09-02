import type { PropsWithChildren, ReactNode } from "react";

interface FigureProps {
  /** e.g. "Fig. 1" */
  label: string;
  caption: ReactNode;
  /** Optional right-aligned mono note in the header, e.g. "interactive".
      Omit it for static figures. */
  note?: string;
  className?: string;
  bodyClassName?: string;
}

/* Frames an interactive demo the way a paper frames a figure: a kicker
   row, the figure body on dot-grid paper, and a caption underneath. */
const Figure = ({ label, caption, note, className = "", bodyClassName = "", children }: PropsWithChildren<FigureProps>) => (
  <figure className={`figure-frame ${className}`}>
    <div className="flex items-center justify-between border-b border-border px-4 py-2">
      <span className="font-mono text-[0.68rem] font-medium uppercase tracking-[0.14em] text-foreground">{label}</span>
      {note ? (
        <span className="flex items-center gap-1.5 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
          {note}
        </span>
      ) : null}
    </div>
    <div className={`dot-grid ${bodyClassName}`}>{children}</div>
    <figcaption className="border-t border-border px-4 py-3 text-xs leading-relaxed text-muted-foreground">{caption}</figcaption>
  </figure>
);

export default Figure;

import type { PropsWithChildren, ReactNode } from "react";
import Reveal from "./Reveal";

interface SectionProps {
  id: string;
  /** Running index rendered like a paper section number, e.g. "01". */
  index: string;
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  className?: string;
}

/* Every home-page section shares this frame: a hairline rule, a numbered
   mono eyebrow, a serif title, and an optional lede, then the body. */
const Section = ({ id, index, eyebrow, title, lede, className = "", children }: PropsWithChildren<SectionProps>) => (
  <section id={id} className={`border-t border-border ${className}`}>
    <div className="mx-auto max-w-page px-6 py-20 md:py-28">
      <Reveal>
        <div className="mb-12 grid gap-6 md:grid-cols-[10rem_1fr] md:gap-10">
          <p className="eyebrow flex items-baseline gap-3">
            <span className="text-accent">{index}</span>
            {eyebrow}
          </p>
          <div>
            <h2 className="display text-3xl md:text-4xl">{title}</h2>
            {lede ? <p className="mt-4 max-w-prose text-base leading-relaxed text-muted-foreground">{lede}</p> : null}
          </div>
        </div>
      </Reveal>
      {children}
    </div>
  </section>
);

export default Section;

import type { ReactNode } from "react";

interface StepProps {
  n: string;
  title: ReactNode;
  children: ReactNode;
}

/* A numbered step: mono index in the accent, serif title, body underneath. */
export function Step({ n, title, children }: StepProps) {
  return (
    <div className="grid gap-3 border-t border-border pt-8 md:grid-cols-[3rem_1fr] md:gap-5">
      <span className="readout text-sm font-medium text-accent">{n}</span>
      <div>
        <h3 className="display text-xl leading-[1.2] text-foreground md:text-2xl">{title}</h3>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

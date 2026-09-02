import type { ReactNode } from "react";

/* A small labelled value, set like a figure legend. */
export function Stat({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <div className="mb-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">{label}</div>
      <div className="text-sm font-medium text-foreground">{value}</div>
    </div>
  );
}

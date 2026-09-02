import type { ReactNode } from "react";

interface CalloutProps {
  symbol: string;
  children: ReactNode;
  className?: string;
}

/* A short aside with a small marker in the accent. */
export function Callout({ symbol, children, className = "" }: CalloutProps) {
  return (
    <div className={`flex gap-3 rounded-lg border border-accent/30 bg-accent/[0.06] px-4 py-3.5 ${className}`}>
      <span
        aria-hidden="true"
        className="mt-px flex size-[18px] flex-none items-center justify-center rounded-full border border-accent font-mono text-[11px] font-medium text-accent"
      >
        {symbol}
      </span>
      <p className="m-0 text-[13px] leading-relaxed text-muted-foreground">{children}</p>
    </div>
  );
}

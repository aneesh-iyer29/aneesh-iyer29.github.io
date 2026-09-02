import type { ReactNode } from "react";

/* Body copy for case studies: a measured column of muted ink. */
export function P({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`mt-4 max-w-prose text-base leading-relaxed text-muted-foreground first:mt-0 ${className}`}>
      {children}
    </p>
  );
}

/* Inline emphasis inside a paragraph. */
export function Strong({ children }: { children: ReactNode }) {
  return <strong className="font-medium text-foreground">{children}</strong>;
}

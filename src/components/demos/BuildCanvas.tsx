import type { DemoProps } from "./index";

/* Placeholder until the interactive figure lands. */
const BuildCanvas = ({ className = "" }: DemoProps) => (
  <div className={`flex min-h-[18rem] items-center justify-center font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground ${className}`}>
    BuildCanvas
  </div>
);

export default BuildCanvas;

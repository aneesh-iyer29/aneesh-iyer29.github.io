import { lazy, Suspense, type ComponentType } from "react";
import type { DemoId } from "@/data/projects";

/* Registry of interactive figures keyed by DemoId. Each demo is a
   self-contained component that fills its container, and is lazy-loaded
   so the home page's first paint does not wait on any of them. */
export interface DemoProps {
  /** Render a shorter, lighter version for narrow or secondary placements. */
  compact?: boolean;
  className?: string;
}

const registry: Record<DemoId, ComponentType<DemoProps>> = {
  "build-canvas": lazy(() => import("./BuildCanvas")),
  "bench-race": lazy(() => import("./BenchRace")),
  "heat-map": lazy(() => import("./HeatMap")),
  "pid-tuner": lazy(() => import("./PidTuner")),
};

const Fallback = () => (
  <div className="flex min-h-[18rem] items-center justify-center font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground" aria-hidden="true">
    loading figure
  </div>
);

export const Demo = ({ id, ...props }: DemoProps & { id: DemoId }) => {
  const Component = registry[id];
  return (
    <Suspense fallback={<Fallback />}>
      <Component {...props} />
    </Suspense>
  );
};

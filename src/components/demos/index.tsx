import { lazy, Suspense, type ComponentType } from "react";
import type { DemoId } from "@/data/projects";

/* Registry of project figures keyed by DemoId. Each figure is a
   self-contained component that fills its container and is lazy-loaded.
   On the home page figures render with `interactive={false}`: a quiet,
   static chart or diagram with a single draw-on. On a project's own page
   the same figure renders with its one interaction enabled. */
export interface DemoProps {
  /** Enable the figure's single interaction (hover/focus emphasis, a
      legend you can select, etc.). False on the home page. */
  interactive?: boolean;
  /** Render a shorter, lighter version for narrow or secondary placements. */
  compact?: boolean;
  className?: string;
}

const registry: Record<DemoId, ComponentType<DemoProps>> = {
  "build-canvas": lazy(() => import("./BuildCanvas")),
  "bench-race": lazy(() => import("./BenchRace")),
  "heat-map": lazy(() => import("./HeatMap")),
  "ekf-replay": lazy(() => import("./EkfReplay")),
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

import type { ProjectDetailBodyComponent } from "@/pages/projects/types";
import { M3DeepDive } from "@/pages/projects/pages/M3DeepDive";
import { ScioVirtualCodebustersDeepDive } from "@/pages/projects/pages/ScioVirtualCodebustersDeepDive";
import { PropulsiveLandersDeepDive } from "@/pages/projects/pages/PropulsiveLandersDeepDive";

/**
 * Register per-project deep-dive pages here.
 * - Key: the `slug` from `src/data/projects.ts`
 * - Value: a React component that renders the body of the page (header/back-link stay consistent).
 */
export const projectDetailBodies: Record<string, ProjectDetailBodyComponent> = {
  "m3-math-modeling-champion": M3DeepDive,
  "sciovirtual-codebusters": ScioVirtualCodebustersDeepDive,
  "propulsive-landers-gnc": PropulsiveLandersDeepDive,
};


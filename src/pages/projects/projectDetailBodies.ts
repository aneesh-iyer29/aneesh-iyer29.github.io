import type { ProjectDetailBodyComponent } from "@/pages/projects/types";
import { M3DeepDive } from "@/pages/projects/pages/M3DeepDive";
import { PropulsiveLandersDeepDive } from "@/pages/projects/pages/PropulsiveLandersDeepDive";
import { BuildDeepDive } from "@/pages/projects/pages/BuildDeepDive";
import { BenchceptionDeepDive } from "@/pages/projects/pages/BenchceptionDeepDive";

/**
 * Register per-project deep-dive pages here.
 * - Key: the `slug` from `src/data/projects.ts`
 * - Value: a React component that renders the body of the page (header/back-link stay consistent).
 */
export const projectDetailBodies: Record<string, ProjectDetailBodyComponent> = {
  "build-rl-environments": BuildDeepDive,
  benchception: BenchceptionDeepDive,
  "m3-math-modeling-champion": M3DeepDive,
  "propulsive-landers-gnc": PropulsiveLandersDeepDive,
};

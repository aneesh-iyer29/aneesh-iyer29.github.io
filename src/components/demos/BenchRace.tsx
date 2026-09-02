import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import type { DemoProps } from "./index";

/* ------------------------------------------------------------------
   Benchception evaluation race. Three Qwen-8B students climb toward
   their held-out Supply Chain Bench success rate. They tie: that is
   the finding, so the figure ends on the tie rather than a winner.
   ------------------------------------------------------------------ */

interface Track {
  id: string;
  model: string;
  condition: string;
  final: number;
  color: string;
}

const TRACKS: Track[] = [
  { id: "baseline", model: "Qwen-8B", condition: "untrained baseline", final: 45, color: "hsl(var(--fig-3))" },
  { id: "opus", model: "Qwen-8B", condition: "trained on Opus 4.8 env", final: 45, color: "hsl(var(--fig-1))" },
  { id: "gpt", model: "Qwen-8B", condition: "trained on GPT-5.5 env", final: 44, color: "hsl(var(--fig-4))" },
];

const DURATION_MS = 2500;
const TOTAL_STEPS = 1200;
const NOISE_KEYS = 24;
const TIE_RATE = 45;

interface PipelineNode {
  label: string;
  /** Progress at which this node becomes the active one. */
  at: number;
}

const PIPELINE: PipelineNode[] = [
  { label: "spec", at: 0 },
  { label: "author", at: 0.12 },
  { label: "train student", at: 0.3 },
  { label: "held-out eval", at: 0.82 },
];

/* mulberry32: a tiny seeded PRNG so a replay is deterministic per seed. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* One smooth noise track per student: keyframes in [-1, 1], linearly interpolated. */
function noiseTracks(seed: number): number[][] {
  const rand = mulberry32(seed);
  return TRACKS.map(() => Array.from({ length: NOISE_KEYS + 1 }, () => rand() * 2 - 1));
}

function sampleNoise(keys: number[], p: number): number {
  const pos = p * NOISE_KEYS;
  const i = Math.min(NOISE_KEYS - 1, Math.floor(pos));
  const f = pos - i;
  return keys[i] * (1 - f) + keys[i + 1] * f;
}

/* Success-rate trajectory: an eased climb to the final rate, with noise
   that shrinks as more evaluation episodes accumulate. */
function successRate(final: number, p: number, noise: number): number {
  const eased = 1 - Math.pow(1 - p, 2.4);
  const jitter = noise * 5 * (1 - p) * Math.min(1, p * 6);
  return Math.max(0, final * eased + jitter);
}

const formatSteps = (n: number) => n.toLocaleString("en-US");

const BenchRace = ({ compact = false, className = "" }: DemoProps) => {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { amount: 0.3 });

  const [seed, setSeed] = useState(1);
  const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const elapsedRef = useRef(0);
  const hasAutoPlayed = useRef(false);

  const noise = useMemo(() => noiseTracks(seed), [seed]);

  const replay = () => {
    elapsedRef.current = 0;
    setSeed((s) => s + 1);
    setDone(false);
    if (reduce) {
      setProgress(1);
      setRunning(false);
      setDone(true);
      return;
    }
    setProgress(0);
    setRunning(true);
  };

  /* Auto-play once, the first time the figure scrolls into view. */
  useEffect(() => {
    if (inView && !hasAutoPlayed.current) {
      hasAutoPlayed.current = true;
      replay();
    }
  }, [inView]); // eslint-disable-line react-hooks/exhaustive-deps

  /* The rAF loop only runs while in view; leaving the viewport pauses it
     and coming back resumes from the same elapsed time. */
  useEffect(() => {
    if (!running || !inView) return;
    const start = performance.now() - elapsedRef.current;
    let frame = 0;
    const tick = (now: number) => {
      const elapsed = now - start;
      elapsedRef.current = elapsed;
      const p = Math.min(1, Math.max(0, elapsed) / DURATION_MS);
      setProgress(p);
      if (p < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setRunning(false);
        setDone(true);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [running, inView]);

  const rates = TRACKS.map((track, i) => successRate(track.final, progress, sampleNoise(noise[i], progress)));
  const steps = Math.round(progress * TOTAL_STEPS);
  const activeNode = PIPELINE.reduce((acc, node, i) => (progress >= node.at ? i : acc), 0);
  const rowHeight = compact ? "h-2" : "h-2.5";

  return (
    <div ref={rootRef} className={`flex flex-col gap-4 p-4 ${compact ? "min-h-[16rem]" : "min-h-[20rem]"} ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="eyebrow text-[0.62rem]">success rate · supply chain bench (held-out)</span>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
            steps <span className="readout normal-case tracking-normal text-foreground">{formatSteps(steps)}</span>
            <span className="text-muted-foreground/60"> / {formatSteps(TOTAL_STEPS)}</span>
          </span>
          <button type="button" className="btn-secondary btn-compact" onClick={replay} aria-label={running ? "Restart replay" : "Replay training runs"}>
            {running ? "Restart" : "Replay"}
          </button>
        </div>
      </div>

      <div className="relative">
        <ol className={`flex flex-col ${compact ? "gap-2.5" : "gap-3.5"}`} aria-label="Held-out success rate by student">
          {TRACKS.map((track, i) => {
            const rate = rates[i];
            return (
              <li key={track.id} className="grid grid-cols-[minmax(0,9.5rem)_minmax(0,1fr)_3.25rem] items-center gap-3 sm:grid-cols-[minmax(0,11.5rem)_minmax(0,1fr)_3.25rem]">
                <div className="min-w-0 leading-tight">
                  <div className="truncate font-mono text-[0.66rem] font-medium text-foreground">{track.model}</div>
                  <div className="truncate font-mono text-[0.6rem] text-muted-foreground">{track.condition}</div>
                </div>
                <div className={`relative w-full rounded-sm border border-border bg-card ${rowHeight}`} role="meter" aria-label={`${track.model} ${track.condition}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(rate)}>
                  <div className="absolute inset-y-0 left-0 rounded-sm" style={{ width: `${Math.min(100, rate)}%`, background: track.color }} />
                  <motion.span
                    className="absolute -top-1 -bottom-1 border-l border-dashed border-accent"
                    style={{ left: `${TIE_RATE}%` }}
                    initial={false}
                    animate={{ opacity: done ? 1 : 0 }}
                    transition={{ duration: reduce ? 0 : 0.3 }}
                    aria-hidden="true"
                  />
                </div>
                <span className="readout text-right text-xs text-foreground">{rate.toFixed(1)}%</span>
              </li>
            );
          })}
        </ol>
        <div className="mt-1.5 grid grid-cols-[minmax(0,9.5rem)_minmax(0,1fr)_3.25rem] gap-3 sm:grid-cols-[minmax(0,11.5rem)_minmax(0,1fr)_3.25rem]" aria-hidden="true">
          <span />
          <div className="relative h-3 font-mono text-[0.58rem] text-muted-foreground">
            {[0, 25, 50, 75, 100].map((tick) => (
              <span key={tick} className="absolute -translate-x-1/2" style={{ left: `${tick}%` }}>
                {tick}
              </span>
            ))}          </div>
          <span />
        </div>
      </div>

      <motion.p
        className="font-mono text-[0.65rem] text-accent"
        initial={false}
        animate={{ opacity: done ? 1 : 0 }}
        transition={{ duration: reduce ? 0 : 0.35, delay: reduce ? 0 : 0.1 }}
        aria-live="polite"
      >
        {done ? "tied within noise (±2% across seeds)" : " "}
      </motion.p>

      <ol className="mt-auto flex items-center gap-1 border-t border-border pt-3" aria-label="Benchception pipeline">
        {PIPELINE.map((node, i) => {
          const isActive = i === activeNode && (running || done);
          const isDone = i < activeNode || (done && i <= activeNode);
          return (
            <li key={node.label} className="flex min-w-0 flex-1 items-center gap-1.5 last:flex-none">
              <span
                className={`h-2 w-2 shrink-0 rounded-full border transition-colors ${
                  isActive ? "border-accent bg-accent" : isDone ? "border-foreground bg-foreground" : "border-muted-foreground/60 bg-transparent"
                }`}
                aria-hidden="true"
              />
              <span className={`truncate font-mono text-[0.6rem] uppercase tracking-[0.12em] transition-colors ${isActive ? "text-accent" : isDone ? "text-foreground" : "text-muted-foreground"}`}>
                {node.label}
              </span>
              {i < PIPELINE.length - 1 && <span className="mx-1 h-px min-w-3 flex-1 bg-border" aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default BenchRace;

import { useMemo, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import type { DemoProps } from "./index";
import replay from "@/data/esekf-replay.json";

/* Attitude from the 16-state error-state EKF replayed against simulated
   flight data. The dataset is exported from the flight software's own
   test harness (rust-ekf/src/testing) with the same metric definitions
   as its ekf_eval.py: geodesic attitude error between the estimated and
   true quaternions, and quaternion chordal deviation in percent.
   Nothing is simulated in the browser; the browser only plots. */

interface Sample {
  t: number;
  err: number;
  pct: number;
  truth: [number, number, number];
  est: [number, number, number];
}

const samples = replay.samples as Sample[];
const AXES = ["roll", "pitch", "yaw"] as const;

const W = 640;
const H_TOP = 200;
const H_BOT = 92;
const GAP = 26;
const PAD = { l: 44, r: 16, t: 10, b: 26 };
const H = PAD.t + H_TOP + GAP + H_BOT + PAD.b;

function scaleX(t: number, tMax: number) {
  return PAD.l + (t / tMax) * (W - PAD.l - PAD.r);
}

function linePath(pts: [number, number][]) {
  return pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
}

function niceTicks(min: number, max: number, count: number): number[] {
  const span = max - min;
  const raw = span / count;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const step = [1, 2, 5, 10].map((m) => m * mag).find((s) => span / s <= count) ?? mag * 10;
  const start = Math.ceil(min / step) * step;
  const ticks: number[] = [];
  for (let v = start; v <= max + 1e-9; v += step) ticks.push(parseFloat(v.toFixed(6)));
  return ticks;
}

const EkfReplay = ({ interactive = true, className = "" }: DemoProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const reduce = useReducedMotion();
  const [hover, setHover] = useState<number | null>(null);

  const geom = useMemo(() => {
    const tMax = samples[samples.length - 1].t;
    const angles = samples.flatMap((s) => [...s.truth, ...s.est]);
    const aMin = Math.min(...angles);
    const aMax = Math.max(...angles);
    const aPad = (aMax - aMin) * 0.08;
    const yTop = (v: number) => PAD.t + H_TOP - ((v - (aMin - aPad)) / (aMax - aMin + 2 * aPad)) * H_TOP;
    const eMax = Math.max(...samples.map((s) => s.err));
    const botTop = PAD.t + H_TOP + GAP;
    const yBot = (v: number) => botTop + H_BOT - (v / (eMax * 1.1)) * H_BOT;
    const truthPaths = AXES.map((_, i) => linePath(samples.map((s) => [scaleX(s.t, tMax), yTop(s.truth[i])])));
    const estPaths = AXES.map((_, i) => linePath(samples.map((s) => [scaleX(s.t, tMax), yTop(s.est[i])])));
    const errPath = linePath(samples.map((s) => [scaleX(s.t, tMax), yBot(s.err)]));
    const errArea = `${errPath} L${scaleX(tMax, tMax).toFixed(1)},${(botTop + H_BOT).toFixed(1)} L${PAD.l},${(botTop + H_BOT).toFixed(1)} Z`;
    return {
      tMax,
      yTop,
      yBot,
      botTop,
      truthPaths,
      estPaths,
      errPath,
      errArea,
      angleTicks: niceTicks(aMin - aPad, aMax + aPad, 5),
      errTicks: niceTicks(0, eMax * 1.1, 3),
      timeTicks: niceTicks(0, tMax, 6),
      meanErr: replay.avgErrorDeg,
    };
  }, []);

  const hovered = hover !== null ? samples[hover] : null;

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * W;
    const t = ((x - PAD.l) / (W - PAD.l - PAD.r)) * geom.tMax;
    if (t < 0 || t > geom.tMax) {
      setHover(null);
      return;
    }
    let lo = 0;
    let hi = samples.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (samples[mid].t < t) lo = mid + 1;
      else hi = mid;
    }
    setHover(lo);
  };

  const draw = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { pathLength: 0 },
          animate: inView ? { pathLength: 1 } : { pathLength: 0 },
          transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  const ink = "hsl(var(--fig-2))";
  const accent = "hsl(var(--fig-1))";
  const graphite = "hsl(var(--fig-3))";
  const grid = "hsl(var(--fig-grid))";
  const label = "hsl(var(--muted-foreground))";

  return (
    <div ref={ref} className={`bg-card px-2 pt-2 ${className}`}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="block w-full"
        role="img"
        aria-label="Roll, pitch, and yaw from the error-state EKF overlaid on the true attitude over a 23 second flight, with attitude error below"
        onPointerMove={onMove}
        onPointerLeave={() => setHover(null)}
        style={{ fontFamily: "JetBrains Mono, ui-monospace, monospace", cursor: interactive ? "crosshair" : "default" }}
      >
        {/* Top panel: angle grid and axes. */}
        {geom.angleTicks.map((v) => (
          <g key={`a${v}`}>
            <line x1={PAD.l} x2={W - PAD.r} y1={geom.yTop(v)} y2={geom.yTop(v)} stroke={grid} strokeWidth={1} />
            <text x={PAD.l - 6} y={geom.yTop(v) + 3} fontSize={9} textAnchor="end" fill={label}>
              {v}°
            </text>
          </g>
        ))}
        {/* Bottom panel: error grid. */}
        {geom.errTicks.map((v) => (
          <g key={`e${v}`}>
            <line x1={PAD.l} x2={W - PAD.r} y1={geom.yBot(v)} y2={geom.yBot(v)} stroke={grid} strokeWidth={1} />
            <text x={PAD.l - 6} y={geom.yBot(v) + 3} fontSize={9} textAnchor="end" fill={label}>
              {v}°
            </text>
          </g>
        ))}
        {/* Time axis. */}
        {geom.timeTicks.map((v) => (
          <g key={`t${v}`}>
            <line x1={scaleX(v, geom.tMax)} x2={scaleX(v, geom.tMax)} y1={geom.botTop + H_BOT} y2={geom.botTop + H_BOT + 4} stroke={label} strokeWidth={1} />
            <text x={scaleX(v, geom.tMax)} y={geom.botTop + H_BOT + 16} fontSize={9} textAnchor="middle" fill={label}>
              {v} s
            </text>
          </g>
        ))}
        <text x={PAD.l} y={PAD.t + 9} fontSize={9} fill={label} letterSpacing={1}>
          ATTITUDE
        </text>
        <text x={PAD.l} y={geom.botTop + 9} fontSize={9} fill={label} letterSpacing={1}>
          ATTITUDE ERROR
        </text>

        {/* Truth: solid ink/graphite. Estimate: dashed accent on top. */}
        {geom.truthPaths.map((d, i) => (
          <motion.path key={`tr${i}`} d={d} fill="none" stroke={i === 2 ? ink : graphite} strokeWidth={1.5} strokeLinejoin="round" {...draw(0.05 * i)} />
        ))}
        {geom.estPaths.map((d, i) => (
          <motion.path key={`es${i}`} d={d} fill="none" stroke={accent} strokeWidth={1.5} strokeDasharray="4 3" strokeLinejoin="round" {...draw(0.2 + 0.05 * i)} />
        ))}
        {/* Axis labels at the right edge of each truth line. */}
        {AXES.map((name, i) => {
          const last = samples[samples.length - 1];
          return (
            <text key={name} x={W - PAD.r - 2} y={geom.yTop(last.truth[i]) - 4} fontSize={9} textAnchor="end" fill={i === 2 ? ink : graphite}>
              {name}
            </text>
          );
        })}

        {/* Error panel. */}
        <path d={geom.errArea} fill={accent} opacity={0.1} />
        <motion.path d={geom.errPath} fill="none" stroke={accent} strokeWidth={1.25} {...draw(0.4)} />
        <line x1={PAD.l} x2={W - PAD.r} y1={geom.yBot(geom.meanErr)} y2={geom.yBot(geom.meanErr)} stroke={ink} strokeWidth={1} strokeDasharray="2 3" />
        <text x={W - PAD.r - 2} y={geom.yBot(geom.meanErr) - 4} fontSize={9} textAnchor="end" fill={ink}>
          mean {geom.meanErr.toFixed(3)}°
        </text>

        {/* Hover cursor (project page only). */}
        {hovered ? (
          <g pointerEvents="none">
            <line x1={scaleX(hovered.t, geom.tMax)} x2={scaleX(hovered.t, geom.tMax)} y1={PAD.t} y2={geom.botTop + H_BOT} stroke={ink} strokeWidth={1} opacity={0.5} />
            {AXES.map((_, i) => (
              <circle key={i} cx={scaleX(hovered.t, geom.tMax)} cy={geom.yTop(hovered.est[i])} r={2.5} fill={accent} />
            ))}
            <circle cx={scaleX(hovered.t, geom.tMax)} cy={geom.yBot(hovered.err)} r={2.5} fill={accent} />
          </g>
        ) : null}
      </svg>

      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-2 pb-2 pt-1 font-mono text-[0.65rem] text-muted-foreground">
        <span className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-0.5 w-4 bg-foreground" /> truth
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-0.5 w-4 border-t-2 border-dashed border-accent" /> ES-EKF
          </span>
        </span>
        <span className="readout">
          {hovered
            ? `t ${hovered.t.toFixed(2)} s · yaw ${hovered.est[2].toFixed(2)}° (truth ${hovered.truth[2].toFixed(2)}°) · err ${hovered.err.toFixed(3)}°`
            : `avg deviation ${replay.avgDeviationPct.toFixed(2)}% · avg error ${replay.avgErrorDeg.toFixed(3)}° · max ${replay.maxErrorDeg.toFixed(3)}°`}
        </span>
      </div>
    </div>
  );
};

export default EkfReplay;

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import type { DemoProps } from "./index";

/* ------------------------------------------------------------------
   Indoor temperature of a home without air conditioning over a 24 h
   heatwave, from the Newton's-law-of-cooling model in the M3 paper.
   Two sliders drive the outdoor peak and the envelope insulation.
   ------------------------------------------------------------------ */

const DT_HOURS = 0.05;
const WARMUP_DAYS = 2;
const THRESHOLD_F = 90;
const DIURNAL_SWING_F = 22;
const Y_MIN = 65;
const Y_MAX = 115;

interface Simulation {
  hours: number[];
  indoor: number[];
  outdoor: number[];
  peakIndoor: number;
  peakHour: number;
  hoursAbove: number;
}

/* Outdoor temperature: a 24 h sinusoid peaking at 15:00 with a 22 F diurnal swing. */
function outdoorTemp(peak: number, t: number): number {
  const half = DIURNAL_SWING_F / 2;
  return peak - half + half * Math.cos((2 * Math.PI * (t - 15)) / 24);
}

/* Solar gain through the envelope (F/h): a half-sine over daylight, 07:00 to 19:00,
   attenuated by insulation. */
function solarGain(t: number, insulation: number): number {
  const h = ((t % 24) + 24) % 24;
  if (h <= 7 || h >= 19) return 0;
  return 1.6 * Math.sin((Math.PI * (h - 7)) / 12) * (1 - 0.6 * insulation);
}

/* Heat transfer coefficient k (1/h) from the insulation slider: leaky at 0, tight at 1. */
function coolingRate(insulation: number): number {
  return 0.45 + (0.08 - 0.45) * insulation;
}

/* Newton's law of cooling, dT_in/dt = k (T_out(t) - T_in) + solar(t), integrated
   with RK4 for three days; only the final day is returned so the start-up
   transient is gone. */
function simulateIndoor(peak: number, insulation: number): Simulation {
  const k = coolingRate(insulation);
  const dTdt = (t: number, temp: number) => k * (outdoorTemp(peak, t) - temp) + solarGain(t, insulation);
  const totalHours = 24 * (WARMUP_DAYS + 1);
  const steps = Math.round(totalHours / DT_HOURS);
  let temp = outdoorTemp(peak, 0);
  const hours: number[] = [];
  const indoor: number[] = [];
  const outdoor: number[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i * DT_HOURS;
    if (t >= 24 * WARMUP_DAYS) {
      hours.push(t - 24 * WARMUP_DAYS);
      indoor.push(temp);
      outdoor.push(outdoorTemp(peak, t));
    }
    const k1 = dTdt(t, temp);
    const k2 = dTdt(t + DT_HOURS / 2, temp + (DT_HOURS / 2) * k1);
    const k3 = dTdt(t + DT_HOURS / 2, temp + (DT_HOURS / 2) * k2);
    const k4 = dTdt(t + DT_HOURS, temp + DT_HOURS * k3);
    temp += (DT_HOURS / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
  }
  let peakIndoor = -Infinity;
  let peakHour = 0;
  let hoursAbove = 0;
  indoor.forEach((value, i) => {
    if (value > peakIndoor) {
      peakIndoor = value;
      peakHour = hours[i];
    }
    if (value > THRESHOLD_F && i < indoor.length - 1) hoursAbove += DT_HOURS;
  });
  return { hours, indoor, outdoor, peakIndoor, peakHour, hoursAbove };
}

/* Fixed, deterministic vulnerability scores for 27 zip codes (a 9x3 strip). */
const ZIP_SCORES = [
  0.31, 0.52, 0.87, 0.44, 0.18, 0.66, 0.27, 0.73, 0.39,
  0.58, 0.92, 0.35, 0.21, 0.79, 0.47, 0.63, 0.14, 0.55,
  0.42, 0.29, 0.84, 0.36, 0.69, 0.23, 0.51, 0.95, 0.33,
];
const TOP_N = 4;
const topThreshold = [...ZIP_SCORES].sort((a, b) => b - a)[TOP_N - 1];

function linePath(xs: number[], ys: number[], sx: (x: number) => number, sy: (y: number) => number): string {
  let d = "";
  for (let i = 0; i < xs.length; i++) {
    d += `${i === 0 ? "M" : "L"}${sx(xs[i]).toFixed(1)},${sy(ys[i]).toFixed(1)}`;
  }
  return d;
}

function formatHour(h: number): string {
  const whole = Math.floor(h);
  const minutes = Math.round((h - whole) * 60);
  return `${String(whole).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

/* Tracks the rendered width of an element so the SVG can draw in real pixels. */
function useElementWidth<T extends HTMLElement>(fallback: number): [RefObject<T>, number] {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(fallback);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width > 0) setWidth(entry.contentRect.width);
    });
    observer.observe(el);
    if (el.clientWidth > 0) setWidth(el.clientWidth);
    return () => observer.disconnect();
  }, []);
  return [ref, width];
}

const HeatMap = ({ compact = false, className = "" }: DemoProps) => {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { amount: 0.25, once: true });
  const [plotRef, width] = useElementWidth<HTMLDivElement>(480);

  const [peak, setPeak] = useState(100);
  const [insulationPct, setInsulationPct] = useState(35);
  const insulation = insulationPct / 100;

  const sim = useMemo(() => simulateIndoor(peak, insulation), [peak, insulation]);

  const height = compact ? 128 : 168;
  const pad = { left: 30, right: 10, top: 10, bottom: 20 };
  const plotW = Math.max(40, width - pad.left - pad.right);
  const plotH = height - pad.top - pad.bottom;
  const sx = (h: number) => pad.left + (h / 24) * plotW;
  const sy = (f: number) => pad.top + (1 - (f - Y_MIN) / (Y_MAX - Y_MIN)) * plotH;

  const indoorPath = linePath(sim.hours, sim.indoor, sx, sy);
  const outdoorPath = linePath(sim.hours, sim.outdoor, sx, sy);
  const areaPath = `${indoorPath}L${sx(24).toFixed(1)},${sy(Y_MIN).toFixed(1)}L${sx(0).toFixed(1)},${sy(Y_MIN).toFixed(1)}Z`;
  const thresholdY = sy(THRESHOLD_F);

  const yTicks = [70, 80, 90, 100, 110];
  const xTicks = [0, 6, 12, 18, 24];
  const drawn = reduce || inView;
  const drawTransition = { duration: reduce ? 0 : 0.9, ease: "easeInOut" as const };

  return (
    <div ref={rootRef} className={`flex flex-col gap-3 p-4 ${compact ? "min-h-[16rem]" : "min-h-[20rem]"} ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="eyebrow text-[0.62rem]">indoor vs outdoor · 24 h · no air conditioning</span>
        <span className="flex items-center gap-3 font-mono text-[0.62rem] text-muted-foreground" aria-hidden="true">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-0 w-3.5 border-t-[1.5px] border-[hsl(var(--fig-1))]" />
            indoor
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-0 w-3.5 border-t-[1.5px] border-dashed border-[hsl(var(--fig-3))]" />
            outdoor
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-0 w-3.5 border-t border-dashed border-accent" />
            {THRESHOLD_F} F threshold
          </span>
        </span>
      </div>

      <div ref={plotRef} className="w-full">
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={`Indoor temperature peaks at ${sim.peakIndoor.toFixed(1)} degrees Fahrenheit and stays above ${THRESHOLD_F} degrees for ${sim.hoursAbove.toFixed(1)} hours`}
          className="block overflow-visible"
        >
          <defs>
            <clipPath id="heat-above-threshold">
              <rect x={pad.left} y={pad.top} width={plotW} height={Math.max(0, thresholdY - pad.top)} />
            </clipPath>
          </defs>
          {yTicks.map((tick) => (
            <g key={`y${tick}`}>
              <line x1={pad.left} x2={pad.left + plotW} y1={sy(tick)} y2={sy(tick)} stroke="hsl(var(--fig-grid))" strokeWidth={1} />
              <text x={pad.left - 6} y={sy(tick)} textAnchor="end" dominantBaseline="middle" fontSize={9} className="font-mono" fill={tick === THRESHOLD_F ? "hsl(var(--fig-1))" : "hsl(var(--muted-foreground))"}>
                {tick}
              </text>
            </g>
          ))}
          {xTicks.map((tick) => (
            <g key={`x${tick}`}>
              {tick > 0 && tick < 24 && <line x1={sx(tick)} x2={sx(tick)} y1={pad.top} y2={pad.top + plotH} stroke="hsl(var(--fig-grid))" strokeWidth={1} />}
              <text x={sx(tick)} y={height - 6} textAnchor={tick === 0 ? "start" : tick === 24 ? "end" : "middle"} fontSize={9} className="font-mono" fill="hsl(var(--muted-foreground))">
                {tick === 24 ? "24 h" : `${String(tick).padStart(2, "0")}:00`}
              </text>
            </g>
          ))}
          <motion.path
            d={areaPath}
            fill="hsl(var(--fig-1))"
            clipPath="url(#heat-above-threshold)"
            initial={false}
            animate={{ opacity: drawn ? 0.12 : 0 }}
            transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : 0.6 }}
          />
          <line x1={pad.left} x2={pad.left + plotW} y1={thresholdY} y2={thresholdY} stroke="hsl(var(--fig-1))" strokeWidth={1} strokeDasharray="2 3" />
          <motion.path
            d={outdoorPath}
            fill="none"
            stroke="hsl(var(--fig-3))"
            strokeWidth={1.5}
            strokeDasharray="4 3"
            initial={false}
            animate={{ pathLength: drawn ? 1 : 0, opacity: drawn ? 1 : 0 }}
            transition={drawTransition}
          />
          <motion.path
            d={indoorPath}
            fill="none"
            stroke="hsl(var(--fig-1))"
            strokeWidth={1.5}
            strokeLinejoin="round"
            initial={false}
            animate={{ pathLength: drawn ? 1 : 0, opacity: drawn ? 1 : 0 }}
            transition={{ ...drawTransition, delay: reduce ? 0 : 0.15 }}
          />
          <motion.g initial={false} animate={{ opacity: drawn ? 1 : 0 }} transition={{ duration: reduce ? 0 : 0.3, delay: reduce ? 0 : 0.9 }}>
            <circle cx={sx(sim.peakHour)} cy={sy(sim.peakIndoor)} r={3} fill="hsl(var(--background))" stroke="hsl(var(--fig-1))" strokeWidth={1.5} />
          </motion.g>
        </svg>
      </div>

      <div className={`grid gap-4 ${compact ? "" : "md:grid-cols-[minmax(0,1fr)_auto]"}`}>
        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="flex items-baseline justify-between font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
              <span>outdoor peak</span>
              <span className="readout text-xs normal-case tracking-normal text-foreground">{peak} F</span>
            </span>
            <input
              type="range"
              className="range"
              min={90}
              max={110}
              step={1}
              value={peak}
              aria-label="Outdoor peak temperature in degrees Fahrenheit"
              aria-valuetext={`${peak} degrees`}
              onChange={(e) => setPeak(Number(e.target.value))}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="flex items-baseline justify-between font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
              <span>insulation</span>
              <span className="readout text-xs normal-case tracking-normal text-foreground">k = {coolingRate(insulation).toFixed(2)} /h</span>
            </span>
            <input
              type="range"
              className="range"
              min={0}
              max={100}
              step={1}
              value={insulationPct}
              aria-label="Insulation, from low to high"
              aria-valuetext={`${insulationPct} percent`}
              onChange={(e) => setInsulationPct(Number(e.target.value))}
            />
            <span className="flex justify-between font-mono text-[0.58rem] uppercase tracking-[0.12em] text-muted-foreground/70" aria-hidden="true">
              <span>low</span>
              <span>high</span>
            </span>
          </label>
        </div>
        <dl className="grid grid-cols-3 gap-x-4 gap-y-2">
          <div className="flex flex-col gap-0.5">
            <dt className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-muted-foreground">peak indoor</dt>
            <dd className={`readout text-xs ${sim.peakIndoor > THRESHOLD_F ? "text-accent" : "text-foreground"}`}>{sim.peakIndoor.toFixed(1)} F</dd>
          </div>
          <div className="flex flex-col gap-0.5">
            <dt className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-muted-foreground">hours &gt; {THRESHOLD_F} F</dt>
            <dd className={`readout text-xs ${sim.hoursAbove > 0 ? "text-accent" : "text-foreground"}`}>{sim.hoursAbove.toFixed(1)} h</dd>
          </div>
          <div className="flex flex-col gap-0.5">
            <dt className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-muted-foreground">indoor peak at</dt>
            <dd className="readout text-xs text-foreground">{formatHour(sim.peakHour)}</dd>
          </div>
        </dl>
      </div>

      {!compact && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-3">
          <div className="grid grid-cols-9 gap-[3px]" role="img" aria-label="Vulnerability index across 27 Memphis zip codes, with the four most vulnerable highlighted">
            {ZIP_SCORES.map((score, i) => {
              const top = score >= topThreshold;
              return (
                <span
                  key={i}
                  className="h-2.5 w-2.5 rounded-[2px]"
                  style={{
                    background: top ? "hsl(var(--fig-1))" : `hsl(var(--fig-3) / ${(0.15 + 0.55 * score).toFixed(2)})`,
                    outline: top ? "1px solid hsl(var(--fig-1))" : undefined,
                    outlineOffset: 1,
                  }}
                />
              );
            })}
          </div>
          <p className="min-w-0 flex-1 font-mono text-[0.6rem] leading-relaxed text-muted-foreground">
            <span className="text-foreground">27 zip codes</span>, top {TOP_N} in accent. Four significant features after backward selection: elderly share, children share, population, transit and walk commuters.
          </p>
        </div>
      )}
    </div>
  );
};

export default HeatMap;

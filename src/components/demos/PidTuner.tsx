import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import type { DemoProps } from "./index";

/* ------------------------------------------------------------------
   Closed-loop step response of a thrust controller. The plant, the
   discrete PID loop, and the step-response metrics mirror what the
   real tuner logs to CSV each run; the gains are live.
   ------------------------------------------------------------------ */

interface Gains {
  kp: number;
  ki: number;
  kd: number;
}
type GainKey = keyof Gains;

interface GainSpec {
  key: GainKey;
  label: string;
  min: number;
  max: number;
  step: number;
}

const DT = 0.005;
const HORIZON = 5;
const SETPOINT = 1;
const Y_MAX = 1.6;
const DEFAULT_GAINS: Gains = { kp: 20, ki: 4, kd: 1 };
const TUNED_GAINS: Gains = { kp: 45, ki: 40, kd: 9 };
const GAIN_SPECS: GainSpec[] = [
  { key: "kp", label: "Kp", min: 0, max: 60, step: 0.5 },
  { key: "ki", label: "Ki", min: 0, max: 60, step: 0.5 },
  { key: "kd", label: "Kd", min: 0, max: 15, step: 0.1 },
];
/* Tolerances the tuner flags against. */
const TOLERANCE = { riseTime: 0.5, overshoot: 10, settlingTime: 1.5, steadyStateError: 0.02 };

/* Plant: a first-order engine lag (tau = 80 ms) driving a unit mass-spring-damper
   (wn = 3 rad/s, zeta = 0.3), closed with PID using derivative-on-measurement,
   stepped explicitly at dt = 5 ms. Returns the output trace. */
function simulateStep({ kp, ki, kd }: Gains): number[] {
  const mass = 1;
  const damping = 1.8;
  const stiffness = 9;
  const tau = 0.08;
  const steps = Math.round(HORIZON / DT);
  const out = new Array<number>(steps);
  let x = 0;
  let v = 0;
  let thrust = 0;
  let integral = 0;
  for (let i = 0; i < steps; i++) {
    const err = SETPOINT - x;
    integral += err * DT;
    const u = kp * err + ki * integral - kd * v;
    thrust += ((u - thrust) / tau) * DT;
    const accel = (thrust - damping * v - stiffness * x) / mass;
    v = clamp(v + accel * DT, -1e4, 1e4);
    x = clamp(x + v * DT, -1e4, 1e4);
    out[i] = x;
  }
  return out;
}

interface StepMetrics {
  riseTime: number | null;
  overshoot: number;
  settlingTime: number | null;
  steadyStateError: number;
  peakTime: number;
  ise: number;
  diverges: boolean;
}

/* Step-response metrics as the tuner logs them: 10-90% rise time, peak
   overshoot, 2% settling time, steady-state error over the last 0.5 s,
   peak time, and integral of squared error. */
function stepMetrics(xs: number[]): StepMetrics {
  let t10: number | null = null;
  let t90: number | null = null;
  let peak = -Infinity;
  let peakTime = 0;
  let ise = 0;
  for (let i = 0; i < xs.length; i++) {
    const t = (i + 1) * DT;
    const x = xs[i];
    if (t10 === null && x >= 0.1 * SETPOINT) t10 = t;
    if (t90 === null && x >= 0.9 * SETPOINT) t90 = t;
    if (x > peak) {
      peak = x;
      peakTime = t;
    }
    ise += (SETPOINT - x) ** 2 * DT;
  }
  let lastOutOfBand = -1;
  for (let i = xs.length - 1; i >= 0; i--) {
    if (Math.abs(xs[i] - SETPOINT) > 0.02 * SETPOINT) {
      lastOutOfBand = i;
      break;
    }
  }
  const settlingTime = lastOutOfBand === xs.length - 1 ? null : (lastOutOfBand + 1) * DT;
  const tail = xs.slice(-Math.round(0.5 / DT));
  const tailMean = tail.reduce((sum, x) => sum + x, 0) / tail.length;
  return {
    riseTime: t10 !== null && t90 !== null ? t90 - t10 : null,
    overshoot: Math.max(0, ((peak - SETPOINT) / SETPOINT) * 100),
    settlingTime,
    steadyStateError: SETPOINT - tailMean,
    peakTime,
    ise,
    diverges: !Number.isFinite(peak) || peak > 5,
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/* Builds the SVG path for a trace, sampling every other point and clipping
   values that leave the plot so a divergent run stays drawable. */
function tracePath(xs: number[], sx: (t: number) => number, sy: (y: number) => number): string {
  let d = "";
  for (let i = 0; i < xs.length; i += 2) {
    const y = clamp(xs[i], -0.5, Y_MAX + 0.5);
    d += `${i === 0 ? "M" : "L"}${sx(i * DT).toFixed(1)},${sy(y).toFixed(1)}`;
  }
  return d;
}

function formatSeconds(value: number | null, missing: string): string {
  return value === null ? missing : `${value.toFixed(2)} s`;
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

const easeOutCubic = (p: number) => 1 - Math.pow(1 - p, 3);

const PidTuner = ({ compact = false, className = "" }: DemoProps) => {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { amount: 0.2 });
  const [plotRef, width] = useElementWidth<HTMLDivElement>(480);

  const [gains, setGains] = useState<Gains>(DEFAULT_GAINS);
  const [drawKey, setDrawKey] = useState(0);
  const [tuning, setTuning] = useState(false);
  const tweenRef = useRef<number | null>(null);

  const trace = useMemo(() => simulateStep(gains), [gains]);
  const metrics = useMemo(() => stepMetrics(trace), [trace]);

  useEffect(
    () => () => {
      if (tweenRef.current !== null) cancelAnimationFrame(tweenRef.current);
    },
    [],
  );

  const redraw = () => setDrawKey((k) => k + 1);
  const setGain = (key: GainKey, value: number) => setGains((g) => ({ ...g, [key]: value }));

  const tweenTo = (target: Gains) => {
    if (tweenRef.current !== null) cancelAnimationFrame(tweenRef.current);
    if (reduce) {
      setGains(target);
      redraw();
      return;
    }
    const from = gains;
    const start = performance.now();
    setTuning(true);
    const tick = (now: number) => {
      const p = Math.min(1, Math.max(0, now - start) / 800);
      const e = easeOutCubic(p);
      setGains({
        kp: from.kp + (target.kp - from.kp) * e,
        ki: from.ki + (target.ki - from.ki) * e,
        kd: from.kd + (target.kd - from.kd) * e,
      });
      if (p < 1) {
        tweenRef.current = requestAnimationFrame(tick);
      } else {
        tweenRef.current = null;
        setTuning(false);
        redraw();
      }
    };
    tweenRef.current = requestAnimationFrame(tick);
  };

  /* Plot geometry. */
  const height = compact ? 132 : 176;
  const pad = { left: 30, right: 10, top: 10, bottom: 20 };
  const plotW = Math.max(40, width - pad.left - pad.right);
  const plotH = height - pad.top - pad.bottom;
  const sx = (t: number) => pad.left + (t / HORIZON) * plotW;
  const sy = (y: number) => pad.top + (1 - y / Y_MAX) * plotH;
  const path = tracePath(trace, sx, sy);

  const cells = [
    {
      label: "rise 10-90",
      value: formatSeconds(metrics.riseTime, "n/a"),
      bad: metrics.riseTime === null || metrics.riseTime > TOLERANCE.riseTime,
    },
    {
      label: "overshoot",
      value: `${metrics.overshoot > 999 ? ">999" : metrics.overshoot.toFixed(1)} %`,
      bad: metrics.overshoot > TOLERANCE.overshoot,
    },
    {
      label: "settle 2%",
      value: formatSeconds(metrics.settlingTime, `>${HORIZON} s`),
      bad: metrics.settlingTime === null || metrics.settlingTime > TOLERANCE.settlingTime,
    },
    {
      label: "ss error",
      value: Math.abs(metrics.steadyStateError) > 99 ? ">99" : metrics.steadyStateError.toFixed(3),
      bad: Math.abs(metrics.steadyStateError) > TOLERANCE.steadyStateError,
    },
    { label: "peak time", value: `${metrics.peakTime.toFixed(2)} s`, bad: false },
    { label: "ISE", value: metrics.ise > 999 ? ">999" : metrics.ise.toFixed(3), bad: false },
  ];

  const yTicks = [0, 0.5, 1, 1.5];
  const xTicks = [0, 1, 2, 3, 4, 5];
  const animateDraw = !reduce && inView;

  return (
    <div ref={rootRef} className={`flex flex-col gap-3 p-4 ${compact ? "min-h-[16rem]" : "min-h-[20rem]"} ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="eyebrow text-[0.62rem]">step response · thrust command</span>
        <div className="flex items-center gap-1.5">
          {metrics.diverges && <span className="tag-accent text-[0.62rem]">unstable</span>}
          <button type="button" className="btn-ghost btn-compact" onClick={() => tweenTo(DEFAULT_GAINS)} disabled={tuning}>
            Reset
          </button>
          <button type="button" className="btn-secondary btn-compact" onClick={() => tweenTo(TUNED_GAINS)} disabled={tuning}>
            Auto-tune
          </button>
        </div>
      </div>

      <div ref={plotRef} className="w-full">
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={`Step response with overshoot ${metrics.overshoot.toFixed(1)} percent and settling time ${formatSeconds(metrics.settlingTime, "over five seconds")}`}
          className="block overflow-visible"
        >
          <defs>
            <clipPath id="pid-plot-clip">
              <rect x={pad.left} y={pad.top - 1} width={plotW} height={plotH + 2} />
            </clipPath>
          </defs>
          {yTicks.map((tick) => (
            <g key={`y${tick}`}>
              <line x1={pad.left} x2={pad.left + plotW} y1={sy(tick)} y2={sy(tick)} stroke="hsl(var(--fig-grid))" strokeWidth={1} />
              <text x={pad.left - 6} y={sy(tick)} textAnchor="end" dominantBaseline="middle" fontSize={9} className="font-mono" fill="hsl(var(--muted-foreground))">
                {tick.toFixed(1)}
              </text>
            </g>
          ))}
          {xTicks.map((tick) => (
            <g key={`x${tick}`}>
              {tick > 0 && tick < HORIZON && (
                <line x1={sx(tick)} x2={sx(tick)} y1={pad.top} y2={pad.top + plotH} stroke="hsl(var(--fig-grid))" strokeWidth={1} />
              )}
              <text x={sx(tick)} y={height - 6} textAnchor={tick === 0 ? "start" : tick === HORIZON ? "end" : "middle"} fontSize={9} className="font-mono" fill="hsl(var(--muted-foreground))">
                {tick} s
              </text>
            </g>
          ))}
          <line x1={pad.left} x2={pad.left + plotW} y1={sy(SETPOINT)} y2={sy(SETPOINT)} stroke="hsl(var(--fig-2))" strokeWidth={1.5} strokeDasharray="4 4" />
          <motion.path
            key={drawKey}
            d={path}
            fill="none"
            stroke="hsl(var(--fig-1))"
            strokeWidth={1.5}
            strokeLinejoin="round"
            strokeLinecap="round"
            clipPath="url(#pid-plot-clip)"
            initial={animateDraw ? { pathLength: 0 } : false}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
          <g className="font-mono" fontSize={9} fill="hsl(var(--muted-foreground))">
            <line x1={pad.left + plotW - 118} x2={pad.left + plotW - 104} y1={pad.top - 3} y2={pad.top - 3} stroke="hsl(var(--fig-1))" strokeWidth={1.5} />
            <text x={pad.left + plotW - 99} y={pad.top - 3} dominantBaseline="middle">
              response
            </text>
            <line x1={pad.left + plotW - 50} x2={pad.left + plotW - 36} y1={pad.top - 3} y2={pad.top - 3} stroke="hsl(var(--fig-2))" strokeWidth={1.5} strokeDasharray="3 3" />
            <text x={pad.left + plotW - 31} y={pad.top - 3} dominantBaseline="middle">
              setpoint
            </text>
          </g>
        </svg>
      </div>

      <div className={`grid gap-4 ${compact ? "" : "md:grid-cols-[minmax(0,1fr)_auto]"}`}>
        <div className="grid grid-cols-3 gap-3">
          {GAIN_SPECS.map((spec) => (
            <label key={spec.key} className="flex flex-col gap-1.5">
              <span className="flex items-baseline justify-between font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
                <span>{spec.label}</span>
                <span className="readout text-xs normal-case tracking-normal text-foreground">{gains[spec.key].toFixed(1)}</span>
              </span>
              <input
                type="range"
                className="range"
                min={spec.min}
                max={spec.max}
                step={spec.step}
                value={gains[spec.key]}
                aria-label={`${spec.label} gain`}
                aria-valuetext={gains[spec.key].toFixed(1)}
                disabled={tuning}
                onChange={(e) => setGain(spec.key, Number(e.target.value))}
                onPointerUp={redraw}
                onKeyUp={redraw}
              />
            </label>
          ))}
        </div>
        <dl className={`grid gap-x-4 gap-y-2 ${compact ? "grid-cols-3" : "grid-cols-3 md:grid-cols-6"}`}>
          {cells.map((cell) => (
            <div key={cell.label} className="flex flex-col gap-0.5">
              <dt className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-muted-foreground">{cell.label}</dt>
              <dd className={`readout text-xs ${cell.bad ? "text-accent" : "text-foreground"}`}>{cell.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
};

export default PidTuner;

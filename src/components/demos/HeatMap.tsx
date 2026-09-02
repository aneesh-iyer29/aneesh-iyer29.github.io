import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import type { DemoProps } from "./index";

/* ------------------------------------------------------------------
   Reproduction of Figure 2.5.2 from Shao, Iyer, Rajan, Tang, Zhang,
   "Hot Button Issue: Staying Cool as the World Heats Up" (SIAM
   Undergraduate Research Online, doi 10.1137/25S1777554): indoor
   temperature of four Memphis homes without air conditioning over a
   24 h heat day. The model and parameters are the paper's, unchanged.
   ------------------------------------------------------------------ */

interface Home {
  id: string;
  label: string;
  /** Floor area A_b in m^2. */
  area: number;
  /** Solar exposure ratio r_s (1 = no shade). */
  shade: number;
  note: string;
  color: string;
}

const HOMES: Home[] = [
  { id: "home1", label: "Home 1", area: 88, shade: 0.1, note: "heavy shade", color: "hsl(var(--fig-2))" },
  { id: "home2", label: "Home 2", area: 63, shade: 0.6, note: "partial shade", color: "hsl(var(--fig-3))" },
  { id: "home3", label: "Home 3", area: 74, shade: 0.95, note: "no shade", color: "hsl(var(--fig-1))" },
  { id: "home4", label: "Home 4", area: 278, shade: 0.95, note: "no shade, large", color: "hsl(var(--fig-4))" },
];

/* Shared parameters from Table 2.5.1: wall height h (m), specific heat c,
   air density D, window ratio r_w, thermal resistance R, and n floors. */
const WALL_HEIGHT = 3.048;
const SPECIFIC_HEAT = 1.005;
const DENSITY = 1293;
const WINDOW_RATIO = 0.2;
const RESISTANCE = 13;
const FLOORS = 1;
const T_IN_0 = 29.444;
const STEPS = 2000;
const HIGHLIGHTED = "home3";

const X_MIN = 0;
const X_MAX = 24;
const Y_MIN = 27;
const Y_MAX = 38;
const X_TICKS = [0, 4, 8, 12, 16, 20, 24];
const Y_TICKS = [28, 30, 32, 34, 36, 38];

/* Outdoor temperature (deg C) at t hours after midnight: the paper's fitted sinusoid (Fig. 2.4.1). */
function outdoorTemp(t: number): number {
  return 4.9796776692867555 * Math.sin(0.31958467920431916 * t + -2.7753696625091497) + 32.23606417137194;
}

/* Global horizontal irradiance (W/m^2): the paper's piecewise quadratic (Fig. 2.4.2), zero before 7 AM. */
function irradiance(t: number): number {
  return t < 7 ? 0 : -24.099845890995997 * t * t + 623.6904007623635 * t + -3166.8881716727808;
}

interface Series {
  t: number[];
  temp: number[];
  peak: number;
  peakHour: number;
}

/* The paper's indoor model, dT_in/dt = (r_s r_w I(t) A_w + (T_out(t) + 50 - T_in) A_w / R) / (A_b h c D),
   with wall area A_w = 4 sqrt(A_b / n) n h, integrated by RK4 over 0 to 24 h. */
function simulateHome(area: number, shade: number): Series {
  const wallArea = 4 * Math.sqrt(area / FLOORS) * FLOORS * WALL_HEIGHT;
  const capacity = area * WALL_HEIGHT * SPECIFIC_HEAT * DENSITY;
  const dTdt = (t: number, temp: number) =>
    (1 / capacity) * (shade * WINDOW_RATIO * irradiance(t) * wallArea + ((outdoorTemp(t) + 50 - temp) * wallArea) / RESISTANCE);
  const dt = (X_MAX - X_MIN) / STEPS;
  const t: number[] = [0];
  const temp: number[] = [T_IN_0];
  let value = T_IN_0;
  for (let i = 0; i < STEPS; i++) {
    const time = i * dt;
    const k1 = dTdt(time, value);
    const k2 = dTdt(time + dt / 2, value + (dt / 2) * k1);
    const k3 = dTdt(time + dt / 2, value + (dt / 2) * k2);
    const k4 = dTdt(time + dt, value + dt * k3);
    value += (dt / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
    t.push((i + 1) * dt);
    temp.push(value);
  }
  let peak = -Infinity;
  let peakHour = 0;
  temp.forEach((v, i) => {
    if (v > peak) {
      peak = v;
      peakHour = t[i];
    }
  });
  return { t, temp, peak, peakHour };
}

function outdoorSeries(): Series {
  const t: number[] = [];
  const temp: number[] = [];
  for (let i = 0; i <= 240; i++) {
    const time = (i / 240) * X_MAX;
    t.push(time);
    temp.push(outdoorTemp(time));
  }
  return { t, temp, peak: Math.max(...temp), peakHour: t[temp.indexOf(Math.max(...temp))] };
}

function linePath(xs: number[], ys: number[], sx: (x: number) => number, sy: (y: number) => number, stride = 1): string {
  let d = "";
  for (let i = 0; i < xs.length; i += stride) {
    d += `${d === "" ? "M" : "L"}${sx(xs[i]).toFixed(1)},${sy(ys[i]).toFixed(1)}`;
  }
  return d;
}

const toFahrenheit = (c: number) => (c * 9) / 5 + 32;

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
  const inView = useInView(rootRef, { amount: 0.3, once: true });
  const [plotRef, width] = useElementWidth<HTMLDivElement>(560);
  const [active, setActive] = useState<string | null>(null);

  const homes = useMemo(() => HOMES.map((home) => ({ ...home, series: simulateHome(home.area, home.shade) })), []);
  const outdoor = useMemo(outdoorSeries, []);
  const readoutHome = homes.find((home) => home.id === (active ?? HIGHLIGHTED)) ?? homes[2];

  const height = compact ? 200 : 260;
  const pad = { left: 46, right: 12, top: 10, bottom: 36 };
  const plotW = Math.max(60, width - pad.left - pad.right);
  const plotH = height - pad.top - pad.bottom;
  const sx = (x: number) => pad.left + ((x - X_MIN) / (X_MAX - X_MIN)) * plotW;
  const sy = (y: number) => pad.top + (1 - (y - Y_MIN) / (Y_MAX - Y_MIN)) * plotH;

  const drawn = Boolean(reduce) || inView;
  const lineTransition = (delay: number) => ({ duration: reduce ? 0 : 0.8, ease: "easeOut" as const, delay: reduce ? 0 : delay });
  const labelColor = "hsl(var(--muted-foreground))";

  return (
    <div ref={rootRef} className={`flex flex-col gap-3 p-4 ${compact ? "min-h-[18rem]" : "min-h-[22rem]"} ${className}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="eyebrow text-[0.62rem]">indoor temperature without air conditioning · four memphis homes</span>
        <span className="readout text-[0.68rem] text-foreground" aria-live="polite">
          <span className="text-muted-foreground">{readoutHome.label} peak </span>
          {readoutHome.series.peak.toFixed(1)} °C ({toFahrenheit(readoutHome.series.peak).toFixed(1)} °F)
          <span className="text-muted-foreground"> at </span>
          {readoutHome.series.peakHour.toFixed(1)} h
        </span>
      </div>

      <div ref={plotRef} className="w-full">
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label="Outdoor temperature and modeled indoor temperature of four homes over 24 hours"
          className="block overflow-visible"
        >
          <rect x={pad.left} y={pad.top} width={plotW} height={plotH} fill="hsl(var(--card))" />
          {Y_TICKS.map((tick) => (
            <g key={`y${tick}`}>
              <line x1={pad.left} x2={pad.left + plotW} y1={sy(tick)} y2={sy(tick)} stroke="hsl(var(--fig-grid))" strokeWidth={1} />
              <text x={pad.left - 7} y={sy(tick)} textAnchor="end" dominantBaseline="middle" fontSize={9} className="font-mono" fill={labelColor}>
                {tick}
              </text>
            </g>
          ))}
          {X_TICKS.map((tick) => (
            <g key={`x${tick}`}>
              <line x1={sx(tick)} x2={sx(tick)} y1={pad.top + plotH} y2={pad.top + plotH + 4} stroke={labelColor} strokeWidth={1} />
              <text x={sx(tick)} y={pad.top + plotH + 14} textAnchor="middle" fontSize={9} className="font-mono" fill={labelColor}>
                {tick}
              </text>
            </g>
          ))}
          <line x1={pad.left} x2={pad.left} y1={pad.top} y2={pad.top + plotH} stroke={labelColor} strokeWidth={1} />
          <line x1={pad.left} x2={pad.left + plotW} y1={pad.top + plotH} y2={pad.top + plotH} stroke={labelColor} strokeWidth={1} />
          <text x={pad.left + plotW / 2} y={height - 6} textAnchor="middle" fontSize={9} className="font-mono" fill={labelColor}>
            Hours after 12:00 AM
          </text>
          <text
            x={12}
            y={pad.top + plotH / 2}
            textAnchor="middle"
            fontSize={9}
            className="font-mono"
            fill={labelColor}
            transform={`rotate(-90 12 ${pad.top + plotH / 2})`}
          >
            Temperature (°C)
          </text>

          <motion.path
            d={linePath(outdoor.t, outdoor.temp, sx, sy)}
            fill="none"
            stroke="hsl(var(--fig-3))"
            strokeWidth={1.5}
            strokeDasharray="5 4"
            initial={false}
            animate={{ pathLength: drawn ? 1 : 0, opacity: drawn ? (active ? 0.35 : 1) : 0 }}
            transition={lineTransition(0)}
          />
          {homes.map((home, i) => {
            const emphasized = active === home.id;
            const dimmed = active !== null && !emphasized;
            return (
              <motion.path
                key={home.id}
                d={linePath(home.series.t, home.series.temp, sx, sy, 4)}
                fill="none"
                stroke={home.color}
                strokeWidth={emphasized ? 2.25 : 1.5}
                strokeLinejoin="round"
                initial={false}
                animate={{ pathLength: drawn ? 1 : 0, opacity: drawn ? (dimmed ? 0.22 : 1) : 0 }}
                transition={lineTransition(0.1 + i * 0.08)}
              />
            );
          })}
          <motion.g initial={false} animate={{ opacity: drawn ? 1 : 0 }} transition={{ duration: reduce ? 0 : 0.3, delay: reduce ? 0 : 0.9 }}>
            <circle
              cx={sx(readoutHome.series.peakHour)}
              cy={sy(readoutHome.series.peak)}
              r={3}
              fill="hsl(var(--card))"
              stroke={readoutHome.color}
              strokeWidth={1.5}
            />
          </motion.g>
        </svg>
      </div>

      <ul className="flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-[0.64rem] text-muted-foreground" aria-label="Legend">
        <li className="flex items-center gap-2">
          <span className="inline-block h-0 w-4 border-t-[1.5px] border-dashed border-[hsl(var(--fig-3))]" aria-hidden="true" />
          <span>Outdoor</span>
        </li>
        {homes.map((home) => {
          const emphasized = active === home.id;
          return (
            <li key={home.id}>
              <button
                type="button"
                className={`flex items-center gap-2 rounded-sm px-1 py-0.5 text-left transition-opacity ${active !== null && !emphasized ? "opacity-50" : ""}`}
                aria-label={`Highlight ${home.label}, floor area ${home.area} square meters, solar exposure ${home.shade}`}
                onMouseEnter={() => setActive(home.id)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(home.id)}
                onBlur={() => setActive(null)}
              >
                <span className="inline-block h-0 w-4 border-t-[1.5px]" style={{ borderColor: home.color }} aria-hidden="true" />
                <span className="text-foreground">{home.label}</span>
                <span>
                  A<sub>b</sub> {home.area} m² · r<sub>s</sub> {home.shade}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <p className="font-mono text-[0.6rem] text-muted-foreground">Model and parameters from Table 2.5.1 and Appendix 7.1 of the paper.</p>
    </div>
  );
};

export default HeatMap;

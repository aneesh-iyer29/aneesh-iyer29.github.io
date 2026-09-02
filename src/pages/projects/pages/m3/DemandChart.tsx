import { useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import Figure from "@/components/layout/Figure";
import { demand, projections } from "@/data/m3";

/* Two small multiples from Appendix 7.4: the drivers of peak demand
   (maximum temperature against peak hourly load) and of peak-month
   consumption (population against total consumption), 2012 to 2022.
   Hover a year to read the values. */

const W = 520;
const H = 230;
const PAD = { l: 44, r: 46, t: 12, b: 30 };
const years = demand.map((d) => d.year);
const x = (year: number) => PAD.l + ((year - years[0]) / (years[years.length - 1] - years[0])) * (W - PAD.l - PAD.r);

interface Series {
  key: "mtemp" | "pload" | "pop" | "tc";
  label: string;
  unit: string;
  color: string;
  side: "left" | "right";
  format: (v: number) => string;
}

/* Consecutive years join; a missing year (2020 load) leaves a gap. */
function linePath(pts: { x: number; y: number; year: number }[]) {
  return pts
    .map((p, i) => `${i === 0 || pts[i - 1].year !== p.year - 1 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");
}

function niceTicks(min: number, max: number, count: number): number[] {
  const span = max - min;
  const raw = span / count;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => span / s <= count) ?? mag * 10;
  const start = Math.floor(min / step) * step;
  const ticks: number[] = [];
  for (let v = start; v <= max + 1e-9; v += step) ticks.push(parseFloat(v.toFixed(6)));
  return ticks;
}

const Panel = ({ a, b, label, drawn, hover, setHover }: { a: Series; b: Series; label: string; drawn: boolean; hover: number | null; setHover: (y: number | null) => void }) => {
  const reduce = useReducedMotion();
  const scale = (s: Series) => {
    const vals = demand.map((d) => d[s.key]).filter((v): v is number => v !== null);
    const ticks = niceTicks(Math.min(...vals), Math.max(...vals), 4);
    const lo = ticks[0];
    const hi = ticks[ticks.length - 1];
    const y = (v: number) => PAD.t + (1 - (v - lo) / (hi - lo)) * (H - PAD.t - PAD.b);
    return { ticks, y };
  };
  const sa = scale(a);
  const sb = scale(b);
  const pts = (s: Series, sc: { y: (v: number) => number }) =>
    demand.filter((d) => d[s.key] !== null).map((d) => ({ x: x(d.year), y: sc.y(d[s.key] as number), year: d.year }));
  const pa = pts(a, sa);
  const pb = pts(b, sb);
  const ink = "hsl(var(--fig-2))";
  const grid = "hsl(var(--fig-grid))";
  const muted = "hsl(var(--muted-foreground))";
  const draw = (delay: number) =>
    reduce ? {} : { initial: { pathLength: 0 }, animate: { pathLength: drawn ? 1 : 0 }, transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] as const } };
  const hovered = hover !== null ? demand.find((d) => d.year === hover) : null;

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    let best = years[0];
    let dist = Infinity;
    for (const yr of years) {
      const d = Math.abs(x(yr) - px);
      if (d < dist) {
        dist = d;
        best = yr;
      }
    }
    setHover(dist < 30 ? best : null);
  };

  return (
    <div className="min-w-0">
      <svg viewBox={`0 0 ${W} ${H}`} className="block w-full" role="img" aria-label={label} onPointerMove={onMove} onPointerLeave={() => setHover(null)} style={{ fontFamily: "JetBrains Mono, ui-monospace, monospace", cursor: "crosshair" }}>
        {sa.ticks.map((v) => (
          <g key={`l${v}`}>
            <line x1={PAD.l} x2={W - PAD.r} y1={sa.y(v)} y2={sa.y(v)} stroke={grid} strokeWidth={1} />
            <text x={PAD.l - 6} y={sa.y(v) + 3} fontSize={9} textAnchor="end" fill={a.color}>
              {a.format(v)}
            </text>
          </g>
        ))}
        {sb.ticks.map((v) => (
          <text key={`r${v}`} x={W - PAD.r + 6} y={sb.y(v) + 3} fontSize={9} fill={b.color}>
            {b.format(v)}
          </text>
        ))}
        {years.map((yr) => (
          <text key={yr} x={x(yr)} y={H - PAD.b + 16} fontSize={9} textAnchor="middle" fill={muted}>
            {yr % 2 === 0 ? yr : ""}
          </text>
        ))}
        <motion.path d={linePath(pa)} fill="none" stroke={a.color} strokeWidth={1.5} strokeLinejoin="round" {...draw(0)} />
        <motion.path d={linePath(pb)} fill="none" stroke={b.color} strokeWidth={1.5} strokeDasharray="4 3" strokeLinejoin="round" {...draw(0.15)} />
        {[...pa.map((p) => ({ ...p, c: a.color })), ...pb.map((p) => ({ ...p, c: b.color }))].map((p, i) => (
          <motion.circle key={i} cx={p.x} cy={p.y} r={2.2} fill={p.c} initial={{ opacity: 0 }} animate={{ opacity: drawn ? 1 : 0 }} transition={{ delay: reduce ? 0 : 0.8, duration: 0.3 }} />
        ))}
        {hovered ? (
          <g pointerEvents="none">
            <line x1={x(hovered.year)} x2={x(hovered.year)} y1={PAD.t} y2={H - PAD.b} stroke={ink} strokeWidth={1} opacity={0.5} />
          </g>
        ) : null}
      </svg>
      <p className="flex flex-wrap items-center gap-x-4 gap-y-1 px-1 pt-1 font-mono text-[0.65rem] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-4" style={{ background: a.color }} /> {a.label} ({a.unit})
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-0 w-4 border-t-2 border-dashed" style={{ borderColor: b.color }} /> {b.label} ({b.unit})
        </span>
      </p>
      <p className="readout px-1 pt-1 text-[0.65rem] text-muted-foreground">
        {hovered ? (
          <>
            <span className="text-foreground">{hovered.year}</span> · {a.label} <span className="text-foreground">{hovered[a.key] === null ? "n/a" : a.format(hovered[a.key] as number)}</span> {a.unit} · {b.label}{" "}
            <span className="text-foreground">{hovered[b.key] === null ? "not recorded" : b.format(hovered[b.key] as number)}</span> {hovered[b.key] === null ? "" : b.unit}
          </>
        ) : (
          "hover a year"
        )}
      </p>
    </div>
  );
};

const DemandChart = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const reduce = useReducedMotion();
  const drawn = Boolean(reduce) || inView;
  const [hover, setHover] = useState<number | null>(null);

  const mtemp: Series = { key: "mtemp", label: "Max temperature", unit: "°F", color: "hsl(var(--fig-1))", side: "left", format: (v) => v.toFixed(0) };
  const pload: Series = { key: "pload", label: "Peak hourly load", unit: "MW", color: "hsl(var(--fig-2))", side: "right", format: (v) => v.toLocaleString("en-US", { maximumFractionDigits: 0 }) };
  const pop: Series = { key: "pop", label: "Population", unit: "people", color: "hsl(var(--fig-4))", side: "left", format: (v) => `${(v / 1000).toFixed(0)}k` };
  const tc: Series = { key: "tc", label: "Peak-month consumption", unit: "B kWh", color: "hsl(var(--fig-2))", side: "right", format: (v) => v.toFixed(2) };

  return (
    <div ref={ref} className="grid gap-8 md:grid-cols-2">
      <Figure
        label="Fig. 3"
        caption={`Annual maximum temperature against peak hourly load in Shelby County, 2012 to 2022 (2020 load not recorded). Regressing load on temperature and population projects ${projections.pload2025.toLocaleString("en-US", { minimumFractionDigits: 2 })} MW for 2025 and ${projections.pload2045[0].toLocaleString("en-US")} to ${projections.pload2045[1].toLocaleString("en-US")} MW for 2045 across ${projections.scenarios}.`}
      >
        <div className="bg-card p-3">
          <Panel a={mtemp} b={pload} label="Maximum temperature and peak hourly load by year" drawn={drawn} hover={hover} setHover={setHover} />
        </div>
      </Figure>
      <Figure
        label="Fig. 4"
        caption={`Population against total consumption in the peak summer month, 2012 to 2022. The same regression projects ${(projections.tc2025 / 1e6).toFixed(1)} million kWh for 2025 and ${(projections.tc2045[0] / 1e6).toFixed(1)} to ${(projections.tc2045[1] / 1e6).toFixed(1)} million kWh for 2045.`}
      >
        <div className="bg-card p-3">
          <Panel a={pop} b={tc} label="Population and peak-month consumption by year" drawn={drawn} hover={hover} setHover={setHover} />
        </div>
      </Figure>
    </div>
  );
};

export default DemandChart;

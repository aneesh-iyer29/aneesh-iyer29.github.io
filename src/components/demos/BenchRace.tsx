import { useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import type { DemoProps } from "./index";

/* ------------------------------------------------------------------
   Benchception result: success rate of three Qwen-8B students on the
   held-out Supply Chain Bench. The trained students do not separate
   from the untrained baseline within noise, and that tie is the finding.
   ------------------------------------------------------------------ */

interface Row {
  id: string;
  label: string;
  detail: string;
  rate: number;
  color: string;
}

const ROWS: Row[] = [
  { id: "baseline", label: "Qwen-8B", detail: "untrained baseline", rate: 45, color: "hsl(var(--fig-3))" },
  { id: "opus", label: "Qwen-8B", detail: "trained on Opus 4.8 env", rate: 45, color: "hsl(var(--fig-1))" },
  { id: "gpt", label: "Qwen-8B", detail: "trained on GPT-5.5 env", rate: 44, color: "hsl(var(--fig-4))" },
];
const NOISE = 2; // ± across seeds, in percentage points
const BASELINE = ROWS[0].rate;

const W = 640;
const ROW_H = 34;
const PAD = { l: 196, r: 40, t: 14, b: 30 };
const H = PAD.t + ROWS.length * ROW_H + PAD.b;
const X_TICKS = [0, 20, 40, 60, 80, 100];
const x = (v: number) => PAD.l + (v / 100) * (W - PAD.l - PAD.r);

const BenchRace = ({ interactive = true, className = "" }: DemoProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const reduce = useReducedMotion();
  const [hover, setHover] = useState<string | null>(null);
  const drawn = reduce || inView;

  const ink = "hsl(var(--fig-2))";
  const grid = "hsl(var(--fig-grid))";
  const label = "hsl(var(--muted-foreground))";

  return (
    <div ref={ref} className={`bg-card px-2 pb-1 pt-3 ${className}`}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="block w-full"
        role="img"
        aria-label="Bar chart: success rate on the held-out Supply Chain Bench for three Qwen-8B students, 45, 45, and 44 percent, tied within two points"
        style={{ fontFamily: "JetBrains Mono, ui-monospace, monospace" }}
      >
        {X_TICKS.map((v) => (
          <g key={v}>
            <line x1={x(v)} x2={x(v)} y1={PAD.t} y2={PAD.t + ROWS.length * ROW_H} stroke={grid} strokeWidth={1} />
            <text x={x(v)} y={PAD.t + ROWS.length * ROW_H + 16} fontSize={9} textAnchor="middle" fill={label}>
              {v}%
            </text>
          </g>
        ))}
        <text x={W - PAD.r} y={H - 4} fontSize={9} textAnchor="end" fill={label} letterSpacing={1}>
          SUCCESS RATE · SUPPLY CHAIN BENCH (HELD OUT)
        </text>

        {ROWS.map((r, i) => {
          const y = PAD.t + i * ROW_H;
          const cy = y + ROW_H / 2;
          const lit = hover === null || hover === r.id;
          return (
            <g
              key={r.id}
              opacity={lit ? 1 : 0.4}
              style={{ transition: "opacity 0.2s" }}
              onMouseEnter={interactive ? () => setHover(r.id) : undefined}
              onMouseLeave={interactive ? () => setHover(null) : undefined}
              tabIndex={interactive ? 0 : undefined}
              onFocus={interactive ? () => setHover(r.id) : undefined}
              onBlur={interactive ? () => setHover(null) : undefined}
              aria-label={interactive ? `${r.label} ${r.detail}: ${r.rate} percent, plus or minus ${NOISE}` : undefined}
            >
              <text x={PAD.l - 10} y={cy - 2} fontSize={10} textAnchor="end" fill={ink}>
                {r.label}
              </text>
              <text x={PAD.l - 10} y={cy + 10} fontSize={8.5} textAnchor="end" fill={label}>
                {r.detail}
              </text>
              <motion.rect
                x={x(0)}
                y={cy - 7}
                height={14}
                fill={r.color}
                initial={{ width: 0 }}
                animate={{ width: drawn ? x(r.rate) - x(0) : 0 }}
                transition={{ duration: reduce ? 0 : 0.8, delay: reduce ? 0 : 0.1 * i, ease: [0.22, 1, 0.36, 1] }}
              />
              {/* ± noise across seeds */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: drawn ? 1 : 0 }} transition={{ delay: reduce ? 0 : 0.7 + 0.1 * i, duration: 0.3 }}>
                <line x1={x(r.rate - NOISE)} x2={x(r.rate + NOISE)} y1={cy} y2={cy} stroke={ink} strokeWidth={1} />
                <line x1={x(r.rate - NOISE)} x2={x(r.rate - NOISE)} y1={cy - 4} y2={cy + 4} stroke={ink} strokeWidth={1} />
                <line x1={x(r.rate + NOISE)} x2={x(r.rate + NOISE)} y1={cy - 4} y2={cy + 4} stroke={ink} strokeWidth={1} />
                <text x={x(r.rate + NOISE) + 8} y={cy + 3.5} fontSize={10} fill={ink}>
                  {r.rate}%
                </text>
              </motion.g>
            </g>
          );
        })}

        {/* Baseline reference line. */}
        <motion.line
          x1={x(BASELINE)}
          x2={x(BASELINE)}
          y1={PAD.t - 4}
          y2={PAD.t + ROWS.length * ROW_H + 4}
          stroke={ink}
          strokeWidth={1}
          strokeDasharray="2 3"
          initial={{ opacity: 0 }}
          animate={{ opacity: drawn ? 1 : 0 }}
          transition={{ delay: reduce ? 0 : 1, duration: 0.3 }}
        />
      </svg>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-2 pb-1 font-mono text-[0.65rem] text-muted-foreground">
        <span>
          {hover
            ? `${ROWS.find((r) => r.id === hover)?.detail}: ${ROWS.find((r) => r.id === hover)?.rate}% ± ${NOISE}`
            : `error bars: ±${NOISE} points across seeds · dashed line: untrained baseline`}
        </span>
        <span className="text-foreground">tied within noise</span>
      </div>
    </div>
  );
};

export default BenchRace;

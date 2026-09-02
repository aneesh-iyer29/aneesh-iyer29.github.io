import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import Figure from "@/components/layout/Figure";

/* A real, if small, Kalman filter running in the browser.
   State x = [px, py, vx, vy]. A constant-velocity model is driven by a
   noisy, biased "IMU" acceleration input at 60 Hz, and corrected by
   noisy "GPS" position fixes at 6 Hz. The vehicle flies a smooth loop.
   Dropping GPS shows the estimate drift on dead reckoning and the
   covariance grow, then snap back when fixes resume. */

const DT = 1 / 60;
const GPS_EVERY = 10; // steps
const SIGMA_IMU = 0.35; // m/s^2
const SIGMA_GPS = 0.05; // m
const TRAIL = 240; // steps of history to draw (4 s)
const DROPOUT_STEPS = 150; // 2.5 s

type Vec4 = [number, number, number, number];
type Mat4 = number[][];

function gaussian(): number {
  // Box-Muller
  const u = 1 - Math.random();
  const v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function identity(): Mat4 {
  return [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ];
}

function matMul(a: number[][], b: number[][]): number[][] {
  return a.map((row) => b[0].map((_, j) => row.reduce((s, v, k) => s + v * b[k][j], 0)));
}

function transpose(a: number[][]): number[][] {
  return a[0].map((_, j) => a.map((row) => row[j]));
}

function matAdd(a: number[][], b: number[][]): number[][] {
  return a.map((row, i) => row.map((v, j) => v + b[i][j]));
}

/* Nominal flight path: a Lissajous loop in a 1 m box, so the truth is
   smooth and its acceleration is known analytically for the IMU. */
function truthAt(t: number): { p: [number, number]; v: [number, number]; a: [number, number] } {
  const wa = 0.55;
  const wb = 0.8;
  const A = 0.34;
  const B = 0.22;
  const px = 0.5 + A * Math.sin(wa * t);
  const py = 0.5 + B * Math.sin(wb * t + 0.9);
  const vx = A * wa * Math.cos(wa * t);
  const vy = B * wb * Math.cos(wb * t + 0.9);
  const ax = -A * wa * wa * Math.sin(wa * t);
  const ay = -B * wb * wb * Math.sin(wb * t + 0.9);
  return { p: [px, py], v: [vx, vy], a: [ax, ay] };
}

interface Sim {
  t: number;
  step: number;
  x: Vec4;
  P: Mat4;
  bias: [number, number];
  dropout: number;
  truthTrail: [number, number][];
  estTrail: [number, number][];
  gps: [number, number][];
  err: number;
  rms: number;
  errCount: number;
  errSum: number;
}

function makeSim(): Sim {
  const t0 = truthAt(0);
  return {
    t: 0,
    step: 0,
    x: [t0.p[0], t0.p[1], t0.v[0], t0.v[1]],
    P: [
      [0.0025, 0, 0, 0],
      [0, 0.0025, 0, 0],
      [0, 0, 0.02, 0],
      [0, 0, 0, 0.02],
    ],
    bias: [0.15, -0.1],
    dropout: 0,
    truthTrail: [],
    estTrail: [],
    gps: [],
    err: 0,
    rms: 0,
    errCount: 0,
    errSum: 0,
  };
}

function stepSim(s: Sim) {
  s.t += DT;
  s.step += 1;
  const truth = truthAt(s.t);

  // Slowly wandering IMU bias, as a real accelerometer has.
  s.bias[0] += 0.02 * gaussian() * DT;
  s.bias[1] += 0.02 * gaussian() * DT;
  const aMeas: [number, number] = [
    truth.a[0] + s.bias[0] + SIGMA_IMU * gaussian(),
    truth.a[1] + s.bias[1] + SIGMA_IMU * gaussian(),
  ];

  // Predict.
  const F: Mat4 = [
    [1, 0, DT, 0],
    [0, 1, 0, DT],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ];
  const [px, py, vx, vy] = s.x;
  s.x = [
    px + vx * DT + 0.5 * aMeas[0] * DT * DT,
    py + vy * DT + 0.5 * aMeas[1] * DT * DT,
    vx + aMeas[0] * DT,
    vy + aMeas[1] * DT,
  ];
  const q = SIGMA_IMU * SIGMA_IMU;
  const d2 = (DT * DT) / 2;
  const Q: Mat4 = [
    [q * d2 * d2, 0, q * d2 * DT, 0],
    [0, q * d2 * d2, 0, q * d2 * DT],
    [q * d2 * DT, 0, q * DT * DT, 0],
    [0, q * d2 * DT, 0, q * DT * DT],
  ];
  s.P = matAdd(matMul(matMul(F, s.P), transpose(F)), Q) as Mat4;

  // Update on a GPS fix, unless we are simulating a dropout.
  if (s.dropout > 0) s.dropout -= 1;
  if (s.step % GPS_EVERY === 0 && s.dropout === 0) {
    const z: [number, number] = [truth.p[0] + SIGMA_GPS * gaussian(), truth.p[1] + SIGMA_GPS * gaussian()];
    const H = [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
    ];
    const R = [
      [SIGMA_GPS * SIGMA_GPS, 0],
      [0, SIGMA_GPS * SIGMA_GPS],
    ];
    const PHt = matMul(s.P, transpose(H));
    const S = matAdd(matMul(H, PHt), R);
    const det = S[0][0] * S[1][1] - S[0][1] * S[1][0];
    const Sinv = [
      [S[1][1] / det, -S[0][1] / det],
      [-S[1][0] / det, S[0][0] / det],
    ];
    const K = matMul(PHt, Sinv); // 4x2
    const y = [z[0] - s.x[0], z[1] - s.x[1]];
    s.x = s.x.map((v, i) => v + K[i][0] * y[0] + K[i][1] * y[1]) as Vec4;
    const KH = matMul(K, H);
    const IKH = identity().map((row, i) => row.map((v, j) => v - KH[i][j]));
    s.P = matMul(IKH, s.P) as Mat4;
    s.gps.push(z);
    if (s.gps.length > TRAIL / GPS_EVERY) s.gps.shift();
  }

  s.truthTrail.push([truth.p[0], truth.p[1]]);
  s.estTrail.push([s.x[0], s.x[1]]);
  if (s.truthTrail.length > TRAIL) s.truthTrail.shift();
  if (s.estTrail.length > TRAIL) s.estTrail.shift();

  const ex = s.x[0] - truth.p[0];
  const ey = s.x[1] - truth.p[1];
  s.err = Math.hypot(ex, ey);
  s.errSum += ex * ex + ey * ey;
  s.errCount += 1;
  s.rms = Math.sqrt(s.errSum / s.errCount);
}

/* Draw the 2x2 position covariance as a 2-sigma ellipse. */
function covEllipse(P: Mat4): { rx: number; ry: number; angle: number } {
  const a = P[0][0];
  const b = P[0][1];
  const c = P[1][1];
  const tr = a + c;
  const det = a * c - b * b;
  const disc = Math.sqrt(Math.max(tr * tr / 4 - det, 0));
  const l1 = tr / 2 + disc;
  const l2 = tr / 2 - disc;
  const angle = Math.atan2(l1 - a, b || 1e-9);
  return { rx: 2 * Math.sqrt(Math.max(l1, 0)), ry: 2 * Math.sqrt(Math.max(l2, 0)), angle };
}

interface Colors {
  ink: string;
  accent: string;
  graphite: string;
  grid: string;
}

function readColors(el: HTMLElement): Colors {
  const cs = getComputedStyle(el);
  const v = (name: string) => `hsl(${cs.getPropertyValue(name).trim()})`;
  return { ink: v("--fig-2"), accent: v("--fig-1"), graphite: v("--fig-3"), grid: v("--fig-grid") };
}

function draw(ctx: CanvasRenderingContext2D, w: number, h: number, s: Sim, colors: Colors) {
  ctx.clearRect(0, 0, w, h);
  const pad = 18;
  const sx = (x: number) => pad + x * (w - pad * 2);
  const sy = (y: number) => h - pad - y * (h - pad * 2);

  // Hairline grid, 0.1 m.
  ctx.strokeStyle = colors.grid;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 0; i <= 10; i++) {
    const gx = sx(i / 10);
    const gy = sy(i / 10);
    ctx.moveTo(gx, sy(0));
    ctx.lineTo(gx, sy(1));
    ctx.moveTo(sx(0), gy);
    ctx.lineTo(sx(1), gy);
  }
  ctx.stroke();

  const trail = (pts: [number, number][], color: string, width: number, dash: number[] = []) => {
    if (pts.length < 2) return;
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.setLineDash(dash);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    pts.forEach(([x, y], i) => {
      if (i === 0) ctx.moveTo(sx(x), sy(y));
      else ctx.lineTo(sx(x), sy(y));
    });
    ctx.stroke();
    ctx.setLineDash([]);
  };

  // GPS fixes.
  ctx.fillStyle = colors.graphite;
  s.gps.forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(sx(x), sy(y), 2.2, 0, Math.PI * 2);
    ctx.fill();
  });

  trail(s.truthTrail, colors.ink, 1.25, [3, 4]);
  trail(s.estTrail, colors.accent, 1.75);

  // Covariance ellipse around the estimate.
  const { rx, ry, angle } = covEllipse(s.P);
  const scale = w - pad * 2;
  ctx.save();
  ctx.translate(sx(s.x[0]), sy(s.x[1]));
  ctx.rotate(-angle);
  ctx.strokeStyle = colors.accent;
  ctx.lineWidth = 1;
  ctx.setLineDash([2, 3]);
  ctx.beginPath();
  ctx.ellipse(0, 0, Math.max(rx * scale, 3), Math.max(ry * scale, 3), 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();

  // Vehicle glyph at the estimate, pointed along its velocity.
  const heading = Math.atan2(-s.x[3], s.x[2]);
  ctx.save();
  ctx.translate(sx(s.x[0]), sy(s.x[1]));
  ctx.rotate(heading);
  ctx.fillStyle = colors.accent;
  ctx.beginPath();
  ctx.moveTo(7, 0);
  ctx.lineTo(-5, 4.5);
  ctx.lineTo(-3, 0);
  ctx.lineTo(-5, -4.5);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Truth marker.
  const tp = s.truthTrail[s.truthTrail.length - 1];
  if (tp) {
    ctx.strokeStyle = colors.ink;
    ctx.lineWidth = 1.25;
    ctx.beginPath();
    ctx.arc(sx(tp[0]), sy(tp[1]), 4, 0, Math.PI * 2);
    ctx.stroke();
  }
}

const EkfFigure = ({ className = "" }: { className?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const simRef = useRef<Sim>(makeSim());
  const inView = useInView(wrapRef, { margin: "80px" });
  const reduce = useReducedMotion();
  const [readout, setReadout] = useState({ err: 0, rms: 0, sigma: 0, dropout: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const colors = readColors(wrap);

    let raf = 0;
    let last = performance.now();
    let acc = 0;
    let readoutAcc = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const { width } = wrap.getBoundingClientRect();
      const height = Math.max(200, Math.round(width * 0.62));
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(ctx, width, height, simRef.current, colors);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    resize();

    // With reduced motion, run the sim once to a steady state and draw
    // a single frame rather than animating.
    if (reduce) {
      for (let i = 0; i < TRAIL; i++) stepSim(simRef.current);
      resize();
      const s = simRef.current;
      setReadout({ err: s.err, rms: s.rms, sigma: Math.sqrt(s.P[0][0]), dropout: false });
      return () => ro.disconnect();
    }

    if (!inView) return () => ro.disconnect();

    const frame = (now: number) => {
      const elapsed = Math.min((now - last) / 1000, 0.1);
      last = now;
      acc += elapsed;
      readoutAcc += elapsed;
      const s = simRef.current;
      while (acc >= DT) {
        stepSim(s);
        acc -= DT;
      }
      const { width, height } = canvas.getBoundingClientRect();
      draw(ctx, width, height, s, colors);
      if (readoutAcc > 0.12) {
        readoutAcc = 0;
        setReadout({ err: s.err, rms: s.rms, sigma: Math.sqrt(s.P[0][0]), dropout: s.dropout > 0 });
      }
      raf = window.requestAnimationFrame(frame);
    };
    raf = window.requestAnimationFrame(frame);
    return () => {
      window.cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [inView, reduce]);

  const dropGps = () => {
    simRef.current.dropout = DROPOUT_STEPS;
  };
  const reset = () => {
    simRef.current = makeSim();
  };

  return (
    <Figure
      label="Fig. 0"
      note="live"
      className={className}
      caption={
        <>
          A Kalman filter fusing a noisy, biased IMU at 60 Hz with GPS fixes at 6 Hz. Ink: true path. Orange: estimate,
          with its 2σ covariance. Dots: GPS fixes. Drop GPS to watch dead reckoning drift and then snap back. The flight
          filter on Propulsive Landers is a 16-state version of this, in Rust.
        </>
      }
    >
      <div ref={wrapRef} className="relative w-full">
        <canvas ref={canvasRef} className="block w-full" role="img" aria-label="Animated plot of an EKF position estimate tracking a true trajectory" />
        <div className="pointer-events-none absolute left-3 top-3 grid gap-0.5 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-muted-foreground">
          <span>
            err <span className="readout text-foreground">{readout.err.toFixed(3)} m</span>
          </span>
          <span>
            rms <span className="readout text-foreground">{readout.rms.toFixed(3)} m</span>
          </span>
          <span>
            σ<sub>x</sub> <span className="readout text-foreground">{readout.sigma.toFixed(3)} m</span>
          </span>
          <span>
            gps{" "}
            <span className={`readout ${readout.dropout ? "text-accent" : "text-foreground"}`}>{readout.dropout ? "lost" : "fix"}</span>
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 border-t border-border bg-card px-3 py-2">
        <button type="button" onClick={dropGps} className="btn-secondary btn-compact" disabled={!!reduce}>
          Drop GPS 2.5 s
        </button>
        <button type="button" onClick={reset} className="btn-ghost btn-compact">
          Reset
        </button>
        <span className="ml-auto flex items-center gap-3 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-px w-3 border-t border-dashed border-foreground" /> truth
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-0.5 w-3 bg-accent" /> estimate
          </span>
        </span>
      </div>
    </Figure>
  );
};

export default EkfFigure;

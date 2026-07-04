/* Faint blueprint-style line art placed behind content sections.
   Every element is aria-hidden, pointer-events-none, and drawn in
   low-opacity strokes so it reads as texture, not content. */

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";

const INK = "hsl(var(--foreground) / 0.09)";
const INK_SOFT = "hsl(var(--foreground) / 0.055)";
const GLOW = "hsl(var(--accent) / 0.42)";
const LABEL = "hsl(var(--foreground) / 0.19)";

/* Georgia state outline (traced from the public-domain Wikimedia US map)
   with a marker on Atlanta. */
export function GeorgiaOutline({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 384 400"
      aria-hidden="true"
      className={`pointer-events-none absolute select-none ${className}`}
      fill="none"
    >
      <path
        d="M383.9,237.5 L383.9,243.1 L366.9,268.1 L362.1,269.0 L368.1,271.0 L368.1,279.0 L364.5,283.5 L362.1,307.7 L352.8,332.7 L354.8,340.7 L357.7,361.3 L343.1,362.5 L327.0,359.7 L320.2,356.0 L311.3,361.7 L311.3,371.8 L316.9,380.2 L314.9,397.6 L306.5,400.0 L302.4,395.6 L300.0,382.7 L98.0,396.0 L84.7,371.8 L81.9,362.9 L75.8,356.9 L73.8,351.2 L76.2,325.8 L66.5,302.8 L68.5,292.3 L69.8,277.4 L78.6,262.1 L77.8,257.7 L71.0,253.6 L71.0,240.7 L63.7,233.1 L52.0,208.5 L0.0,23.8 L92.3,12.1 L178.6,0.0 L178.2,7.7 L170.6,11.7 L164.9,24.6 L165.7,29.8 L190.3,45.2 L200.8,44.0 L213.3,60.1 L214.9,66.9 L231.9,87.5 L242.3,94.4 L248.0,95.2 L256.9,101.6 L261.3,110.5 L269.4,116.9 L276.6,119.0 L287.5,129.8 L287.9,135.5 L298.4,146.8 L318.5,156.0 L333.1,183.1 L334.3,194.0 L350.0,202.4 L360.1,221.8 L363.3,234.3 L380.2,235.9 L383.9,237.5 Z"
        stroke={INK}
        strokeWidth="1.5"
      />
      {/* Atlanta */}
      <circle cx="98" cy="108" r="3" fill={GLOW} />
      <circle cx="98" cy="108" r="9" stroke={GLOW} strokeWidth="1" className="decor-pulse" />
      <line x1="110" y1="108" x2="148" y2="108" stroke={LABEL} strokeWidth="1" strokeDasharray="2 4" />
      <text x="154" y="111" fontFamily="IBM Plex Mono, monospace" fontSize="10" letterSpacing="0.14em" fill={LABEL}>
        ATL 33.7N 84.4W
      </text>
    </svg>
  );
}

/* The monoprop vehicle alone, so it can be animated along the descent path.
   `bright` is for the page-following lander, which should read clearly. */
export function LanderVehicle({ className = "", bright = false }: { className?: string; bright?: boolean }) {
  const body = bright ? "hsl(var(--foreground) / 0.32)" : INK;
  const plume = bright ? "hsl(var(--accent) / 0.65)" : GLOW;
  return (
    <svg viewBox="0 0 148 190" aria-hidden="true" className={`pointer-events-none select-none ${className}`} fill="none">
      <g stroke={body} strokeWidth="1.5">
        {/* nose cone */}
        <path d="M54,28 C54,12 74,4 94,28" />
        {/* fuselage */}
        <path d="M54,28 L50,128 L98,128 L94,28 Z" />
        {/* window / sensor ring */}
        <circle cx="74" cy="56" r="7" />
        <line x1="50" y1="90" x2="98" y2="90" />
        {/* engine bell */}
        <path d="M64,128 L58,152 L72,148 M84,128 L92,152 L78,148" />
        <path d="M58,152 C64,158 84,158 92,152" />
        {/* landing legs */}
        <path d="M54,112 L20,172 M20,172 L10,172 M20,172 L30,172" />
        <path d="M94,112 L128,172 M128,172 L118,172 M128,172 L138,172" />
      </g>
      {/* thrust plume */}
      <g stroke={plume} strokeWidth="1.2" className="decor-flicker">
        <line x1="75" y1="164" x2="75" y2="184" strokeDasharray="2 5" />
        <line x1="64" y1="162" x2="60" y2="178" strokeDasharray="2 6" />
        <line x1="86" y1="162" x2="90" y2="178" strokeDasharray="2 6" />
      </g>
    </svg>
  );
}

/* The page-following lander: fades in after the hero, glides down a dashed
   flight line that weaves across the page, and touches down on the border
   above the final (contact) section. Sized for a 72px vehicle; the anchor
   offsets below assume that width (center +36,+46; feet +84). */
const FLIGHT_PATH = [
  { t: 0.0, x: 0.8, y: 0.3, r: 0 },
  { t: 0.22, x: 0.66, y: 0.48, r: -5 },
  { t: 0.44, x: 0.18, y: 0.4, r: -10 },
  { t: 0.62, x: 0.3, y: 0.54, r: 4 },
  { t: 0.8, x: 0.72, y: 0.42, r: 8 },
  { t: 0.92, x: 0.55, y: 0.46, r: -4 },
  { t: 1.0, x: 0.5, y: 0.5, r: 0 },
];
const smooth = (f: number) => f * f * (3 - 2 * f);

type FlightMetrics = { start: number; end: number; landY: number; vw: number; vh: number };

/* Shared by the rocket and the drawn trail, so they always agree.
   Returns the pose in DOCUMENT space (yDoc is the vehicle center's document
   y); the rocket converts to viewport space by subtracting the live scroll. */
function flightPose(sy: number, m: FlightMetrics) {
  const t = Math.min(1, Math.max(0, (sy - m.start) / Math.max(1, m.end - m.start)));
  let i = 0;
  while (i < FLIGHT_PATH.length - 2 && t > FLIGHT_PATH[i + 1].t) i++;
  const a = FLIGHT_PATH[i];
  const b = FLIGHT_PATH[i + 1];
  const e = smooth(Math.min(1, Math.max(0, (t - a.t) / Math.max(1e-6, b.t - a.t))));
  let x = (a.x + (b.x - a.x) * e) * m.vw - 36;
  let yDoc = (a.y + (b.y - a.y) * e) * m.vh + sy;
  let r = a.r + (b.r - a.r) * e;
  // Final approach: converge on the landing line, then stay anchored to it.
  const lb = Math.min(1, Math.max(0, (t - 0.84) / 0.16));
  if (lb > 0) {
    const lbe = smooth(lb);
    const landX = 0.5 * m.vw - 36;
    const landYDoc = m.landY - 38; // vehicle center when feet sit on the border
    x += (landX - x) * lbe;
    yDoc += (landYDoc - yDoc) * lbe;
    r *= 1 - lbe;
  }
  return { x, yDoc, r, t };
}

export function PageLander() {
  const { scrollY } = useScroll();
  const prefersReducedMotion = useReducedMotion();
  const metrics = useRef<FlightMetrics>({ start: 400, end: 4000, landY: 5000, vw: 1280, vh: 800 });
  const [trail, setTrail] = useState<{ d: string; w: number; h: number } | null>(null);

  useEffect(() => {
    const measure = () => {
      const hero = document.getElementById("hero");
      const contact = document.getElementById("contact");
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const contactTop = contact ? contact.offsetTop : document.documentElement.scrollHeight - vh;
      const m: FlightMetrics = {
        start: hero ? hero.offsetHeight - vh * 0.5 : vh * 0.5,
        // The flight completes while the landing line is still mid-viewport;
        // after that the rocket is part of the page and scrolls with it.
        end: Math.max(1, contactTop - vh * 0.62),
        landY: contactTop,
        vw,
        vh,
      };
      metrics.current = m;
      // Trace the same pose math into a document-space dashed trail.
      const pts: string[] = [];
      const steps = 90;
      for (let s = 0; s <= steps; s++) {
        const t = s / steps;
        const sy = m.start + t * (m.end - m.start);
        const p = flightPose(sy, m);
        pts.push(`${(p.x + 36).toFixed(1)},${p.yDoc.toFixed(1)}`);
      }
      setTrail({ d: `M${pts.join(" L")}`, w: vw, h: contactTop });
    };
    measure();
    window.addEventListener("resize", measure);
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    return () => {
      window.removeEventListener("resize", measure);
      ro.disconnect();
    };
  }, []);

  // Smooth the *progress along the line* (one scalar), then evaluate the
  // exact path pose from it: the rocket's document position is always a
  // point on the drawn trail, just eased along it.
  const pathSy = useSpring(scrollY, { stiffness: 30, damping: 19, mass: 1 });
  const sx = useTransform(pathSy, (sp) => flightPose(sp, metrics.current).x);
  const sySpring = useTransform(
    [pathSy, scrollY],
    ([sp, sn]: number[]) => flightPose(sp, metrics.current).yDoc - 46 - sn
  );
  const sRotate = useTransform(pathSy, (sp) => flightPose(sp, metrics.current).r);
  const opacity = useTransform(pathSy, (v) => {
    const m = metrics.current;
    return Math.min(1, Math.max(0, (v - (m.start - 180)) / 180));
  });
  const landed = useTransform(pathSy, (v) => (flightPose(v, metrics.current).t >= 0.995 ? 1 : 0));
  const label = useTransform(pathSy, (v) => {
    const { t } = flightPose(v, metrics.current);
    return t >= 0.995
      ? "TOUCHDOWN CONFIRMED"
      : `DESCENT · ALT ${Math.max(0, Math.round((1 - t) * 12400)).toLocaleString()}M`;
  });
  const labelColor = useTransform(landed, (l) => (l ? "hsl(var(--accent) / 0.85)" : "hsl(var(--foreground) / 0.45)"));

  if (prefersReducedMotion) return null;

  return (
    <>
      {/* The dashed flight line, drawn in document space behind the content. */}
      {trail && (
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 z-0 hidden select-none lg:block"
          width="100%"
          height={trail.h}
          viewBox={`0 0 ${trail.w} ${trail.h}`}
          preserveAspectRatio="none"
          fill="none"
        >
          <path
            d={trail.d}
            stroke="hsl(var(--foreground) / 0.09)"
            strokeWidth="1.2"
            strokeDasharray="4 10"
            className="decor-flow"
          />
        </svg>
      )}

      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-0 hidden lg:block"
        style={{ x: sx, y: sySpring, opacity }}
      >
        <motion.div style={{ rotate: sRotate }}>
          <LanderVehicle bright className="w-[72px]" />
        </motion.div>
      </motion.div>

      {/* Corner telemetry, synced to the rocket's flight. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed bottom-5 right-6 z-40 hidden items-center gap-2 md:flex"
      >
        <span className="size-1.5 rounded-full bg-accent decor-pulse" />
        <motion.span
          className="font-mono text-[0.62rem] uppercase tracking-[0.18em]"
          style={{ color: labelColor }}
        >
          {label}
        </motion.span>
      </div>
    </>
  );
}

/* The classic agent-environment reinforcement-learning loop. */
export function RLLoop({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 340 220"
      aria-hidden="true"
      className={`pointer-events-none absolute select-none ${className}`}
      fill="none"
    >
      <rect x="20" y="20" width="120" height="48" rx="6" stroke={INK} strokeWidth="1.5" />
      <text x="80" y="48" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="11" letterSpacing="0.18em" fill={LABEL}>
        AGENT
      </text>
      <rect x="200" y="150" width="120" height="48" rx="6" stroke={INK} strokeWidth="1.5" />
      <text x="260" y="178" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="11" letterSpacing="0.18em" fill={LABEL}>
        ENV
      </text>
      {/* action: agent -> env */}
      <path
        d="M150,44 C230,44 260,80 260,142"
        stroke={INK}
        strokeWidth="1.2"
        strokeDasharray="4 8"
        className="decor-flow"
        markerEnd="url(#decorArrow)"
      />
      <text x="238" y="66" fontFamily="IBM Plex Mono, monospace" fontSize="9" letterSpacing="0.12em" fill={INK}>
        action
      </text>
      {/* state, reward: env -> agent */}
      <path
        d="M192,174 C100,174 80,140 80,76"
        stroke={GLOW}
        strokeWidth="1.2"
        opacity="0.5"
        strokeDasharray="4 8"
        className="decor-flow"
        markerEnd="url(#decorArrowAccent)"
      />
      <text x="34" y="150" fontFamily="IBM Plex Mono, monospace" fontSize="9" letterSpacing="0.12em" fill={LABEL}>
        state, reward
      </text>
      <defs>
        <marker id="decorArrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6" stroke={INK} strokeWidth="1" fill="none" />
        </marker>
        <marker id="decorArrowAccent" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6" stroke={GLOW} strokeWidth="1" fill="none" />
        </marker>
      </defs>
    </svg>
  );
}

/* PCB-style right-angle traces with via pads. */
export function CircuitTrace({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 420 200"
      aria-hidden="true"
      className={`pointer-events-none absolute select-none ${className}`}
      fill="none"
    >
      <g stroke={INK} strokeWidth="1.2">
        <path d="M0,40 H90 L120,70 H210" />
        <path d="M0,90 H60 L100,130 H160 L190,160 H300" />
        <path d="M0,140 H36 L70,174 H120" />
        <path d="M210,70 L250,30 H340" />
      </g>
      <g fill="hsl(var(--background))" stroke={INK} strokeWidth="1.2">
        <circle cx="210" cy="70" r="4" />
        <circle cx="300" cy="160" r="4" />
        <circle cx="120" cy="174" r="4" />
        <circle cx="340" cy="30" r="4" />
      </g>
      <circle cx="340" cy="30" r="1.5" fill={GLOW} className="decor-pulse" />
      <circle cx="300" cy="160" r="1.5" fill={GLOW} className="decor-pulse" />
    </svg>
  );
}

/* A small constellation: faint points joined by hairlines, one star lit. */
export function Constellation({ className = "" }: { className?: string }) {
  const pts: Array<[number, number]> = [
    [20, 150],
    [70, 96],
    [128, 118],
    [172, 52],
    [216, 84],
    [252, 24],
  ];
  return (
    <svg
      viewBox="0 0 270 170"
      aria-hidden="true"
      className={`pointer-events-none absolute select-none ${className}`}
      fill="none"
    >
      <path
        d={`M${pts.map((p) => p.join(",")).join(" L")}`}
        stroke={INK}
        strokeWidth="1"
      />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2" fill={i === 3 ? GLOW : INK} />
      ))}
      <circle cx="172" cy="52" r="7" stroke={GLOW} strokeWidth="1" className="decor-pulse" />
      {/* an occasional meteor streaking past */}
      <line x1="30" y1="36" x2="58" y2="22" stroke={GLOW} strokeWidth="1" className="decor-comet" />
    </svg>
  );
}

/* PID step response: dashed setpoint, overshoot, settle. */
export function StepResponse({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 190"
      aria-hidden="true"
      className={`pointer-events-none absolute select-none ${className}`}
      fill="none"
    >
      {/* axes */}
      <path d="M30,16 V160 H304" stroke={INK} strokeWidth="1.2" />
      {/* setpoint */}
      <line x1="30" y1="66" x2="304" y2="66" stroke={INK} strokeWidth="1" strokeDasharray="4 6" />
      {/* response curve: rise, overshoot, ring down, settle */}
      <path
        d="M30,160 C60,160 68,52 92,44 C110,38 118,84 138,80 C154,77 158,60 174,62 C190,64 198,70 216,67 C248,63 272,66 304,66"
        stroke={GLOW}
        strokeWidth="1.4"
        opacity="0.5"
      />
      <text x="238" y="56" fontFamily="IBM Plex Mono, monospace" fontSize="9" letterSpacing="0.12em" fill={INK}>
        setpoint
      </text>
      <text x="30" y="180" fontFamily="IBM Plex Mono, monospace" fontSize="9" letterSpacing="0.14em" fill={INK}>
        PID STEP RESPONSE · 8 METRICS/RUN
      </text>
    </svg>
  );
}

/* Small drafting crosses that sit in section corners. */
export function DraftMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`pointer-events-none absolute size-6 select-none ${className}`}
      fill="none"
    >
      <path d="M12,2 V22 M2,12 H22" stroke={INK_SOFT} strokeWidth="1.5" />
    </svg>
  );
}

/* A dashed orbit with a satellite tracing it (native SVG motion, no JS). */
export function OrbitSat({ className = "" }: { className?: string }) {
  const orbit = "M110,14 A96,42 0 1,1 109.9,14 Z";
  return (
    <svg
      viewBox="0 0 220 112"
      aria-hidden="true"
      className={`decor-kinetic pointer-events-none absolute select-none ${className}`}
      fill="none"
    >
      <path d={orbit} stroke={INK} strokeWidth="1" strokeDasharray="3 7" transform="rotate(-14 110 56)" />
      <g transform="rotate(-14 110 56)">
        <g>
          <circle r="2.5" fill={GLOW} />
          <circle r="6" stroke={GLOW} strokeWidth="0.8" className="decor-pulse" />
          <animateMotion dur="16s" repeatCount="indefinite" path={orbit} />
        </g>
      </g>
    </svg>
  );
}

/* A noisy sensor channel trace. */
export function Waveform({ label = "IMU CH-01", className = "" }: { label?: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 260 84"
      aria-hidden="true"
      className={`pointer-events-none absolute select-none ${className}`}
      fill="none"
    >
      <line x1="0" y1="40" x2="260" y2="40" stroke={INK_SOFT} strokeWidth="1" strokeDasharray="2 6" />
      <path
        d="M0,40 C10,40 14,18 24,18 S38,62 48,62 62,22 72,22 86,54 96,54 110,14 120,14 134,60 144,60 158,26 168,26 182,50 192,50 206,20 216,20 230,56 240,56 254,40 260,40"
        stroke={INK}
        strokeWidth="1.3"
      />
      <circle cx="120" cy="14" r="2" fill={GLOW} className="decor-pulse" />
      <text x="0" y="80" fontFamily="IBM Plex Mono, monospace" fontSize="9" letterSpacing="0.14em" fill={INK}>
        {label}
      </text>
    </svg>
  );
}

/* A normal distribution with its mean marked: the M3 statistics motif. */
export function NormalCurve({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 220 116"
      aria-hidden="true"
      className={`pointer-events-none absolute select-none ${className}`}
      fill="none"
    >
      <path d="M8,92 C50,92 62,16 110,16 C158,16 170,92 212,92" stroke={INK} strokeWidth="1.3" />
      <line x1="110" y1="16" x2="110" y2="92" stroke={INK_SOFT} strokeWidth="1" strokeDasharray="3 6" />
      <line x1="8" y1="92" x2="212" y2="92" stroke={INK} strokeWidth="1" />
      {[74, 146].map((x) => (
        <line key={x} x1={x} y1="88" x2={x} y2="96" stroke={INK} strokeWidth="1" />
      ))}
      <circle cx="110" cy="16" r="2" fill={GLOW} className="decor-pulse" />
      <text x="8" y="110" fontFamily="IBM Plex Mono, monospace" fontSize="9" letterSpacing="0.14em" fill={INK}>
        BACKWARD SELECTION · 4 FEATURES
      </text>
    </svg>
  );
}

/* A Caesar shift mid-decryption: the Codebusters motif. */
export function CipherStrip({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 220 62"
      aria-hidden="true"
      className={`pointer-events-none absolute select-none ${className}`}
      fill="none"
    >
      <text x="0" y="12" fontFamily="IBM Plex Mono, monospace" fontSize="11" letterSpacing="0.22em" fill={LABEL}>
        WKH URFNHW
      </text>
      <path d="M10,22 L10,34" stroke={GLOW} strokeWidth="1" markerEnd="url(#cipherArw)" opacity="0.7" />
      <text x="20" y="32" fontFamily="IBM Plex Mono, monospace" fontSize="8" letterSpacing="0.16em" fill={INK}>
        CAESAR −3
      </text>
      <text x="0" y="54" fontFamily="IBM Plex Mono, monospace" fontSize="11" letterSpacing="0.22em" fill={LABEL}>
        THE ROCKET
      </text>
      <defs>
        <marker id="cipherArw" markerWidth="7" markerHeight="7" refX="3" refY="5" orient="auto">
          <path d="M0,0 L3,6 L6,0" stroke={GLOW} strokeWidth="1" fill="none" />
        </marker>
      </defs>
    </svg>
  );
}

/* A ground-station dish with signal arcs. */
export function GroundStation({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 140 116"
      aria-hidden="true"
      className={`pointer-events-none absolute select-none ${className}`}
      fill="none"
    >
      <line x1="24" y1="100" x2="112" y2="100" stroke={INK} strokeWidth="1.2" strokeDasharray="6 6" />
      <line x1="60" y1="100" x2="60" y2="76" stroke={INK} strokeWidth="1.3" />
      <path d="M40,56 A28,28 0 0,0 82,84" stroke={INK} strokeWidth="1.3" />
      <line x1="61" y1="70" x2="88" y2="48" stroke={INK} strokeWidth="1" />
      <circle cx="88" cy="48" r="2.5" stroke={INK} strokeWidth="1" />
      <g stroke={GLOW} strokeWidth="1" className="decor-flicker">
        <path d="M96,42 a9,9 0 0,1 9,9" />
        <path d="M101,35 a16,16 0 0,1 16,16" />
        <path d="M106,28 a23,23 0 0,1 23,23" />
      </g>
    </svg>
  );
}

/* Snapped block outlines: the Build canvas motif. */
export function BlockStack({ className = "" }: { className?: string }) {
  const tab = (x: number, y: number, stroke: string) => (
    <rect x={x} y={y} width="22" height="6" rx="2" stroke={stroke} strokeWidth="1.2" />
  );
  return (
    <svg
      viewBox="0 0 180 118"
      aria-hidden="true"
      className={`pointer-events-none absolute select-none ${className}`}
      fill="none"
    >
      {tab(26, 6, INK)}
      <rect x="10" y="12" width="122" height="26" rx="5" stroke={INK} strokeWidth="1.3" />
      <text x="24" y="29" fontFamily="IBM Plex Mono, monospace" fontSize="9" letterSpacing="0.16em" fill={INK}>
        ENVIRONMENT
      </text>
      {tab(42, 38, INK)}
      <rect x="26" y="44" width="134" height="26" rx="5" stroke={INK} strokeWidth="1.3" />
      <text x="40" y="61" fontFamily="IBM Plex Mono, monospace" fontSize="9" letterSpacing="0.16em" fill={INK}>
        TASK · SCORING
      </text>
      {tab(26, 70, GLOW)}
      <rect x="10" y="76" width="112" height="26" rx="5" stroke={GLOW} strokeWidth="1.2" opacity="0.75" />
      <text x="24" y="93" fontFamily="IBM Plex Mono, monospace" fontSize="9" letterSpacing="0.16em" fill={GLOW}>
        TRAIN · AUTO
      </text>
    </svg>
  );
}

/* A tiny eval bar chart. */
export function TelemetryBars({ className = "" }: { className?: string }) {
  const bars: Array<[number, number, boolean?]> = [
    [16, 24],
    [36, 44],
    [56, 32],
    [76, 58, true],
    [96, 38],
  ];
  return (
    <svg
      viewBox="0 0 124 96"
      aria-hidden="true"
      className={`pointer-events-none absolute select-none ${className}`}
      fill="none"
    >
      {bars.map(([x, h, hot]) => (
        <rect
          key={x}
          x={x}
          y={78 - h}
          width="12"
          height={h}
          stroke={hot ? GLOW : INK}
          strokeWidth="1.2"
          fill={hot ? "hsl(var(--accent) / 0.08)" : "none"}
        />
      ))}
      <line x1="8" y1="78" x2="116" y2="78" stroke={INK} strokeWidth="1.2" />
      <text x="8" y="92" fontFamily="IBM Plex Mono, monospace" fontSize="9" letterSpacing="0.14em" fill={INK}>
        BEST@K
      </text>
    </svg>
  );
}

/* A faint column of hex, like a memory dump. */
export function HexColumn({ className = "" }: { className?: string }) {
  const rows = ["0x1F 4A C3", "0x07 B2 91", "0xD4 33 0E", "0x6C F8 2B", "0xA0 15 77"];
  return (
    <svg
      viewBox="0 0 110 100"
      aria-hidden="true"
      className={`pointer-events-none absolute select-none ${className}`}
      fill="none"
    >
      {rows.map((r, i) => (
        <text
          key={r}
          x="0"
          y={14 + i * 19}
          fontFamily="IBM Plex Mono, monospace"
          fontSize="10"
          letterSpacing="0.1em"
          fill={i === 2 ? LABEL : INK}
        >
          {r}
        </text>
      ))}
    </svg>
  );
}

/* A radar scope with a sweeping beam and one pinging blip. */
export function RadarSweep({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      aria-hidden="true"
      className={`decor-kinetic pointer-events-none absolute select-none ${className}`}
      fill="none"
    >
      <circle cx="60" cy="60" r="54" stroke={INK} strokeWidth="1.2" />
      <circle cx="60" cy="60" r="34" stroke={INK} strokeWidth="1" strokeDasharray="2 6" />
      <circle cx="60" cy="60" r="14" stroke={INK} strokeWidth="1" />
      <line x1="6" y1="60" x2="114" y2="60" stroke={INK_SOFT} strokeWidth="1" />
      <line x1="60" y1="6" x2="60" y2="114" stroke={INK_SOFT} strokeWidth="1" />
      <g>
        <line x1="60" y1="60" x2="60" y2="9" stroke={GLOW} strokeWidth="1.2" opacity="0.55" />
        <animateTransform attributeName="transform" type="rotate" from="0 60 60" to="360 60 60" dur="7s" repeatCount="indefinite" />
      </g>
      <circle cx="86" cy="42" r="2" fill={GLOW} className="decor-pulse" />
    </svg>
  );
}

/* Two slowly counter-rotating gimbal rings. */
export function GimbalRings({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 160"
      aria-hidden="true"
      className={`decor-kinetic pointer-events-none absolute select-none ${className}`}
      fill="none"
    >
      <g>
        <ellipse cx="80" cy="80" rx="70" ry="26" stroke={INK} strokeWidth="1" strokeDasharray="4 8" />
        <animateTransform attributeName="transform" type="rotate" from="0 80 80" to="360 80 80" dur="46s" repeatCount="indefinite" />
      </g>
      <g>
        <ellipse cx="80" cy="80" rx="26" ry="70" stroke={INK} strokeWidth="1" strokeDasharray="4 8" />
        <animateTransform attributeName="transform" type="rotate" from="0 80 80" to="-360 80 80" dur="62s" repeatCount="indefinite" />
      </g>
      <circle cx="80" cy="80" r="2.5" fill={GLOW} className="decor-pulse" />
    </svg>
  );
}

/* Dust motes drifting across the whole page, between the grid and content. */
const PARTICLES: Array<{ t: number; l: number; s: number; d: number; delay: number; accent?: boolean }> = [
  { t: 12, l: 8, s: 2, d: 11, delay: 0 },
  { t: 22, l: 88, s: 1.5, d: 14, delay: 3 },
  { t: 30, l: 46, s: 2, d: 16, delay: 6 },
  { t: 38, l: 16, s: 1.5, d: 12, delay: 9 },
  { t: 44, l: 72, s: 2.5, d: 18, delay: 2, accent: true },
  { t: 52, l: 30, s: 1.5, d: 13, delay: 5 },
  { t: 58, l: 92, s: 2, d: 15, delay: 8 },
  { t: 64, l: 6, s: 2, d: 17, delay: 1 },
  { t: 70, l: 54, s: 1.5, d: 12, delay: 4 },
  { t: 76, l: 82, s: 2, d: 14, delay: 7, accent: true },
  { t: 82, l: 24, s: 1.5, d: 16, delay: 10 },
  { t: 88, l: 64, s: 2, d: 13, delay: 3 },
  { t: 18, l: 62, s: 1.5, d: 15, delay: 11 },
  { t: 48, l: 12, s: 1.5, d: 19, delay: 6 },
  { t: 92, l: 40, s: 2, d: 14, delay: 2 },
  { t: 8, l: 34, s: 1.5, d: 17, delay: 8 },
];

export function FieldParticles() {
  return (
    <div aria-hidden="true" className="fixed inset-0 z-0 pointer-events-none">
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="particle"
          style={{
            top: `${p.t}%`,
            left: `${p.l}%`,
            width: p.s,
            height: p.s,
            animationDuration: `${p.d}s`,
            animationDelay: `-${p.delay}s`,
            background: p.accent ? "hsl(var(--accent) / 0.55)" : "hsl(var(--foreground) / 0.4)",
          }}
        />
      ))}
    </div>
  );
}

/* Hairline meteors that cross the viewport every so often. */
export function PageComets() {
  return (
    <div aria-hidden="true" className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div className="page-comet" style={{ top: "16%", animationDuration: "14s", animationDelay: "2s" }} />
      <div className="page-comet" style={{ top: "56%", animationDuration: "23s", animationDelay: "9s" }} />
    </div>
  );
}

/* Full-page blueprint grid that drifts slightly against the scroll. */
export function BlueprintGrid() {
  const { scrollY } = useScroll();
  const backgroundPositionY = useTransform(scrollY, (v) => `${v * -0.05}px`);
  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none"
      style={{
        backgroundPositionY,
        backgroundImage:
          "linear-gradient(hsl(var(--foreground) / 0.016) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground) / 0.016) 1px, transparent 1px)",
        backgroundSize: "56px 56px",
      }}
    />
  );
}

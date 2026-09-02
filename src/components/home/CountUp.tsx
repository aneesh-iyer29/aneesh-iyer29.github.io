import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/* Counts a display string up when scrolled into view. Handles values like
   "1st", "0.14%", "300+", "$20K" by animating only the leading number and
   keeping prefix/suffix text fixed. */
const CountUp = ({ value, duration = 1100, className = "" }: { value: string; duration?: number; className?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduce = useReducedMotion();
  const [text, setText] = useState(value);

  useEffect(() => {
    const match = value.match(/^([^0-9]*)(\d+(?:\.\d+)?)(.*)$/);
    if (!match || reduce) {
      setText(value);
      return;
    }
    const [, prefix, num, suffix] = match;
    const target = parseFloat(num);
    const decimals = (num.split(".")[1] ?? "").length;
    if (!inView) {
      setText(`${prefix}${(0).toFixed(decimals)}${suffix}`);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setText(`${prefix}${(target * eased).toFixed(decimals)}${suffix}`);
      if (p < 1) raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [inView, value, duration, reduce]);

  return (
    <span ref={ref} className={`readout ${className}`}>
      {text}
    </span>
  );
};

export default CountUp;

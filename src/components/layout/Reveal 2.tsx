import { motion, useReducedMotion } from "framer-motion";
import type { PropsWithChildren } from "react";

interface RevealProps {
  delay?: number;
  className?: string;
  /** Distance to travel in px. */
  y?: number;
  as?: "div" | "li" | "article";
}

/* One quiet fade-and-rise when an element scrolls into view. Runs once. */
const Reveal = ({ children, delay = 0, className, y = 14, as = "div" }: PropsWithChildren<RevealProps>) => {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={reduce ? { opacity: 1 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Tag>
  );
};

export default Reveal;

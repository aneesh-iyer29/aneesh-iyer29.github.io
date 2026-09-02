import { useId, useRef, useState, type KeyboardEvent } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import type { DemoProps } from "./index";

/* ------------------------------------------------------------------
   A Build block tree and the plain-language spec it compiles to.
   Left: nested outlined blocks with colored tabs, the way Build nests
   them by construction. Right: the spec as one paragraph, one sentence
   per block. With `interactive`, hovering or focusing a block traces
   it to its sentence, and hovering a sentence traces it back.
   ------------------------------------------------------------------ */

type NodeId = "environment" | "task" | "question" | "scoring" | "good" | "bad" | "tool" | "train";
type Tone = "ink" | "accent" | "teal" | "graphite";

interface BlockNode {
  id: NodeId;
  label: string;
  /** Short plain-language text shown on the block itself. */
  blurb: string;
  /** The sentence this block compiles to. */
  sentence: string;
  tone: Tone;
  children?: BlockNode[];
}

const TREE: BlockNode = {
  id: "environment",
  label: "Environment",
  blurb: "warehouse picker",
  sentence: "The environment is a warehouse in which a picker robot walks the aisles to fill orders.",
  tone: "ink",
  children: [
    {
      id: "task",
      label: "Task",
      blurb: "fill the order",
      sentence: "In each episode the agent must pick every bin on the order without wasted walking.",
      tone: "accent",
      children: [
        {
          id: "question",
          label: "Question",
          blurb: "which bins, in what order?",
          sentence: "It is asked which bins to visit and in what sequence.",
          tone: "accent",
        },
        {
          id: "scoring",
          label: "Scoring",
          blurb: "grader",
          sentence: "A grader scores the episode:",
          tone: "accent",
          children: [
            {
              id: "good",
              label: "Good",
              blurb: "all bins, short path",
              sentence: "good if every bin is picked and the path is within 1.2x of optimal,",
              tone: "accent",
            },
            {
              id: "bad",
              label: "Bad",
              blurb: "missed bin or collision",
              sentence: "bad if a bin is missed, the robot collides, or time runs out.",
              tone: "accent",
            },
          ],
        },
      ],
    },
    {
      id: "tool",
      label: "Tool",
      blurb: "warehouse.step(action)",
      sentence: "The agent acts through one tool, warehouse.step(action), which returns the observation, reward, and done flag.",
      tone: "teal",
    },
    {
      id: "train",
      label: "Train",
      blurb: "GRPO · Qwen-8B · 200 steps",
      sentence: "Training runs GRPO on a Qwen-8B student for 200 steps with 8 rollouts per prompt.",
      tone: "graphite",
    },
  ],
};

/* Depth-first order, which is also the order of sentences in the spec. */
function flatten(node: BlockNode, depth = 0): { node: BlockNode; depth: number }[] {
  return [{ node, depth }, ...(node.children ?? []).flatMap((child) => flatten(child, depth + 1))];
}
const NODES = flatten(TREE);

const TAB_CLASS: Record<Tone, string> = {
  ink: "bg-foreground",
  accent: "bg-accent",
  teal: "bg-[hsl(var(--fig-4))]",
  graphite: "bg-[hsl(var(--fig-3))]",
};

interface BlockProps {
  node: BlockNode;
  depth: number;
  index: number;
  active: NodeId | null;
  interactive: boolean;
  drawn: boolean;
  reduce: boolean;
  specId: (id: NodeId) => string;
  onActivate: (id: NodeId | null) => void;
}

const Block = ({ node, depth, index, active, interactive, drawn, reduce, specId, onActivate }: BlockProps) => {
  const isActive = active === node.id;
  const dimmed = active !== null && !isActive;
  const leaf = !node.children;
  const handlers = interactive
    ? {
        onMouseEnter: () => onActivate(node.id),
        onMouseLeave: () => onActivate(null),
        onFocus: () => onActivate(node.id),
        onBlur: () => onActivate(null),
        onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => {
          if (e.key === "Escape") onActivate(null);
        },
        tabIndex: 0,
        "aria-describedby": specId(node.id),
      }
    : {};
  return (
    <motion.div
      className={`relative rounded-md border bg-card transition-colors ${isActive ? "border-foreground/50" : "border-border"} ${leaf ? "py-1.5" : "pb-1.5 pt-1.5"} pl-3.5 pr-2`}
      initial={false}
      animate={{ opacity: drawn ? (dimmed ? 0.45 : 1) : 0, y: drawn ? 0 : 6 }}
      transition={{ duration: reduce ? 0 : 0.5, ease: "easeOut", delay: reduce || !drawn ? 0 : index * 0.06 }}
      role={interactive ? "group" : undefined}
      aria-label={interactive ? `${node.label} block: ${node.blurb}` : undefined}
      {...handlers}
    >
      <span className={`absolute left-0 top-0 h-full w-[3px] rounded-l-md ${TAB_CLASS[node.tone]} ${depth > 1 ? "opacity-60" : ""}`} aria-hidden="true" />
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <span className={`font-mono text-[0.62rem] font-medium uppercase tracking-[0.14em] ${isActive ? "text-accent" : "text-foreground"}`}>{node.label}</span>
        <span className="font-mono text-[0.64rem] text-muted-foreground">{node.blurb}</span>
      </div>
      {node.children && (
        <div className={`mt-1.5 flex flex-col gap-1.5 ${depth === 0 ? "" : ""}`}>
          {node.children.map((child) => (
            <Block
              key={child.id}
              node={child}
              depth={depth + 1}
              index={NODES.findIndex((n) => n.node.id === child.id)}
              active={active}
              interactive={interactive}
              drawn={drawn}
              reduce={reduce}
              specId={specId}
              onActivate={onActivate}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

const BuildCanvas = ({ interactive = true, compact = false, className = "" }: DemoProps) => {
  const reduce = Boolean(useReducedMotion());
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { amount: 0.25, once: true });
  const [active, setActive] = useState<NodeId | null>(null);
  const uid = useId();
  const specId = (id: NodeId) => `${uid}-spec-${id}`;
  const drawn = reduce || inView;

  return (
    <div ref={rootRef} className={`grid gap-4 p-4 ${compact ? "min-h-[18rem]" : "min-h-[20rem] md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]"} ${className}`}>
      <div className="flex flex-col gap-2">
        <span className="eyebrow text-[0.62rem]">block tree</span>
        <Block node={TREE} depth={0} index={0} active={active} interactive={interactive} drawn={drawn} reduce={reduce} specId={specId} onActivate={setActive} />
      </div>

      <div className="flex flex-col gap-2">
        <span className="eyebrow text-[0.62rem]">compiled spec</span>
        <motion.div
          className="flex-1 rounded-md border border-border bg-card px-3.5 py-3"
          initial={false}
          animate={{ opacity: drawn ? 1 : 0 }}
          transition={{ duration: reduce ? 0 : 0.5, delay: reduce || !drawn ? 0 : 0.35 }}
        >
          <p className="font-mono text-[0.7rem] leading-[1.75] text-foreground">
            {NODES.map(({ node }, i) => {
              const isActive = active === node.id;
              const dimmed = active !== null && !isActive;
              const sentenceHandlers = interactive
                ? {
                    onMouseEnter: () => setActive(node.id),
                    onMouseLeave: () => setActive(null),
                  }
                : {};
              return (
                <span key={node.id}>
                  {i > 0 && " "}
                  <span
                    id={specId(node.id)}
                    className={`rounded-sm transition-colors ${isActive ? "bg-accent/10 text-accent" : dimmed ? "text-muted-foreground" : ""}`}
                    {...sentenceHandlers}
                  >
                    {node.sentence}
                  </span>
                </span>
              );
            })}
          </p>
        </motion.div>
        {interactive && (
          <p className="font-mono text-[0.6rem] text-muted-foreground">Hover or focus a block to trace it to its sentence in the spec.</p>
        )}
      </div>
    </div>
  );
};

export default BuildCanvas;

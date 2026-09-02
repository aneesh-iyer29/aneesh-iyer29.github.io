import { useEffect, useMemo, useRef, useState } from "react";
import { MotionConfig, Reorder, useInView, useReducedMotion } from "framer-motion";
import type { DemoProps } from "./index";

/* ------------------------------------------------------------------
   A miniature Build canvas: a stack of Scratch-style blocks on the
   left, the plain-language spec they compile to on the right. This is
   a mock of the real builder's block tree, not the builder itself.
   ------------------------------------------------------------------ */

type BlockId = "environment" | "task" | "tool" | "train";
type ChildId = "question" | "scoring";
type ToggleId = BlockId | ChildId;
type Tone = "ink" | "accent" | "teal" | "graphite";

interface ChildBlock {
  id: ChildId;
  label: string;
  summary: string;
}

interface Block {
  id: BlockId;
  label: string;
  tone: Tone;
  summary: string;
  children?: ChildBlock[];
}

type Stage = "idle" | "validate" | "compile" | "deploy" | "ready" | "failed";

const BLOCKS: Record<BlockId, Block> = {
  environment: {
    id: "environment",
    label: "Environment",
    tone: "ink",
    summary: "A warehouse picker that walks aisles to fill orders.",
  },
  task: {
    id: "task",
    label: "Task",
    tone: "accent",
    summary: "Pick every bin on the order without wasted walking.",
    children: [
      { id: "question", label: "Question", summary: "Which bins, in what sequence?" },
      { id: "scoring", label: "Scoring", summary: "Good: all bins, short path. Bad: missed bin or collision." },
    ],
  },
  tool: {
    id: "tool",
    label: "Tool",
    tone: "teal",
    summary: "Step the simulator with an action and read back what changed.",
  },
  train: {
    id: "train",
    label: "Train",
    tone: "graphite",
    summary: "Run GRPO on a Qwen-8B student for 200 steps.",
  },
};

const INITIAL_ORDER: BlockId[] = ["environment", "task", "tool", "train"];
const INITIAL_ENABLED: Record<ToggleId, boolean> = {
  environment: true,
  task: true,
  question: true,
  scoring: true,
  tool: true,
  train: true,
};

const TAB_CLASS: Record<Tone, string> = {
  ink: "bg-foreground",
  accent: "bg-accent",
  teal: "bg-[hsl(var(--fig-4))]",
  graphite: "bg-[hsl(var(--fig-3))]",
};

const STAGES: Stage[] = ["validate", "compile", "deploy"];
const STAGE_MS = 450;

interface Compiled {
  lines: string[];
  notes: string[];
}

/* Compile: walks the block list in order, emitting one spec line per enabled
   block and a lint note for each structural rule the real builder enforces. */
function compileSpec(order: BlockId[], enabled: Record<ToggleId, boolean>): Compiled {
  const lines: string[] = [];
  const notes: string[] = [];
  const active = order.filter((id) => enabled[id]);

  for (const id of active) {
    if (id === "environment") {
      lines.push('environment "warehouse-picker"', "  runtime: hud");
    } else if (id === "task") {
      lines.push('task "fill the order"');
      if (enabled.question) lines.push('  question: "which bins, in what sequence?"');
      if (enabled.scoring) {
        lines.push("  scoring:", "    good: every bin picked, path <= 1.2x optimal", "    bad: missed bin, collision, or timeout");
      }
    } else if (id === "tool") {
      lines.push("tool warehouse.step(action) -> obs, reward, done");
    } else if (id === "train") {
      lines.push("train grpo  student=qwen-8b  rollouts=8  steps=200");
    }
  }

  if (!enabled.environment) notes.push("no environment block, nothing to deploy");
  else if (active[0] !== "environment") notes.push("environment must be the root block");
  if (enabled.task && !enabled.scoring) notes.push("task has no scoring, so reward is undefined");
  if (enabled.task && !enabled.tool) notes.push("no tool block, so the agent has no actions");
  if (enabled.train && !enabled.task) notes.push("train has no task to optimize");
  if (enabled.train && enabled.task && active.indexOf("train") < active.indexOf("task")) {
    notes.push("train runs before its task is defined");
  }

  if (lines.length === 0) lines.push("# empty canvas");
  lines.push("");
  if (notes.length === 0) lines.push(`# ok  ${active.length} blocks, ready to build`);
  else notes.forEach((note) => lines.push(`# warn  ${note}`));

  return { lines, notes };
}

/* Reveals lines one at a time over at most 600 ms whenever the spec changes. */
function useLineReveal(text: string, lineCount: number, instant: boolean): number {
  const [visible, setVisible] = useState(lineCount);
  useEffect(() => {
    if (instant) {
      setVisible(lineCount);
      return;
    }
    const duration = Math.min(600, 55 * lineCount);
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const p = Math.min(1, Math.max(0, now - start) / duration);
      setVisible(Math.max(1, Math.floor(p * lineCount)));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    setVisible(0);
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [text, lineCount, instant]);
  return visible;
}

const Chevron = ({ up }: { up: boolean }) => (
  <svg viewBox="0 0 12 12" className={`h-3 w-3 ${up ? "" : "rotate-180"}`} aria-hidden="true">
    <path d="M3 7.5l3-3 3 3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Check = () => (
  <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden="true">
    <path d="M2.5 6.5l2.5 2.5 4.5-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

interface ToggleProps {
  on: boolean;
  label: string;
  onChange: () => void;
}

const Toggle = ({ on, label, onChange }: ToggleProps) => (
  <button
    type="button"
    role="checkbox"
    aria-checked={on}
    aria-label={`Include ${label} block`}
    onClick={onChange}
    onPointerDown={(e) => e.stopPropagation()}
    className={`flex h-4 w-4 items-center justify-center rounded-sm border transition-colors ${
      on ? "border-foreground bg-foreground text-background" : "border-foreground/40 bg-card text-transparent hover:border-foreground"
    }`}
  >
    <Check />
  </button>
);

interface BlockItemProps {
  block: Block;
  enabled: Record<ToggleId, boolean>;
  index: number;
  count: number;
  onToggle: (id: ToggleId) => void;
  onMove: (id: BlockId, delta: -1 | 1) => void;
}

const BlockItem = ({ block, enabled, index, count, onToggle, onMove }: BlockItemProps) => {
  const on = enabled[block.id];
  return (
    <Reorder.Item
      value={block.id}
      as="li"
      className="list-none cursor-grab select-none active:cursor-grabbing"
      whileDrag={{ scale: 1.01 }}
      aria-label={`${block.label} block, position ${index + 1} of ${count}`}
    >
      <div className={`relative rounded-md border border-border bg-card py-2 pl-3.5 pr-2 transition-opacity ${on ? "" : "opacity-50"}`}>
        <span className={`absolute left-0 top-0 h-full w-[3px] rounded-l-md ${TAB_CLASS[block.tone]}`} aria-hidden="true" />
        <div className="flex items-center gap-2">
          <span className="font-mono text-[0.66rem] font-medium uppercase tracking-[0.14em] text-foreground">{block.label}</span>
          <span className="ml-auto flex items-center gap-1 text-muted-foreground">
            <button
              type="button"
              aria-label={`Move ${block.label} up`}
              disabled={index === 0}
              onClick={() => onMove(block.id, -1)}
              onPointerDown={(e) => e.stopPropagation()}
              className="rounded p-0.5 transition-colors hover:text-foreground disabled:opacity-30 disabled:hover:text-muted-foreground"
            >
              <Chevron up />
            </button>
            <button
              type="button"
              aria-label={`Move ${block.label} down`}
              disabled={index === count - 1}
              onClick={() => onMove(block.id, 1)}
              onPointerDown={(e) => e.stopPropagation()}
              className="mr-1 rounded p-0.5 transition-colors hover:text-foreground disabled:opacity-30 disabled:hover:text-muted-foreground"
            >
              <Chevron up={false} />
            </button>
            <Toggle on={on} label={block.label} onChange={() => onToggle(block.id)} />
          </span>
        </div>
        <p className="mt-1 text-xs leading-snug text-muted-foreground">{block.summary}</p>
        {block.children && (
          <ul className="mt-2 flex flex-col gap-1.5 border-l border-border pl-3">
            {block.children.map((child) => (
              <li key={child.id} className={`flex items-start gap-2 ${enabled[child.id] ? "" : "opacity-50"}`}>
                <div className="min-w-0 flex-1">
                  <span className="font-mono text-[0.62rem] font-medium uppercase tracking-[0.14em] text-foreground">{child.label}</span>
                  <p className="text-[0.7rem] leading-snug text-muted-foreground">{child.summary}</p>
                </div>
                <span className="pt-0.5">
                  <Toggle on={enabled[child.id]} label={child.label} onChange={() => onToggle(child.id)} />
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Reorder.Item>
  );
};

const BuildCanvas = ({ compact = false, className = "" }: DemoProps) => {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { amount: 0.2 });

  const [order, setOrder] = useState<BlockId[]>(INITIAL_ORDER);
  const [enabled, setEnabled] = useState<Record<ToggleId, boolean>>(INITIAL_ENABLED);
  const [stage, setStage] = useState<Stage>("idle");
  const timersRef = useRef<number[]>([]);

  const compiled = useMemo(() => compileSpec(order, enabled), [order, enabled]);
  const specText = compiled.lines.join("\n");
  const visibleLines = useLineReveal(specText, compiled.lines.length, Boolean(reduce) || !inView);

  useEffect(
    () => () => {
      timersRef.current.forEach((id) => clearTimeout(id));
    },
    [],
  );

  const clearTimers = () => {
    timersRef.current.forEach((id) => clearTimeout(id));
    timersRef.current = [];
  };

  const reorder = (next: BlockId[]) => {
    clearTimers();
    setStage("idle");
    setOrder(next);
  };

  const move = (id: BlockId, delta: -1 | 1) => {
    const from = order.indexOf(id);
    const to = from + delta;
    if (to < 0 || to >= order.length) return;
    const next = [...order];
    next.splice(from, 1);
    next.splice(to, 0, id);
    reorder(next);
  };

  const toggle = (id: ToggleId) => {
    clearTimers();
    setStage("idle");
    setEnabled((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const build = () => {
    clearTimers();
    const willFail = compiled.notes.length > 0;
    if (reduce) {
      setStage(willFail ? "failed" : "ready");
      return;
    }
    setStage("validate");
    if (willFail) {
      timersRef.current.push(window.setTimeout(() => setStage("failed"), STAGE_MS));
      return;
    }
    timersRef.current.push(
      window.setTimeout(() => setStage("compile"), STAGE_MS),
      window.setTimeout(() => setStage("deploy"), STAGE_MS * 2),
      window.setTimeout(() => setStage("ready"), STAGE_MS * 3),
    );
  };

  const running = STAGES.includes(stage);
  const stageIndex = stage === "ready" ? STAGES.length : stage === "failed" ? 0 : STAGES.indexOf(stage);
  const message =
    stage === "ready"
      ? "environment ready"
      : stage === "failed"
        ? `validate failed: ${compiled.notes[0]}`
        : stage === "idle"
          ? "idle"
          : "";

  return (
    <MotionConfig reducedMotion="user">
      <div ref={rootRef} className={`grid gap-4 p-4 ${compact ? "min-h-[16rem]" : "min-h-[20rem] md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]"} ${className}`}>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="eyebrow text-[0.62rem]">block canvas</span>
            <button type="button" className="btn-primary btn-compact" onClick={build} disabled={running}>
              Build it
            </button>
          </div>
          <Reorder.Group axis="y" values={order} onReorder={reorder} as="ul" className="flex flex-col gap-2">
            {order.map((id, index) => (
              <BlockItem key={id} block={BLOCKS[id]} enabled={enabled} index={index} count={order.length} onToggle={toggle} onMove={move} />
            ))}
          </Reorder.Group>
        </div>

        <div className="flex min-h-[12rem] flex-col rounded-md border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-3 py-1.5">
            <span className="eyebrow text-[0.62rem]">compiled spec</span>
            <span className="readout text-[0.62rem] text-muted-foreground">{compiled.lines.length - 1} lines</span>
          </div>
          <pre className="flex-1 overflow-x-auto px-3 py-2.5 font-mono text-[0.68rem] leading-[1.65] text-foreground" aria-live="polite" aria-atomic="true">
            <code>
              {compiled.lines.slice(0, visibleLines).map((line, i) => (
                <span key={i} className={line.startsWith("# warn") ? "text-accent" : line.startsWith("#") ? "text-muted-foreground" : ""}>
                  {line}
                  {"\n"}
                </span>
              ))}
            </code>
          </pre>
          <div className="flex flex-wrap items-center gap-x-2 border-t border-border px-3 py-2 font-mono text-[0.62rem] uppercase tracking-[0.12em]" role="status">
            {STAGES.map((name, i) => {
              const done = i < stageIndex;
              const active = stage === name || (stage === "failed" && i === 0);
              return (
                <span key={name} className="flex items-center gap-2">
                  {i > 0 && <span className="text-muted-foreground/50">{">"}</span>}
                  <span className={active ? "text-accent" : done ? "text-foreground" : "text-muted-foreground/60"}>{name}</span>
                </span>
              );
            })}
            <span className={`ml-auto flex items-center gap-1 normal-case tracking-normal ${stage === "ready" || stage === "failed" ? "text-accent" : "text-muted-foreground"}`}>
              {message}
              <span
                className={`inline-block h-3 w-[2px] ${running || stage === "ready" ? "bg-accent" : "bg-muted-foreground/60"} ${inView && !reduce ? "animate-blink" : ""}`}
                aria-hidden="true"
              />
            </span>
          </div>
        </div>
      </div>
    </MotionConfig>
  );
};

export default BuildCanvas;

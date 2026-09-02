import { useId, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import type { DemoProps } from "./index";

/* ------------------------------------------------------------------
   Build's block tree and what it compiles to, using Build's own data.
   The blocks are the SupChain-Bench starter template from Build
   (src/lib/templates.ts), and the right-hand panel is the output of
   Build's compile step, toV1Blocks (src/lib/ir/v1.ts), ported here
   line for line. Colors are the block registry's (src/lib/blocks/model.ts).
   The template has eight tools and four tasks; two tools and one task
   are shown so the figure fits on a page.
   ------------------------------------------------------------------ */

type Kind =
  | "environment"
  | "overview"
  | "setup"
  | "tool"
  | "goal"
  | "input"
  | "output"
  | "taskset"
  | "task"
  | "prompt"
  | "scoring"
  | "good_outcome"
  | "bad_outcome";

interface Block {
  id: string;
  kind: Kind;
  name?: string;
  text?: string;
  children: Block[];
}

/* Registry labels and colors, verbatim from Build's BLOCKS table. */
const IO = "#5A7691";
const GOOD = "#4F8A5B";
const BAD = "#B0503E";
const CFG = "#8C7B63";
const DEF: Record<Kind, { label: string; color: string }> = {
  environment: { label: "Environment", color: "#BE5A2E" },
  overview: { label: "Overview", color: CFG },
  setup: { label: "Setup notes", color: CFG },
  tool: { label: "Tool", color: "#3F7A74" },
  goal: { label: "Goal", color: CFG },
  input: { label: "What goes in", color: IO },
  output: { label: "What comes out", color: IO },
  taskset: { label: "Taskset", color: "#9C4A55" },
  task: { label: "Task", color: "#B26B74" },
  prompt: { label: "Question", color: IO },
  scoring: { label: "Scoring", color: GOOD },
  good_outcome: { label: "Good answer", color: GOOD },
  bad_outcome: { label: "Bad answer", color: BAD },
};

let seq = 0;
const block = (kind: Kind, props: Partial<Block> = {}, children: Block[] = []): Block => ({
  id: `${kind}-${seq++}`,
  kind,
  children,
  ...props,
});
const text = (kind: Kind, value: string) => block(kind, { text: value });

/* Template builders, mirroring templates.ts. */
function environment(overview: string, setup: string): Block {
  return block("environment", {}, [text("overview", overview), text("setup", setup)]);
}
function tool(name: string, goal: string, input: string, output: string): Block {
  return block("tool", { name }, [text("goal", goal), text("input", input), text("output", output)]);
}
function task(opts: { name: string; prompt: string; format?: string; good: string[]; bad: string[] }): Block {
  const scoring = block("scoring", {}, [
    ...opts.good.map((t) => text("good_outcome", t)),
    ...opts.bad.map((t) => text("bad_outcome", t)),
  ]);
  const prompt = opts.format ? `${opts.prompt}\n\n${opts.format}` : opts.prompt;
  return block("task", { name: opts.name }, [text("prompt", prompt), scoring]);
}

/* The SupChain-Bench template, first two tools and first task. */
const PROJECT_NAME = "SupChain-Bench";
const BLOCKS: Block[] = [
  environment(
    "A supply-chain order-management environment: answer natural-language questions about orders by making strategic tool calls across a three-tier system (Trade → Fulfillment → Warehouse).",
    "The data is a simulated order database with five tables (trade orders, fulfillment orders, warehouse orders, error logs, cancellation context). Each trade order has 1–5 fulfillment orders, and each fulfillment has 1–3 warehouse orders. Answering requires chaining multiple tool calls with conditional logic: start from the trade order, branch on each fulfillment's status (cancelled → cancellation tools, error → error tools), then drill into each warehouse order. The final answer is a structured summary of the orders, statuses, reasons, and error details.",
  ),
  tool(
    "query_buyer_and_related",
    "Entry point: given a trade order id, return the buyer and every related fulfillment and warehouse order id.",
    "A trade order id, e.g. 'T1030'.",
    "buyer_id plus a related_item list of { fulfillment_id, warehouse_order_id } pairs (empty if the order id is unknown).",
  ),
  tool(
    "get_fulfillment_status",
    "Get the aggregated business status of a fulfillment order, rolled up from its warehouse orders.",
    "A fulfillment order id, e.g. 'FO2080'.",
    "status: one of cancelled, error, in_transit, dispatched, delivered, packing_done, or packing_in_progress.",
  ),
  block("taskset", {}, [
    task({
      name: "Cancellation reason + warehouse status",
      prompt:
        "For trade order T1001, what was the stated reason for the cancellation of fulfillment order FO2001, and what is the current status of its associated warehouse order WO3001?",
      format: "Use the tools to find the answer, then report the cancellation reason and the warehouse order status.",
      good: [
        "Starts from query_buyer_and_related('T1001') to find FO2001 and WO3001.",
        "Finds FO2001 is cancelled, then calls get_cancel_error_code to get the reason: the wrong size was received, so the buyer cancelled and reordered.",
        "Reports WO3001's status as packing_in_progress.",
      ],
      bad: ["States a cancellation reason without calling the cancellation tools.", "Reports the wrong warehouse status."],
    }),
  ]),
];
/* Home-page digest: one tool and a two-line rubric, so the figure sits
   beside its write-up instead of towering over it. */
const DIGEST: Block[] = [
  BLOCKS[0],
  BLOCKS[1],
  block("taskset", {}, [
    task({
      name: "Cancellation reason + warehouse status",
      prompt:
        "For trade order T1001, what was the stated reason for the cancellation of fulfillment order FO2001, and what is the current status of its associated warehouse order WO3001?",
      good: ["Finds FO2001 is cancelled, then calls get_cancel_error_code to get the reason: the wrong size was received, so the buyer cancelled and reordered."],
      bad: ["States a cancellation reason without calling the cancellation tools."],
    }),
  ]),
];
const OMITTED = { full: { tools: 6, tasks: 3 }, digest: { tools: 7, tasks: 3 } };

/* ---- Build's compile step, ported from src/lib/ir/v1.ts ---------------- */

type V1Block =
  | { type: "env"; name: string; description: string }
  | { type: "tool"; name: string; functionality: string }
  | { type: "task"; prompt: string; answerType: "exact" | "state"; answer: string };

/* HUD env names are slugs: lowercase, underscore-separated, alphanumeric. */
function envSlug(name: string): string {
  return (
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 48) || "environment"
  );
}

/* A good answer that looks like a short exact value ("391", "true") vs. a prose rubric line. */
function looksExact(answer: string): boolean {
  const a = answer.trim();
  return a.length > 0 && a.length <= 40 && !/\s{2,}/.test(a) && a.split(/\s+/).length <= 4;
}

const childText = (b: Block, kind: Kind) => b.children.find((c) => c.kind === kind)?.text?.trim() ?? "";
function deepText(b: Block, kind: Kind): string[] {
  const out: string[] = [];
  for (const c of b.children) {
    if (c.kind === kind && c.text?.trim()) out.push(c.text.trim());
    out.push(...deepText(c, kind));
  }
  return out;
}
function collect(forest: Block[], kind: Kind, out: Block[] = []): Block[] {
  for (const b of forest) {
    if (b.kind === kind) out.push(b);
    collect(b.children, kind, out);
  }
  return out;
}

/* Each compiled block remembers which main/group block produced it, so a
   block on the canvas can be traced to its output. */
function compile(blocks: Block[]): { source: string; v1: V1Block }[] {
  const out: { source: string; v1: V1Block }[] = [];
  const env = blocks.find((b) => b.kind === "environment");
  if (env) {
    const description = [childText(env, "overview"), childText(env, "setup")]
      .map((s) => s.trim())
      .filter(Boolean)
      .join("\n\n");
    out.push({ source: env.id, v1: { type: "env", name: envSlug(PROJECT_NAME), description } });
  }
  for (const t of collect(blocks, "tool")) {
    const functionality = [
      childText(t, "goal"),
      childText(t, "input") && `Inputs: ${childText(t, "input")}`,
      childText(t, "output") && `Returns: ${childText(t, "output")}`,
    ]
      .filter(Boolean)
      .join(" ");
    out.push({ source: t.id, v1: { type: "tool", name: t.name || "tool", functionality } });
  }
  for (const t of collect(blocks, "task")) {
    const good = deepText(t, "good_outcome");
    const answer = good.join(" ");
    out.push({
      source: t.id,
      v1: { type: "task", prompt: childText(t, "prompt"), answerType: good.length === 1 && looksExact(good[0]) ? "exact" : "state", answer },
    });
  }
  return out;
}

/* Which compiled block a canvas block belongs to: itself if it is a
   main/group that compiles, else its nearest compiling ancestor. */
function sourceOf(blocks: Block[]): Map<string, string> {
  const map = new Map<string, string>();
  const walk = (b: Block, owner: string | null) => {
    const compiles = b.kind === "environment" || b.kind === "tool" || b.kind === "task";
    const next = compiles ? b.id : owner;
    if (next) map.set(b.id, next);
    b.children.forEach((c) => walk(c, next));
  };
  blocks.forEach((b) => walk(b, null));
  return map;
}

/* ---- Rendering ---------------------------------------------------------- */

interface NodeProps {
  b: Block;
  depth: number;
  order: number;
  active: string | null;
  owner: Map<string, string>;
  interactive: boolean;
  drawn: boolean;
  reduce: boolean;
  onActivate: (id: string | null) => void;
}

const Node = ({ b, depth, order, active, owner, interactive, drawn, reduce, onActivate }: NodeProps) => {
  const def = DEF[b.kind];
  const mine = owner.get(b.id) ?? null;
  const lit = active !== null && mine === active;
  const dim = active !== null && !lit;
  const leaf = b.children.length === 0;
  const handlers = interactive
    ? {
        onMouseEnter: () => onActivate(mine),
        onMouseLeave: () => onActivate(null),
        onFocus: () => onActivate(mine),
        onBlur: () => onActivate(null),
        onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => {
          if (e.key === "Escape") onActivate(null);
        },
        tabIndex: 0,
      }
    : {};
  const style: CSSProperties = { borderLeftColor: def.color };
  return (
    <motion.div
      className={`relative rounded-md border border-l-[3px] bg-card ${lit ? "border-foreground/40" : "border-border"} ${leaf ? "px-2.5 py-1.5" : "px-2.5 pb-2 pt-1.5"}`}
      style={style}
      initial={false}
      animate={{ opacity: drawn ? (dim ? 0.4 : 1) : 0, y: drawn ? 0 : 6 }}
      transition={{ duration: reduce ? 0 : 0.45, ease: "easeOut", delay: reduce || !drawn ? 0 : Math.min(order, 14) * 0.04 }}
      aria-label={interactive ? `${def.label}${b.name ? ` ${b.name}` : ""}` : undefined}
      {...handlers}
    >
      <div className="flex min-w-0 items-baseline gap-2">
        <span className="shrink-0 font-mono text-[0.6rem] font-semibold uppercase tracking-[0.12em]" style={{ color: def.color }}>
          {def.label}
        </span>
        {b.name ? <span className="truncate font-mono text-[0.66rem] text-foreground">{b.name}</span> : null}
        {leaf && b.text ? (
          <span className={`min-w-0 truncate text-[0.7rem] text-muted-foreground ${depth > 1 ? "" : ""}`}>{b.text}</span>
        ) : null}
      </div>
      {!leaf && (
        <div className="mt-1.5 flex flex-col gap-1.5">
          {b.children.map((c, i) => (
            <Node key={c.id} b={c} depth={depth + 1} order={order + 1 + i} active={active} owner={owner} interactive={interactive} drawn={drawn} reduce={reduce} onActivate={onActivate} />
          ))}
        </div>
      )}
    </motion.div>
  );
};

const BuildCanvas = ({ interactive = true, compact = false, className = "" }: DemoProps) => {
  const reduce = Boolean(useReducedMotion());
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { amount: 0.2, once: true });
  const [active, setActive] = useState<string | null>(null);
  const uid = useId();
  const drawn = reduce || inView;
  const blocks = compact ? DIGEST : BLOCKS;
  const omitted = compact ? OMITTED.digest : OMITTED.full;
  const compiled = useMemo(() => compile(blocks), [blocks]);
  const owner = useMemo(() => sourceOf(blocks), [blocks]);

  const activate = (id: string | null) => {
    setActive(id);
    if (id && interactive) {
      document.getElementById(`${uid}-${id}`)?.scrollIntoView({ block: "nearest", behavior: reduce ? "auto" : "smooth" });
    }
  };

  return (
    <div ref={rootRef} className={`grid gap-4 p-4 md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] ${className}`}>
      <div className="flex min-w-0 flex-col gap-2">
        <div className="flex items-baseline justify-between">
          <span className="eyebrow text-[0.62rem]">canvas · {PROJECT_NAME}</span>
          <span className="font-mono text-[0.6rem] text-muted-foreground">
            +{omitted.tools} tools, +{omitted.tasks} tasks not shown
          </span>
        </div>
        <div className="flex flex-col gap-2">
          {blocks.map((b, i) => (
            <Node key={b.id} b={b} depth={0} order={i * 3} active={active} owner={owner} interactive={interactive} drawn={drawn} reduce={reduce} onActivate={activate} />
          ))}
        </div>
      </div>

      <div className="flex min-w-0 flex-col gap-2">
        <div className="flex items-baseline justify-between">
          <span className="eyebrow text-[0.62rem]">compiled · v1 blocks</span>
          <span className="font-mono text-[0.6rem] text-muted-foreground">toV1Blocks(toIR(doc))</span>
        </div>
        <div className={compact ? "relative min-h-[18rem] flex-1 md:min-h-0" : "flex-1"}>
          <motion.div
            className={`min-w-0 rounded-md border border-border bg-card ${compact ? "absolute inset-0 overflow-hidden" : "relative max-h-[26rem] overflow-auto md:h-full md:max-h-none"}`}
            initial={false}
            animate={{ opacity: drawn ? 1 : 0 }}
            transition={{ duration: reduce ? 0 : 0.5, delay: reduce || !drawn ? 0 : 0.4 }}
          >
            <pre className="whitespace-pre-wrap break-words px-3.5 py-3 font-mono text-[0.64rem] leading-[1.6] text-foreground">
              {"[\n"}
              {compiled.map((c, i) => {
                const lit = active === c.source;
                const dim = active !== null && !lit;
                const handlers = interactive ? { onMouseEnter: () => setActive(c.source), onMouseLeave: () => setActive(null) } : {};
                return (
                  <span
                    key={c.source}
                    id={`${uid}-${c.source}`}
                    className={`block rounded-sm transition-colors ${lit ? "bg-accent/10" : ""} ${dim ? "text-muted-foreground" : ""}`}
                    {...handlers}
                  >
                    {JSON.stringify(c.v1, null, 2)
                      .split("\n")
                      .map((line) => `  ${line}`)
                      .join("\n")}
                    {i < compiled.length - 1 ? "," : ""}
                    {"\n"}
                  </span>
                );
              })}
              {"]"}
            </pre>
            {compact && <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card to-transparent" aria-hidden="true" />}
          </motion.div>
        </div>
        {interactive && <p className="font-mono text-[0.6rem] text-muted-foreground">Hover or focus a block to trace it to the object it compiles into.</p>}
      </div>
    </div>
  );
};

export default BuildCanvas;

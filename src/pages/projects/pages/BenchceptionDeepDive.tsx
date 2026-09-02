import { useState } from "react";
import { motion } from "framer-motion";
import type { ProjectDetailBodyProps } from "@/pages/projects/types";
import { Callout, SectionHeading, Stat } from "@/components/casestudy";

const ACCENT = "hsl(var(--accent))";
const NEUTRAL = "hsl(var(--muted-foreground) / 0.45)";
const ACTIVE_SHADOW = "0 8px 24px -10px hsl(var(--accent) / 0.45)";

// Which diagram nodes light up at each pipeline step (0 = show everything).
const STAGES: Record<number, string[]> = {
  1: ["build", "spec"],
  2: ["spec", "opus", "gpt", "envO", "envG"],
  3: ["envO", "envG", "qO", "qBase", "qG"],
  4: ["qO", "qBase", "qG", "arena", "result"],
};

const STEPS = [
  {
    n: "01",
    title: "Capture the spec",
    body:
      "In Build, we drag & drop blocks to write a plain-language description meant to help a model rebuild Supply Chain Bench. Each model sees only this description, never the env.",
  },
  {
    n: "02",
    title: "Two authors build environments",
    body: "Claude Opus 4.8 and GPT-5.5 each turn the spec into a full RL environment on HUD.",
  },
  {
    n: "03",
    title: "Train the students",
    body:
      "Each author trains a Qwen-8B on the environment it generated. A third Qwen-8B stays untrained as a baseline.",
  },
  {
    n: "04",
    title: "Three-way contest on Golden Bench",
    body:
      "All three Qwens face the held-out Supply Chain Bench. The strongest student would reveal who authored the better environment.",
  },
];

const reveal = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
};

export function BenchceptionDeepDive(_props: ProjectDetailBodyProps) {
  const [active, setActive] = useState(0);
  const toggle = (s: number) => setActive((cur) => (cur === s ? 0 : s));

  const nodeOn = (id: string) => active === 0 || STAGES[active]?.includes(id);
  const nodeStyle = (id: string): React.CSSProperties => {
    const on = nodeOn(id);
    return {
      opacity: on ? 1 : 0.28,
      borderColor: active !== 0 && on ? ACCENT : undefined,
      boxShadow: active !== 0 && on ? ACTIVE_SHADOW : "none",
      transition: "0.3s",
    };
  };
  const conn = (stage: number): React.CSSProperties => ({
    fill: "none",
    stroke: active === stage ? ACCENT : NEUTRAL,
    strokeOpacity: active === 0 || active === stage ? 1 : 0.18,
    strokeWidth: 2,
    strokeDasharray: active === stage ? "5 7" : undefined,
    transition: "stroke 0.3s, stroke-opacity 0.3s",
  });
  // Active connections get flowing dashes so the selected stage feels live.
  const flow = (stage: number) => (active === stage ? "decor-flow" : undefined);

  return (
    <div>
      {/* PIPELINE + DIAGRAM ------------------------------------------------ */}
      <section className="flex flex-wrap items-start gap-x-14 gap-y-12">
        <div className="min-w-[300px] flex-[1_1_360px] pt-1.5">
          <p className="text-base leading-relaxed text-muted-foreground">
            For this experiment, our golden environment is{" "}
            <a href="https://arxiv.org/pdf/2602.07342" target="_blank" rel="noopener noreferrer" className="link-accent">
              Supply Chain Bench
            </a>{" "}
            (
            <a href="https://github.com/Damon-GSY/SC-bench" target="_blank" rel="noopener noreferrer" className="link-accent">
              code
            </a>
            ), a HUD benchmark held out from every model.
          </p>

          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
            <Stat label="Golden env" value="Supply Chain Bench" />
            <Stat label="Authors" value="Opus 4.8 · GPT-5.5" />
            <Stat label="Student" value="Qwen-8B" />
          </div>

          {/* STEPPER */}
          <div className="mb-3.5 mt-10 flex items-center justify-between">
            <span id="bc-pipeline-label" className="eyebrow">
              Walk the pipeline
            </span>
            <button
              type="button"
              onClick={() => setActive(0)}
              className="press font-mono text-[0.68rem] font-medium uppercase tracking-[0.12em] text-accent transition-colors hover:text-foreground"
            >
              Show all
            </button>
          </div>

          <div className="flex flex-col gap-2.5" role="group" aria-labelledby="bc-pipeline-label">
            {STEPS.map((step, i) => {
              const s = i + 1;
              const on = active === s;
              return (
                <button
                  key={step.n}
                  type="button"
                  onClick={() => toggle(s)}
                  aria-pressed={on}
                  className={`press flex gap-3.5 rounded-lg border p-4 text-left transition-colors ${
                    on ? "border-accent bg-accent/[0.07]" : "border-border bg-card hover:border-foreground/30"
                  }`}
                >
                  <span
                    className={`readout flex size-[30px] flex-none items-center justify-center rounded-md border text-[13px] font-medium ${
                      on ? "border-accent text-accent" : "border-border text-muted-foreground"
                    }`}
                  >
                    {step.n}
                  </span>
                  <span>
                    <span className="mb-1 block text-sm font-medium text-foreground">{step.title}</span>
                    <span className="block text-[13px] leading-[1.45] text-muted-foreground">{step.body}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <Callout symbol="!" className="mt-[18px]">
            <strong className="font-medium text-foreground">No contamination.</strong> The golden environment is never
            shown to either author or student during authoring or training; it is revealed only at evaluation. Models
            can&apos;t memorize the test, only learn to teach.
          </Callout>
        </div>

        {/* DIAGRAM */}
        <div className="min-w-[300px] flex-[1_1_440px] self-stretch">
          <div className="mb-2.5 flex items-baseline justify-between">
            <span className="eyebrow">Architecture</span>
            <div className="flex gap-3.5 font-mono text-[10px] uppercase tracking-[0.04em] text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <span className="size-[9px] rounded-sm border border-border bg-card" />
                pipeline
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span
                  className="size-[9px] rounded-sm border"
                  style={{ background: "hsl(var(--accent) / 0.12)", borderColor: ACCENT }}
                />
                golden bench
              </span>
            </div>
          </div>

          <div className="figure-frame dot-grid w-full" style={{ aspectRatio: "600 / 880" }}>
            <svg viewBox="0 0 600 880" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 h-full w-full">
              <defs>
                <marker id="bcArw" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6 Z" fill="context-stroke" />
                </marker>
              </defs>
              <path d="M300,100 L300,150" style={conn(1)} className={flow(1)} markerEnd="url(#bcArw)" />
              <path d="M300,228 C300,242 150,234 150,248" style={conn(2)} className={flow(2)} markerEnd="url(#bcArw)" />
              <path d="M300,228 C300,242 450,234 450,248" style={conn(2)} className={flow(2)} markerEnd="url(#bcArw)" />
              <path d="M150,334 L150,378" style={conn(2)} className={flow(2)} markerEnd="url(#bcArw)" />
              <path d="M450,334 L450,378" style={conn(2)} className={flow(2)} markerEnd="url(#bcArw)" />
              <path d="M150,456 C150,480 108,482 108,502" style={conn(3)} className={flow(3)} markerEnd="url(#bcArw)" />
              <path d="M450,456 C450,480 492,482 492,502" style={conn(3)} className={flow(3)} markerEnd="url(#bcArw)" />
              <path d="M108,590 C108,624 220,636 248,650" style={conn(4)} className={flow(4)} markerEnd="url(#bcArw)" />
              <path d="M300,590 L300,650" style={conn(4)} className={flow(4)} markerEnd="url(#bcArw)" />
              <path d="M492,590 C492,624 380,636 352,650" style={conn(4)} className={flow(4)} markerEnd="url(#bcArw)" />
              <path d="M300,744 L300,788" style={conn(4)} className={flow(4)} markerEnd="url(#bcArw)" />
            </svg>

            <DiagNode pos={{ left: "31.667%", top: "2.273%", width: "36.667%", height: "9.091%" }} style={nodeStyle("build")}>
              <NodeKicker>In-house · Build</NodeKicker>
              <NodeTitle>Drag &amp; drop blocks</NodeTitle>
              <NodeSub>describe the task to rebuild the env</NodeSub>
            </DiagNode>

            <DiagNode pos={{ left: "30.833%", top: "17.045%", width: "38.333%", height: "8.864%" }} style={nodeStyle("spec")}>
              <NodeKicker>Extracted</NodeKicker>
              <NodeTitle>Environment spec</NodeTitle>
              <NodeSub>plain-language description (IR)</NodeSub>
            </DiagNode>

            <DiagNode pos={{ left: "7.333%", top: "28.182%", width: "35.333%", height: "9.773%" }} style={nodeStyle("opus")}>
              <NodeKicker>Author A</NodeKicker>
              <NodeTitle>Claude Opus 4.8</NodeTitle>
              <NodeSub>generates an environment</NodeSub>
            </DiagNode>
            <DiagNode pos={{ left: "57.333%", top: "28.182%", width: "35.333%", height: "9.773%" }} style={nodeStyle("gpt")}>
              <NodeKicker>Author B</NodeKicker>
              <NodeTitle>GPT-5.5</NodeTitle>
              <NodeSub>generates an environment</NodeSub>
            </DiagNode>

            <DiagNode pos={{ left: "7.333%", top: "42.955%", width: "35.333%", height: "8.864%" }} style={nodeStyle("envO")}>
              <NodeKicker>Generated</NodeKicker>
              <NodeTitle>Env by Opus</NodeTitle>
            </DiagNode>
            <DiagNode pos={{ left: "57.333%", top: "42.955%", width: "35.333%", height: "8.864%" }} style={nodeStyle("envG")}>
              <NodeKicker>Generated</NodeKicker>
              <NodeTitle>Env by GPT</NodeTitle>
            </DiagNode>

            <DiagNode pos={{ left: "3%", top: "57.045%", width: "30%", height: "10%" }} style={nodeStyle("qO")}>
              <NodeKicker>Student</NodeKicker>
              <NodeTitle className="font-semibold">Qwen-8B</NodeTitle>
              <NodeSub>trained · Opus env</NodeSub>
            </DiagNode>
            <DiagNode
              pos={{ left: "35%", top: "57.045%", width: "30%", height: "10%" }}
              style={nodeStyle("qBase")}
              dashed
              bg="hsl(var(--secondary))"
            >
              <NodeKicker>Baseline</NodeKicker>
              <NodeTitle className="font-semibold">Qwen-8B</NodeTitle>
              <NodeSub>untrained</NodeSub>
            </DiagNode>
            <DiagNode pos={{ left: "67%", top: "57.045%", width: "30%", height: "10%" }} style={nodeStyle("qG")}>
              <NodeKicker>Student</NodeKicker>
              <NodeTitle className="font-semibold">Qwen-8B</NodeTitle>
              <NodeSub>trained · GPT env</NodeSub>
            </DiagNode>

            <div
              className="absolute flex flex-col justify-center rounded-md border px-4"
              style={{
                left: "9%",
                top: "73.4%",
                width: "82%",
                height: "11.6%",
                background: "hsl(var(--accent) / 0.08)",
                borderWidth: 1.5,
                borderColor: ACCENT,
                opacity: nodeOn("arena") ? 1 : 0.28,
                boxShadow: active !== 0 && nodeOn("arena") ? ACTIVE_SHADOW : "none",
                transition: "0.3s",
              }}
            >
              <div className="font-mono text-[9.5px] font-medium uppercase tracking-[0.13em] text-accent">
                Held-out evaluation
              </div>
              <div className="text-[13.5px] font-semibold leading-[1.25] text-foreground">Three-Way Contest on Golden Bench</div>
              <div className="text-[10.5px] leading-[1.3] text-muted-foreground">all three play the held-out Supply Chain Bench</div>
            </div>

            <div
              className="absolute flex items-center justify-center px-3.5 text-center"
              style={{
                left: "20%",
                top: "89.545%",
                width: "60%",
                height: "7.955%",
                opacity: nodeOn("result") ? 1 : 0.28,
                transition: "0.3s",
              }}
            >
              <div className="font-serif text-[15px] font-medium leading-snug text-foreground">
                Winning student ⇒ the model that authored the better environment
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RESULTS / LEADERBOARD ------------------------------------------- */}
      <motion.section {...reveal} className="mt-20 rounded-lg border border-border bg-secondary/50 p-7 sm:p-10">
        <div className="flex flex-wrap items-start gap-x-14 gap-y-10">
          <div className="min-w-[300px] flex-[1_1_360px]">
            <SectionHeading eyebrow="Results" title="All three students tied" />
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              We ran the full pipeline end to end: both authors generated environments, both trained a Qwen-8B, and
              all three students played the held-out Supply Chain Bench. They finished in a dead heat.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              When we looked closer, the environments the models authored were low-quality and, honestly, a little
              sloppy, so neither trained student learned much the untrained baseline didn&apos;t already know.
            </p>
            <Callout symbol="✓" className="mt-[18px]">
              <strong className="font-medium text-foreground">The tie is the signal.</strong> A flat leaderboard
              isn&apos;t a broken experiment; it is evidence that authoring a good RL environment is genuinely hard. The
              models fail for a valid reason, which is exactly what a strong benchmark should expose.
            </Callout>
          </div>

          <div className="min-w-[300px] flex-[1_1_400px] card-surface px-7 py-6">
            <div className="mb-2 flex items-baseline justify-between gap-3">
              <span className="eyebrow">Leaderboard</span>
              <span className="font-mono text-[11px] text-muted-foreground">success rate</span>
            </div>
            <LeaderRow rank="T-1" label="Qwen-8B · untrained baseline" pct={45} tone="neutral" />
            <LeaderRow rank="T-1" label="Qwen-8B · trained on Opus env" pct={45} tone="accent" delay={0.15} />
            <LeaderRow rank="T-1" label="Qwen-8B · trained on GPT env" pct={44} tone="accent" delay={0.3} last />
            <div className="mt-4 text-[11.5px] leading-[1.5] text-muted-foreground">
              Tied within noise (±2% across seeds). Neither trained student shows a reliable lift over the untrained
              baseline.
            </div>
          </div>
        </div>
      </motion.section>

      {/* BLOCKS → SPEC --------------------------------------------------- */}
      <motion.section {...reveal} className="mt-20 grid items-start gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,21rem)] md:gap-14">
        <div className="min-w-0">
          <SectionHeading eyebrow="How we built the environments in-house" title="From blocks to a spec" />
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Build is a Scratch-style canvas. We drag four kinds of blocks out of the tray (
            <strong className="font-medium text-foreground">Environment, Tool, Task, Train</strong>), snap detail
            blocks into them, and describe each in plain language. The blocks form a recursive tree that the builder
            projects into a plain-language description, written to help a model rebuild Supply Chain Bench. That
            description, not code or JSON, is the only thing each model receives.
          </p>
          <div className="mt-6 flex flex-wrap gap-6">
            <MiniNote label="Why blocks">
              No-code authoring keeps the spec consistent and human-auditable across every environment we test.
            </MiniNote>
            <MiniNote label="What ships">
              A clean description object: the same input given to Opus 4.8 and GPT-5.5, identically.
            </MiniNote>
          </div>
        </div>

        {/* block mock */}
        <div className="min-w-0 card-surface p-6">
          <div className="mb-3.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            Build · canvas
          </div>
          <div className="flex flex-col gap-2.5">
            <MockBlock kind="Environment" color="hsl(var(--fig-3))">
              a supply-chain operator working a live order queue…
            </MockBlock>
            <MockBlock kind="Tool" color="hsl(var(--fig-4))">
              check_inventory(sku) → units on hand
            </MockBlock>
            <MockBlock kind="Task" color="hsl(var(--accent))">
              fulfil the backlog without stocking out…
            </MockBlock>
            <MockBlock kind="Train" color="hsl(var(--fig-2))">
              algorithm: auto · reward from rubric
            </MockBlock>
          </div>
          <div className="my-4 flex items-center gap-2.5 px-0.5 text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            <span className="font-mono text-[10px] uppercase tracking-[0.14em]">extract description</span>
            <span className="text-sm" aria-hidden="true">
              ↓
            </span>
          </div>
          {/* A deliberate "terminal" block: ink on paper inverted. */}
          <div
            className="rounded-md p-4 font-mono text-[12.5px] leading-[1.6]"
            style={{ background: "hsl(var(--foreground))", color: "hsl(var(--background))" }}
          >
            <span className="mb-2 block text-[9px] uppercase tracking-[0.16em] text-accent">spec handed to the models</span>
            &quot;Build an RL environment where an agent operates a supply chain: it queries inventory and supplier
            tools to clear an order backlog, scored by fill-rate without stock-outs. Train a policy to maximize the
            rubric reward.&quot;
          </div>
        </div>
      </motion.section>

      {/* ROADMAP --------------------------------------------------------- */}
      <motion.section {...reveal} className="mt-20 rounded-lg border border-border bg-secondary/50 p-7 sm:p-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-7">
          <SectionHeading eyebrow="Roadmap" title="How we'd improve it" />
          <p className="m-0 text-base leading-relaxed text-muted-foreground">
            Because every environment is a task in itself, the breadth and integrity of the golden set is the whole
            experiment. We&apos;re really measuring how well models build HUD tasks.
          </p>
        </div>

        <div className="grid gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
          <RoadmapCard n="01" title="Harden the golden set">
            Broaden and diversify the golden environments so no single benchmark can be gamed. Variety is the defense
            against contamination and overfitting.
          </RoadmapCard>
          <RoadmapCard n="02" title="Harnesses & visibility">
            Add inspection harnesses into the environments models generate, surfacing reward hacks and degenerate
            setups before any training run begins.
          </RoadmapCard>
          <RoadmapCard n="03" title="Paper → environment">
            An automated pipeline that turns any research paper into a golden environment on HUD, scaling the golden
            set far beyond what we can hand-author.
          </RoadmapCard>
          <RoadmapCard n="04" title="Human verification">
            Human-in-the-loop review on every generated golden environment, guaranteeing the dataset stays correct,
            fair, and trustworthy.
          </RoadmapCard>
        </div>
      </motion.section>

      <div className="mt-10 flex flex-wrap items-center justify-end gap-5 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-muted-foreground">
        <a href="https://arxiv.org/pdf/2602.07342" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-accent">
          Paper
        </a>
        <a href="https://github.com/Damon-GSY/SC-bench" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-accent">
          SC-Bench code
        </a>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Small presentational helpers
// ---------------------------------------------------------------------------

function DiagNode({
  pos,
  style,
  children,
  dashed,
  bg = "hsl(var(--card))",
}: {
  pos: React.CSSProperties;
  style: React.CSSProperties;
  children: React.ReactNode;
  dashed?: boolean;
  bg?: string;
}) {
  return (
    <div
      className="absolute flex flex-col justify-center gap-px overflow-hidden rounded-md px-3"
      style={{
        ...pos,
        background: bg,
        borderWidth: 1,
        borderStyle: dashed ? "dashed" : "solid",
        borderColor: "hsl(var(--border))",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function NodeKicker({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-[8.5px] font-medium uppercase leading-[1.4] tracking-[0.09em] text-muted-foreground">
      {children}
    </div>
  );
}
function NodeTitle({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`text-[13px] font-medium leading-[1.25] text-foreground ${className}`}>{children}</div>;
}
function NodeSub({ children }: { children: React.ReactNode }) {
  return <div className="text-[10.5px] leading-[1.3] text-muted-foreground">{children}</div>;
}

function LeaderRow({
  rank,
  label,
  pct,
  tone,
  delay = 0,
  last,
}: {
  rank: string;
  label: string;
  pct: number;
  tone: "neutral" | "accent";
  delay?: number;
  last?: boolean;
}) {
  return (
    <div className={`flex items-center gap-4 border-t border-border py-4 ${last ? "border-b" : ""}`}>
      <span className="readout w-[34px] flex-none text-[12px] font-medium tracking-[0.04em] text-muted-foreground">
        {rank}
      </span>
      <div className="min-w-0 flex-1">
        <div className="mb-[7px] flex items-baseline justify-between gap-3">
          <span className="text-[13.5px] font-medium text-foreground">{label}</span>
          <span className="readout text-sm font-medium">{pct}%</span>
        </div>
        <div className="h-2 rounded-sm border border-border bg-muted">
          <motion.div
            className="h-full"
            initial={{ width: 0 }}
            whileInView={{ width: `${pct}%` }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
            style={{ background: tone === "accent" ? "hsl(var(--accent))" : NEUTRAL }}
          />
        </div>
      </div>
    </div>
  );
}

function MiniNote({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="max-w-[15em]">
      <div className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{label}</div>
      <div className="text-[13.5px] leading-[1.5] text-muted-foreground">{children}</div>
    </div>
  );
}

function MockBlock({ kind, color, children }: { kind: string; color: string; children: React.ReactNode }) {
  return (
    <div
      className="flex items-start gap-3 rounded-md border border-border bg-card px-3 py-2.5"
      style={{ borderLeft: `4px solid ${color}` }}
    >
      <span
        className="w-[88px] flex-none whitespace-nowrap font-mono text-[9.5px] font-medium uppercase leading-[1.5] tracking-[0.08em]"
        style={{ color }}
      >
        {kind}
      </span>
      <span className="text-[12.5px] leading-[1.5] text-muted-foreground">{children}</span>
    </div>
  );
}

function RoadmapCard({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <div className="card-surface p-6">
      <div className="readout mb-3 text-[13px] font-medium text-accent">{n}</div>
      <h3 className="mb-2 font-serif text-lg font-medium text-foreground">{title}</h3>
      <p className="m-0 text-[13.5px] leading-[1.55] text-muted-foreground">{children}</p>
    </div>
  );
}

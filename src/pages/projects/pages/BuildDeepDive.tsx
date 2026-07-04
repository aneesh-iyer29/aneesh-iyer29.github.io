import { motion } from "framer-motion";
import type { ProjectDetailBodyProps } from "@/pages/projects/types";
import ImageSlot from "@/components/ImageSlot";
import buildCanvas from "@/assets/build-canvas.png";
import buildRunTrain from "@/assets/build-run-train.png";

const BLOCKS = [
  { name: "Environment", body: "The world the agent works in: the setting, the data it can touch, and the rules of the game." },
  { name: "Tool", body: "A function the agent can call. Give it a goal, its inputs, and what it returns, all in plain language." },
  { name: "Task", body: "A prompt plus a rubric: Good and Bad answers nested in a Scoring block that becomes the reward signal." },
  { name: "Train", body: "How the policy learns. Left on auto, a model picks a fitting RL framework for the environment you built." },
];

function Step({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-border pt-10">
      <div className="flex items-baseline gap-4">
        <span className="font-mono text-sm font-semibold text-accent">{n}</span>
        <h2 className="font-serif text-2xl md:text-3xl font-semibold tracking-tight text-foreground">{title}</h2>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="mt-4 text-base leading-relaxed text-muted-foreground first:mt-0">{children}</p>;
}

export function BuildDeepDive(_props: ProjectDetailBodyProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.08 }}
      className="max-w-4xl"
    >
      <div className="inline-flex items-center gap-2.5 rounded-full border border-accent/30 bg-accent/[0.06] px-4 py-2 text-sm font-medium text-foreground">
        <span className="font-mono text-xs text-accent">🏆</span>
        1st place of 70 teams at the HUD × Y Combinator Frontier/RSI RL Environments Hackathon
      </div>

      <ImageSlot
        src={buildCanvas}
        address="build.transpiralabs.com"
        label="Canvas overview"
        caption="An environment open on the Build canvas: here, SupChain-Bench. The block tray sits on the left; on the right, an Environment block, a Taskset of Tasks (each with a Question and a Scoring group of Good and Bad answers), and a column of Tool blocks, every one describing its goal, inputs, and outputs in plain language."
      />

      <section>
        <P>
          A good RL environment is hard to write and easy to get subtly wrong. Build turns authoring into something
          you can see and reason about: every part of the environment is a labelled block, and the whole thing reads
          like a description rather than a config file. Under the hood, those blocks compile to real HUD environment
          code, but no one has to touch it.
        </P>
        <P>
          We built and demoed Build end to end at the hackathon, taking{" "}
          <strong className="text-foreground">first place out of 70 teams</strong> with over $50K in prizes and
          credits on the line. The platform is open source.
        </P>
      </section>

      <section className="mt-12">
        <p className="eyebrow">The building blocks</p>
        <h2 className="mt-3 font-serif text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
          Four blocks, nested to any depth
        </h2>
        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          {BLOCKS.map((b) => (
            <div key={b.name} className="card-surface p-6">
              <h3 className="font-serif text-lg font-semibold text-foreground">{b.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 flex flex-col gap-12">
        <div>
          <p className="eyebrow">How it works</p>
          <h2 className="mt-3 font-serif text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
            From blank canvas to a trained policy
          </h2>
        </div>

        <Step n="01" title="Start from a template or a blank canvas">
          <P>
            Open Build and either start a new environment or fork one of the ready-made templates: SupChain-Bench,
            Wordle Solver, Math Word Problems, or Support Ticket Triage. Templates are complete, runnable
            environments, so you can see how a finished one is wired before changing anything.
          </P>
        </Step>

        <Step n="02" title="Snap blocks together and describe each in plain language">
          <P>
            Drag blocks out of the tray and snap detail blocks into them. Build enforces what can nest where, so a
            Good answer only ever lands inside a Scoring block and a Tool's inputs land on the Tool. Dragging a block
            out pre-includes the parts it always needs, so a Task arrives with a Question and a Scoring block already
            in place.
          </P>
          <P>
            Everything is described in words, not code: a tool's goal, its inputs and returns, a task's prompt, the
            answers that should score well or poorly. That plain-language description is the entire specification.
          </P>
        </Step>

        <Step n="03" title="Check it">
          <P>
            Before building anything, run <em>Check it</em>. It reads the live environment and returns a friendly
            checklist of what still needs fixing (missing pieces, empty rubrics, tools nothing references), separated
            into errors that block a build and warnings worth a look. Nothing is generated yet; it just tells you
            whether the environment is ready.
          </P>
        </Step>

        <Step n="04" title="Build it: compile and deploy to HUD">
          <P>
            Hit <em>Build it</em> and the blocks compile into a real HUD reinforcement-learning environment (the
            tools, the task prompts, and the rubric-based reward) and deploy. A live modal tracks the compile and
            container build; the occasional generation hiccup is retried automatically rather than handed back to you.
          </P>
        </Step>

        <Step n="05" title="Run a baseline, then train">
          <P>
            With the environment live, run every task on HUD across a spanning set of models, a few attempts each. The
            results tell you whether the environment is any good:{" "}
            <strong className="text-foreground">solvable</strong> (a strong model can actually do it) and{" "}
            <strong className="text-foreground">discriminating</strong> (it separates weak models from strong ones).
            Once it's both, fork a base model from the same screen and start an RL run against the reward you
            described in blocks, closing the loop from a plain-language idea to a measurably better model.
          </P>
          <ImageSlot
            src={buildRunTrain}
            ratio="740 / 430"
            label="Run and train"
            caption="From one screen: launch a run of every task in the deployed taskset on HUD across several models, then fork a base model (qwen3-14b) into a trainable one and start an RL run on the tasks you defined. Rollouts and inference both route through HUD."
          />
        </Step>
      </section>

      <section className="mt-16 card-surface p-8 sm:p-10">
        <p className="eyebrow">Under the hood</p>
        <h2 className="mt-3 font-serif text-xl md:text-2xl font-semibold tracking-tight text-foreground">
          Blocks become a canonical spec, then real code
        </h2>
        <P>
          Every block tree projects into a normalized intermediate representation: the canonical description of the
          environment. That representation is what gets checked, compiled to HUD SDK code, and deployed. Because the
          spec is consistent and human-readable, the same environment is auditable by a person and buildable by a
          machine, with nothing lost in translation.
        </P>
      </section>

      <section className="mt-14 flex flex-wrap items-center justify-between gap-6 border-t border-border pt-10">
        <h2 className="font-serif text-2xl md:text-3xl font-semibold tracking-tight text-foreground max-w-[16em]">
          Build an environment without writing code.
        </h2>
        <a
          href="https://build.transpiralabs.com"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          Try Build →
        </a>
      </section>
    </motion.div>
  );
}

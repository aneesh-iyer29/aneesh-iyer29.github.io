import { motion } from "framer-motion";
import type { ProjectDetailBodyProps } from "@/pages/projects/types";
import ImageSlot from "@/components/ImageSlot";

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-serif text-2xl md:text-3xl font-semibold text-foreground mt-16 mb-6 tracking-tight">
      {children}
    </h2>
  );
}
function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="font-serif text-lg md:text-xl font-semibold text-foreground mt-10 mb-4">{children}</h3>;
}
function P({ children }: { children: React.ReactNode }) {
  return <p className="text-muted-foreground leading-relaxed mb-5">{children}</p>;
}
function Code({ children }: { children: React.ReactNode }) {
  return <code className="font-mono text-sm bg-secondary px-1.5 py-0.5 rounded">{children}</code>;
}

export function ClasshopperDeepDive(_props: ProjectDetailBodyProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.08 }}
      className="max-w-4xl"
    >
      <div className="rounded-lg border border-accent/30 bg-accent/5 p-6">
        <p className="text-muted-foreground leading-relaxed m-0">
          At Transpira Labs, we used{" "}
          <a href="https://www.hud.ai/" target="_blank" rel="noreferrer" className="text-accent hover:underline">
            HUD
          </a>
          's RL platform to fine-tune GPT OSS 120B on 100 real-world bug-fixing tasks built from a production
          codebase. Training with GRPO yielded a <strong className="text-foreground">+13% improvement</strong>{" "}
          (Best@10 runs), better first-attempt reliability, and fewer steps per task.
        </p>
      </div>

      <H2>1. Environment creation</H2>
      <P>
        We started with Classhopper, one of our older production apps. It's an Airbnb-style service for discovering
        and booking classes near you. The codebase was pre-AI era: functional, deployed, but messy. Perfect for
        realistic coding challenges.
      </P>
      <P>
        We merged frontend and backend into a single monorepo, verified builds and tests passed, and confirmed it was
        stable enough for automated evaluation.
      </P>
      <P>
        We then connected it using HUD's coding environment template. The template handles the heavy lifting of
        environment creation: it ships with a Dockerfile, a grading harness, and a task runner. Out of the box, it
        gives the agent two built-in tools: a bash tool for running shell commands, and an editor tool for viewing,
        creating, and editing files. These are the only tools the agent gets: no web access, no special APIs, just a
        terminal and a file editor, the same primitives a human developer would use.
      </P>
      <P>
        To connect our codebase, we forked the template and set the <Code>REPO_URL</Code> build argument in the
        Dockerfile to point at our Classhopper monorepo. The template clones this repo into the container at build
        time and wires it into the task runner automatically.
      </P>

      <H2>2. Task creation</H2>
      <H3>Branch structure</H3>
      <P>HUD uses a three-branch structure per task ("scenario"), based on their coding template:</P>
      <ul className="list-disc pl-6 mb-5 space-y-2 text-muted-foreground">
        <li>
          <strong className="text-foreground">Baseline:</strong> The buggy code the agent starts with.
        </li>
        <li>
          <strong className="text-foreground">Test:</strong> Tests that check the fix and catch regressions.
        </li>
        <li>
          <strong className="text-foreground">Golden:</strong> The correct working code. We mostly kept the original
          source, cleaning it up where needed.
        </li>
      </ul>

      <H3>Bug design</H3>
      <P>
        We built 25 initial bugs across frontend-only, backend-only, and cross-stack categories at easy, medium, and
        hard difficulties, then injected these bugs into the codebase.
      </P>
      <div className="card-surface p-6 mb-6 font-mono text-sm text-muted-foreground leading-relaxed">
        <div className="text-xs uppercase tracking-wider text-muted-foreground/70 mb-3">Example bug prompt</div>
        <p className="mb-3">
          "You will be working on a task for project. The repository has already been cloned in{" "}
          <span className="text-accent">/home/ubuntu/project</span>."
        </p>
        <p className="mb-3">Use the tools provided to complete the following task:</p>
        <p className="mb-3">Fix the course visibility toggle bug in the Classhopper backend.</p>
        <p className="mb-3">
          The "make all courses visible" endpoint for instructors does the opposite of what it should. After calling{" "}
          <span className="text-accent">PUT /instructors/&#123;id&#125;/courses/visible</span>, all courses become
          hidden instead of visible.
        </p>
        <p>You MUST edit the relevant file(s) to fix the bug. Do not just describe the fix."</p>
      </div>

      <H3>Test design &amp; reward signal</H3>
      <P>
        Each bug got tests for the fix itself plus adjacent areas to catch regressions. Reward is binary: pass all
        tests or fail the task. No partial credit. Binary rewards give the strongest training signal since the model
        can't get away with partial fixes.
      </P>

      <H2>3. Task validation</H2>
      <P>
        Early mistake: we jumped straight to running agents without verifying the HUD build config was correct. Tasks
        that look fine locally can silently break when config doesn't apply tests properly.
      </P>
      <P>
        The <Code>uv run imagectl4.py &lt;img-name&gt; -v --ids &lt;task-1&gt; &lt;task-2&gt;</Code> command fixed
        this. It checks that everything builds, tests apply to the right branches, baseline tests fail (bug exists),
        and golden tests pass (fix works). After running validation across all tasks, we could trust that any agent
        failure was a real performance issue, not a config bug.
      </P>

      <H2>4. Model training</H2>
      <H3>Initial evaluation</H3>
      <P>
        With 25 validated tasks, we created a taskset on HUD and batch-ran it against the base GPT OSS 120B. After
        fixing a few config issues, we got a solid distribution of success rates: some tasks the model solved easily,
        some it struggled with, some it couldn't crack.
      </P>

      <H3>Scaling to 100 tasks</H3>
      <P>
        We talked to the HUD team about what makes a good training set. Based on their guidance, we built 75 more
        tasks, keeping diversity across stack types and difficulties while targeting a similar success distribution.
      </P>
      <P>
        <strong className="text-foreground">Final dataset: 100 validated tasks.</strong>
      </P>

      <div className="card-surface overflow-hidden my-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
              <tr>
                <th className="text-left px-5 py-3">Difficulty</th>
                <th className="text-right px-5 py-3">Frontend Only</th>
                <th className="text-right px-5 py-3">Backend Only</th>
                <th className="text-right px-5 py-3">Cross-Stack</th>
                <th className="text-right px-5 py-3">Total</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              {[
                ["Easy", 13, 14, 6, 33],
                ["Medium", 12, 16, 8, 36],
                ["Hard", 10, 14, 7, 31],
              ].map((r) => (
                <tr key={r[0] as string} className="border-b border-border/50 last:border-0">
                  <td className="px-5 py-3 text-foreground">{r[0]}</td>
                  <td className="px-5 py-3 text-right text-muted-foreground">{r[1]}</td>
                  <td className="px-5 py-3 text-right text-muted-foreground">{r[2]}</td>
                  <td className="px-5 py-3 text-right text-muted-foreground">{r[3]}</td>
                  <td className="px-5 py-3 text-right text-foreground">{r[4]}</td>
                </tr>
              ))}
              <tr className="bg-secondary/50 font-semibold">
                <td className="px-5 py-3 text-foreground">Total</td>
                <td className="px-5 py-3 text-right text-foreground">35</td>
                <td className="px-5 py-3 text-right text-foreground">44</td>
                <td className="px-5 py-3 text-right text-foreground">21</td>
                <td className="px-5 py-3 text-right text-foreground">100</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 text-xs text-muted-foreground border-t border-border">
          Table 1: Task distribution by stack type and difficulty
        </div>
      </div>

      <H3>Training run</H3>
      <P>
        We ran GRPO training on a HUD fork of GPT OSS 120B, investing ~10 hours and 600 credits over 20 training
        steps. The model's policy showed a clear shift, with pass rates climbing steadily throughout the run. The
        performance dips at checkpoints #5 and #11 weren't regressions; they came from a more difficult distribution
        of tasks in those specific evaluations. Overall, the trajectory remained strong.
      </P>

      <ImageSlot
        label="Training curve"
        ratio="16 / 8"
        caption="Pass rate over the 20 GRPO training steps, showing the policy shift across the run (with the harder task distributions at checkpoints #5 and #11 visible as dips)."
      />

      <H2>5. Results</H2>
      <H3>Evaluation setup</H3>
      <P>
        We benchmarked the newly trained model on 50 unseen tasks: 25 new Classhopper tasks and 25 from ScheduleHero,
        a completely separate app. The out-of-domain eval on ScheduleHero was key to confirming the model gained real
        coding skill, not just Classhopper memorization.
      </P>

      <H3>Performance</H3>
      <P>Consistent improvement across every metric:</P>

      <div className="card-surface overflow-hidden my-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
              <tr>
                <th className="text-left px-5 py-3">Metric</th>
                <th className="text-right px-5 py-3">Base GPT OSS 120B</th>
                <th className="text-right px-5 py-3">Trained Model</th>
                <th className="text-right px-5 py-3">Improvement</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              {[
                ["Average Pass Rate", "53.9%", "60.7%", "+6.8%"],
                ["Best@3", "68.2%", "77.9%", "+9.7%"],
                ["Best@5", "70.8%", "82.9%", "+12.1%"],
                ["Best@10", "73.9%", "86.9%", "+13.0%"],
                ["Pass@1", "80.0%", "88.0%", "+8.0%"],
                ["ScheduleHero (out-of-domain)", "14%", "22%", "+8.0%"],
                ["Avg Steps", "26.2", "22.2", "-4.0 steps"],
              ].map((r) => (
                <tr key={r[0]} className="border-b border-border/50 last:border-0">
                  <td className="px-5 py-3 text-foreground">{r[0]}</td>
                  <td className="px-5 py-3 text-right text-muted-foreground">{r[1]}</td>
                  <td className="px-5 py-3 text-right text-foreground">{r[2]}</td>
                  <td className="px-5 py-3 text-right text-accent">{r[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 text-xs text-muted-foreground border-t border-border">
          Table 2: Benchmark results on classhopper-benchv1 (25 held-out tasks)
        </div>
      </div>

      <H3>Key takeaways</H3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-lg overflow-hidden border border-border mb-6">
        {[
          { v: "+6.8%", l: "Avg Pass Rate" },
          { v: "+12.1%", l: "Best@5" },
          { v: "+8.0%", l: "Pass@1" },
          { v: "-4", l: "Avg Steps" },
        ].map((s) => (
          <div key={s.l} className="bg-card p-6">
            <div className="readout text-2xl md:text-3xl text-foreground">{s.v}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.l}</div>
          </div>
        ))}
      </div>
      <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
        <li>
          <strong className="text-foreground">+6.8% average pass rate</strong> (53.9% → 60.7%). More tasks solved per
          run.
        </li>
        <li>
          <strong className="text-foreground">+12.1% Best@5</strong> (70.8% → 82.9%). Way more tasks solvable given
          multiple attempts.
        </li>
        <li>
          <strong className="text-foreground">+8.0% Pass@1</strong> (80.0% → 88.0%). Better first-attempt reliability.
        </li>
        <li>
          <strong className="text-foreground">4 fewer steps on average</strong> (26.2 → 22.2). Not just more accurate,
          but more efficient.
        </li>
        <li>
          <strong className="text-foreground">+8.0% improvement on an unseen codebase</strong> with significantly
          harder tasks.
        </li>
      </ul>
    </motion.div>
  );
}

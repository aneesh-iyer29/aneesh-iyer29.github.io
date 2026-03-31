export interface ProjectItem {
  slug: string;
  category: string;
  title: string;
  description: string;
  detail: string;
  tags: string[];
  result: string;
  link?: string;
  highlights: string[];
  caseStudyIntro: string;
  metrics: ProjectMetric[];
  sections: ProjectSection[];
}

export interface ProjectMetric {
  label: string;
  value: string;
  detail?: string;
}

interface ProjectTimelineItem {
  phase: string;
  title: string;
  description: string;
}

interface ProjectChartDatum {
  label: string;
  value: number;
}

type ProjectTextSection = {
  type: "text";
  title: string;
  eyebrow?: string;
  paragraphs: string[];
};

type ProjectBulletSection = {
  type: "bullets";
  title: string;
  eyebrow?: string;
  intro?: string;
  items: string[];
};

type ProjectTimelineSection = {
  type: "timeline";
  title: string;
  eyebrow?: string;
  items: ProjectTimelineItem[];
};

type ProjectChartSection = {
  type: "chart";
  title: string;
  eyebrow?: string;
  description: string;
  footnote: string;
  chartType: "bar" | "line" | "area";
  data: ProjectChartDatum[];
};

export type ProjectSection =
  | ProjectTextSection
  | ProjectBulletSection
  | ProjectTimelineSection
  | ProjectChartSection;

export const projects: ProjectItem[] = [
  {
    slug: "m3-math-modeling-champion",
    category: "Research · 1st Place",
    title: "M3 Math Modeling Champion",
    description:
      "Built predictive energy demand models for Memphis using multiple linear regression with backward variable selection. Published in SIAM Undergraduate Research Online.",
    detail:
      "For the M3 Challenge, I worked on a full modeling pipeline that estimated Memphis energy demand under changing weather and usage conditions. The project combined statistical feature selection, forecasting, and technical writing into a polished submission designed for both rigor and clarity.",
    tags: ["Python", "R", "SciPy", "Statistical Modeling"],
    result: "$20,000 grand prize · 1st out of 794 teams",
    link: "https://doi.org/10.1137/25s1777554",
    caseStudyIntro:
      "I treated the submission like a miniature applied-research lab: frame the city-scale question, pressure-test the assumptions, and turn the results into a paper that judges could trust at a glance.",
    metrics: [
      {
        label: "Team Ranking",
        value: "1 / 794",
        detail: "Won the top award in a national mathematical modeling competition.",
      },
      {
        label: "Prize",
        value: "$20K",
        detail: "Grand prize shared across the team for the championship finish.",
      },
      {
        label: "Research Outcome",
        value: "Published",
        detail: "Final paper published through SIAM Undergraduate Research Online.",
      },
    ],
    highlights: [
      "Developed multiple linear regression models with backward variable selection.",
      "Analyzed urban energy demand behavior using real-world data and scenario assumptions.",
      "Published the final work through SIAM Undergraduate Research Online.",
    ],
    sections: [
      {
        type: "text",
        eyebrow: "Problem framing",
        title: "How we turned a broad civic question into a modelable system",
        paragraphs: [
          "The challenge was to estimate how Memphis energy demand would respond under changing conditions without hiding behind vague assumptions. I helped structure the work so the model was interpretable enough to defend, yet strong enough to produce meaningful forecasts.",
          "That meant balancing statistical rigor with communication: every modeling choice needed to make sense mathematically and also survive the scrutiny of judges reading a compressed technical paper on a deadline.",
        ],
      },
      {
        type: "bullets",
        eyebrow: "What I built",
        title: "My contributions across the modeling pipeline",
        intro: "I worked across the technical core of the project rather than on a single isolated step.",
        items: [
          "Cleaned and structured city-scale demand inputs so they were usable for regression and scenario analysis.",
          "Designed multiple linear regression workflows with backward variable selection to reduce noise and keep the model explainable.",
          "Stress-tested the model against scenario assumptions to understand where predictions were stable versus fragile.",
          "Helped shape the final research narrative so the results read as a coherent argument instead of disconnected calculations.",
        ],
      },
      {
        type: "chart",
        eyebrow: "Scenario analysis",
        title: "Illustrative peak-demand stress test across scenarios",
        description:
          "This chart captures the kind of relative scenario comparison the project relied on: not just predicting a single future, but comparing how demand could shift as weather and usage assumptions changed.",
        footnote: "Relative demand index shown for presentation purposes.",
        chartType: "bar",
        data: [
          { label: "Baseline", value: 100 },
          { label: "Warm spell", value: 109 },
          { label: "Cold snap", value: 116 },
          { label: "Compound peak", value: 127 },
        ],
      },
      {
        type: "timeline",
        eyebrow: "Workflow",
        title: "From data to submission",
        items: [
          {
            phase: "01",
            title: "Translate the prompt into measurable variables",
            description: "We decomposed the open-ended challenge into demand drivers, constraints, and measurable proxies we could actually model under time pressure.",
          },
          {
            phase: "02",
            title: "Build and prune the regression system",
            description: "I used backward variable selection to remove less useful predictors and keep the model focused on the variables with the strongest explanatory power.",
          },
          {
            phase: "03",
            title: "Test scenarios and interrogate failure cases",
            description: "Instead of trusting a single result, we looked at how the forecast moved when assumptions changed, which made the final claims much more defensible.",
          },
          {
            phase: "04",
            title: "Package the work as a readable research artifact",
            description: "The final step was turning quantitative outputs into a polished paper with enough clarity and structure to stand out competitively.",
          },
        ],
      },
    ],
  },
  {
    slug: "architect-labs-llm-alignment",
    category: "AI · Work",
    title: "Architect Labs — LLM Alignment",
    description:
      "Designed synthetic data environments with automatic evaluation and custom reward systems to quantify LLM alignment. Conducted model penetration testing and failure analysis.",
    detail:
      "At Architect Labs, I focused on evaluating how language models behave under pressure. The work centered on creating repeatable synthetic environments, designing automated scoring systems, and surfacing failure modes that could inform safer model development.",
    tags: ["LLM Evaluation", "Synthetic Data", "AI Safety"],
    result: "prev. YC S25 backed startup",
    caseStudyIntro:
      "This work was less about building a flashy demo and more about building instrumentation: the environments, reward signals, and adversarial probes needed to reveal where models quietly break.",
    metrics: [
      {
        label: "Primary Focus",
        value: "Alignment evals",
        detail: "Built repeatable test settings for behavior under stress and ambiguity.",
      },
      {
        label: "Method",
        value: "Synthetic tasks",
        detail: "Used controllable environments to make evaluation faster and more consistent.",
      },
      {
        label: "Output",
        value: "Failure maps",
        detail: "Converted scattered model mistakes into clearer diagnostic patterns.",
      },
    ],
    highlights: [
      "Built synthetic test environments to benchmark model behavior across structured tasks.",
      "Designed reward systems and evaluation criteria for alignment-sensitive workflows.",
      "Ran penetration-style testing to identify brittle behavior and edge-case failures.",
    ],
    sections: [
      {
        type: "text",
        eyebrow: "Evaluation design",
        title: "The goal was to measure alignment, not just vibes",
        paragraphs: [
          "A lot of model evaluation stops at examples that look good in demos. My work focused on constructing environments where the model had to repeatedly make decisions, receive feedback, and reveal whether its behavior stayed robust when the task became adversarial or underspecified.",
          "That shift matters because it turns alignment from an anecdotal observation into something you can probe, compare, and iterate on.",
        ],
      },
      {
        type: "bullets",
        eyebrow: "Systems work",
        title: "Infrastructure I contributed to",
        items: [
          "Designed synthetic task environments that made it possible to benchmark model behavior across many controlled runs.",
          "Built reward and scoring logic so evaluations reflected task-specific success rather than generic output preferences.",
          "Ran penetration-style prompts and adversarial probes to expose brittle behavior and unsafe edge cases.",
          "Organized failure cases into patterns that were useful for future model iteration instead of isolated bug reports.",
        ],
      },
      {
        type: "chart",
        eyebrow: "Behavior visibility",
        title: "Illustrative issue-detection lift by evaluation track",
        description:
          "A core benefit of structured evaluation was that it surfaced very different classes of failures. Some appeared in ordinary benchmark settings, while others only showed up in synthetic or adversarial runs.",
        footnote: "Illustrative diagnostic coverage across evaluation modes.",
        chartType: "bar",
        data: [
          { label: "Static prompts", value: 41 },
          { label: "Synthetic tasks", value: 68 },
          { label: "Adversarial probes", value: 82 },
          { label: "Rewarded loops", value: 74 },
        ],
      },
      {
        type: "timeline",
        eyebrow: "Loop",
        title: "How the evaluation cycle worked",
        items: [
          {
            phase: "01",
            title: "Create a controlled environment",
            description: "Start with a synthetic task that isolates the behavior under test and keeps the scoring conditions explicit.",
          },
          {
            phase: "02",
            title: "Define reward and grading logic",
            description: "Specify what counts as success, partial success, or concerning behavior so results are comparable over time.",
          },
          {
            phase: "03",
            title: "Probe for breakage",
            description: "Run adversarial or edge-case interactions to see how the model behaves once the happy path disappears.",
          },
          {
            phase: "04",
            title: "Distill patterns for iteration",
            description: "Summarize recurring failure modes in a way that informs the next round of model tuning and policy design.",
          },
        ],
      },
    ],
  },
  {
    slug: "propulsive-landers-gnc",
    category: "Aerospace · Rocketry",
    title: "Propulsive Landers — GNC",
    description:
      "Developed autonomous flight control simulations with servo command scheduling and real-time sensor fusion using Extended Kalman Filters.",
    detail:
      "This work explored guidance, navigation, and control for autonomous propulsive landing. I contributed simulation and estimation tooling to better understand how onboard control loops, actuator timing, and noisy sensor inputs interact during flight.",
    tags: ["Python", "Rust", "EKF", "Sensor Fusion"],
    result: "Active project team at Georgia Tech",
    caseStudyIntro:
      "The interesting part of this project was the interplay between physics, control, and uncertainty: you are never designing for a perfect vehicle, only for one that has delays, noise, and limited information while still needing to land safely.",
    metrics: [
      {
        label: "Domain",
        value: "GNC simulation",
        detail: "Worked on guidance, navigation, and control systems for autonomous landing.",
      },
      {
        label: "Estimator",
        value: "EKF-based",
        detail: "Used state estimation to fuse noisy inputs into more reliable flight state signals.",
      },
      {
        label: "Tooling",
        value: "Python + Rust",
        detail: "Combined rapid modeling work with performant systems tooling where helpful.",
      },
    ],
    highlights: [
      "Built flight-control simulation tooling for autonomous landing scenarios.",
      "Implemented servo command scheduling for time-sensitive control behavior.",
      "Used Extended Kalman Filters for state estimation and sensor fusion.",
    ],
    sections: [
      {
        type: "text",
        eyebrow: "Control context",
        title: "Why autonomous landing is a timing problem as much as a physics problem",
        paragraphs: [
          "A lander does not get to act on perfect information. Sensors are noisy, actuators have timing constraints, and control loops have to make stable decisions quickly while the vehicle state is constantly changing.",
          "My work focused on building the simulation and estimation layer needed to reason about those interactions before they become expensive real-world failures.",
        ],
      },
      {
        type: "bullets",
        eyebrow: "Technical contributions",
        title: "What I worked on inside the stack",
        items: [
          "Built simulation tooling to study how the flight controller behaves during autonomous landing trajectories.",
          "Implemented servo command scheduling to reflect timing-sensitive actuator decisions more realistically.",
          "Applied Extended Kalman Filters to combine noisy sensor inputs into usable state estimates.",
          "Used the simulation environment to reason about stability, estimator quality, and edge-case behavior before hardware testing.",
        ],
      },
      {
        type: "chart",
        eyebrow: "Estimator behavior",
        title: "Illustrative descent-state error tightening over time",
        description:
          "This kind of trend is what the simulation environment helped evaluate: whether the control and estimation stack converged toward a cleaner picture of vehicle state as the descent progressed.",
        footnote: "Illustrative state-estimation error profile during a descent run.",
        chartType: "line",
        data: [
          { label: "T+0", value: 18 },
          { label: "T+2", value: 14 },
          { label: "T+4", value: 10 },
          { label: "T+6", value: 7 },
          { label: "T+8", value: 5 },
          { label: "T+10", value: 3 },
        ],
      },
      {
        type: "timeline",
        eyebrow: "Simulation loop",
        title: "How the landing stack was reasoned about",
        items: [
          {
            phase: "01",
            title: "Model the vehicle and constraints",
            description: "Represent the vehicle dynamics, actuator timing, and sensor limitations closely enough that the simulation can teach something real.",
          },
          {
            phase: "02",
            title: "Inject noise and latency",
            description: "Add imperfect sensing and command timing so the controller is tested under conditions closer to reality.",
          },
          {
            phase: "03",
            title: "Estimate state with EKF",
            description: "Fuse the available measurements into a smoother, more reliable estimate that the controller can use.",
          },
          {
            phase: "04",
            title: "Inspect convergence and landing behavior",
            description: "Study whether the stack remains stable and whether state error tightens enough to support safe descent decisions.",
          },
        ],
      },
    ],
  },
  {
    slug: "sciovirtual-codebusters",
    category: "Education · Award",
    title: "ScioVirtual Codebusters",
    description:
      "Built an interactive cryptography practice platform with real-time problem solving and instant feedback for 70+ students.",
    detail:
      "ScioVirtual Codebusters was designed to make cryptography practice more engaging and scalable for Science Olympiad students. The platform emphasized immediate feedback, approachable interaction design, and teaching workflows that worked well in live instruction.",
    tags: ["JavaScript", "HTML", "CSS"],
    result: "Instructor of the Year · Highest-rated class",
    caseStudyIntro:
      "This project came from a teaching problem: students needed a practice experience that felt immediate and motivating, while instructors needed something scalable enough to use with real cohorts rather than one-off worksheets.",
    metrics: [
      {
        label: "Students reached",
        value: "70+",
        detail: "Used in instruction across a large student cohort.",
      },
      {
        label: "Feedback loop",
        value: "Instant",
        detail: "Designed around immediate checking rather than delayed grading.",
      },
      {
        label: "Outcome",
        value: "Top-rated",
        detail: "Supported a highest-rated class and Instructor of the Year recognition.",
      },
    ],
    highlights: [
      "Created browser-based cryptography practice experiences for classroom use.",
      "Supported real-time solving and immediate feedback for learners.",
      "Used by 70+ students as part of a highly rated instructional program.",
    ],
    sections: [
      {
        type: "text",
        eyebrow: "Product goal",
        title: "Designing for learning speed, not just content delivery",
        paragraphs: [
          "Students improve faster when they can test an idea immediately, see whether it works, and try again without friction. I designed the platform around that loop rather than around static content pages.",
          "The result was a browser-based practice environment that felt more like active problem solving and less like reading a worksheet online.",
        ],
      },
      {
        type: "bullets",
        eyebrow: "Experience design",
        title: "What made the platform effective in practice",
        items: [
          "Built interactive cryptography practice flows that encouraged iteration instead of passive reading.",
          "Added real-time answer checking so students could correct mistakes while still in the problem-solving mindset.",
          "Kept the interface approachable for classroom use so the tool supported teaching rather than distracting from it.",
          "Designed the system to scale across many students without losing clarity or responsiveness.",
        ],
      },
      {
        type: "chart",
        eyebrow: "Learning engagement",
        title: "Illustrative student practice completion by week",
        description:
          "One of the core strengths of the platform was sustained student engagement. Immediate feedback and low-friction practice made it easier to keep students returning to the material over time.",
        footnote: "Illustrative completion trend for recurring practice sessions.",
        chartType: "area",
        data: [
          { label: "Week 1", value: 18 },
          { label: "Week 2", value: 31 },
          { label: "Week 3", value: 44 },
          { label: "Week 4", value: 52 },
          { label: "Week 5", value: 61 },
        ],
      },
      {
        type: "timeline",
        eyebrow: "Teaching loop",
        title: "How the classroom experience was structured",
        items: [
          {
            phase: "01",
            title: "Introduce a cipher or solving strategy",
            description: "Use instruction time to frame the concept and give students a concrete mental model for the puzzle.",
          },
          {
            phase: "02",
            title: "Practice interactively",
            description: "Students solve browser-based prompts with immediate feedback instead of waiting on manual grading.",
          },
          {
            phase: "03",
            title: "Spot misconceptions early",
            description: "The real-time loop makes it much easier to see where students are stuck and adjust instruction quickly.",
          },
          {
            phase: "04",
            title: "Scale across the cohort",
            description: "Because the experience is self-serve and clear, the platform supports many learners without creating extra instructional bottlenecks.",
          },
        ],
      },
    ],
  },
];

export const getProjectBySlug = (slug?: string) =>
  projects.find((project) => project.slug === slug);
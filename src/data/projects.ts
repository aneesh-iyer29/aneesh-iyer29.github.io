import buildCanvas from "@/assets/build-canvas.png";
import benchceptionLeaderboard from "@/assets/benchception-leaderboard.png";
import m3Finals from "@/assets/m3-finals.jpg";

export interface ProjectLink {
  label: "Code" | "Demo" | "Paper";
  href: string;
}

/* Which interactive figure a project renders on the home page.
   Components live in src/components/demos and are keyed by this id. */
export type DemoId = "build-canvas" | "bench-race" | "heat-map" | "ekf-replay";

export interface ProjectItem {
  slug: string;
  category: string;
  title: string;
  description: string;
  detail: string;
  tags: string[];
  result: string;
  year: string;
  period: string;
  link?: string;
  /** Labeled evidence links (Code / Demo / Paper) shown on the card and detail page. */
  links?: ProjectLink[];
  highlights: string[];
  /** Static media for the detail page header and social previews. */
  image?: string;
  /** Figure shown on the home page (static) and the project page (interactive). */
  demo: DemoId;
  /** Caption under the interactive figure, written like a paper figure. */
  figureCaption: string;
}

export const projects: ProjectItem[] = [
  {
    slug: "build-rl-environments",
    category: "Open source · 1st place",
    title: "Build: Scratch for RL Environments",
    description:
      "A Scratch-style, block-based builder for reinforcement-learning environments. Snap blocks together, describe each in plain language, and ship a real environment you can run and train on, with no code, JSON, or CLI required.",
    detail:
      "Build is a Scratch-style, block-based builder for reinforcement-learning environments. Snap blocks together, describe each in plain language, and ship a real HUD environment you can run and train on, with no code, JSON, or CLI required. Build took 1st place out of 70 teams at the HUD × Y Combinator Frontier/RSI RL Environments Hackathon, where it was built and demoed end to end.",
    tags: ["Python", "TypeScript", "HUD", "Reinforcement Learning"],
    result: "1st of 70 · $50K+ in prizes at the HUD × YC hackathon",
    year: "2026",
    period: "Jun 2026",
    link: "https://build.transpiralabs.com",
    links: [{ label: "Demo", href: "https://build.transpiralabs.com" }],
    image: buildCanvas,
    demo: "build-canvas",
    figureCaption:
      "How Build compiles a block tree into an environment: the Environment, Tool, and Taskset blocks on the left, with their nested detail blocks, project into the canonical environment, tool, and task records on the right, which is what gets deployed to HUD.",
    highlights: [
      "Compiles plain-language block trees into real, deployable HUD reinforcement-learning environments.",
      "Enforces valid block nesting so environments are structurally correct by construction.",
      "Lets anyone evaluate models in custom simulations and launch RL training runs without writing any code.",
    ],
  },
  {
    slug: "benchception",
    category: "Research · Transpira Labs",
    title: "Benchception",
    description:
      "Which frontier model is best at building RL environments? Benchception makes environment-authoring the thing under test: models compete not by answering but by teaching, and a held-out benchmark decides the winner.",
    detail:
      "Every RL environment is itself a task, so which frontier model is best at building them? Benchception, an internal R&D project at Transpira Labs, makes environment-authoring the thing under test: frontier models compete not by answering, but by teaching. Each model authors an environment from the same plain-language spec and trains a student model on it. The students then face Supply Chain Bench, a held-out golden benchmark that no model ever sees during authoring or training.",
    tags: ["LLM Evaluation", "RL Training", "Benchmarking"],
    result: "Revealed under 1% lift: authoring good RL environments is genuinely hard",
    year: "2026",
    period: "Jul 2026",
    image: benchceptionLeaderboard,
    demo: "bench-race",
    figureCaption:
      "Success rate of three Qwen-8B students on the held-out Supply Chain Bench. Neither student trained on a model-authored environment separates from the untrained baseline within noise.",
    highlights: [
      "Designed a contamination-free evaluation: the golden benchmark is revealed only at final evaluation.",
      "Trained Qwen-8B students on environments authored by Claude Opus 4.8 and GPT-5.5 from identical specs.",
      "A three-way tie against the untrained baseline exposed how hard environment-authoring actually is.",
    ],
  },
  {
    slug: "propulsive-landers-gnc",
    category: "Aerospace · GNC",
    title: "Propulsive Landers GNC",
    description:
      "Guidance, navigation, and control for a self-landing rocket: a 16-state error-state Kalman filter in Rust fusing IMU, GPS, and magnetometer data, and automated PID tuning for a 1.8 kN engine simulation.",
    detail:
      "Propulsive Landers @ Georgia Tech (GTPL) is a student-led team working to become the first student team in the world to achieve vertical take-off and landing of a hybrid rocket. As Vice Lead of the Guidance, Navigation, and Control subteam, I build the estimation and control software that flies the vehicle.\n\nI automated PID tuning for a 1.8 kN engine simulation via 8 step-response metrics logged to CSV each run, and built a 16-state error-state Extended Kalman Filter (ES-EKF) in Rust that fuses IMU, GPS, and magnetometer data, with process noise derived from the VN-200 IMU datasheet. Adding magnetometer fusion made yaw observable and eliminated gyro-bias drift, achieving a 0.14% average deviation (0.17 degrees average attitude error) from simulated ground truth.",
    tags: ["Rust", "Python", "EKF", "Sensor Fusion", "Control Systems"],
    result: "0.14% average deviation from simulated ground truth",
    year: "2026",
    period: "Jan 2026 – Present",
    link: "https://github.com/Avionics-Propulsion-Landers-GT/MonopropUAV",
    links: [{ label: "Code", href: "https://github.com/Avionics-Propulsion-Landers-GT/MonopropUAV" }],
    image: "/projects/landers/generated/esekf_attitude.gif",
    demo: "ekf-replay",
    figureCaption:
      "Roll, pitch, and yaw estimated by the 16-state error-state EKF (dashed) over the true attitude (solid) across a 23 second simulated flight, with the geodesic attitude error below. Data and metrics are exported from the filter's own test harness: 0.14% average deviation, 0.17 degrees average error.",
    highlights: [
      "Built a 16-state error-state EKF in Rust fusing IMU, GPS, and magnetometer data, with process noise derived from the VN-200 IMU datasheet.",
      "Made yaw observable through magnetometer fusion and diagnosed a covariance tuning bug, cutting average deviation from simulated ground truth to 0.14% (0.17 degrees of attitude error).",
      "Automated PID tuning for a 1.8 kN engine simulation via 8 step-response metrics logged to CSV each run.",
    ],
  },
  {
    slug: "m3-math-modeling-champion",
    category: "Research · 1st place · Published",
    title: "M3 Math Modeling Champion",
    description:
      "Modeled Memphis heat resilience and electricity demand, winning 1st of 794 teams and the $20,000 grand prize. Published in SIAM Undergraduate Research Online.",
    detail:
      "The MathWorks Math Modeling Challenge tasks teams of 3-5 students with developing data-driven mathematical models to address complex, real-world societal issues under significant time constraints. Participants are required to translate an open-ended problem into a structured quantitative framework by making justified assumptions, identifying and analyzing relevant datasets, and constructing models that could generate meaningful predictions or insights.",
    tags: ["Python", "R", "SciPy", "Statistical Modeling"],
    result: "$20,000 grand prize · 1st of 794 teams · SIAM published",
    year: "2025",
    period: "Mar 2025 – May 2025",
    link: "https://doi.org/10.1137/25s1777554",
    links: [{ label: "Paper", href: "https://doi.org/10.1137/25s1777554" }],
    image: m3Finals,
    demo: "heat-map",
    figureCaption:
      "Reproduction of the paper's Figure 2.5.2: predicted indoor temperature of four Memphis homes without air conditioning over a heatwave day, integrating the paper's heat-transfer ODE with its fitted outdoor-temperature and irradiance curves. The unshaded home peaks at 31.6 °C, the 89 °F a resident reported during the June 2023 outages.",
    highlights: [
      "Quantified heat vulnerability across 27 Memphis zip codes by reducing variables to 4 significant features via backward selection.",
      "Modeled urban electricity demand over five emissions pathways with simulations and sensitivity analysis.",
      "Presented to Ph.D. mathematicians in New York City and co-authored a publication in SIAM Undergraduate Research Online.",
    ],
  },
];

export const getProjectBySlug = (slug?: string) =>
  projects.find((project) => project.slug === slug);

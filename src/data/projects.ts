import buildCanvas from "@/assets/build-canvas.png";

export interface ProjectItem {
  slug: string;
  category: string;
  title: string;
  description: string;
  detail: string;
  tags: string[];
  result: string;
  year: string;
  link?: string;
  highlights: string[];
  /** Card media: an imported image, or a description of the image to add later. */
  image?: string;
  imagePlaceholder?: string;
}

export const projects: ProjectItem[] = [
  {
    slug: "build-rl-environments",
    category: "Case Study · 1st Place",
    title: "Build: Scratch for RL Environments",
    description:
      "A Scratch-style, block-based builder for reinforcement-learning environments. Snap blocks together, describe each in plain language, and ship a real environment you can run and train on, with no code, JSON, or CLI required.",
    detail:
      "Build is a Scratch-style, block-based builder for reinforcement-learning environments. Snap blocks together, describe each in plain language, and ship a real HUD environment you can run and train on, with no code, JSON, or CLI required. Build took 1st place out of 70 teams at the HUD × Y Combinator Frontier/RSI RL Environments Hackathon, where it was built and demoed end to end.",
    tags: ["Python", "TypeScript", "HUD", "Reinforcement Learning"],
    result: "1st of 70 · $50K+ in prizes at the HUD × YC hackathon",
    year: "2026",
    link: "https://build.transpiralabs.com",
    image: buildCanvas,
    highlights: [
      "Compiles plain-language block trees into real, deployable HUD reinforcement-learning environments.",
      "Enforces valid block nesting so environments are structurally correct by construction.",
      "Lets anyone evaluate models in custom simulations and launch RL training runs without writing any code.",
    ],
  },
  {
    slug: "benchception",
    category: "Case Study · Research",
    title: "Benchception",
    description:
      "Which frontier model is best at building RL environments? Benchception makes environment-authoring the thing under test: models compete not by answering but by teaching, and a held-out benchmark decides the winner.",
    detail:
      "Every RL environment is itself a task, so which frontier model is best at building them? Benchception, an internal R&D project at Transpira Labs, makes environment-authoring the thing under test: frontier models compete not by answering, but by teaching. Each model authors an environment from the same plain-language spec and trains a student model on it. The students then face Supply Chain Bench, a held-out golden benchmark that no model ever sees during authoring or training.",
    tags: ["LLM Evaluation", "RL Training", "Benchmarking"],
    result: "Revealed under 1% lift: authoring good RL environments is genuinely hard",
    year: "2026",
    imagePlaceholder:
      "Screenshot of the Benchception pipeline diagram or the leaderboard view (the interactive version lives on the detail page).",
    highlights: [
      "Designed a contamination-free evaluation: the golden benchmark is revealed only at final evaluation.",
      "Trained Qwen-8B students on environments authored by Claude Opus 4.8 and GPT-5.5 from identical specs.",
      "A three-way tie against the untrained baseline exposed how hard environment-authoring actually is.",
    ],
  },
  {
    slug: "classhopper-set",
    category: "Case Study · RL Fine-Tuning",
    title: "Classhopper Set: Fine-Tuning GPT OSS 120B",
    description:
      "Built 100 real-world bug-fixing tasks from a production codebase and trained GPT OSS 120B with GRPO on HUD: +13% Best@10, +8% Pass@1, and 4 fewer steps per task.",
    detail:
      "We used HUD's RL platform to fine-tune GPT OSS 120B on 100 real-world bug-fixing tasks built from Classhopper, a production pre-AI-era codebase. Training with GRPO yielded a +13% improvement on Best@10 runs, better first-attempt reliability, and fewer steps per task, with gains that transferred to a completely unseen codebase.",
    tags: ["GRPO", "Code Generation", "HUD", "RL Environments"],
    result: "+13% Best@10 · +8% on an unseen out-of-domain codebase",
    year: "2026",
    imagePlaceholder:
      "The GRPO training curve (pass rate over 20 training steps) or the HUD results dashboard for the trained model.",
    highlights: [
      "Authored 100 validated bug-fixing tasks across frontend, backend, and cross-stack categories.",
      "Used a three-branch task structure (baseline, test, golden) with binary rewards for a clean training signal.",
      "Verified real skill transfer with an out-of-domain eval on a separate application.",
    ],
  },
  {
    slug: "m3-math-modeling-champion",
    category: "Research · 1st Place",
    title: "M3 Math Modeling Champion",
    description:
      "Modeled Memphis heat resilience and electricity demand, winning 1st of 794 teams and the $20,000 grand prize. Published in SIAM Undergraduate Research Online.",
    detail:
      "The MathWorks Math Modeling Challenge tasks teams of 3-5 students with developing data-driven mathematical models to address complex, real-world societal issues under significant time constraints. Participants are required to translate an open-ended problem into a structured quantitative framework by making justified assumptions, identifying and analyzing relevant datasets, and constructing models that could generate meaningful predictions or insights.",
    tags: ["Python", "R", "SciPy", "Statistical Modeling"],
    result: "$20,000 grand prize · 1st of 794 teams · SIAM published",
    year: "2025",
    link: "https://doi.org/10.1137/25s1777554",
    imagePlaceholder:
      "A figure from the paper (e.g. the zip-code vulnerability heat map of Memphis) or a photo from the finals presentation in New York City.",
    highlights: [
      "Quantified heat vulnerability across 27 Memphis zip codes by reducing variables to 4 significant features via backward selection.",
      "Modeled urban electricity demand over five emissions pathways with simulations and sensitivity analysis.",
      "Presented to Ph.D. mathematicians in New York City and co-authored a publication in SIAM Undergraduate Research Online.",
    ],
  },
  {
    slug: "propulsive-landers-gnc",
    category: "Aerospace · GNC",
    title: "Propulsive Landers GNC",
    description:
      "Guidance, navigation, and control for a self-landing rocket: automated PID tuning for a 1.8 kN engine simulation and sensor fusion with three Extended Kalman Filters.",
    detail:
      "Propulsive Landers @ Georgia Tech (GTPL) is a student-led team working to become the first student team in the world to achieve vertical take-off and landing of a hybrid rocket. On the Guidance, Navigation, and Control subteam, I build the estimation and control software that flies the vehicle.\n\nI automated PID tuning for a 1.8 kN engine simulation via 8 step-response metrics logged to CSV each run, and engineered sensor fusion pipelines with 3 distinct Extended Kalman Filters spanning IMU, GPS, and LIDAR to filter noisy inputs, achieving a 0.63% average deviation from simulated ground truth.",
    tags: ["Python", "Rust", "EKF", "Sensor Fusion", "Control Systems"],
    result: "0.63% average deviation from simulated ground truth",
    year: "2026",
    link: "https://github.com/Avionics-Propulsion-Landers-GT/MonopropUAV",
    image: "/projects/landers/generated/attitude_animation.gif",
    highlights: [
      "Automated PID tuning for a 1.8 kN engine simulation via 8 step-response metrics logged to CSV each run.",
      "Engineered sensor fusion pipelines with 3 distinct EKFs spanning IMU, GPS, and LIDAR to filter noisy inputs.",
      "Achieved a 0.63% average deviation from simulated ground truth, demonstrating robust estimation accuracy.",
    ],
  },
  {
    slug: "sciovirtual-codebusters",
    category: "Education · Award",
    title: "ScioVirtual Codebusters",
    description:
      "An interactive cryptography practice platform with real-time solving and instant feedback for 70+ students. Highest-rated course of 20+ offerings; 2025 Instructor of the Year.",
    detail:
      "ScioVirtual is a non-profit organization that provides interactive science education in the summer to students in grades 5-10 virtually. Since 2025, I have been an instructor for the Codebusters course, which focuses on cryptography and decrypting messages that have been encoded using various different ciphers.\n\nTraditionally, cryptography problems are very hands-on and require space for the students to write down various pieces of information and interact directly with the ciphertext. Given the virtual format of this course, I built an interactive browser-based platform that allowed students to solve the problems in real-time, with immediate feedback and a dynamic interface for interacting with the ciphertext naturally.",
    tags: ["TypeScript", "HTML", "CSS", "Education"],
    result: "Instructor of the Year · Highest-rated course of 20+",
    year: "2025",
    imagePlaceholder:
      "Screenshot of the Codebusters solving interface mid-problem, showing the interactive ciphertext and live feedback.",
    highlights: [
      "Mimics the experience of solving cryptography problems on paper, entirely in the browser.",
      "Automated solution verification lets students revisit missed problems and get instant feedback without an instructor.",
      "Voted the highest-rated class in the program (of 20+) and named 2025 Instructor of the Year.",
    ],
  },
];

export const getProjectBySlug = (slug?: string) =>
  projects.find((project) => project.slug === slug);

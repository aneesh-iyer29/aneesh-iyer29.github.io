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
}

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
    highlights: [
      "Developed multiple linear regression models with backward variable selection.",
      "Analyzed urban energy demand behavior using real-world data and scenario assumptions.",
      "Published the final work through SIAM Undergraduate Research Online.",
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
    highlights: [
      "Built synthetic test environments to benchmark model behavior across structured tasks.",
      "Designed reward systems and evaluation criteria for alignment-sensitive workflows.",
      "Ran penetration-style testing to identify brittle behavior and edge-case failures.",
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
    highlights: [
      "Built flight-control simulation tooling for autonomous landing scenarios.",
      "Implemented servo command scheduling for time-sensitive control behavior.",
      "Used Extended Kalman Filters for state estimation and sensor fusion.",
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
    highlights: [
      "Created browser-based cryptography practice experiences for classroom use.",
      "Supported real-time solving and immediate feedback for learners.",
      "Used by 70+ students as part of a highly rated instructional program.",
    ],
  },
];

export const getProjectBySlug = (slug?: string) =>
  projects.find((project) => project.slug === slug);
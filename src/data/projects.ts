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
      "The MathWorks Math Modeling Challenge tasks teams of 3-5 students with developing data-driven mathematical models to address complex, real-world societal issues under significant time constraints. Participants are required to translate an open-ended problem into a structured quantitative framework by making justified assumptions, identifying and analyzing relevant datasets, and constructing models that could generate meaningful predictions or insights.",
    tags: ["Python", "R", "SciPy", "Statistical Modeling"],
    result: "$20,000 grand prize · 1st out of 794 teams",
    link: "https://doi.org/10.1137/25s1777554",
    highlights: [
      "Developed multiple linear regression models with backward variable selection to quantify the expected annual loss due to heatwaves for various regions.",
      "Analyzed urban energy demand behavior using real-world data and scenario assumptions over five different emissions pathways.",
      "Executed all models through simulations and sensitivity analysis using Python and R.",
      "Presented our work to Ph. D mathematicians in New York City and published the final work through SIAM Undergraduate Research Online.",
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
    result: "Delivered projects to multiple top-level AI research labs.",
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
      "Propulsive Landers @ Georgia Tech (GTPL) is a student-led team at the Georgia Institute of Technology working to develop autonomous systems that power a self-landing rocket. Our mission is to become the first student team in the world to achieve vertical take-off, and landing of a hybrid rocket.\n\nSpecifically, I work on the Guidance, Navigation, and Control subteam which is responsible for all the software that controls the rocket during its flight. I contributed simulation and estimation tooling using an Extended Kalman Filter to better understand how onboard control loops, actuator timing, and noisy sensor inputs interact during flight.",
    tags: ["Python", "Rust", "EKF", "Sensor Fusion"],
    result: "Active project team at Georgia Tech",
    link: "https://github.com/Avionics-Propulsion-Landers-GT/MonopropUAV",
    highlights: [
      "Built flight-control simulation tooling for autonomous landing scenarios to test sensor fusion and control system behavior.",
      "Implemented servo command scheduling for time-sensitive control behavior to simulate chamber pressure based on the main throttle valve position.",
      "Used Extended Kalman Filters for dynamic state estimation and sensor fusion to estimate the attitude of the rocket based on the noisy data from the sensors.",
    ],
  },
  {
    slug: "sciovirtual-codebusters",
    category: "Education · Award",
    title: "ScioVirtual Codebusters",
    description:
      "Built an interactive cryptography practice platform with real-time problem solving and instant feedback for 70+ students.",
    detail:
      "ScioVirtual is a non-profit organization that provides interactive science education in the summer to students in grades 5-10 virtually. Since 2025, I have been an instructor for the Codebusters course, which focuses on cryptography and decrypting messages that have been encoded using various different ciphers.\n\nTraditionally, cryptography problems are very hands-on and require space for the students to write down various pieces of information and interact directly with the ciphertext. Given the virtual format of this course, and the lack of reliability for students to have access to a printer, I needed a solution that would allow these students to have an interactive experience while not requiring any more materials than the computer that they were already using to attend class.\n\nTo solve this, I built an interactive browser-based platform that allowed students to solve the problems in real-time, with immediate feedback and a dynamic interface that allowed them to interact with the ciphertext in a more natural way (shown below).",
    tags: ["JavaScript", "HTML", "CSS"],
    result: "Instructor of the Year · Highest-rated class",
    highlights: [
      "Allowed students to solve problems while mimicing the experience of solving problems in a physical classroom.",
      "Enabled students to come back to any missed problems after class and receive immediate feedback without active instructors.",
      "Voted has the highest-rated class in the program (out of 20+) and voted as the Instructor of the Year for 2025 by the students.",
    ],
  },
];

export const getProjectBySlug = (slug?: string) =>
  projects.find((project) => project.slug === slug);
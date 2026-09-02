export interface ExperienceItem {
  org: string;
  orgNote?: string;
  role: string;
  period: string;
  location: string;
  link?: string;
  summary: string;
  bullets: string[];
  stack: string[];
}

export const experience: ExperienceItem[] = [
  {
    org: "Transpira Labs",
    orgNote: "Backed by Christopher Klaus",
    role: "Software Engineer",
    period: "May 2026 – Aug 2026",
    location: "Atlanta, GA",
    link: "https://www.transpiralabs.com",
    summary: "Infrastructure for frontier AI training data and supply-chain RL deployments.",
    bullets: [
      "Maximized output of 40+ subject-matter experts producing frontier AI training data by building a task authoring platform.",
      "Landed 5 pilot partners by building a custom go-to-market platform for outreach, lead generation, and analytics.",
      "Built a sandbox replicating a 3PL's full operational stack, enabling end-to-end testing before deployment.",
      "Packaged 288 supply-chain benchmark tasks into a reproducible validation suite with deterministic rewards.",
      "Created Benchception, a benchmark for LLM agents on their ability to RL-train agents, revealing under 1% lift from instruction.",
    ],
    stack: ["TypeScript", "React", "Python", "NVIDIA NeMo Gym", "HUD SDK", "Docker"],
  },
  {
    org: "Nuntius",
    orgNote: "YC S25",
    role: "Software Engineer",
    period: "Sep 2025 – Apr 2026",
    location: "Remote",
    summary: "RL environments and adversarial evaluations that expose frontier-model weaknesses.",
    bullets: [
      "Directed a team of 8 engineers to deliver a $50K client project evaluating LLM agent tool-use limitations.",
      "Produced 300+ adversarial tasks across 5+ RL environments with automated graders and custom rewards.",
      "Designed trajectory-aware validation frameworks that credit intermediate steps, moving evals beyond binary pass/fail to debug agent failure modes.",
    ],
    stack: ["Python", "Pydantic", "RL Environments", "LLM Evaluation"],
  },
  {
    org: "GT Propulsive Landers",
    role: "Vice Lead, Guidance, Navigation, and Controls Subteam",
    period: "Jan 2026 – Present",
    location: "Atlanta, GA",
    link: "https://github.com/Avionics-Propulsion-Landers-GT/MonopropUAV",
    summary: "Estimation and control software for a student-built vertical take-off and landing rocket.",
    bullets: [
      "Built a 16-state error-state EKF in Rust fusing IMU, GPS, and magnetometer data, with process noise derived from the VN-200 IMU datasheet.",
      "Made yaw observable through magnetometer fusion, holding estimates within 0.14% of simulated ground truth (0.17 degrees average attitude error).",
      "Automated PID tuning for a 1.8 kN engine simulation via 8 step-response metrics logged to CSV each run.",
    ],
    stack: ["Rust", "Python", "Sensor Fusion", "Control Systems"],
  },
];

export interface VolunteeringItem {
  org: string;
  role: string;
  period: string;
  link?: string;
  bullets: string[];
  stack: string[];
}

export const volunteering: VolunteeringItem[] = [
  {
    org: "Science Olympiad National Team",
    role: "Open-Source Maintainer & Volunteer",
    period: "Aug 2025 – Present",
    link: "https://github.com/toebes/ciphers",
    bullets: [
      "Open-source maintainer of the Codebusters platform (toebes.com/codebusters) used by 1,000+ coaches and volunteers nationwide.",
      "Supported exam administration for 2,000+ students at state and national tournaments.",
      "Member of the GT Alumni Chapter, organizing exam logistics for 40 teams at the Georgia State Tournament.",
    ],
    stack: ["TypeScript", "Web Development"],
  },
  {
    org: "ScioVirtual Foundation",
    role: "STEM Instructor",
    period: "Summers 2024 – 2026",
    bullets: [
      "Volunteered 100+ hours teaching STEM courses to kids aged 11 to 14 for the ScioVirtual nonprofit.",
      "Created a cryptography training platform for 70+ students with feedback and automated solution verification.",
      "Highest-rated course by students among 20+ offerings; named 2025 Instructor of the Year.",
    ],
    stack: ["HTML", "CSS", "JavaScript"],
  },
];

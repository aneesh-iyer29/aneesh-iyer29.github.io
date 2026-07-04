export interface ExperienceItem {
  org: string;
  orgNote?: string;
  role: string;
  period: string;
  location: string;
  link?: string;
  bullets: string[];
}

export const experience: ExperienceItem[] = [
  {
    org: "Transpira Labs",
    orgNote: "Backed by Christopher Klaus",
    role: "Software Engineer",
    period: "May 2026 – Present",
    location: "Atlanta, GA",
    link: "https://www.transpiralabs.com",
    bullets: [
      "Developed full-stack services for a platform supporting 40+ expert contractors building frontier AI training data.",
      "Packaged 288 supply-chain benchmark tasks into a reproducible environment with deterministic rewards.",
      "Created a benchmark for LLM agents on their ability to RL-train agents, revealing under 1% lift from instruction.",
    ],
  },
  {
    org: "Nuntius",
    orgNote: "YC S25",
    role: "Software Engineer",
    period: "Sep 2025 – Apr 2026",
    location: "Remote",
    bullets: [
      "Directed a team of 8 engineers to deliver a $50K client project evaluating LLM agent tool-use limitations.",
      "Built 5+ RL environments with automated graders and custom rewards; created 300+ adversarial tasks.",
      "Designed trajectory-aware evaluators assigning partial credit on intermediate steps instead of binary results.",
    ],
  },
  {
    org: "GT Propulsive Landers",
    role: "Guidance, Navigation & Control",
    period: "Jan 2026 – Present",
    location: "Atlanta, GA",
    link: "https://github.com/Avionics-Propulsion-Landers-GT/MonopropUAV",
    bullets: [
      "Automated PID tuning for a 1.8 kN engine simulation via 8 step-response metrics logged to CSV each run.",
      "Engineered sensor fusion pipelines with 3 distinct EKFs spanning IMU, GPS, and LIDAR to filter noisy inputs.",
      "Achieved a 0.63% average deviation from simulated ground truth, demonstrating robust estimation accuracy.",
    ],
  },
];

export interface VolunteeringItem {
  org: string;
  role: string;
  period: string;
  bullets: string[];
}

export const volunteering: VolunteeringItem[] = [
  {
    org: "Science Olympiad National Team",
    role: "Open-Source Maintainer & Volunteer",
    period: "Aug 2025 – Present",
    bullets: [
      "Maintainer of the Codebusters platform used by 1,000+ coaches and volunteers nationwide.",
      "Supported exam administration for 2,000+ students at state and national tournaments; organized exam logistics for 40 teams at the GA State Tournament with the GT Alumni Chapter.",
    ],
  },
  {
    org: "ScioVirtual Foundation",
    role: "STEM Instructor",
    period: "Summers 2024 – 2026",
    bullets: [
      "100+ hours teaching STEM courses to kids aged 11–14; built a cryptography training platform for 70+ students.",
      "Highest-rated course among 20+ offerings; named 2025 Instructor of the Year.",
    ],
  },
];

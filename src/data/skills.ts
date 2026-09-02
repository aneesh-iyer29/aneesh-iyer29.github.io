/* Skill pool from the resume content bank. Only claim what the resume backs,
   plus the web stack this site itself is built with. */
export interface SkillGroup {
  title: string;
  items: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    title: "Languages",
    items: ["Python", "Java", "Rust", "C", "TypeScript / JavaScript", "SQL", "R", "MATLAB", "HTML / CSS", "Bash", "LaTeX"],
  },
  {
    title: "AI / ML",
    items: [
      "RLVR / GRPO",
      "RL Environment Creation",
      "LLM Evaluation & Benchmarking",
      "HUD SDK",
      "NVIDIA NeMo Gym",
      "NumPy",
    ],
  },
  {
    title: "Tools & Systems",
    items: [
      "Linux",
      "Docker",
      "Git",
      "Pydantic",
      "Arduino",
      "RISC-V",
      "Control Systems",
      "Sensor Fusion",
      "Embedded Systems",
    ],
  },
  {
    title: "Web",
    items: ["React", "Vite", "Tailwind CSS", "GitHub Actions"],
  },
  {
    title: "Interests",
    items: [
      "Machine Learning",
      "Cryptography",
      "Cybersecurity",
      "Aerospace Systems",
      "Optics",
      "GPU & Accelerated Computing",
      "Spanish (Intermediate)",
    ],
  },
];

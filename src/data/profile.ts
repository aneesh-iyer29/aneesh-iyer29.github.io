/* Single source of truth for identity, status, education, and contact.
   Mirrors ../aneesh-iyer29/RESUME_CONTENT.md; update there first. */

export const profile = {
  name: "Aneesh Iyer",
  headline: "Software engineer working on RL environments, evals, and benchmarks for frontier LLMs.",
  positioning:
    "Most recently a software engineer at Transpira Labs, where I built the task-authoring platform and validation suites behind frontier AI training data. I also help lead guidance, navigation, and control software for a self-landing rocket at Georgia Tech.",
  seeking: "Seeking Summer 2027 SWE and ML infrastructure internships",
  location: "Atlanta, GA",
  email: "aiyer@gatech.edu",
  phone: "(513) 399-1607",
  site: "aneesh-iyer.com",
  github: "https://github.com/aneesh-iyer29",
  githubHandle: "aneesh-iyer29",
  linkedin: "https://linkedin.com/in/aneesh-iyer",
  linkedinHandle: "in/aneesh-iyer",
  resumeUrl: "/resume.pdf",
};

export const education = {
  school: "Georgia Institute of Technology",
  location: "Atlanta, GA",
  degree: "B.S. in Computer Engineering",
  threads: "Cybersecurity & Systems/Architecture",
  gpa: "4.0",
  graduation: "May 2028",
  coursework: ["Data Structures & Algorithms", "Hardware/Software Systems Programming"],
  inProgress: ["Computer Architecture", "Cryptographic Hardware for Embedded Systems"],
};

/* Headline numbers surfaced on the home page. Every figure traces to a
   resume bullet or a case study. */
export const stats = [
  { value: "1st", of: "of 70", label: "HUD × YC RL Environments Hackathon" },
  { value: "1st", of: "of 794", label: "MathWorks M3 Challenge, $20K grand prize" },
  { value: "0.14%", of: "deviation", label: "16-state ES-EKF vs. simulated ground truth" },
  { value: "300+", of: "tasks", label: "adversarial tasks across 5+ RL environments" },
];

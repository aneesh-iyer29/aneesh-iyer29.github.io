import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink } from "lucide-react";

const projects = [
  {
    category: "Research",
    title: "M3 Math Modeling Champion",
    description: "Developed mathematical models to predict energy demand in Memphis for 2025 and 2045; built multiple linear regression models with backward variable selection. Published in SIAM Undergraduate Research Online. 1st out of 794 teams internationally, $20,000 grand prize.",
    tags: ["Python", "R", "SciPy", "Statistical Modeling"],
    link: "https://doi.org/10.1137/25s1777554",
  },
  {
    category: "Work",
    title: "Architect Labs — AI Alignment",
    description: "Designed custom evaluation environments with synthetic data generation, automatic evaluation, and reward systems to quantify LLM alignment in tool-based systems. Conducted penetration testing and failure analysis on AI models.",
    tags: ["LLM Evaluation", "Synthetic Data", "AI Safety"],
  },
  {
    category: "Robotics",
    title: "Propulsive Landers — GNC",
    description: "Developed control systems simulations for autonomous flight with servo command scheduling. Implemented real-time sensor fusion using Extended Kalman Filter and dynamic state transitions under noisy conditions.",
    tags: ["Python", "Rust", "EKF", "Sensor Fusion"],
  },
  {
    category: "Education",
    title: "ScioVirtual Codebusters",
    description: "Designed and developed an interactive Codebusters practice platform enabling 70+ students to solve cryptography problems in real time with instant feedback. Awarded Instructor of the Year.",
    tags: ["HTML", "CSS", "JavaScript"],
  },
  {
    category: "Leadership",
    title: "Science Olympiad — Captain & Director",
    description: "Led 3rd place National team; managed 100+ members. Directed a nationwide 270-team tournament, raised $20K. 1st at Nationals in Optics, 2nd in Codebusters, 1st at MIT in Bungee Drop and Optics.",
    tags: ["Leadership", "Event Management", "National Competition"],
  },
  {
    category: "Research",
    title: "Physics Lab — Data Analysis",
    description: "Processed and visualized real-time sensor data with statistical and graphical analysis methods at SUNY.",
    tags: ["Data Analysis", "Visualization", "Statistics"],
  },
];

const Projects = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="projects" className="py-24 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="section-label mb-3">Selected Work</p>
          <h2 className="text-4xl md:text-5xl font-serif text-foreground">Projects, Research, and Impact</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((proj, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="card-surface-hover p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="tag-accent">{proj.category}</span>
                {proj.link && (
                  <a
                    href={proj.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ExternalLink size={15} />
                  </a>
                )}
              </div>

              <h3 className="text-lg font-semibold text-foreground mb-2">{proj.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{proj.description}</p>

              <div className="flex flex-wrap gap-1.5">
                {proj.tags.map((t) => (
                  <span key={t} className="tag text-[11px]">{t}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;

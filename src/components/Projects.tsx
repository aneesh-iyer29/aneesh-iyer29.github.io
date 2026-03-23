import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Trophy, Code, ExternalLink } from "lucide-react";

const projects = [
  {
    featured: true,
    title: "M3 Math Modeling Champion",
    description:
      "Developed mathematical models to predict energy demand in Memphis for 2025 and 2045. Built multiple linear regression models with backward variable selection to quantify vulnerability and guide targeted resource allocation. Presented findings to Ph.D mathematicians; published in SIAM Undergraduate Research Online.",
    tech: ["Python", "R", "SciPy", "Statistical Modeling"],
    impact: "1st out of 794 teams internationally · $20,000 grand prize · Published in SIAM",
    icon: Trophy,
    link: "https://doi.org/10.1137/25s1777554",
  },
  {
    featured: false,
    title: "ScioVirtual Codebusters",
    description:
      "Designed and developed an interactive Codebusters practice platform for ScioVirtual. Created a dynamic UI enabling 70+ students to solve cryptography problems in real time with instant feedback.",
    tech: ["HTML", "CSS", "JavaScript"],
    impact: "70+ active users · Instructor of the Year · Highest-rated class on platform",
    icon: Code,
  },
];

const Projects = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="projects" className="py-24 px-6">
      <div className="max-w-4xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-sm font-mono text-primary tracking-widest uppercase mb-3">
            Projects
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-12">
            Things I've built.
          </h3>
        </motion.div>

        <div className="space-y-6">
          {projects.map((proj, i) => {
            const Icon = proj.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className={`relative p-8 rounded-xl bg-card border-glow card-hover ${
                  proj.featured
                    ? "ring-1 ring-primary/20"
                    : ""
                }`}
              >
                {proj.featured && (
                  <span className="absolute top-4 right-4 text-xs font-mono text-primary bg-primary/10 px-3 py-1 rounded-full">
                    ★ Featured
                  </span>
                )}

                <div className="flex items-start gap-4 mb-4">
                  <div className="p-2.5 rounded-lg bg-primary/10 text-primary shrink-0">
                    <Icon size={20} />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-foreground flex items-center gap-2">
                      {proj.title}
                      {proj.link && (
                        <a
                          href={proj.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          <ExternalLink size={16} />
                        </a>
                      )}
                    </h4>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {proj.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {proj.tech.map((t) => (
                    <span
                      key={t}
                      className="text-xs font-mono px-2.5 py-1 rounded bg-secondary text-primary"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <p className="text-sm font-medium text-primary">
                  {proj.impact}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Projects;

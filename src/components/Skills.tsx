import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const categories = [
  {
    title: "Languages",
    items: ["Java", "Python", "Rust", "C", "C++", "SQL", "JavaScript", "HTML/CSS", "R", "MATLAB", "LaTeX", "Bash", "Arduino", "RISC-V"],
  },
  {
    title: "Engineering",
    items: ["Control Systems", "Sensor Fusion", "Embedded Systems", "Systems Engineering", "Aerospace Systems"],
  },
  {
    title: "Tools",
    items: ["Git", "SciPy", "NumPy", "Data Analytics", "Modeling & Simulation"],
  },
  {
    title: "Interests",
    items: ["Machine Learning", "AI", "Optics", "Cryptography", "Cybersecurity", "Algorithms"],
  },
];

const Skills = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="skills" className="py-24 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <p className="section-label mb-3">Capabilities</p>
          <h2 className="text-3xl md:text-4xl font-serif text-foreground">Technical Toolkit</h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">{cat.title}</h3>
              <div className="flex flex-wrap gap-1.5">
                {cat.items.map((item) => (
                  <span key={item} className="tag">{item}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;

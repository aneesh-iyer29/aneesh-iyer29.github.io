import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const categories = [
  {
    title: "Languages",
    items: ["Java", "Python", "Rust", "C", "C++", "SQL", "JavaScript", "HTML/CSS", "R", "MATLAB", "LaTeX", "Bash", "Arduino", "RISC-V"],
  },
  {
    title: "Engineering Focus",
    items: ["Control Systems", "Sensor Fusion", "Embedded Systems", "Systems Engineering", "Aerospace Systems"],
  },
  {
    title: "Tools & Technologies",
    items: ["Data Analytics", "Modeling & Simulation", "Microsoft 365", "Git", "SciPy", "NumPy"],
  },
  {
    title: "Interests",
    items: ["Machine Learning", "Artificial Intelligence", "Optics", "Cryptography", "Cybersecurity", "Algorithms"],
  },
];

const Skills = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="skills" className="py-24 px-6">
      <div className="max-w-4xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-sm font-mono text-primary tracking-widest uppercase mb-3">
            Skills
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-12">
            Technical toolkit.
          </h3>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="p-6 rounded-xl bg-card border-glow card-hover"
            >
              <h4 className="text-sm font-mono text-primary mb-4 uppercase tracking-wider">
                {cat.title}
              </h4>
              <div className="flex flex-wrap gap-2">
                {cat.items.map((item) => (
                  <span
                    key={item}
                    className="text-xs font-medium px-3 py-1.5 rounded-md bg-secondary text-secondary-foreground hover:bg-primary/10 hover:text-primary transition-colors cursor-default"
                  >
                    {item}
                  </span>
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

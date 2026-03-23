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
    items: ["Git", "SciPy", "NumPy", "Data Analytics", "Modeling & Simulation", "Microsoft 365"],
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
    <section id="skills" className="py-24 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="section-label mb-3">Capabilities</p>
          <h2 className="text-4xl md:text-5xl font-serif text-foreground">Skills and Technologies</h2>
          <p className="text-muted-foreground mt-3 max-w-lg">Technical skills from coursework, research, and professional experience.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <h3 className="text-sm font-semibold text-foreground mb-3">{cat.title}</h3>
              <div className="flex flex-wrap gap-2">
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

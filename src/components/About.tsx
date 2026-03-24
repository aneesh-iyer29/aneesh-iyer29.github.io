import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const About = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-24 px-6 border-t border-border">
      <div className="max-w-4xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className=""
        >
          <p className="section-label mb-3"></p>
          <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-8 leading-tight">
            About
          </h2>

          <div className="space-y-4 text-base text-muted-foreground leading-relaxed">
            <p>
              I'm a Computer Engineering student at <span className="text-foreground font-medium">Georgia Tech</span> with a 4.0 GPA, focused on building systems at the intersection of AI, control theory, and aerospace. My work emphasizes mathematical rigor, reliability, and real-world validation.
            </p>
            <p>
              At <span className="text-foreground font-medium">Architect Labs (prev. Nuntius YC S25)</span>, I design evaluation frameworks for large language models, developing synthetic data pipelines and reward systems to study alignment in tool-based environments. With <span className="text-foreground font-medium">Propulsive Landers</span>, I build control and estimation systems for autonomous flight, including sensor fusion pipelines using Extended Kalman Filters.
            </p>
            <p>
              I’ve led projects ranging from research-level mathematical modeling to scalable educational platforms, including a first-place finish in the <span className="text-foreground font-medium">MathWorks Math Modeling Challenge</span> (1st out of 794 teams, $20K prize, SIAM published) and building educational platforms used by students nationwide. I'm interested in applying my skills in practical systems that must perform under uncertainty, constraints, and scale.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 mt-10 pt-8 border-t border-border text-center">
            {[
              { label: "GPA", value: "4.0 / 4.0" },
              { label: "M3 Rank", value: "1st / 794" },
              { label: "SIAM Published", value: "2025" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-serif text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1 font-mono uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;

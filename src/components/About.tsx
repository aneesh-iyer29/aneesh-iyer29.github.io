import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const About = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-24 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className=""
        >
          <p className="section-label mb-3">About</p>
          <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-8 leading-tight">
            Engineering from first principles
          </h2>

          <div className="space-y-4 text-base text-muted-foreground leading-relaxed">
            <p>
              I'm a Computer Engineering student at <span className="text-foreground font-medium">Georgia Tech</span> with a 4.0 GPA. My work sits at the intersection of AI, control theory, and aerospace — always grounded in mathematical rigor and real-world validation.
            </p>
            <p>
              At <span className="text-foreground font-medium">Architect Labs (YC S'25)</span>, I design LLM evaluation systems and research AI alignment through synthetic data generation. With <span className="text-foreground font-medium">Propulsive Landers</span>, I build sensor fusion and control systems for autonomous flight using Extended Kalman Filters.
            </p>
            <p>
              I've won the <span className="text-foreground font-medium">M3 Math Modeling Challenge</span> (1st out of 794 teams, $20K prize, SIAM published) and built educational platforms serving 70+ students.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10 pt-8 border-t border-border">
            {[
              { label: "GPA", value: "4.0 / 4.0" },
              { label: "M3 Rank", value: "1st / 794" },
              { label: "SciOly Nationals", value: "3rd Place" },
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

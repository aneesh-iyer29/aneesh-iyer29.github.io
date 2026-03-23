import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const About = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-4xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-sm font-mono text-primary tracking-widest uppercase mb-3">
            About
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
            Engineering from first principles.
          </h3>

          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              I'm a Computer Engineering student at Georgia Tech with a 4.0 GPA, focused on building systems
              that bridge the gap between mathematical theory and real-world engineering. My work spans
              autonomous flight control, AI alignment, and sensor fusion — always grounded in rigorous
              analysis and first-principles thinking.
            </p>
            <p>
              From designing Extended Kalman Filters for propulsive landers to building LLM evaluation
              frameworks at a YC-backed startup, I approach every problem as a systems challenge: understand
              the physics, model the dynamics, validate with data.
            </p>
            <p>
              Outside of engineering, I've led a national Science Olympiad team to a 3rd place finish,
              directed a 270-team tournament, and won the M3 Math Modeling Challenge — placing 1st
              internationally out of 794 teams. I'm driven by problems that demand both mathematical
              depth and engineering craft.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;

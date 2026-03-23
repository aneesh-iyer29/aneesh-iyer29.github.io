import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const About = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-24 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto grid md:grid-cols-[1fr_1.2fr] gap-12 items-start" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="section-label mb-3">About</p>
          <h2 className="text-4xl md:text-5xl font-serif text-foreground leading-tight">
            Who I am
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-4"
        >
          <p className="text-base text-muted-foreground leading-relaxed">
            I am <span className="font-semibold text-foreground">Aneesh Iyer</span>, a Computer Engineering student at Georgia Tech with a 4.0 GPA, building at the intersection of AI, control theory, and aerospace systems.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed">
            I currently work as a Software Engineer at <span className="font-semibold text-foreground">Architect Labs (YC S'25)</span>, where I design LLM evaluation systems and conduct AI model alignment research with synthetic data pipelines.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed">
            My recent work spans autonomous flight control with Extended Kalman Filters, mathematical modeling published in SIAM, and interactive educational platforms serving 70+ users.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div>
              <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Location</p>
              <p className="text-sm text-foreground mt-1">Atlanta, Georgia</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Status</p>
              <p className="text-sm text-foreground mt-1">Seeking internship opportunities</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Education</p>
              <p className="text-sm text-foreground mt-1">Georgia Tech — Computer Engineering</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Focus</p>
              <p className="text-sm text-foreground mt-1">AI · Control Systems · Aerospace</p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <a
              href="/Aneesh_Iyer_Resume.pdf"
              target="_blank"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border text-sm text-foreground hover:bg-secondary transition-colors"
            >
              Resume
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;

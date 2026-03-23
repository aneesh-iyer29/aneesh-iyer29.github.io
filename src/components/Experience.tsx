import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Briefcase } from "lucide-react";

const experiences = [
  {
    role: "Software Engineer",
    company: "Architect Labs (prev. Nuntius · YC S'25)",
    date: "Sep 2025 – Present",
    location: "Remote",
    bullets: [
      "Designed custom data-based environments with synthetic data generation, automatic evaluation, and reward systems to quantify LLM model alignment in tool-based systems.",
      "Conducted penetration testing and failure analysis on AI models, uncovering security weaknesses that informed model hardening strategies.",
    ],
  },
  {
    role: "GNC Engineer",
    company: "Propulsive Landers",
    date: "Jan 2026 – Present",
    location: "Atlanta, GA",
    bullets: [
      "Developed control systems simulations for autonomous flight, implementing servo command scheduling for time-dependent actuation.",
      "Implemented real-time sensor fusion using Extended Kalman Filter and dynamic state transitions for estimation under noisy conditions.",
    ],
  },
  {
    role: "Physics Lab Assistant",
    company: "State University of New York",
    date: "Aug – Dec 2024",
    location: "Remote",
    bullets: [
      "Processed and visualized real-time sensor data with statistical and graphical analysis methods.",
      "Provided reference data and adjustments to enhance lab experience quality.",
    ],
  },
  {
    role: "Captain & Director",
    company: "Science Olympiad",
    date: "Aug 2019 – Present",
    location: "Mason, OH & Atlanta, GA",
    bullets: [
      "Led 3rd place National team; managed 100+ members and oversaw resource exchange with 100+ schools.",
      "Directed a nationwide 270-team tournament; raised $20K and managed all logistics.",
      "Notable: 1st at Nationals (Optics), 2nd (Codebusters), 1st at MIT (Bungee Drop, Optics).",
    ],
  },
];

const Experience = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="experience" className="py-24 px-6">
      <div className="max-w-4xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-sm font-mono text-primary tracking-widest uppercase mb-3">
            Experience
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-12">
            Where I've contributed.
          </h3>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[19px] top-2 bottom-2 w-px bg-border hidden md:block" />

          <div className="space-y-8">
            {experiences.map((exp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative md:pl-12"
              >
                {/* Timeline dot */}
                <div className="absolute left-[12px] top-2 w-[15px] h-[15px] rounded-full bg-primary/20 border-2 border-primary hidden md:flex items-center justify-center">
                  <div className="w-[5px] h-[5px] rounded-full bg-primary" />
                </div>

                <div className="p-6 rounded-xl bg-card border-glow card-hover">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
                    <div>
                      <h4 className="text-lg font-semibold text-foreground flex items-center gap-2">
                        <Briefcase size={16} className="text-primary shrink-0" />
                        {exp.role}
                      </h4>
                      <p className="text-primary text-sm font-medium">{exp.company}</p>
                    </div>
                    <div className="text-xs text-muted-foreground font-mono mt-1 sm:mt-0 sm:text-right shrink-0">
                      <p>{exp.date}</p>
                      <p>{exp.location}</p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {exp.bullets.map((b, j) => (
                      <li key={j} className="text-sm text-muted-foreground flex gap-2">
                        <span className="text-primary mt-1.5 shrink-0">▹</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;

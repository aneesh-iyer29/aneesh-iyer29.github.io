import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { CircuitTrace, StepResponse, RadarSweep, HexColumn, Waveform, DraftMark } from "@/components/decor";

const categories = [
  {
    title: "Languages",
    items: ["Python", "Java", "Rust", "C", "TypeScript", "SQL", "R", "MATLAB", "HTML/CSS", "Bash", "LaTeX"],
  },
  {
    title: "AI / ML",
    items: ["RL Environment Creation", "LLM Evaluation & Benchmarking", "RLVR / GRPO", "NVIDIA NeMo Gym"],
  },
  {
    title: "Tools & Systems",
    items: ["Docker", "Git", "Pydantic", "Arduino", "RISC-V", "Control Systems", "Sensor Fusion", "Embedded Systems"],
  },
  {
    title: "Interests",
    items: ["Machine Learning", "Cryptography", "Cybersecurity", "Aerospace Systems", "Optics", "Spanish"],
  },
];

const Skills = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="skills" className="relative overflow-hidden py-24 px-6 border-t border-border">
      <CircuitTrace className="left-[-20px] bottom-[-30px] w-[380px] hidden md:block" />
      <StepResponse className="right-[-110px] top-[120px] w-[330px] hidden xl:block" />
      <RadarSweep className="right-[60px] bottom-[30px] w-[120px] hidden lg:block" />
      <HexColumn className="left-[36px] top-[110px] w-[105px] hidden xl:block" />
      <Waveform label="EKF RESIDUAL" className="left-[40%] bottom-[14px] w-[220px] hidden lg:block" />
      <DraftMark className="right-10 top-12" />
      <DraftMark className="left-8 top-1/2" />
      <div className="relative max-w-5xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="eyebrow mb-3">Capabilities</p>
          <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground tracking-tight">
            Technical toolkit
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-x-12 gap-y-10">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="border-t border-border pt-4"
            >
              <h3 className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground mb-4">
                {cat.title}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {cat.items.map((item) => (
                  <span key={item} className="tag">
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

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import aneeshPhoto from "@/assets/aneesh-photo.jpeg";
import { GeorgiaOutline, OrbitSat, Waveform, NormalCurve, DraftMark } from "@/components/decor";

const About = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="relative overflow-hidden py-24 px-6 border-t border-border">
      <GeorgiaOutline className="left-[-60px] bottom-[-120px] w-[340px] hidden md:block" />
      <OrbitSat className="right-[-50px] top-[36px] w-[230px] hidden lg:block" />
      <Waveform label="IMU CH-01" className="left-[28px] top-[150px] w-[230px] hidden xl:block" />
      <NormalCurve className="right-[36px] bottom-[28px] w-[210px] hidden lg:block" />
      <DraftMark className="right-8 top-8" />
      <DraftMark className="left-[46%] bottom-6" />
      <div className="relative max-w-5xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-[180px_1fr] gap-8"
        >
          <p className="eyebrow">About</p>

          <div className="flex flex-col-reverse gap-10 lg:flex-row lg:items-start">
            <div className="space-y-4 text-base text-muted-foreground leading-relaxed max-w-2xl flex-1">
              <p>
                I'm a Computer Engineering student at <span className="text-foreground font-medium">Georgia Tech</span>{" "}
                (4.0 GPA, Cybersecurity &amp; Systems/Architecture threads) working at the intersection of AI training
                infrastructure and control systems.
              </p>
              <p>
                At <span className="text-foreground font-medium">Transpira Labs</span>, I build full-stack services and
                RL benchmarks that support expert contractors producing frontier AI training data. Before that, at{" "}
                <span className="text-foreground font-medium">Nuntius (YC S25)</span>, I directed a team of eight
                engineers delivering RL environments and adversarial evaluations for LLM agents. On{" "}
                <span className="text-foreground font-medium">GT Propulsive Landers</span>, I write the estimation and
                control software for a self-landing rocket.
              </p>
              <p>
                I care about work that gets measured: benchmarks with deterministic rewards, estimators checked against
                ground truth, and models judged on held-out tasks. That thread runs from my{" "}
                <span className="text-foreground font-medium">MathWorks M3 Challenge</span> win (1st of 794, published
                in SIAM Undergraduate Research Online) through the evaluation systems I build today.
              </p>
            </div>

            <div className="w-full max-w-[220px] shrink-0">
              <div className="rounded-lg overflow-hidden aspect-[3/4] border border-border">
                <img src={aneeshPhoto} alt="Aneesh Iyer" className="w-full h-full object-cover object-top" />
              </div>
              <p className="mt-2 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">
                Fig. 01 · Atlanta, GA
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;

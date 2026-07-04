import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type Variants } from "framer-motion";
import { MapPin, Briefcase, GraduationCap, Github, Linkedin, Mail, ArrowRight } from "lucide-react";
import heroStars from "@/assets/hero-stars.jpg";

/* Deterministic pseudo-noise so the trace is identical on every load. */
const noise = (i: number) => {
  const s = Math.sin(i * 12.9898) * 43758.5453;
  return s - Math.floor(s) - 0.5;
};

const W = 720;
const H = 120;
const estimateY = (x: number) => 64 + 40 * Math.exp(-x / 260) * Math.cos(x / 50 + 0.5);

const rawPath = Array.from({ length: 91 }, (_, i) => {
  const x = i * 8;
  const y = estimateY(x) + noise(i) * (14 + 20 * Math.exp(-x / 320));
  return `${i === 0 ? "M" : "L"}${x},${y.toFixed(1)}`;
}).join(" ");

const estPath = Array.from({ length: 91 }, (_, i) => {
  const x = i * 8;
  return `${i === 0 ? "M" : "L"}${x},${estimateY(x).toFixed(1)}`;
}).join(" ");

const stats = [
  { value: "1st / 70", label: "HUD × YC RL Hackathon" },
  { value: "1st / 794", label: "M3 Challenge · $20K prize" },
  { value: "300+", label: "Adversarial eval tasks built" },
  { value: "4.00", label: "GPA · Georgia Tech" },
];

const rise: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  // The sky drifts slower than the page, so the hero feels dimensional.
  const skyY = useTransform(scrollYProgress, [0, 1], ["0%", prefersReducedMotion ? "0%" : "22%"]);

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" ref={sectionRef} className="relative overflow-hidden">
      {/* Night-sky backdrop fading into the solid content background. */}
      <motion.img
        src={heroStars}
        alt=""
        aria-hidden="true"
        style={{ y: skyY, scale: 1.12 }}
        className="absolute inset-0 h-full w-full object-cover object-[center_30%]"
      />
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(to bottom, hsl(var(--background) / 0.62) 0%, hsl(var(--background) / 0.38) 42%, hsl(var(--background) / 0.86) 78%, hsl(var(--background)) 100%)",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto w-full px-6 pt-40 pb-16">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } } }}
        >
          <motion.p variants={rise} className="eyebrow mb-6">
            Computer Engineering · Georgia Tech · Class of 2028
          </motion.p>
          <motion.h1
            variants={rise}
            className="text-5xl md:text-6xl lg:text-[4.5rem] font-serif font-semibold text-foreground mb-6 leading-[1.04] tracking-tight"
          >
            Aneesh Iyer
          </motion.h1>
          <motion.p variants={rise} className="text-lg md:text-xl text-foreground/85 max-w-2xl mb-7 leading-relaxed">
            I build the systems that train and measure AI agents: RL environments, evaluations, and training
            infrastructure for frontier models. I also write the guidance software that lands rockets.
          </motion.p>

          <motion.div
            variants={rise}
            className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-foreground/70 mb-9 font-mono"
          >
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={13} /> Atlanta, GA
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Briefcase size={13} /> Transpira Labs
            </span>
            <span className="inline-flex items-center gap-1.5">
              <GraduationCap size={13} /> Georgia Tech
            </span>
          </motion.div>

          <motion.div variants={rise} className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
              onClick={() => scrollToSection("projects")}
            >
              View projects <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 px-6 py-3 rounded border border-foreground/25 bg-background/30 backdrop-blur-sm text-foreground font-medium text-sm hover:bg-background/60 transition-colors"
              onClick={() => scrollToSection("contact")}
            >
              Contact
            </button>
            <div className="flex items-center gap-4 ml-2 text-foreground/70">
              <a href="https://github.com/aneesh-iyer29" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-foreground transition-colors">
                <Github size={17} />
              </a>
              <a href="https://linkedin.com/in/aneesh-iyer" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-foreground transition-colors">
                <Linkedin size={17} />
              </a>
              <a href="mailto:aiyer@gatech.edu" aria-label="Email" className="hover:text-foreground transition-colors">
                <Mail size={17} />
              </a>
            </div>
          </motion.div>
        </motion.div>

        {/* Telemetry strip: raw sensor noise vs. the filtered estimate. */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 rounded-lg border border-border bg-card/70 backdrop-blur-md overflow-hidden"
          aria-hidden="true"
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-2">
            <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">
              Attitude estimate · sensor fusion
            </span>
            <span className="flex gap-4 font-mono text-[0.65rem] uppercase tracking-[0.1em]">
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                <span className="inline-block h-px w-4 bg-muted-foreground/60" /> raw sensor
              </span>
              <span className="inline-flex items-center gap-1.5 text-accent">
                <span className="inline-block h-[2px] w-4 bg-accent" /> EKF estimate
              </span>
            </span>
          </div>
          <svg viewBox={`0 0 ${W} ${H}`} className="block w-full" preserveAspectRatio="none" style={{ height: 96 }}>
            <line x1="0" y1="64" x2={W} y2="64" stroke="hsl(var(--border))" strokeDasharray="2 6" />
            <path d={rawPath} fill="none" stroke="hsl(var(--muted-foreground) / 0.5)" strokeWidth="1" className="trace-draw" />
            <path d={estPath} fill="none" stroke="hsl(var(--accent))" strokeWidth="1.8" className="trace-draw-slow" />
          </svg>
          <div className="flex items-center justify-between border-t border-border px-4 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-muted-foreground">
            <span>t+0s</span>
            <span className="text-foreground/70">avg deviation from ground truth: 0.63%</span>
          </div>
        </motion.div>

        {/* Readout stats */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.55 } } }}
          className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6"
        >
          {stats.map((stat) => (
            <motion.div key={stat.label} variants={rise} className="border-t border-foreground/20 pt-3">
              <p className="readout text-xl md:text-2xl text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

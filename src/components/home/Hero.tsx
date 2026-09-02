import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { profile, stats } from "@/data/profile";
import EkfFigure from "./EkfFigure";
import CountUp from "./CountUp";

const ease = [0.22, 1, 0.36, 1] as const;

const Hero = () => {
  const reduce = useReducedMotion();
  const rise = (delay: number) => ({
    initial: reduce ? { opacity: 1 } : { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease },
  });

  return (
    <section id="top" className="relative">
      <div className="mx-auto grid max-w-page items-center gap-12 px-6 pb-16 pt-32 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:pb-24 lg:pt-40">
        <div>
          <motion.p {...rise(0)} className="eyebrow mb-6">
            Computer Engineering · Georgia Tech · Class of 2028
          </motion.p>
          <motion.h1 {...rise(0.06)} className="display text-[3.4rem] leading-[0.98] sm:text-6xl md:text-7xl">
            {profile.name}
          </motion.h1>
          <motion.p {...rise(0.12)} className="mt-6 max-w-[34rem] text-lg leading-relaxed text-foreground md:text-xl">
            {profile.headline}
          </motion.p>
          <motion.p {...rise(0.18)} className="mt-4 max-w-[36rem] text-base leading-relaxed text-muted-foreground">
            {profile.positioning}
          </motion.p>
          <motion.p {...rise(0.22)} className="mt-5 flex items-center gap-2 font-mono text-xs text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
            {profile.seeking}
          </motion.p>

          <motion.div {...rise(0.28)} className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#work" className="btn-primary">
              Selected work <ArrowDown size={14} />
            </a>
            <a href="#contact" className="btn-secondary">
              Contact
            </a>
            <div className="ml-1 flex items-center gap-4 text-muted-foreground">
              <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="transition-colors hover:text-foreground">
                <Github size={17} />
              </a>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="transition-colors hover:text-foreground">
                <Linkedin size={17} />
              </a>
              <a href={`mailto:${profile.email}`} aria-label="Email" className="transition-colors hover:text-foreground">
                <Mail size={17} />
              </a>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease }}
        >
          <EkfFigure />
        </motion.div>
      </div>

      <div className="mx-auto max-w-page px-6 pb-20">
        <dl className="grid grid-cols-2 gap-x-8 gap-y-8 border-t border-border pt-8 md:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div key={s.label} {...rise(0.4 + i * 0.06)}>
              <dt className="order-2 mt-1.5 text-xs leading-relaxed text-muted-foreground">{s.label}</dt>
              <dd className="flex items-baseline gap-2">
                <CountUp value={s.value} className="display text-3xl text-foreground md:text-4xl" />
                <span className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-muted-foreground">{s.of}</span>
              </dd>
            </motion.div>
          ))}
        </dl>
      </div>
    </section>
  );
};

export default Hero;

import { ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";

const ease = [0.22, 1, 0.36, 1] as const;

/* The hero is typographic. Left: who and what. Right: an index of the
   four works with their results, the way a paper's contents page tells
   you what is inside before you read a word of it. */
const Hero = () => {
  const reduce = useReducedMotion();
  const rise = (delay: number) => ({
    initial: reduce ? { opacity: 1 } : { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease },
  });

  return (
    <section id="top" className="relative">
      <div className="mx-auto grid max-w-page gap-14 px-6 pb-20 pt-32 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20 lg:pb-28 lg:pt-44">
        <div>
          <motion.p {...rise(0)} className="eyebrow mb-7">
            Computer Engineering · Georgia Tech · Class of 2028
          </motion.p>
          <motion.h1 {...rise(0.05)} className="display text-[3.4rem] leading-[0.98] sm:text-6xl md:text-7xl">
            {profile.name}
          </motion.h1>
          <motion.p {...rise(0.1)} className="mt-7 max-w-[32rem] text-lg leading-[1.55] text-foreground md:text-[1.35rem]">
            {profile.headline}
          </motion.p>
          <motion.p {...rise(0.15)} className="mt-4 max-w-[34rem] text-base leading-relaxed text-muted-foreground">
            {profile.positioning}
          </motion.p>
          <motion.p {...rise(0.2)} className="mt-6 font-mono text-xs text-muted-foreground">
            <span className="text-accent">●</span> {profile.seeking}
          </motion.p>

          <motion.div {...rise(0.25)} className="mt-9 flex flex-wrap items-center gap-3">
            <a href="#work" className="btn-primary">
              Selected work
            </a>
            <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              Resume
            </a>
            <div className="ml-2 flex items-center gap-4 text-muted-foreground">
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

        <motion.nav {...rise(0.3)} aria-label="Selected work index" className="lg:pt-3">
          <p className="eyebrow mb-3">Contents</p>
          <ol className="border-t border-border">
            {projects.map((p, i) => (
              <li key={p.slug} className="border-b border-border">
                <Link
                  to={`/projects/${p.slug}`}
                  className="group grid grid-cols-[2rem_1fr_auto] items-baseline gap-4 py-4"
                >
                  <span className="readout text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    <span className="block font-serif text-lg leading-snug text-foreground transition-colors group-hover:text-accent">
                      {p.title}
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{p.result}</span>
                  </span>
                  <span className="readout flex items-center gap-1 text-xs text-muted-foreground">
                    {p.year}
                    <ArrowUpRight size={12} className="opacity-0 transition-opacity group-hover:opacity-100" />
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </motion.nav>
      </div>
    </section>
  );
};

export default Hero;

import { motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ExternalLink } from "lucide-react";
import { experience, volunteering } from "@/data/experience";
import { LanderScene, LanderVehicle, GimbalRings, CipherStrip, GroundStation, DraftMark } from "@/components/decor";

/* Scroll progress through the section flies the lander down the dashed
   trajectory in the scene (curve, flip to vertical, touchdown on the pad). */
const FLIGHT_STOPS = [0, 0.3, 0.55, 0.92, 1];
const FLIGHT_X = [189, 122, 74, 74, 74];
const FLIGHT_Y = [-104, 53, 182, 316, 316];
const FLIGHT_TILT = [-14, -8, 0, 0, 0];

const Experience = () => {
  const ref = useRef(null);
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const landerX = useTransform(scrollYProgress, FLIGHT_STOPS, FLIGHT_X);
  const landerY = useTransform(scrollYProgress, FLIGHT_STOPS, FLIGHT_Y);
  const landerTilt = useTransform(scrollYProgress, FLIGHT_STOPS, FLIGHT_TILT);

  return (
    <section id="experience" ref={sectionRef} className="relative overflow-hidden py-24 px-6 border-t border-border">
      <div className="pointer-events-none absolute right-[-30px] top-[220px] hidden h-[600px] w-[300px] lg:block" aria-hidden="true">
        <LanderScene className="inset-0 w-full" />
        <motion.div
          className="absolute left-0 top-0 w-[171px]"
          style={
            prefersReducedMotion
              ? { x: FLIGHT_X[4], y: FLIGHT_Y[4] }
              : { x: landerX, y: landerY, rotate: landerTilt }
          }
        >
          <LanderVehicle className="w-full" />
        </motion.div>
      </div>
      <GimbalRings className="left-[-50px] bottom-[60px] w-[180px] hidden lg:block" />
      <CipherStrip className="left-[32px] top-[46%] w-[210px] hidden xl:block" />
      <GroundStation className="right-[64px] bottom-[36px] w-[130px] hidden lg:block" />
      <DraftMark className="left-8 bottom-10" />
      <DraftMark className="right-12 top-14" />
      <div className="relative max-w-5xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <p className="eyebrow mb-3">Experience</p>
          <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground tracking-tight">
            Where I've worked
          </h2>
        </motion.div>

        <div className="space-y-14">
          {experience.map((job, i) => (
            <motion.article
              key={job.org}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="grid md:grid-cols-[180px_1fr] gap-x-8 gap-y-3 border-t border-border pt-8"
            >
              <div className="font-mono text-xs text-muted-foreground leading-relaxed">
                <p className="readout">{job.period}</p>
                <p className="mt-1">{job.location}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground flex flex-wrap items-baseline gap-x-2.5">
                  {job.link ? (
                    <a
                      href={job.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 hover:text-accent transition-colors"
                    >
                      {job.org} <ExternalLink size={13} className="text-muted-foreground" />
                    </a>
                  ) : (
                    job.org
                  )}
                  {job.orgNote && (
                    <span className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-accent">
                      {job.orgNote}
                    </span>
                  )}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">{job.role}</p>
                <ul className="space-y-2">
                  {job.bullets.map((bullet) => (
                    <li key={bullet} className="text-sm text-muted-foreground leading-relaxed flex gap-3">
                      <span className="mt-[0.55rem] h-px w-3 shrink-0 bg-accent" aria-hidden="true" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Volunteering */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, delay: 0.3 }}
          className="mt-20"
        >
          <p className="eyebrow mb-8">Volunteering</p>
          <div className="grid md:grid-cols-2 gap-6">
            {volunteering.map((item) => (
              <div key={item.org} className="card-surface-hover p-6">
                <p className="readout text-xs text-muted-foreground mb-2">{item.period}</p>
                <h3 className="text-base font-semibold text-foreground">{item.org}</h3>
                <p className="text-sm text-muted-foreground mb-3">{item.role}</p>
                <ul className="space-y-2">
                  {item.bullets.map((bullet) => (
                    <li key={bullet} className="text-sm text-muted-foreground leading-relaxed">
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Experience;

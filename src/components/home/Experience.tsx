import { ExternalLink } from "lucide-react";
import Section from "@/components/layout/Section";
import Reveal from "@/components/layout/Reveal";
import { experience } from "@/data/experience";

/* A single vertical timeline: the period sits in the left gutter, the
   rail carries a dot per role, and the current role's dot is accent. */
const Experience = () => (
  <Section id="experience" index="02" eyebrow="Experience" title="Where I have worked.">
    <ol className="relative">
      {experience.map((job, i) => {
        const current = job.period.endsWith("Present");
        return (
          <Reveal as="li" key={job.org} delay={i * 0.05} className="grid gap-4 md:grid-cols-[10rem_1fr] md:gap-10">
            <div className="md:pt-1">
              <p className="readout text-xs text-foreground">{job.period}</p>
              <p className="mt-1 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-muted-foreground">{job.location}</p>
            </div>
            <div className={`relative border-l border-border pl-7 ${i < experience.length - 1 ? "pb-14" : "pb-0"}`}>
              <span
                className={`absolute -left-[5px] top-2 h-[9px] w-[9px] rounded-full border-2 border-background ${current ? "bg-accent" : "bg-foreground/60"}`}
                aria-hidden="true"
              />
              <h3 className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="display text-2xl">
                  {job.link ? (
                    <a href={job.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 transition-colors hover:text-accent">
                      {job.org} <ExternalLink size={13} className="text-muted-foreground" />
                    </a>
                  ) : (
                    job.org
                  )}
                </span>
                {job.orgNote ? <span className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-accent">{job.orgNote}</span> : null}
              </h3>
              <p className="mt-1 text-sm font-medium text-foreground">{job.role}</p>
              <p className="mt-2 max-w-prose text-sm text-muted-foreground">{job.summary}</p>
              <ul className="mt-4 space-y-2">
                {job.bullets.map((b) => (
                  <li key={b} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                    <span className="mt-[0.6rem] h-px w-3 shrink-0 bg-accent" aria-hidden="true" />
                    {b}
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {job.stack.map((s) => (
                  <span key={s} className="tag">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        );
      })}
    </ol>
  </Section>
);

export default Experience;

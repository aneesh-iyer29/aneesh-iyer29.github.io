import { ExternalLink } from "lucide-react";
import { experience, volunteering } from "@/data/experience";

const Experience = () => {
  return (
    <section id="experience" className="relative py-28 px-6">
      <div className="relative max-w-5xl mx-auto">
        <div className="mb-14">
          <p className="eyebrow mb-3">Experience</p>
          <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground tracking-tight">
            Where I've worked
          </h2>
        </div>

        <div className="space-y-14">
          {experience.map((job) => (
            <article
              key={job.org}
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
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {job.stack.map((item) => (
                    <span key={item} className="tag !text-[0.65rem]">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Volunteering */}
        <div className="mt-20">
          <p className="eyebrow mb-8">Volunteering</p>
          <div className="grid md:grid-cols-2 gap-6">
            {volunteering.map((item) => (
              <div key={item.org} className="card-surface p-6">
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
        </div>
      </div>
    </section>
  );
};

export default Experience;

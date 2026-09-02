import { ArrowUpRight, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import Section from "@/components/layout/Section";
import Reveal from "@/components/layout/Reveal";
import { volunteering } from "@/data/experience";

const Community = () => (
  <Section
    id="community"
    index="04"
    eyebrow="Community"
    title="Volunteering Work"
  >
    <div className="grid gap-6 md:grid-cols-2">
      {volunteering.map((v, i) => (
        <Reveal key={v.org} delay={i * 0.06} className="card-surface flex flex-col p-6">
          <p className="readout text-xs text-muted-foreground">{v.period}</p>
          <h3 className="display mt-2 text-xl">
            {v.link ? (
              <a href={v.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 transition-colors hover:text-accent">
                {v.org} <ExternalLink size={13} className="text-muted-foreground" />
              </a>
            ) : (
              v.org
            )}
          </h3>
          <p className="mt-1 text-sm font-medium text-foreground">{v.role}</p>
          <ul className="mt-4 space-y-2">
            {v.bullets.map((b) => (
              <li key={b} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                <span className="mt-[9px] h-[1.5px] w-3 shrink-0 bg-accent" aria-hidden="true" />
                {b}
              </li>
            ))}
          </ul>
          <div className="mt-auto flex flex-wrap gap-1.5 pt-5">
            {v.stack.map((s) => (
              <span key={s} className="tag">
                {s}
              </span>
            ))}
          </div>
        </Reveal>
      ))}
    </div>
    <Reveal delay={0.12}>
      <Link to="/scioly-tests" className="link mt-8 inline-flex items-center gap-1 text-sm font-medium">
        Browse my Science Olympiad test bank <ArrowUpRight size={14} />
      </Link>
    </Reveal>
  </Section>
);

export default Community;

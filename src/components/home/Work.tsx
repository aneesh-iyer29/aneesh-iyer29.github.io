import { ArrowUpRight, ExternalLink, FileText, Github } from "lucide-react";
import { Link } from "react-router-dom";
import Section from "@/components/layout/Section";
import Reveal from "@/components/layout/Reveal";
import Figure from "@/components/layout/Figure";
import { Demo } from "@/components/demos";
import { projects, type ProjectLink } from "@/data/projects";

const linkIcons: Record<ProjectLink["label"], typeof Github> = {
  Code: Github,
  Demo: ExternalLink,
  Paper: FileText,
};

/* Each project is a numbered figure with the write-up beside it. Figures
   alternate sides so the page reads like a paper's two-column layout. */
const Work = () => (
  <Section
    id="work"
    index="01"
    eyebrow="Selected work"
    title="Four projects, each with a figure."
    lede="Each figure is drawn from the real thing: the paper's own model, the filter's own test data, the benchmark's own numbers. Open a project for the interactive version and the full write-up."
  >
    <div className="space-y-20 md:space-y-28">
      {projects.map((p, i) => {
        const flip = i % 2 === 1;
        return (
          <article key={p.slug} className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
            <Reveal className={`lg:col-span-7 ${flip ? "lg:order-2" : ""}`}>
              <Figure label={`Fig. ${i + 1}`} caption={p.figureCaption}>
                <Demo id={p.demo} interactive={false} />
              </Figure>
            </Reveal>

            <Reveal delay={0.08} className={`lg:col-span-5 ${flip ? "lg:order-1" : ""}`}>
              <div className="flex items-center justify-between gap-3">
                <p className="eyebrow">{p.category}</p>
                <p className="font-mono text-[0.68rem] text-muted-foreground">{p.period}</p>
              </div>
              <h3 className="display mt-3 text-2xl md:text-3xl">
                <Link to={`/projects/${p.slug}`} className="transition-colors hover:text-accent">
                  {p.title}
                </Link>
              </h3>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">{p.description}</p>
              <p className="mt-5 border-l-2 border-accent pl-3 font-mono text-xs leading-relaxed text-foreground">{p.result}</p>
              <ul className="mt-5 space-y-2">
                {p.highlights.slice(0, 2).map((h) => (
                  <li key={h} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                    <span className="mt-[9px] h-[1.5px] w-3 shrink-0 bg-foreground/40" aria-hidden="true" />
                    {h}
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {p.tags.map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                <Link to={`/projects/${p.slug}`} className="link inline-flex items-center gap-1 font-medium">
                  Read the case study <ArrowUpRight size={14} />
                </Link>
                {p.links?.map((l) => {
                  const Icon = linkIcons[l.label];
                  return (
                    <a
                      key={l.href}
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <Icon size={13} /> {l.label}
                    </a>
                  );
                })}
              </div>
            </Reveal>
          </article>
        );
      })}
    </div>
  </Section>
);

export default Work;

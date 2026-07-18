import { ArrowUpRight, ExternalLink, FileText, Github } from "lucide-react";
import { Link } from "react-router-dom";
import { projects, type ProjectLink } from "@/data/projects";

const linkIcons: Record<ProjectLink["label"], typeof Github> = {
  Code: Github,
  Demo: ExternalLink,
  Paper: FileText,
};

const Projects = () => {
  return (
    <section id="projects" className="relative py-28 px-6">
      <div className="relative max-w-5xl mx-auto">
        <div className="mb-12">
          <p className="eyebrow mb-3">Selected projects</p>
          <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground tracking-tight">
            Projects &amp; case studies
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((proj) => (
            <article
              key={proj.slug}
              className="card-surface-hover group relative flex h-full flex-col overflow-hidden"
            >
              {/* Whole-card link to the case study; external links sit above it. */}
              <Link
                to={`/projects/${proj.slug}`}
                aria-label={`${proj.title} case study`}
                className="absolute inset-0 z-[1] rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />

              {/* Media */}
              {proj.image ? (
                <div className="border-b border-foreground/10 bg-secondary overflow-hidden">
                  <img
                    src={proj.image}
                    alt={proj.title}
                    loading="lazy"
                    className="block w-full aspect-[16/9] object-cover object-top"
                  />
                </div>
              ) : (
                <div className="grid place-items-center border-b border-foreground/10 bg-secondary px-6 py-4 text-center aspect-[16/9]">
                  {proj.imagePlaceholder && (
                    <p className="mx-auto max-w-xs text-xs leading-relaxed text-muted-foreground">
                      {proj.imagePlaceholder}
                    </p>
                  )}
                </div>
              )}

              {/* Body */}
              <div className="flex flex-1 flex-col p-6">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="eyebrow !text-[0.62rem]">{proj.category}</span>
                  <span className="font-mono text-xs text-muted-foreground readout">{proj.year}</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{proj.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{proj.description}</p>
                <div className="mt-auto">
                  <p className="font-mono text-xs text-foreground/75 border-t border-foreground/10 pt-3">{proj.result}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {proj.tags.map((t) => (
                      <span key={t} className="tag !text-[0.65rem]">
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Labeled exits: the case study plus direct evidence links. */}
                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-foreground/10 pt-3 text-sm">
                    <span className="inline-flex items-center gap-1 font-medium text-foreground/85 transition-colors group-hover:text-accent">
                      Case study <ArrowUpRight size={14} />
                    </span>
                    {proj.links?.map((l) => {
                      const Icon = linkIcons[l.label];
                      return (
                        <a
                          key={l.href}
                          href={l.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="press relative z-[2] inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Icon size={13} /> {l.label}
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;

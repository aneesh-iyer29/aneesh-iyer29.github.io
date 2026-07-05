import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { projects } from "@/data/projects";

const Projects = () => {
  return (
    <section id="projects" className="relative py-24 px-6 border-t border-border">
      <div className="relative max-w-5xl mx-auto">
        <div className="mb-12">
          <p className="eyebrow mb-3">Selected projects</p>
          <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground tracking-tight">
            Projects &amp; case studies
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((proj) => (
            <Link
              key={proj.slug}
              to={`/projects/${proj.slug}`}
              className="card-surface-hover group flex h-full flex-col overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {/* Media */}
              {proj.image ? (
                <div className="border-b border-border bg-secondary overflow-hidden">
                  <img
                    src={proj.image}
                    alt={proj.title}
                    loading="lazy"
                    className="block w-full aspect-[16/9] object-cover object-top"
                  />
                </div>
              ) : (
                <div className="grid place-items-center border-b border-border bg-secondary px-6 py-4 text-center aspect-[16/9]">
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
                <h3 className="text-lg font-semibold text-foreground mb-2 flex items-start justify-between gap-2">
                  {proj.title}
                  <ArrowUpRight
                    size={15}
                    className="mt-1 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground"
                  />
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{proj.description}</p>
                <div className="mt-auto">
                  <p className="font-mono text-xs text-foreground/75 border-t border-border pt-3">{proj.result}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {proj.tags.map((t) => (
                      <span key={t} className="tag !text-[0.65rem]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;

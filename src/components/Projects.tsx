import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { projects } from "@/data/projects";
import { RLLoop, Constellation, BlockStack, TelemetryBars, DraftMark } from "@/components/decor";

const Projects = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="projects" className="relative overflow-hidden py-24 px-6 border-t border-border">
      <RLLoop className="right-[-150px] top-[250px] w-[380px] hidden lg:block" />
      <Constellation className="left-[-80px] bottom-[100px] w-[260px] hidden lg:block" />
      <BlockStack className="right-[-24px] bottom-[130px] w-[190px] hidden lg:block" />
      <TelemetryBars className="left-[36px] top-[230px] w-[120px] hidden xl:block" />
      <DraftMark className="left-10 top-16" />
      <DraftMark className="right-10 bottom-12" />
      <div className="relative max-w-5xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 flex flex-wrap items-end justify-between gap-4"
        >
          <div>
            <p className="eyebrow mb-3">Selected projects</p>
            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground tracking-tight">
              Projects &amp; case studies
            </h2>
          </div>
          <p className="font-mono text-xs text-muted-foreground readout">{projects.length} entries</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((proj, i) => (
            <motion.div
              key={proj.slug}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: i * 0.06 }}
            >
              <Link
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
                      className="block w-full aspect-[16/9] object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  </div>
                ) : (
                  <div
                    className="grid place-items-center border-b border-border bg-secondary px-6 py-4 text-center aspect-[16/9]"
                    style={{
                      backgroundImage:
                        "linear-gradient(hsl(var(--foreground) / 0.04) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground) / 0.04) 1px, transparent 1px)",
                      backgroundSize: "24px 24px",
                    }}
                  >
                    <div>
                      <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-accent">Image slot</p>
                      {proj.imagePlaceholder && (
                        <p className="mx-auto mt-2 max-w-xs text-xs leading-relaxed text-muted-foreground">
                          {proj.imagePlaceholder}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Body */}
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="eyebrow !text-[0.62rem]">{proj.category}</span>
                    <span className="font-mono text-xs text-muted-foreground readout">{proj.year}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 flex items-start gap-1.5">
                    {proj.title}
                    <ArrowUpRight
                      size={15}
                      className="mt-1 shrink-0 text-muted-foreground opacity-0 -translate-x-1 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0"
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;

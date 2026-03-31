import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { projects } from "@/data/projects";

const Projects = () => {
  const ref = useRef(null);
  const navigate = useNavigate();
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="projects" className="py-24 px-6 border-t border-border">
      <div className="max-w-4xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="section-label mb-3">Selected Work</p>
          <h2 className="text-3xl md:text-4xl font-serif text-foreground">Projects & Research</h2>
        </motion.div>

        <div className="space-y-4">
          {projects.map((proj, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="card-surface-hover p-6 md:p-8 group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              role="link"
              tabIndex={0}
              onClick={() => navigate(`/projects/${proj.slug}`)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  navigate(`/projects/${proj.slug}`);
                }
              }}
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="tag-accent text-[11px]">{proj.category}</span>
                    {proj.link && (
                      <a
                        href={proj.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(event) => event.stopPropagation()}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{proj.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">{proj.description}</p>
                  <p className="text-xs font-medium text-foreground/70">{proj.result}</p>
                </div>

                <div className="flex flex-wrap md:flex-col md:items-end gap-1.5 shrink-0">
                  {proj.tags.map((t) => (
                    <span key={t} className="tag text-[11px]">{t}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;

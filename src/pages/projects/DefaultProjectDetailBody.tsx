import { motion } from "framer-motion";
import type { ProjectDetailBodyProps } from "@/pages/projects/types";

export function DefaultProjectDetailBody({ project }: ProjectDetailBodyProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.08 }}
      className="grid gap-6 md:grid-cols-[1.4fr_0.9fr]"
    >
      <article className="card-surface p-7">
        <p className="section-label mb-3">Overview</p>
        <p className="text-base text-muted-foreground leading-relaxed mb-6">{project.description}</p>
        <div>
          <p className="section-label mb-3">Key Contributions</p>
          <ul className="space-y-3">
            {project.highlights.map((highlight) => (
              <li key={highlight} className="text-sm text-muted-foreground leading-relaxed pl-4 relative">
                <span className="absolute left-0 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
                {highlight}
              </li>
            ))}
          </ul>
        </div>
      </article>

      <aside className="card-surface p-7">
        <p className="section-label mb-3">Outcome</p>
        <p className="text-lg font-semibold text-foreground leading-snug mb-6">{project.result}</p>
        <div>
          <p className="section-label mb-3">Project Focus</p>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span key={tag} className="tag-accent">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </aside>
    </motion.section>
  );
}


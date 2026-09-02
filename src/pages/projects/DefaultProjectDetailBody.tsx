import type { ProjectDetailBodyProps } from "@/pages/projects/types";
import { Highlights, P, Stat } from "@/components/casestudy";

/* Fallback body for a project without a registered deep dive. */
export function DefaultProjectDetailBody({ project }: ProjectDetailBodyProps) {
  return (
    <section className="grid gap-12 md:grid-cols-[1.4fr_0.9fr] md:gap-16">
      <div>
        <p className="eyebrow mb-4">Overview</p>
        <P>{project.description}</P>
        <div className="mt-10">
          <Highlights items={project.highlights} />
        </div>
      </div>

      <aside className="card-surface h-fit p-6">
        <p className="eyebrow mb-3">Outcome</p>
        <p className="display text-xl leading-snug text-foreground">{project.result}</p>
        <div className="mt-6 border-t border-border pt-5">
          <Stat
            label="Focus"
            value={
              <span className="flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span key={tag} className="tag-accent">
                    {tag}
                  </span>
                ))}
              </span>
            }
          />
        </div>
      </aside>
    </section>
  );
}

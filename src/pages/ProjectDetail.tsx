import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { ProjectCaseStudySections, ProjectMetricsGrid } from "@/components/project-detail/ProjectCaseStudySections";
import { getProjectBySlug } from "@/data/projects";
import NotFound from "./NotFound";

const ProjectDetail = () => {
  const { slug } = useParams();
  const project = getProjectBySlug(slug);

  if (!project) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12"
        >
          <ArrowLeft size={15} /> Back to portfolio
        </Link>

        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-10 w-full"
        >
          <p className="section-label mb-3">{project.category}</p>
          <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-4">{project.title}</h1>
          <p className="text-base text-muted-foreground leading-relaxed max-w-3xl mb-6">
            {project.detail}
          </p>
          <p className="max-w-3xl text-sm leading-relaxed text-foreground/80 md:text-base">{project.caseStudyIntro}</p>

          <div className="flex flex-wrap items-center gap-3">
            {project.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border text-sm text-foreground hover:bg-secondary transition-colors"
              >
                <ExternalLink size={14} /> View external link
              </a>
            )}
          </div>
        </motion.header>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.35fr_0.82fr]"
        >
          <div className="space-y-6">
            <ProjectMetricsGrid metrics={project.metrics} />
            <ProjectCaseStudySections sections={project.sections} />
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <section className="card-surface p-7">
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
            </section>

            <section className="card-surface p-7">
              <p className="section-label mb-3">Overview</p>
              <p className="text-sm leading-relaxed text-muted-foreground mb-6">{project.description}</p>
              <div>
                <p className="section-label mb-3">Key Contributions</p>
                <ul className="space-y-3">
                  {project.highlights.map((highlight) => (
                    <li key={highlight} className="relative pl-4 text-sm leading-relaxed text-muted-foreground">
                      <span className="absolute left-0 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </aside>
        </motion.section>
      </div>
    </div>
  );
};

export default ProjectDetail;
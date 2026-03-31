import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import type { PropsWithChildren } from "react";
import type { ProjectItem } from "@/data/projects";

export function ProjectDetailLayout({ project, children }: PropsWithChildren<{ project: ProjectItem }>) {
  return (
    <div className="min-h-screen bg-background">
      <div className="w-[80%] max-w-none mx-auto px-6 py-12">
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
          <p className="text-base text-muted-foreground leading-relaxed w-full mb-6 whitespace-pre-line">
            {project.detail}
          </p>

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

        {children}
      </div>
    </div>
  );
}


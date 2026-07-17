import { ArrowLeft, ExternalLink, FileText, Github } from "lucide-react";
import { Link } from "react-router-dom";
import type { PropsWithChildren } from "react";
import type { ProjectItem, ProjectLink } from "@/data/projects";

const linkIcons: Record<ProjectLink["label"], typeof Github> = {
  Code: Github,
  Demo: ExternalLink,
  Paper: FileText,
};

export function ProjectDetailLayout({ project, children }: PropsWithChildren<{ project: ProjectItem }>) {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12"
        >
          <ArrowLeft size={15} /> Back to portfolio
        </Link>

        <header className="mb-10 w-full">
          <p className="eyebrow mb-3">{project.category}</p>
          <h1 className="text-4xl md:text-5xl font-serif font-semibold tracking-tight text-foreground mb-4">{project.title}</h1>
          <p className="text-base text-muted-foreground leading-relaxed w-full mb-6 whitespace-pre-line">
            {project.detail}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            {project.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
            {project.links?.map((l) => {
              const Icon = linkIcons[l.label];
              return (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="press inline-flex items-center gap-2 px-4 py-2 rounded-md border border-border text-sm text-foreground hover:bg-secondary transition-colors"
                >
                  <Icon size={14} /> {l.label}
                </a>
              );
            })}
          </div>
        </header>

        {children}
      </div>
    </div>
  );
}

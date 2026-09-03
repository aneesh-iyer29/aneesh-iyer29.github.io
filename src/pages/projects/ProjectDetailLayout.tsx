import { ArrowLeft, ArrowRight, ExternalLink, FileText, Github } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import type { PropsWithChildren } from "react";
import PageShell from "@/components/layout/PageShell";
import { ImgFigure } from "@/components/casestudy";
import { projects, type ProjectItem, type ProjectLink } from "@/data/projects";
import Figure from "@/components/layout/Figure";
import { Demo } from "@/components/demos";
import { heroCaptions, heroInset, heroLabels, heroNotes, heroPlacement, heroWidth } from "@/pages/projects/heroCaptions";

const linkIcons: Record<ProjectLink["label"], typeof Github> = {
  Code: Github,
  Demo: ExternalLink,
  Paper: FileText,
};

/* The frame every project page shares: a research-paper style header
   (back link, category, title, mono metadata, lede, hero figure), then the
   deep-dive body, then a link to the next project in the list. */
export function ProjectDetailLayout({ project, children }: PropsWithChildren<{ project: ProjectItem }>) {
  const reduce = useReducedMotion();
  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(index + 1) % projects.length];
  const caption = heroCaptions[project.slug] ?? project.result;
  const note = heroNotes[project.slug];
  const placement = heroPlacement[project.slug] ?? "after";
  const media =
    project.image && placement !== "none" ? (
      <ImgFigure
        src={project.image}
        alt={project.title}
        label={heroLabels[project.slug] ?? "Fig. 2"}
        note={note}
        caption={caption}
        inset={heroInset.has(project.slug)}
        loading={placement === "after" ? "eager" : "lazy"}
        className={`${placement === "after" ? "mt-8" : "mt-16"} ${heroWidth[project.slug] ?? ""}`}
      />
    ) : null;

  return (
    <PageShell>
      <motion.article
        initial={reduce ? { opacity: 1 } : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-[60rem] px-6 pb-24 pt-28 md:pt-32"
      >
        <Link
          to="/#work"
          className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft size={13} aria-hidden="true" /> All work
        </Link>

        <header className="mt-10">
          <p className="eyebrow">{project.category}</p>
          <h1 className="display mt-4 text-4xl leading-[1.05] text-foreground md:text-5xl">{project.title}</h1>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
            <span className="readout text-xs text-muted-foreground">{project.period}</span>
            <span aria-hidden="true" className="hidden h-3 w-px bg-border sm:block" />
            <ul className="flex flex-wrap items-center gap-1.5" aria-label="Tags">
              {project.tags.map((tag) => (
                <li key={tag} className="tag">
                  {tag}
                </li>
              ))}
            </ul>
            {project.links?.length ? (
              <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
                {project.links.map((l) => {
                  const Icon = linkIcons[l.label];
                  return (
                    <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className={`${l.label === "Paper" ? "btn-accent" : "btn-secondary"} btn-compact`}>
                      <Icon size={13} aria-hidden="true" /> {l.label}
                    </a>
                  );
                })}
              </div>
            ) : null}
          </div>

          <p className="mt-8 whitespace-pre-line text-lg leading-relaxed text-muted-foreground md:text-xl md:leading-[1.6]">
            {project.detail}
          </p>
        </header>

        <Figure label="Fig. 1" caption={project.figureCaption} className="mt-12">
          <Demo id={project.demo} interactive />
        </Figure>

        {placement === "after" ? media : null}

        <div className="mt-16">{children}</div>

        {placement === "end" ? media : null}

        <nav aria-label="Next project" className="mt-24 border-t border-border pt-8">
          <p className="eyebrow">Next project</p>
          <Link to={`/projects/${next.slug}`} className="group mt-3 inline-flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="display text-2xl text-foreground transition-colors group-hover:text-accent md:text-3xl">{next.title}</span>
            <span className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground">
              {next.category}
              <ArrowRight
                size={13}
                aria-hidden="true"
                className="transition-transform duration-300 ease-out group-hover:translate-x-0.5"
              />
            </span>
          </Link>
        </nav>
      </motion.article>
    </PageShell>
  );
}

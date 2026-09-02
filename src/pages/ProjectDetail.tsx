import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { getProjectBySlug } from "@/data/projects";
import NotFound from "./NotFound";
import { ProjectDetailLayout } from "@/pages/projects/ProjectDetailLayout";
import { DefaultProjectDetailBody } from "@/pages/projects/DefaultProjectDetailBody";
import { projectDetailBodies } from "@/pages/projects/projectDetailBodies";

const ProjectDetail = () => {
  const { slug } = useParams();
  const project = getProjectBySlug(slug);

  // Open each project at the top, without animating up through the
  // previous page's scroll position.
  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    html.style.scrollBehavior = prev;
  }, [slug]);

  if (!project) {
    return <NotFound />;
  }

  const Body = (slug && projectDetailBodies[slug]) ?? DefaultProjectDetailBody;

  return (
    <ProjectDetailLayout key={project.slug} project={project}>
      <Body project={project} />
    </ProjectDetailLayout>
  );
};

export default ProjectDetail;

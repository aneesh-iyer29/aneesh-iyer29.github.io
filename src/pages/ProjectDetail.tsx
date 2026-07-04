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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!project) {
    return <NotFound />;
  }

  const Body = (slug && projectDetailBodies[slug]) ?? DefaultProjectDetailBody;

  return (
    <ProjectDetailLayout project={project}>
      <Body project={project} />
    </ProjectDetailLayout>
  );
};

export default ProjectDetail;

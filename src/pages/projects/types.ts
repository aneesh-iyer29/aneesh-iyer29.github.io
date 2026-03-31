import type React from "react";
import type { ProjectItem } from "@/data/projects";

export type ProjectDetailBodyProps = {
  project: ProjectItem;
};

export type ProjectDetailBodyComponent = React.ComponentType<ProjectDetailBodyProps>;


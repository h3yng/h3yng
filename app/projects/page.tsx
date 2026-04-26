import { getAllWork } from "@/lib/mdx";
import { ProjectsGallery } from "./ProjectsGallery";

export default function ProjectsPage() {
  const works = getAllWork();
  return <ProjectsGallery projects={works} />;
}

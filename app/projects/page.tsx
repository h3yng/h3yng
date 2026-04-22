import type { Metadata } from "next";
import { projects } from "@/content/projects";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Work",
  description: "Projects, experiments, and tools built by bashNeko.",
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    type: "website",
    title: `Work | ${siteConfig.title}`,
    description: "Projects, experiments, and tools built by bashNeko.",
    url: absoluteUrl("/projects"),
  },
};

export default function ProjectsPage() {
  return (
    <main className="site-shell">
      <header className="intro block-reveal">
        <p className="kicker">work</p>
        <h1>things I shipped</h1>
        <p className="lead">A full list of tools, experiments, and builds.</p>
      </header>

      <section className="section block-reveal">
        <ul className="project-list">
          {projects.map((project) => (
            <li key={project.name} className="project-item">
              <img
                className="project-media"
                src={project.image}
                alt={`${project.name} preview`}
                loading="lazy"
              />
              <p className="project-title">{project.name}</p>
              <p>{project.summary}</p>
              <p className="meta">{project.stack}</p>
              <p className="project-links">
                <a href={project.githubUrl}>github</a>
                {project.liveUrl ? (
                  <>
                    <span className="meta">/</span>
                    <a href={project.liveUrl}>live</a>
                  </>
                ) : null}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

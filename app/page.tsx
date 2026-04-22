import Link from "next/link";
import { projects } from "@/content/projects";
import { getHomePostsMeta } from "@/lib/blog";

export default async function Home() {
  const featuredProjects = projects.filter((project) => project.showOnHome);
  const notes = await getHomePostsMeta(3);

  return (
    <main className="site-shell">
      <header className="intro block-reveal">
        <p className="kicker">bashNeko</p>
        <h1>minimal text. terminal mindset.</h1>
        <p className="lead">
          I build small sharp tools for terminal-driven workflows.
        </p>
        <p className="meta">TypeScript / Go / Lua / JavaScript</p>
        <nav aria-label="Primary" className="menu">
          <a href="/projects">work</a>
          <a href="/writing">writing</a>
          <a href="https://github.com/bashnko">github</a>
        </nav>
      </header>

      <section id="work" className="section block-reveal">
        <h2>work</h2>
        <ul className="project-list">
          {featuredProjects.map((project) => (
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
        <p>
          <Link href="/projects">see all work</Link>
        </p>
      </section>

      <section id="writing" className="section block-reveal">
        <h2>writing</h2>
        <ul className="note-list">
          {notes.map((note) => (
            <li key={note.slug}>
              <p>
                <span className="meta">{note.date}</span>{" "}
                <Link href={`/blog/${note.slug}`}>{note.title}</Link>
              </p>
              <p>{note.description}</p>
            </li>
          ))}
        </ul>
        <p>
          <Link href="/writing">see all posts</Link>
        </p>
      </section>
    </main>
  );
}

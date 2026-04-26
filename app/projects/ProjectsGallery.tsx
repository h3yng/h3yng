"use client";

import React, { useState, useEffect } from "react";
import { WorkMeta } from "@/lib/mdx";
import { useResizable } from "@/app/components/useResizable";

export function ProjectsGallery({ projects }: { projects: { meta: WorkMeta, content: string }[] }) {
  const [activeProjectId, setActiveProjectId] = useState<string>(projects[0]?.meta.id || "");
  const { width, startResizing } = useResizable(256, 160, 480);

  useEffect(() => {
    if (projects.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveProjectId(entry.target.id);
          }
        });
      },
      { rootMargin: "-10% 0px -70% 0px", threshold: 0 }
    );
    projects.forEach((p) => {
      const el = document.getElementById(p.meta.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [projects]);

  const scrollToProject = (id: string) => {
    setActiveProjectId(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <aside 
            className="shrink-0 border-r border-[var(--border)] overflow-hidden hidden md:block z-10 relative bg-[var(--background)]"
            style={{ width }}
      >
        <div className="h-full flex flex-col relative" style={{ width }}>
            <div className="px-4 pt-5 pb-3 text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)] flex justify-between items-center shrink-0 whitespace-nowrap">
              <span className="opacity-70">Outline</span>
            </div>
            <div className="flex-1 overflow-y-auto overflow-x-hidden whitespace-nowrap">
              {projects.map((project) => (
                <button
                  key={project.meta.id}
                  onClick={() => scrollToProject(project.meta.id)}
                  className="sidebar-nav-item flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm cursor-pointer transition-all duration-150 border-b border-[var(--border)] h-11"
                  style={{
                    background: activeProjectId === project.meta.id ? "var(--sidebar-active)" : "transparent",
                    color: activeProjectId === project.meta.id ? "var(--foreground)" : "var(--muted-foreground)",
                  }}
                >
                  <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  <span className="truncate">{project.meta.title}</span>
                </button>
              ))}
            </div>
            <div className="w-2.5 cursor-col-resize absolute right-0 top-0 bottom-0 z-20 hover:bg-[var(--foreground)] opacity-0 hover:opacity-10 transition-opacity" onMouseDown={startResizing} />
        </div>
      </aside>

      <main id="main-scroll-area" className="flex min-w-0 flex-1 flex-col overflow-y-auto relative scroll-smooth bg-transparent h-full">
        <header className="px-5 py-3 border-b border-[var(--border)] shrink-0 bg-[var(--background)]/80 backdrop-blur top-0 sticky z-10 flex items-center justify-between">
          <div>
            <h1 className="text-sm font-medium uppercase tracking-wide text-[var(--muted-foreground)]">Projects Gallery</h1>
            <p className="text-xs text-[var(--muted-foreground)] opacity-70 mt-0.5">Directory of applications and dashboards</p>
          </div>
        </header>

        <div className="p-5 sm:p-8 flex-1 animate-enter">
          <div className="max-w-6xl animate-enter">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 pb-32 pt-2">
              {projects.map((project) => (
                <div id={project.meta.id} key={project.meta.id} className="scroll-mt-24 group flex flex-col border border-[var(--border)] bg-[var(--card)] transition-colors hover:border-[var(--ring)]">
                  <div className="relative aspect-[2/1] w-full bg-[var(--surface)] overflow-hidden flex flex-col items-center justify-center border-b border-[var(--border)]">
                    {project.meta.imageUrl ? (
                      <img src={project.meta.imageUrl} alt={project.meta.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="w-[80%] h-[70%] border border-[var(--border)] bg-[var(--background)] shadow-sm rounded-sm flex flex-col mt-4">
                        <div className="border-b border-[var(--border)] h-3 w-full flex items-center px-1 gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-[var(--border)]" />
                          <div className="w-1.5 h-1.5 rounded-full bg-[var(--border)]" />
                          <div className="w-1.5 h-1.5 rounded-full bg-[var(--border)]" />
                        </div>
                        <div className="flex-1 flex p-2 gap-2">
                           <div className="w-4 h-full border border-[var(--border)] bg-[var(--sidebar-bg)]" />
                           <div className="flex-1 h-full border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center">
                              <svg className="w-8 h-8 text-[var(--muted-foreground)] opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                           </div>
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[var(--card)] to-transparent" />
                  </div>
                  <div className="flex flex-col flex-1 p-5 lg:p-6">
                    <div className="flex items-start justify-between mb-2 gap-4">
                      <h2 className="text-xl font-semibold tracking-tight text-[var(--foreground)]">{project.meta.title}</h2>
                      <a href={`https://${project.meta.repoUrl}`} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors mt-1 shrink-0" title="View Source">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                    <p className="text-sm text-[var(--muted-foreground)] leading-relaxed mb-6 flex-1">{project.meta.summary}</p>
                    <div className="mt-auto">
                      <ul className="flex flex-wrap gap-2 pt-5 border-t border-[var(--border)] border-opacity-50">
                        {project.meta.stack.map((item) => (
                          <li key={item} className="text-[0.65rem] uppercase tracking-wider font-semibold text-[var(--muted-foreground)] bg-[var(--surface)] border border-[var(--border)] px-2 py-0.5">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

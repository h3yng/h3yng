"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BlogMeta } from "@/lib/mdx";
import { useResizable } from "@/app/components/useResizable";

export function BlogsSidebar({ blogs }: { blogs: BlogMeta[] }) {
  const pathname = usePathname();
  const { width, startResizing } = useResizable(256, 160, 480);
  
  return (
    <aside 
       className="shrink-0 border-r border-[var(--border)] overflow-hidden hidden md:block z-10 bg-[var(--background)] relative"
       style={{ width }}
    >
      <div className="h-full flex flex-col relative" style={{ width }}>
        <div className="px-4 pt-5 pb-3 text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)] whitespace-nowrap flex justify-between items-center shrink-0 bg-[var(--background)]">
          <span className="opacity-70">Files</span>
        </div>
        <div className="bg-[var(--background)] flex-1 overflow-y-auto overflow-x-hidden whitespace-nowrap">
          {blogs.map((blog) => {
            const isActive = pathname === `/blogs/${blog.slug}`;
            return (
              <Link
                href={`/blogs/${blog.slug}`}
                key={blog.slug}
                className="sidebar-nav-item flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm cursor-pointer transition-all duration-150 border-b border-[var(--border)] decoration-transparent hover:no-underline h-11"
                style={{
                  background: isActive ? "var(--sidebar-active)" : "transparent",
                  color: isActive ? "var(--foreground)" : "var(--muted-foreground)",
                }}
              >
                <svg className="h-4 w-4 shrink-0 text-[var(--muted-foreground)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                   <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="truncate">{blog.title}</span>
              </Link>
            );
          })}
        </div>
        <div className="w-2.5 cursor-col-resize absolute right-0 top-0 bottom-0 z-20 hover:bg-[var(--foreground)] opacity-0 hover:opacity-10 transition-opacity" onMouseDown={startResizing} />
      </div>
    </aside>
  );
}

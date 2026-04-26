import React from "react";
import { getAllBlogs } from "@/lib/mdx";
import { BlogsSidebar } from "./BlogsSidebar";

export default function BlogsLayout({ children }: { children: React.ReactNode }) {
  const blogs = getAllBlogs();
  const metas = blogs.map((b) => b.meta);

  return (
    <>
      <BlogsSidebar blogs={metas} />
      {children}
    </>
  );
}

import React from "react";
import { getBlogBySlug, getBlogSlugs } from "@/lib/mdx";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import { CodeBlock } from "@/app/components/CodeBlock";

export async function generateStaticParams() {
  const slugs = getBlogSlugs();
  return slugs.map((slug) => ({ slug: slug.replace(/\.mdx$/, "") }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { meta, content } = getBlogBySlug(slug);

  return (
    <main id="main-scroll-area" className="flex min-w-0 flex-1 flex-col overflow-y-auto relative scroll-smooth bg-transparent h-full">
      <header className="px-5 py-3 border-b border-[var(--border)] shrink-0 bg-[var(--background)]/80 backdrop-blur top-0 sticky z-10 flex items-center justify-between">
        <div>
          <h1 className="text-sm font-medium uppercase tracking-wide text-[var(--muted-foreground)]">File Editor</h1>
          <p className="text-xs text-[var(--muted-foreground)] opacity-70 mt-0.5">{meta.slug}.mdx</p>
        </div>
      </header>
      <div className="p-5 sm:p-12 flex-1 animate-enter max-w-4xl mx-auto w-full pb-32 mt-4">
         <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[var(--foreground)] mb-6">{meta.title}</h1>
         <div className="flex gap-4 items-center text-sm text-[var(--muted-foreground)] font-mono mb-12 opacity-80 pb-6 border-b border-[var(--border)]">
            <span>{meta.date}</span>
            {meta.readTime && <><span>•</span><span>{meta.readTime}</span></>}
         </div>
         
         <div className="prose prose-base dark:prose-invert text-[var(--foreground)] leading-loose opacity-[0.85] max-w-none font-sans prose-pre:border prose-pre:border-[var(--border)] prose-pre:bg-[var(--surface)] prose-pre:p-4 prose-pre:overflow-x-auto prose-pre:max-w-full prose-code:before:hidden prose-code:after:hidden prose-headings:text-[var(--foreground)] prose-headings:font-semibold">
           <MDXRemote 
              source={content} 
              components={{ pre: CodeBlock }}
              options={{
                  mdxOptions: {
                      remarkPlugins: [remarkGfm],
                      rehypePlugins: [[rehypePrettyCode, { theme: "github-dark" }]]
                  }
              }} 
           />
         </div>
      </div>
    </main>
  );
}

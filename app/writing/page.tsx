import type { Metadata } from "next";
import Link from "next/link";
import { getAllPostsMeta } from "@/lib/blog";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Writing",
  description: "Build logs, terminal workflows, and project deep dives.",
  alternates: {
    canonical: "/writing",
  },
  openGraph: {
    type: "website",
    title: `Writing | ${siteConfig.title}`,
    description: "Build logs, terminal workflows, and project deep dives.",
    url: absoluteUrl("/writing"),
  },
};

export default async function WritingPage() {
  const posts = await getAllPostsMeta();

  return (
    <main className="site-shell">
      <header className="intro block-reveal">
        <p className="kicker">writing</p>
        <h1>posts and build logs</h1>
        <p className="lead">Short practical notes on code, tools, and workflow.</p>
      </header>

      <section className="section block-reveal">
        <ul className="note-list">
          {posts.map((post) => (
            <li key={post.slug}>
              <p>
                <span className="meta">{post.date}</span>{" "}
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </p>
              <p>{post.description}</p>
              {post.tags && post.tags.length > 0 ? (
                <p className="meta">{post.tags.join(" / ")}</p>
              ) : null}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import CodeBlockEnhancer from "@/components/code-block-enhancer";
import { getPostBySlug, getPostSlugs } from "@/lib/blog";
import { absoluteUrl, siteConfig } from "@/lib/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post not found",
    };
  }

  const canonical = post.canonicalUrl ?? absoluteUrl(`/blog/${post.slug}`);

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "article",
      url: canonical,
      title: post.title,
      description: post.description,
      siteName: siteConfig.name,
      publishedTime: post.date,
      modifiedTime: post.updatedAt ?? post.date,
      authors: [siteConfig.author],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const compiled = await compileMDX({
    source: post.content,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          [
            rehypePrettyCode,
            {
              theme: {
                dark: "gruvbox-dark-hard",
                light: "github-light",
              },
              keepBackground: false,
            },
          ],
        ],
      },
    },
  });

  const canonical = post.canonicalUrl ?? absoluteUrl(`/blog/${post.slug}`);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updatedAt ?? post.date,
    author: {
      "@type": "Person",
      name: siteConfig.author,
    },
    publisher: {
      "@type": "Person",
      name: siteConfig.author,
    },
    mainEntityOfPage: canonical,
    url: canonical,
    keywords: post.tags,
  };

  return (
    <main className="site-shell">
      <article className="section block-reveal">
        <p className="kicker">{post.date}</p>
        <h1>{post.title}</h1>
        <p className="lead">{post.description}</p>
        {post.updatedAt ? <p className="meta">updated {post.updatedAt}</p> : null}
        <div className="blog-prose">{compiled.content}</div>
      </article>
      <CodeBlockEnhancer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}

import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type BlogPostFrontmatter = {
  title: string;
  description: string;
  date: string;
  updatedAt?: string;
  tags?: string[];
  draft?: boolean;
  canonicalUrl?: string;
  showOnHome?: boolean;
};

export type BlogPostMeta = BlogPostFrontmatter & {
  slug: string;
};

export type BlogPost = BlogPostMeta & {
  content: string;
};

const BLOG_DIR = path.join(process.cwd(), "content", "posts");

function sortByDateDescending(posts: BlogPostMeta[]) {
  return [...posts].sort(
    (a, b) =>
      new Date(b.updatedAt ?? b.date).getTime() -
      new Date(a.updatedAt ?? a.date).getTime(),
  );
}

function isPublished(post: BlogPostMeta) {
  if (process.env.NODE_ENV !== "production") {
    return true;
  }

  return !post.draft;
}

function withDefaultFrontmatter(
  slug: string,
  frontmatter: Partial<BlogPostFrontmatter>,
): BlogPostMeta {
  return {
    slug,
    title: frontmatter.title ?? slug,
    description: frontmatter.description ?? "",
    date: frontmatter.date ?? new Date().toISOString(),
    updatedAt: frontmatter.updatedAt,
    tags: frontmatter.tags ?? [],
    draft: frontmatter.draft ?? false,
    canonicalUrl: frontmatter.canonicalUrl,
    showOnHome: frontmatter.showOnHome ?? false,
  };
}

export async function getAllPostsMeta(): Promise<BlogPostMeta[]> {
  const fileNames = await fs.readdir(BLOG_DIR);
  const candidates = fileNames.filter(
    (name) => name.endsWith(".mdx") || name.endsWith(".md"),
  );

  const posts = await Promise.all(
    candidates.map(async (fileName) => {
      const fullPath = path.join(BLOG_DIR, fileName);
      const source = await fs.readFile(fullPath, "utf8");
      const { data } = matter(source);
      const slug = fileName.replace(/\.(mdx|md)$/, "");

      return withDefaultFrontmatter(slug, data as Partial<BlogPostFrontmatter>);
    }),
  );

  return sortByDateDescending(posts.filter(isPublished));
}

export async function getPostSlugs(): Promise<string[]> {
  const posts = await getAllPostsMeta();
  return posts.map((post) => post.slug);
}

export async function getHomePostsMeta(limit = 3): Promise<BlogPostMeta[]> {
  const posts = await getAllPostsMeta();
  const selected = posts.filter((post) => post.showOnHome);

  return selected.slice(0, limit);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const mdxPath = path.join(BLOG_DIR, `${slug}.mdx`);
  const mdPath = path.join(BLOG_DIR, `${slug}.md`);

  let fullPath = mdxPath;

  try {
    await fs.access(mdxPath);
  } catch {
    try {
      await fs.access(mdPath);
      fullPath = mdPath;
    } catch {
      return null;
    }
  }

  const source = await fs.readFile(fullPath, "utf8");
  const { content, data } = matter(source);
  const post = withDefaultFrontmatter(slug, data as Partial<BlogPostFrontmatter>);

  if (!isPublished(post)) {
    return null;
  }

  return {
    ...post,
    content,
  };
}

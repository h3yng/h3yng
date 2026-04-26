import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOGS_DIR = path.join(process.cwd(), "content/blogs");
const WORK_DIR = path.join(process.cwd(), "content/work");

export type BlogMeta = {
  slug: string;
  title: string;
  date: string;
  readTime?: string;
  summary?: string;
};

export type WorkMeta = {
  id: string; 
  title: string;
  repoUrl: string;
  summary: string;
  stack: string[];
  imageUrl?: string;
};

export function getBlogSlugs() {
  if (!fs.existsSync(BLOGS_DIR)) return [];
  return fs.readdirSync(BLOGS_DIR).filter((file) => file.endsWith(".mdx"));
}

export function getBlogBySlug(slug: string) {
  const realSlug = slug.replace(/\.mdx$/, "");
  const fullPath = path.join(BLOGS_DIR, `${realSlug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    meta: {
      ...data,
      slug: realSlug,
      title: data.title || "Untitled",
      date: data.date || "Unknown Date",
      readTime: data.readTime || "",
      summary: data.summary || "",
    } as BlogMeta,
    content,
  };
}

export function getAllBlogs() {
  const slugs = getBlogSlugs();
  const blogs = slugs.map((slug) => getBlogBySlug(slug));
  return blogs.sort((a, b) => (new Date(a.meta.date).getTime() > new Date(b.meta.date).getTime() ? -1 : 1));
}


export function getWorkSlugs() {
  if (!fs.existsSync(WORK_DIR)) return [];
  return fs.readdirSync(WORK_DIR).filter((file) => file.endsWith(".mdx") || file.endsWith(".md"));
}

export function getWorkBySlug(slug: string) {
  const realSlug = slug.replace(/\.mdx?$/, "");
  let fullPath = path.join(WORK_DIR, `${realSlug}.mdx`);
  if (!fs.existsSync(fullPath)) {
    fullPath = path.join(WORK_DIR, `${realSlug}.md`);
  }
  
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    meta: {
      ...data,
      id: realSlug,
      title: data.title || "Untitled Project",
      repoUrl: data.repoUrl || "",
      summary: data.summary || "",
      stack: data.stack || [],
      imageUrl: data.imageUrl || undefined,
    } as WorkMeta,
    content,
  };
}

export function getAllWork() {
  const slugs = getWorkSlugs();
  // Using reverse to simulate chronological or weight sorting easily, normally you'd use a date or priority token.
  const works = slugs.map((slug) => getWorkBySlug(slug));
  return works;
}

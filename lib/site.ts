export const siteConfig = {
  name: "bashNeko",
  title: "bashNeko",
  description: "Terminal-first builder. Minimal notes and practical projects.",
  author: "bashnko",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://bashneko.dev",
  githubUrl: "https://github.com/bashnko",
};

export function absoluteUrl(pathname = "/") {
  return new URL(pathname, siteConfig.url).toString();
}

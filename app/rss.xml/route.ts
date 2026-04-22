import { getAllPostsMeta } from "@/lib/blog";
import { absoluteUrl, siteConfig } from "@/lib/site";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export async function GET() {
  const posts = await getAllPostsMeta();
  const items = posts
    .map((post) => {
      const link = absoluteUrl(`/blog/${post.slug}`);

      return [
        "<item>",
        `<title>${escapeXml(post.title)}</title>`,
        `<description>${escapeXml(post.description)}</description>`,
        `<link>${link}</link>`,
        `<guid>${link}</guid>`,
        `<pubDate>${new Date(post.date).toUTCString()}</pubDate>`,
        "</item>",
      ].join("");
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(siteConfig.title)}</title>
    <description>${escapeXml(siteConfig.description)}</description>
    <link>${siteConfig.url}</link>
    <language>en-us</language>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
    },
  });
}

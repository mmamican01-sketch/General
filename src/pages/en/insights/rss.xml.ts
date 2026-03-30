import type { APIRoute } from "astro";
import { loadAllInsights } from "../../../lib/contentStore";

export const GET: APIRoute = ({ site }) => {
  const siteUrl = (site?.toString() ?? "https://general-gjpn.vercel.app").replace(/\/$/, "");
  const insights = loadAllInsights();

  function esc(str: string): string {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  const items = insights
    .map((item) => {
      const link = `${siteUrl}/en/insights/${item.slug}/`;
      const pubDate = item.publishDate
        ? new Date(item.publishDate).toUTCString()
        : new Date().toUTCString();
      return `    <item>
      <title><![CDATA[${item.title ?? "Market Insight"}]]></title>
      <description><![CDATA[${item.shortDescription ?? ""}]]></description>
      <link>${esc(link)}</link>
      <guid isPermaLink="true">${esc(link)}</guid>
      <pubDate>${pubDate}</pubDate>
    </item>`;
    })
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>AL Farhan General Trading — Market Insights</title>
    <description>Institutional market insights from AFGT covering commodity trends, trade structures, and global market signals.</description>
    <link>${siteUrl}/en/insights/</link>
    <atom:link href="${siteUrl}/en/insights/rss.xml" rel="self" type="application/rss+xml"/>
    <language>en-GB</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};

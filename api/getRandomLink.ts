import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getLinkMetaData, getSitemapLinks } from "../scraper/sitemap-scraper";

export default async (_request: VercelRequest, response: VercelResponse) => {
  try {
    const sitemapLinks = await getSitemapLinks();
    if (!sitemapLinks.length) {
      return response.status(500).send("Failed to fetch links");
    }
    const randomLink = sitemapLinks[Math.floor(Math.random() * sitemapLinks.length)];
    const linkMetaData = await getLinkMetaData(randomLink);
    return response.status(200).send(linkMetaData);
  } catch (error) {
    return response.status(500).send("Something went wrong");
  }
};

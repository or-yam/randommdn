import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getLinkMetaData, getSitemapLinks } from '../scraper/sitemap-scraper';

export default async (request: VercelRequest, response: VercelResponse) => {
  console.log(request);
  const sitemapLinks = await getSitemapLinks();
  const randomLink = sitemapLinks[Math.floor(Math.random() * sitemapLinks.length)];
  const linkMetaData = await getLinkMetaData(randomLink);

  response.status(200).send(linkMetaData);
};

import type { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";

const BASE_URL = "https://developer.mozilla.org";
const SITEMAP_URL = `${BASE_URL}/sitemaps/en-US/sitemap.xml.gz`;
const WEB_PATH = `${BASE_URL}/en-US/docs/Web`;
const LINK_REGEX = /<loc>(.*?)<\/loc>/g;
const TITLE_REGEX = /<h1>(.*?)<\/h1>/i;
const DESCRIPTION_REGEX = /<meta name="description" content="(.*?)"\/>/i;
const SECTION_REGEX = /Web\/(.*?)\//;

export const getSitemapLinks = async (): Promise<string[]> => {
  try {
    const { data: sitemap } = await axios.get<XMLDocument>(SITEMAP_URL);
    const sitemapArray: string[] = sitemap.toString().split("\n");
    const webDocsLinks = sitemapArray
      .filter((link) => LINK_REGEX.test(link))
      .map((link) => link.replace("<url><loc>", "").split("</loc>")[0])
      .filter((link) => link.startsWith(WEB_PATH));
    return webDocsLinks;
  } catch (error) {
    console.log(error);
    return [];
  }
};

interface LinkMetaData {
  tag: string;
  title: string;
  description: string;
  url: string;
}
export const getLinkMetaData = async (link: string): Promise<LinkMetaData> => {
  try {
    const tag = link.match(SECTION_REGEX)?.[1] || "";
    const htmlDocument: string = (await axios.get<Document>(link)).data.toString();
    const title = htmlDocument.match(TITLE_REGEX)?.[1] || "Unknown reference";
    const description = htmlDocument.match(DESCRIPTION_REGEX)?.[1] || "Missing description";
    return { tag: tag === "API" ? "WEB API" : tag, title, description, url: link };
  } catch (error) {
    console.log(error);
    return { tag: "", title: "", description: "", url: link };
  }
};

// TODO Filter deprecated class names =>  "notecard", "deprecated"
//TODO if no meta description get it from html document first <p> tag

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

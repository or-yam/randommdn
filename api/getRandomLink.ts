import type { VercelRequest, VercelResponse } from "@vercel/node";

const BASE_URL = "https://developer.mozilla.org";
const SITEMAP_URL = `${BASE_URL}/sitemaps/en-us/sitemap.xml.gz`;
const WEB_PATH = `${BASE_URL}/en-US/docs/Web`;
const LINK_REGEX = /<loc>(.*?)<\/loc>/g;
const TITLE_REGEX = /<h1>(.*?)<\/h1>/i;
const DESCRIPTION_REGEX = /<meta name="description" content="([^"]*)"/i;
const SECTION_REGEX = /Web\/(.*?)\//;

export const getSitemapLinks = async (): Promise<string[]> => {
	try {
		const response = await fetch(SITEMAP_URL, {
			headers: { "Accept-Encoding": "gzip" },
		});
		const sitemap = await response.text();
		const allMatches = Array.from(sitemap.matchAll(LINK_REGEX));
		const webDocsLinks = allMatches
			.map((match) => match[1])
			.filter((url) => url.startsWith(WEB_PATH));

		console.log(`Found ${webDocsLinks.length} Web docs links`);
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
		const htmlDocument: string = await fetch(link).then((res) => res.text());
		const title = htmlDocument.match(TITLE_REGEX)?.[1] || "Unknown reference";
		const description =
			htmlDocument.match(DESCRIPTION_REGEX)?.[1] || "Missing description";
		return {
			tag: tag === "API" ? "WEB API" : tag,
			title,
			description,
			url: link,
		};
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
		const randomLink =
			sitemapLinks[Math.floor(Math.random() * sitemapLinks.length)];
		const linkMetaData = await getLinkMetaData(randomLink);
		return response.status(200).send(linkMetaData);
	} catch (_error) {
		return response.status(500).send("Something went wrong");
	}
};

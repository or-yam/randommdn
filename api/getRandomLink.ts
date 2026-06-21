import type { VercelRequest, VercelResponse } from "@vercel/node";
import sitemapCache from "../src/assets/sitemap-cache.json" with { type: "json" };

const TITLE_REGEX = /<h1>(.*?)<\/h1>/i;
const DESCRIPTION_REGEX = /<meta name="description" content="([^"]*)"/i;
const FIRST_PARAGRAPH_REGEX = /<p[^>]*>(.*?)<\/p>/is;
const SECTION_REGEX = /Web\/(.*?)\//;
const DEPRECATED_REGEX = /class="[^"]*notecard[^"]*deprecated[^"]*"|class="[^"]*deprecated[^"]*notecard[^"]*"/i;

type LinkMetaData = {
	tag: string;
	title: string;
	description: string;
	url: string;
	isDeprecated?: boolean;
};

const isDeprecated = (html: string): boolean => {
	return DEPRECATED_REGEX.test(html);
};

const extractFirstParagraph = (html: string): string => {
	const match = html.match(FIRST_PARAGRAPH_REGEX);
	if (!match) return "";

	const paragraph = match[1]
		.replace(/<[^>]+>/g, "") // Remove HTML tags
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&amp;/g, "&")
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.trim();

	return paragraph || "";
};

export const getLinkMetaData = async (link: string): Promise<LinkMetaData> => {
	if (sitemapCache.popularMetadata[link]) {
		console.log("Using cached metadata");
		return sitemapCache.popularMetadata[link];
	}

	console.log("Fetching metadata from HTML");

	try {
		const response = await fetch(link);
		const html = await response.text();

		const tag = link.match(SECTION_REGEX)?.[1] || "";
		const title = html.match(TITLE_REGEX)?.[1] || "Unknown reference";

		// Check for deprecated status
		const deprecated = isDeprecated(html);

		// Try meta description first, fallback to first paragraph
		let description = html.match(DESCRIPTION_REGEX)?.[1] || "";
		if (!description || description === "Missing description") {
			const firstParagraph = extractFirstParagraph(html);
			description = firstParagraph || "Missing description";
		}

		const metadata: LinkMetaData = {
			tag: tag === "API" ? "WEB API" : tag,
			title: title
				.replace(/&lt;/g, "<")
				.replace(/&gt;/g, ">")
				.replace(/&amp;/g, "&"),
			description: description
				.replace(/&lt;/g, "<")
				.replace(/&gt;/g, ">")
				.replace(/&amp;/g, "&"),
			url: link,
			isDeprecated: deprecated,
		};

		return metadata;
	} catch (error) {
		console.error("Metadata fetch failed:", error);
		return { tag: "", title: "Unknown reference", description: "", url: link };
	}
};

const FALLBACK_LINKS = [
	"https://developer.mozilla.org/en-US/docs/Web/JavaScript",
	"https://developer.mozilla.org/en-US/docs/Web/HTML",
	"https://developer.mozilla.org/en-US/docs/Web/CSS",
];

export const getSitemapLinks = async (): Promise<string[]> => {
	try {
		if (!sitemapCache?.links?.length) {
			console.warn("Cache unavailable, using fallback links");
			return FALLBACK_LINKS;
		}

		const cacheAge = Date.now() - sitemapCache.metadata.buildTime;
		const maxAge = 24 * 60 * 60 * 1000; // 24 hours

		if (cacheAge > maxAge) {
			console.warn("Cache is stale, but using anyway");
		}

		console.log(
			`📋 Using cached sitemap: ${sitemapCache.links.length} links (${sitemapCache.metadata.cachedMetadataCount} with metadata)`,
		);
		return sitemapCache.links;
	} catch (error) {
		console.error("❌ Cache read failed:", error);
		return FALLBACK_LINKS;
	}
};

export default async (request: VercelRequest, response: VercelResponse) => {
	try {
		const sitemapLinks = await getSitemapLinks();

		if (!sitemapLinks.length) {
			console.warn("No links found in sitemap");
			return response.status(500).send("Failed to fetch links");
		}

		const { tags } = request.query;
		let filteredLinks = sitemapLinks;

		if (tags) {
			const tagList = String(tags)
				.split(",")
				.map((tag) => tag.trim().toUpperCase())
				.filter(Boolean);
			if (tagList.length > 0) {
				filteredLinks = sitemapLinks.filter((link) => {
					const linkTag = link.match(SECTION_REGEX)?.[1]?.toUpperCase() || "";
					const normalizedLinkTag = linkTag === "API" ? "WEB API" : linkTag;
					return tagList.includes(normalizedLinkTag);
				});

				if (!filteredLinks.length) {
					console.warn(`No links found for tags: ${tags}`);
					return response.status(404).send(`No links found for tags: ${tags}`);
				}
			}
		}

		// Try up to 5 times to find a non-deprecated link
		const maxRetries = 5;
		let attempts = 0;
		let linkMetaData: LinkMetaData | null = null;

		while (attempts < maxRetries) {
			const randomLink =
				filteredLinks[Math.floor(Math.random() * filteredLinks.length)];
			linkMetaData = await getLinkMetaData(randomLink);

			// Skip deprecated links, but allow if all attempts exhausted
			if (!linkMetaData.isDeprecated || attempts === maxRetries - 1) {
				break;
			}

			attempts++;
			console.log(`Skipping deprecated link, retry ${attempts}/${maxRetries}`);
		}

		if (!linkMetaData) {
			return response.status(500).send("Failed to fetch link metadata");
		}

		// Remove isDeprecated from response (internal only)
		const { isDeprecated: _deprecated, ...responseData } = linkMetaData;
		return response.status(200).send(responseData);
	} catch (_error) {
		return response.status(500).send("Something went wrong");
	}
};

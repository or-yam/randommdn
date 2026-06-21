/**
 * MDN Sitemap Cache Generator
 *
 * Generates a static cache of MDN Web documentation links and popular metadata
 * for improved performance and reduced external API dependencies.
 */

import { writeFileSync } from "fs";
import path from "path";

const BASE_URL = "https://developer.mozilla.org";
const SITEMAP_URL = `${BASE_URL}/sitemaps/en-us/sitemap.xml.gz`;
const WEB_PATH = `${BASE_URL}/en-US/docs/Web`;
const METADATA_CACHE_SIZE = 1000; // Number of popular links to cache metadata for

interface LinkMetaData {
	tag: string;
	title: string;
	description: string;
	url: string;
}

interface CacheData {
	lastUpdated: string;
	links: string[];
	popularMetadata: Record<string, LinkMetaData>;
	metadata: {
		totalLinks: number;
		cachedMetadataCount: number;
		version: string;
		buildTime: number;
	};
}

async function fetchLinkMetadata(link: string): Promise<LinkMetaData> {
	const TITLE_REGEX = /<h1>(.*?)<\/h1>/i;
	const DESCRIPTION_REGEX = /<meta name="description" content="([^"]*)"/i;
	const SECTION_REGEX = /Web\/(.*?)\//;

	try {
		const response = await fetch(link, { signal: AbortSignal.timeout(10000) }); // 10 second timeout
		const html = await response.text();

		const tag = link.match(SECTION_REGEX)?.[1] || "";
		const title = html.match(TITLE_REGEX)?.[1] || "Unknown reference";
		const description =
			html.match(DESCRIPTION_REGEX)?.[1] || "Missing description";

		return {
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
		};
	} catch (_error) {
		return { tag: "", title: "Unknown reference", description: "", url: link };
	}
}

function selectPopularLinks(links: string[], count: number): string[] {
	const categoryPriority: Record<string, number> = {
		JavaScript: 10,
		HTML: 8,
		CSS: 8,
		"Web API": 7,
		HTTP: 6,
		SVG: 5,
	};

	return links
		.map((link) => ({
			link,
			priority: getCategoryPriority(link, categoryPriority),
		}))
		.sort((a, b) => b.priority - a.priority)
		.slice(0, count)
		.map((item) => item.link);
}

function getCategoryPriority(
	link: string,
	priorities: Record<string, number>,
): number {
	const category = link.match(/\/docs\/Web\/([^/]+)/)?.[1];
	return priorities[category || ""] || 1;
}

function extractLinks(sitemap: string): string[] {
	const LINK_REGEX = /<loc>(.*?)<\/loc>/g;
	const matches = Array.from(sitemap.matchAll(LINK_REGEX));
	return matches
		.map((match) => match[1])
		.filter((url) => url.startsWith(WEB_PATH));
}

async function generateCache(): Promise<void> {
	try {
		console.log("Fetching MDN sitemap...");
		const response = await fetch(SITEMAP_URL, {
			headers: { "Accept-Encoding": "gzip" },
		});

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}

		const sitemap = await response.text();
		const allLinks = extractLinks(sitemap);
		console.log(`Found ${allLinks.length} Web documentation links`);

		// Cache metadata for popular links
		const popularLinks = selectPopularLinks(allLinks, METADATA_CACHE_SIZE);
		console.log(`Caching metadata for ${popularLinks.length} popular links...`);

		const popularMetadata: Record<string, LinkMetaData> = {};
		let successCount = 0;
		let failCount = 0;

		for (let i = 0; i < popularLinks.length; i++) {
			const link = popularLinks[i];
			try {
				const metadata = await fetchLinkMetadata(link);
				popularMetadata[link] = metadata;
				successCount++;
			} catch (_error) {
				failCount++;
			}

			// Small delay to be respectful to MDN servers
			await new Promise((resolve) => setTimeout(resolve, 100));
		}

		console.log(
			`Cached ${successCount} metadata entries (${failCount} failed)`,
		);

		const cacheData: CacheData = {
			lastUpdated: new Date().toISOString(),
			links: allLinks,
			popularMetadata,
			metadata: {
				totalLinks: allLinks.length,
				cachedMetadataCount: Object.keys(popularMetadata).length,
				version: "1.0",
				buildTime: Date.now(),
			},
		};

		const cachePath = path.join(process.cwd(), "src/assets/sitemap-cache.json");
		writeFileSync(cachePath, JSON.stringify(cacheData, null, 2));

		console.log(
			`Cache generated successfully: ${allLinks.length} links, ${Object.keys(popularMetadata).length} metadata entries`,
		);
	} catch (error) {
		console.error("Cache generation failed:", error);
		throw error;
	}
}

generateCache().catch(console.error);

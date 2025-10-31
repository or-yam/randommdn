/**
 * Cache Validation Script
 *
 * Validates the integrity and freshness of the MDN sitemap cache.
 */

import { readFileSync } from "fs";
import path from "path";

const cachePath = path.join(process.cwd(), "src/assets/sitemap-cache.json");
const cache = JSON.parse(readFileSync(cachePath, "utf-8"));

function validateCache(): boolean {
	if (!cache.links || !Array.isArray(cache.links)) {
		throw new Error("Invalid cache: missing links array");
	}

	if (cache.links.length === 0) {
		throw new Error("Invalid cache: empty links array");
	}

	if (!cache.lastUpdated) {
		throw new Error("Invalid cache: missing lastUpdated timestamp");
	}

	const cacheAge = Date.now() - cache.metadata.buildTime;
	const ageHours = Math.round(cacheAge / (60 * 60 * 1000));

	console.log(
		`Cache valid: ${cache.links.length} links, ${cache.metadata.cachedMetadataCount} with metadata, ${ageHours}h old`,
	);
	return true;
}

try {
	validateCache();
} catch (error) {
	console.error("Cache validation failed:", error.message);
	process.exit(1);
}

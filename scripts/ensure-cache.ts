/**
 * Smart Cache Management Script
 *
 * Conditionally regenerates cache based on age, existence, and environment variables.
 * This keeps builds fast by skipping regeneration when cache is fresh.
 */

import { existsSync, readFileSync } from "fs";
import { execSync } from "child_process";
import path from "path";

const CACHE_PATH = path.join(process.cwd(), "src/assets/sitemap-cache.json");
const MAX_CACHE_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const FORCE_REGENERATE = process.env.FORCE_CACHE_REGEN === "true";
const SKIP_CACHE_CHECK = process.env.SKIP_CACHE_CHECK === "true";

function shouldRegenerateCache(): boolean {
	// Force regeneration via env var
	if (FORCE_REGENERATE) {
		console.log("🔄 Force regenerating cache (FORCE_CACHE_REGEN=true)");
		return true;
	}

	// Skip cache generation entirely
	if (SKIP_CACHE_CHECK) {
		console.log("⏭️  Skipping cache generation (SKIP_CACHE_CHECK=true)");
		return false;
	}

	// Cache doesn't exist - must generate
	if (!existsSync(CACHE_PATH)) {
		console.log("📦 Cache missing - generating...");
		return true;
	}

	// Check cache age
	try {
		const cache = JSON.parse(readFileSync(CACHE_PATH, "utf-8"));
		const cacheAge = Date.now() - (cache.metadata?.buildTime || 0);
		const ageDays = Math.round(cacheAge / (24 * 60 * 60 * 1000));

		if (cacheAge > MAX_CACHE_AGE_MS) {
			console.log(
				`🔄 Cache is ${ageDays} days old (max: ${Math.round(MAX_CACHE_AGE_MS / (24 * 60 * 60 * 1000))} days) - regenerating...`,
			);
			return true;
		}

		console.log(
			`✅ Cache is fresh (${ageDays} days old) - skipping regeneration`,
		);
		return false;
	} catch (error) {
		console.warn("⚠️  Error reading cache, regenerating...", error);
		return true;
	}
}

if (shouldRegenerateCache()) {
	console.log("⏳ Generating cache (this takes ~5 minutes)...");
	try {
		execSync("node scripts/generate-cache.ts", { stdio: "inherit" });
		console.log("✨ Cache generation completed");
	} catch (error) {
		console.error("❌ Cache generation failed:", error);
		process.exit(1);
	}
} else {
	console.log("✨ Using existing cache");
}


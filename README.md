# Random MDN

<center>
<img alt="logo" src="https://raw.githubusercontent.com/or-yam/randommdn/main/logo.png" width="100" height="100"/>
</center>

## Web app that generates a random link from the [MDN Web documentation]("https://developer.mozilla.org/en-US/")

## What is MDN

> MDN Web Docs is an open-source, collaborative project documenting Web platform technologies, including CSS, HTML, JavaScript, and Web APIs. We also provide an extensive set of learning resources for beginning developers and students.
>
> MDN's mission is to provide a blueprint for a better internet and empower a new generation of developers and content creators to build it.
>
> [MDN website](https://developer.mozilla.org/en-US/about)

> The idea of using the sitemap file came from this [random-mdn twitter-bot](https://github.com/random-mdn/random-mdn-bot)

## Development

### Cache Generation

This project uses a static cache system to improve performance. The cache includes:
- All MDN Web documentation links (~11,865 links)
- Pre-fetched metadata for the top 1,000 popular links

**Cache Workflow:**
- Cache file location: `src/assets/sitemap-cache.json` (committed to git)
- Cache is conditionally regenerated during build (only if missing or older than 7 days)
- Cache generation fetches the MDN sitemap and pre-loads metadata for popular links (~5 minutes)
- Most builds skip cache regeneration for speed (~10 seconds vs ~5 minutes)

**Build Process:**
The build command intelligently manages cache:
```bash
# Standard build (fast if cache is fresh < 7 days old)
npm run build  # Checks cache age -> skips if fresh -> TypeScript compile -> Vite build

# Force cache regeneration
npm run build:force-cache  # Always regenerates cache (~5 min)

# Skip cache check entirely (uses existing cache no matter age)
npm run build:skip-cache  # Fastest build, uses any existing cache
```

**Manual Cache Operations:**
```bash
# Generate/regenerate cache manually
npm run generate-cache

# Validate cache integrity
npm run validate-cache
```

**Vercel Deployment:**
- Cache is bundled with serverless functions during deployment
- By default, cache only regenerates if older than 7 days (keeps builds fast)
- To force fresh cache on each deployment, set `FORCE_CACHE_REGEN=true` in Vercel build settings
- Cache size (currently ~1.5MB) is well within Vercel's 50MB serverless function limit

For more details, see [STATIC_CACHE_PLAN.md](./STATIC_CACHE_PLAN.md).

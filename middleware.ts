import { next } from '@vercel/functions';
import { trackAICrawlerRequest, type WaitUntilContext } from '@datafast/ai-crawl';

// DataFast server-side bot / AI-crawler tracking.
//
// This runs as Vercel Routing (Edge) Middleware on every page request. It's the
// only way to see crawlers that never execute the client-side script in
// src/components/Analytics.astro — ChatGPT, Perplexity, Claude, Google-Extended,
// GPTBot, search indexers, training crawlers, etc.
//
// The site is a static Astro build (no SSR adapter), so Astro's own
// src/middleware never runs at request time; Vercel picks up this root
// middleware.ts independent of the framework.
//
// Docs: https://datafa.st/docs/bot-traffic-tracking
//
// websiteId is non-secret (already exposed in the public client script).
const WEBSITE_ID = 'dfid_qI4dBMANAwmiNsJvVpicO';

export default function middleware(request: Request, context: WaitUntilContext) {
  // Fire-and-forget — do NOT await. DataFast uses context.waitUntil() so the
  // tracking call never delays the page response.
  trackAICrawlerRequest(request, context, {
    websiteId: WEBSITE_ID,
  });

  // Pass the request through untouched to the static asset / page.
  return next();
}

export const config = {
  // Track page navigations only. Skip Astro/Vercel internals and any path that
  // ends in a file extension (JS/CSS/images, sitemap.xml, robots.txt, favicon,
  // assetlinks.json, …) plus the .well-known app-association files.
  matcher: ['/((?!_astro|_image|_vercel|\\.well-known|.*\\.[a-zA-Z0-9]+$).*)'],
};

import { next } from '@vercel/functions';
import { trackAICrawlerRequest, type WaitUntilContext } from '@datafast/ai-crawl';
import { appStoreUrl, playStoreUrl } from './src/data/app-links';

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

/**
 * /get — one link for bios, DMs and QR codes that sends each visitor straight
 * to THEIR store, with no intermediate page.
 *
 * Redirecting here (edge, server-side) rather than from a page means no white
 * flash, no JS requirement, and no extra tap. Desktop has no store to open, so
 * it falls back to /download, which shows both badges.
 *
 * Optional `?s=` tags the source for store-side attribution:
 *   /get?s=tiktok_bio  ->  ct=web_bio_tiktok_bio  /  utm_campaign=web_bio_tiktok_bio
 */
function handleGet(request: Request): Response | null {
  const url = new URL(request.url);
  if (url.pathname !== '/get' && !url.pathname.startsWith('/get/')) return null;

  // Sanitize: the value lands in an outbound URL, so keep it to a safe slug.
  const raw = url.searchParams.get('s') ?? '';
  const slug = raw.toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 32);
  const placement = slug ? `bio_${slug}` : 'bio';

  const ua = request.headers.get('user-agent') ?? '';
  const isAndroid = /android/i.test(ua);
  // iPadOS 13+ reports a Mac UA; those land on /download, which is fine —
  // a desktop-class browser can't open a store app anyway.
  const isIOS = /iphone|ipad|ipod/i.test(ua);

  const target = isAndroid
    ? playStoreUrl(placement)
    : isIOS
      ? appStoreUrl(placement)
      : new URL('/download', url.origin).toString();

  // 302: the destination depends on the request, so it must never be cached
  // as a permanent redirect by a browser or CDN.
  return new Response(null, {
    status: 302,
    headers: { Location: target, 'Cache-Control': 'no-store' },
  });
}

export default function middleware(request: Request, context: WaitUntilContext) {
  // Fire-and-forget — do NOT await. DataFast uses context.waitUntil() so the
  // tracking call never delays the page response.
  trackAICrawlerRequest(request, context, {
    websiteId: WEBSITE_ID,
  });

  const redirect = handleGet(request);
  if (redirect) return redirect;

  // Pass the request through untouched to the static asset / page.
  return next();
}

export const config = {
  // Track page navigations only. Skip Astro/Vercel internals and any path that
  // ends in a file extension (JS/CSS/images, sitemap.xml, robots.txt, favicon,
  // assetlinks.json, …) plus the .well-known app-association files.
  matcher: ['/((?!_astro|_image|_vercel|\\.well-known|.*\\.[a-zA-Z0-9]+$).*)'],
};

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

  // In-app browsers (Instagram, Facebook, TikTok…) swallow an automatic
  // navigation to a store URL — the page just hangs on a loading spinner.
  // They DO honour a user-initiated tap, so serve a one-button interstitial
  // instead of a redirect. This is the path most bio-link traffic takes.
  if ((isIOS || isAndroid) && isInAppBrowser(ua)) {
    return inAppBrowserPage(target, isAndroid);
  }

  // 302: the destination depends on the request, so it must never be cached
  // as a permanent redirect by a browser or CDN.
  return new Response(null, {
    status: 302,
    headers: { Location: target, 'Cache-Control': 'no-store' },
  });
}

/** Webviews embedded in social apps, which block automatic store handoff. */
function isInAppBrowser(ua: string): boolean {
  return /Instagram|FBAN|FBAV|FB_IAB|FBIOS|Messenger|TikTok|BytedanceWebview|musical_ly|Snapchat|LinkedInApp|Pinterest|Line\/|Twitter|X11.*Mobile/i
    .test(ua);
}

/**
 * Minimal, self-contained tap-to-continue page. Inline styles only: it must
 * render instantly and can't depend on the site's CSS bundle.
 */
function inAppBrowserPage(target: string, isAndroid: boolean): Response {
  const store = isAndroid ? 'Google Play' : 'the App Store';
  const escaped = target.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>Get OurCouple</title>
<style>
  body{margin:0;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;
       gap:14px;padding:24px;text-align:center;background:#FAF8F7;color:#1A1A1A;
       font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}
  img{width:72px;height:72px;border-radius:18px}
  h1{font-size:22px;margin:4px 0 0}
  p{color:#6B6B6B;margin:0;font-size:15px;line-height:1.5;max-width:20rem}
  a.cta{display:block;margin-top:8px;padding:16px 32px;border-radius:16px;text-decoration:none;
        font-size:17px;font-weight:600;color:#fff;
        background:linear-gradient(180deg,#F53984 0%,#F53984 14%,#972352 100%);
        box-shadow:0 10px 24px -10px rgba(151,35,82,.55)}
  small{color:#9A9A9A;font-size:12px;margin-top:6px}
</style>
</head>
<body>
  <img src="/logo-192.webp" alt="OurCouple">
  <h1>Get OurCouple</h1>
  <p>Tap below to open ${store} and install the app.</p>
  <a class="cta" id="go" href="${escaped}">Open ${store}</a>
  <small>If nothing happens, tap the ••• menu and choose “Open in browser”.</small>
  <script>
    // Best-effort: some in-app browsers do allow this. Harmless where they don't
    // — the button above stays the reliable path.
    setTimeout(function(){ try { window.location.href = document.getElementById('go').href; } catch (e) {} }, 350);
  </script>
</body>
</html>`;
  return new Response(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
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

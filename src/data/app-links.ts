/**
 * Single source of truth for the two store links + their campaign tracking.
 *
 * Apple uses the `ct=` App Analytics campaign token; Google Play uses the
 * install `referrer` (utm_*). Both are built from the same `placement` string
 * so a CTA is comparable across stores in App Store Connect and Play Console.
 *
 * ⚠️ PLAY_STORE_ID / PLAY_STORE_URL: update here (one place) when the Play
 * Store listing goes live if the final URL differs.
 */

export const APP_STORE_ID = "6758024356";
export const PLAY_STORE_ID = "com.vynse.ourcouple";

/**
 * Apple App Analytics provider token, from the campaign link generated in App
 * Store Connect.
 *
 * This is REQUIRED for campaign attribution: `ct` alone does nothing. Every
 * App Store link on the site previously shipped `?ct=web_<placement>` with no
 * `pt`, which means none of that campaign data was ever recorded in App
 * Analytics. Adding `pt` is what turns the tracking on.
 */
export const APPLE_PROVIDER_TOKEN = "128468716";

// Campaign links use the /app/apple-store/ path (not the plain /app/ one) and
// carry mt=8, the media type for iOS apps.
const APP_STORE_BASE = `https://apps.apple.com/app/apple-store/id${APP_STORE_ID}`;
const PLAY_STORE_BASE = `https://play.google.com/store/apps/details?id=${PLAY_STORE_ID}`;

/**
 * App Store link tagged with an Apple campaign token (App Analytics).
 *
 * The campaign link from App Store Connect ships `ct=website`, a single flat
 * bucket. We keep `ct=web_<placement>` instead so each CTA slot stays
 * separable in App Analytics — the same granularity the Play referrer already
 * carries. Swap the template below for a literal `website` to collapse them.
 *
 * NOTE: Apple caps `ct` at 40 characters. `web_` + the longest placement the
 * /get route can build (`bio_` + a 32-char slug) lands exactly on 40, so don't
 * lengthen either prefix without shortening that slug cap in middleware.ts.
 */
export function appStoreUrl(placement: string): string {
  return `${APP_STORE_BASE}?pt=${APPLE_PROVIDER_TOKEN}&ct=web_${placement}&mt=8`;
}

/**
 * Play Store link tagged with an install referrer. Play Console reports it
 * under Acquisition; the value must be URL-encoded inside `referrer`.
 */
export function playStoreUrl(placement: string): string {
  const referrer = encodeURIComponent(
    `utm_source=website&utm_medium=cta&utm_campaign=web_${placement}`,
  );
  return `${PLAY_STORE_BASE}&referrer=${referrer}`;
}

/**
 * Canonical, untagged URLs — for schema.org / structured data only.
 * Campaign parameters must never appear here: this is the app's identity, not
 * a tracked click.
 */
export const CANONICAL_APP_STORE_URL = `https://apps.apple.com/app/id${APP_STORE_ID}`;
export const CANONICAL_PLAY_STORE_URL = PLAY_STORE_BASE;

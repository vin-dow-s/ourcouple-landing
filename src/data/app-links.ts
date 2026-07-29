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

const APP_STORE_BASE = `https://apps.apple.com/app/id${APP_STORE_ID}`;
const PLAY_STORE_BASE = `https://play.google.com/store/apps/details?id=${PLAY_STORE_ID}`;

/** App Store link tagged with an Apple campaign token (App Analytics). */
export function appStoreUrl(placement: string): string {
  return `${APP_STORE_BASE}?ct=web_${placement}`;
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

/** Canonical, untagged URLs — for schema.org / structured data only. */
export const CANONICAL_APP_STORE_URL = APP_STORE_BASE;
export const CANONICAL_PLAY_STORE_URL = PLAY_STORE_BASE;

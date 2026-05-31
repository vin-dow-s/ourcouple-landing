#!/usr/bin/env node
/**
 * Pings IndexNow (Bing, Yandex, Seznam, Naver) with every URL in our sitemap.
 *
 * Run after a production deploy. Locally: `node scripts/ping-indexnow.mjs`
 * CI: triggered by .github/workflows/indexnow.yml on Vercel production success.
 */

const HOST = 'ourcouple.app';
const KEY = '4b25d83615e248699a62926e67f641f9';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const SITEMAP_URL = `https://${HOST}/sitemap-0.xml`;
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/IndexNow';

async function main() {
  console.log(`Fetching sitemap: ${SITEMAP_URL}`);
  const sitemapRes = await fetch(SITEMAP_URL, { cache: 'no-store' });
  if (!sitemapRes.ok) {
    throw new Error(`Sitemap fetch failed: ${sitemapRes.status} ${sitemapRes.statusText}`);
  }
  const xml = await sitemapRes.text();

  const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  if (urlList.length === 0) {
    throw new Error('No <loc> entries found in sitemap');
  }
  console.log(`Found ${urlList.length} URL(s).`);

  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList,
  };

  const res = await fetch(INDEXNOW_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload),
  });

  const body = await res.text();
  console.log(`IndexNow response: ${res.status} ${res.statusText}`);
  if (body) console.log(body);

  // 200 = OK, 202 = Accepted (some search engines respond with 202)
  if (res.status !== 200 && res.status !== 202) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

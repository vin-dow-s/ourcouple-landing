// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://ourcouple.app',
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
  integrations: [
    sitemap({
      changefreq: 'weekly',
      lastmod: new Date(),
      serialize(item) {
        // Normalize: root keeps "/", everything else has no trailing slash.
        // This must match what Astro serves (trailingSlash: 'never', build.format: 'file').
        if (item.url === 'https://ourcouple.app' || item.url === 'https://ourcouple.app/') {
          return {
            ...item,
            url: 'https://ourcouple.app/',
            priority: 1,
            changefreq: 'daily',
          };
        }
        // Strip any trailing slash on non-root URLs to match canonical
        const normalizedUrl = item.url.endsWith('/') ? item.url.slice(0, -1) : item.url;
        let priority = 0.7;
        let changefreq = 'weekly';
        if (normalizedUrl.includes('/blog') || normalizedUrl.includes('/tools')) {
          priority = 0.8;
        } else if (normalizedUrl.includes('/privacy') || normalizedUrl.includes('/terms')) {
          priority = 0.3;
          changefreq = 'monthly';
        }
        return {
          ...item,
          url: normalizedUrl,
          priority,
          changefreq,
        };
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});
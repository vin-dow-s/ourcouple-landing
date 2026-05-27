// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://ourcouple.app',
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'DM Sans',
      cssVariable: '--font-dm-sans',
      weights: ['400', '500', '600', '700'],
      styles: ['normal'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
  ],
  integrations: [
    sitemap({
      changefreq: 'weekly',
      lastmod: new Date(),
      serialize(item) {
        // Normalize: keep "/" on root, strip trailing slash everywhere else
        // (must match canonical URLs and Vercel's trailingSlash:false)
        if (item.url === 'https://ourcouple.app/' || item.url === 'https://ourcouple.app') {
          return { ...item, url: 'https://ourcouple.app/', priority: 1.0, changefreq: 'daily' };
        }
        const url = item.url.endsWith('/') ? item.url.slice(0, -1) : item.url;
        let priority = 0.7;
        let changefreq = 'weekly';
        if (url.includes('/blog') || url.includes('/tools')) {
          priority = 0.8;
        } else if (url.includes('/privacy') || url.includes('/terms')) {
          priority = 0.3;
          changefreq = 'monthly';
        }
        return { ...item, url, priority, changefreq };
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});

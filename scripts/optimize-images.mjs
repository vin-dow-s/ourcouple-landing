// Generate right-sized WebP variants of the heavy hero/couple-card images.
//
// These live in /public (so Astro's build-time optimizer never touches them)
// and were shipping at 1–1.8 MB while displayed at ~200px wide — the cause of
// the 26 s LCP and the ~5.5 MB "properly size images" savings in Lighthouse.
//
// Widths below cover the largest real display size × DPR (≈3x on mobile),
// so images stay crisp on retina while dropping ~97% of their weight.
// Re-run after replacing a source PNG/JPG:  node scripts/optimize-images.mjs
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { statSync } from 'node:fs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pub = join(root, 'public');

// [source, output, target px width]. Sizes cover the largest real display size
// × 3 (high-DPR mobile); withoutEnlargement caps each at its true source width,
// so requesting more than the source simply yields the full-resolution source.
const jobs = [
  ['mainscreenshot.png', 'mainscreenshot.webp', 540], // hero center phone (~168px css mobile -> 3x)
  ['screenshotleft.png', 'screenshotleft.webp', 440], // hero left phone   (~128px css mobile -> 3x)
  ['screenshotright.png', 'screenshotright.webp', 440], // hero right phone (~128px css mobile -> 3x)
  ['couplecard.jpg', 'couplecard.webp', 1400], // 3D couple card (~364px css mobile -> capped to source)
  ['card2.png', 'card2.webp', 1600], // alt card peeking behind (capped to source)
  ['logo-512.png', 'logo-192.webp', 192], // header/footer logo (40-48px css -> 4x)
];

const kb = (p) => (statSync(p).size / 1024).toFixed(0);

for (const [src, out, width] of jobs) {
  const srcPath = join(pub, src);
  const outPath = join(pub, out);
  const meta = await sharp(srcPath).metadata();
  const info = await sharp(srcPath)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 80, effort: 6 })
    .toFile(outPath);
  console.log(
    `${src} (${meta.width}x${meta.height}, ${kb(srcPath)} KB)  ->  ${out} (${info.width}x${info.height}, ${kb(outPath)} KB)`
  );
}

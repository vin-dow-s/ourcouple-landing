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

// [source, output, target display-px width @ up to 3x DPR]
const jobs = [
  ['mainscreenshot.png', 'mainscreenshot.webp', 540], // hero center phone (~208px css)
  ['screenshotleft.png', 'screenshotleft.webp', 440], // hero left phone   (~160px css)
  ['screenshotright.png', 'screenshotright.webp', 440], // hero right phone (~160px css)
  ['couplecard.jpg', 'couplecard.webp', 920], // 3D couple card (~416px css)
  ['card2.png', 'card2.webp', 720], // alt card peeking behind (~312px css)
];

const kb = (p) => (statSync(p).size / 1024).toFixed(0);

for (const [src, out, width] of jobs) {
  const srcPath = join(pub, src);
  const outPath = join(pub, out);
  await sharp(srcPath)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 80, effort: 6 })
    .toFile(outPath);
  console.log(`${src} (${kb(srcPath)} KB)  ->  ${out} (${kb(outPath)} KB)  @ ${width}w`);
}

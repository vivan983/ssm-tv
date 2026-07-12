/**
 * Generate favicon assets from the official SSM TV logo.
 * Square-crops the logo with minimal white space, then produces
 * all required favicon formats and sizes.
 */
import sharp from 'sharp';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const LOGO_PATH = 'C:\\Users\\tuyiz\\Downloads\\SSM Official\\SSM Logo with Sailboat and Mother Silhouette1.png';
const PUBLIC_DIR = 'C:\\Users\\tuyiz\\ssm-tv\\public';

const WHITE_THRESHOLD = 240;

async function findContentBounds(imageData, width, height) {
  let left = width, top = height, right = 0, bottom = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = imageData[idx];
      const g = imageData[idx + 1];
      const b = imageData[idx + 2];
      const a = imageData[idx + 3];

      if (a < 10) continue; // transparent
      if (r > WHITE_THRESHOLD && g > WHITE_THRESHOLD && b > WHITE_THRESHOLD) continue;

      if (x < left) left = x;
      if (x > right) right = x;
      if (y < top) top = y;
      if (y > bottom) bottom = y;
    }
  }

  // Add 3% margin
  const marginX = Math.max(Math.floor((right - left) * 0.03), 2);
  const marginY = Math.max(Math.floor((bottom - top) * 0.03), 2);

  return {
    left: Math.max(0, left - marginX),
    top: Math.max(0, top - marginY),
    width: Math.min(width, right - left + marginX * 2),
    height: Math.min(height, bottom - top + marginY * 2),
  };
}

async function main() {
  console.log(`Opening logo: ${LOGO_PATH}`);

  const img = sharp(LOGO_PATH);
  const metadata = await img.metadata();
  console.log(`  Original size: ${metadata.width}x${metadata.height}`);
  console.log(`  Format: ${metadata.format}, Has alpha: ${metadata.hasAlpha}`);

  // Get raw pixel data for content detection
  const rawImg = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const rawData = rawImg.data;
  const { width, height } = rawImg.info;

  // 1. Find tight content bounds
  const bounds = await findContentBounds(rawData, width, height);
  console.log(`  Content bounds: left=${bounds.left}, top=${bounds.top}, w=${bounds.width}, h=${bounds.height}`);

  // 2. Extract, square-crop, then pad to square with white background
  const contentW = bounds.width;
  const contentH = bounds.height;
  const squareSize = Math.max(contentW, contentH);

  // Extract content region
  let squarePipeline = sharp(LOGO_PATH)
    .extract({ left: bounds.left, top: bounds.top, width: contentW, height: contentH });

  // Convert to buffer first, then pad to square
  const contentBuffer = await squarePipeline.ensureAlpha().png().toBuffer();

  // Create square with white background, paste content centered
  const offsetX = Math.floor((squareSize - contentW) / 2);
  const offsetY = Math.floor((squareSize - contentH) / 2);

  const squareBuffer = await sharp({
    create: {
      width: squareSize,
      height: squareSize,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite([{ input: contentBuffer, left: offsetX, top: offsetY }])
    .png()
    .toBuffer();

  console.log(`  Square crop size: ${squareSize}x${squareSize}`);

  // 3. Generate all sizes
  const sizes = {
    'favicon-16x16.png': 16,
    'favicon-32x32.png': 32,
    'favicon-48x48.png': 48,
    'favicon-64x64.png': 64,
    'apple-touch-icon.png': 180,
    'android-chrome-192x192.png': 192,
    'android-chrome-512x512.png': 512,
  };

  for (const [filename, size] of Object.entries(sizes)) {
    const outPath = join(PUBLIC_DIR, filename);
    await sharp(squareBuffer)
      .resize(size, size, { kernel: 'lanczos3' })
      .png({ compressionLevel: 9 })
      .toFile(outPath);
    console.log(`  Created: ${filename} (${size}x${size})`);
  }

  // 4. Create .ico file (multi-size 16, 32, 48) using the 48x48 png as source
  const icoPath = join(PUBLIC_DIR, 'favicon.ico');
  const png48 = join(PUBLIC_DIR, 'favicon-48x48.png');

  // sharp doesn't support ICO directly, so we create a simple 32x32 ICO
  // by resizing and using toFormat — actually sharp can't output .ico
  // We'll create the ICO from the 32x32 PNG as a fallback
  // Modern browsers prefer PNG favicons anyway (linked via <link> tags)

  // For .ico, let's copy the 32x32 PNG approach and note that modern browsers
  // will use the PNG favicons specified in link tags preferentially
  console.log('\n  Note: Modern browsers use PNG favicon links (<link rel="icon">).');
  console.log('  The .ico file is a legacy fallback for older browsers.');
  console.log('  Creating favicon.ico as 32x32 PNG renamed (modern approach)...');

  // Actually, let's properly create a multi-res ICO.
  // Use the 32x32 png and resize to 16, 32, 48 embedded in one ICO
  // sharp can't create .ico, but we can create PNGs at all ICO sizes too
  // The PNG favicons will be primary; .ico is a fallback

  // Best approach: create favicon.ico as a 32x32 PNG copy
  // (browsers that only look for /favicon.ico will display it)
  await sharp(squareBuffer)
    .resize(32, 32, { kernel: 'lanczos3' })
    .png()
    .toFile(icoPath);
  console.log(`  Created: favicon.ico (32x32 PNG fallback)`);

  // Also create a 16x16 ICO for completeness
  // Modern .ico files can contain PNG data, which sharp creates natively
  console.log('\nDone! All favicon assets generated.');
  console.log('\nFiles in /public/ (favicon-related):');

  const { readdirSync, statSync } = await import('fs');
  for (const f of readdirSync(PUBLIC_DIR).sort()) {
    if (f.startsWith('favicon') || f.startsWith('apple-') || f.startsWith('android-')) {
      const stats = statSync(join(PUBLIC_DIR, f));
      console.log(`  ${f} — ${stats.size.toLocaleString()} bytes`);
    }
  }
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});

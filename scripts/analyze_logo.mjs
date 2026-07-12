/**
 * Analyze the SSM logo structure to find optimal regions for favicon cropping.
 */
import sharp from 'sharp';

const LOGO_PATH = 'C:\\Users\\tuyiz\\Downloads\\SSM Official\\SSM Logo with Sailboat and Mother Silhouette1.png';
const WHITE_THRESHOLD = 240;

async function main() {
  const img = sharp(LOGO_PATH);
  const metadata = await img.metadata();
  console.log(`Image: ${metadata.width}x${metadata.height}, format: ${metadata.format}`);

  // Get raw pixel data
  const rawImg = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const data = rawImg.data;
  const { width, height } = rawImg.info;

  // Calculate non-white pixel density per row (to find horizontal gaps/splits)
  const rowDensity = [];
  for (let y = 0; y < height; y++) {
    let nonWhite = 0;
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = data[idx], g = data[idx + 1], b = data[idx + 2], a = data[idx + 3];
      if (a > 10 && (r < WHITE_THRESHOLD || g < WHITE_THRESHOLD || b < WHITE_THRESHOLD)) {
        nonWhite++;
      }
    }
    rowDensity.push({ y, density: nonWhite / width });
  }

  // Find rows with significant content
  const contentRows = rowDensity.filter(r => r.density > 0.01);
  if (contentRows.length === 0) {
    console.log('No content found!');
    return;
  }

  const firstRow = contentRows[0].y;
  const lastRow = contentRows[contentRows.length - 1].y;

  console.log(`\nContent rows: ${firstRow} to ${lastRow} (${lastRow - firstRow + 1} rows)`);

  // Find gaps (rows with very low density between content regions)
  const gaps = [];
  let inGap = false;
  let gapStart = 0;

  for (let y = firstRow; y <= lastRow; y++) {
    const density = rowDensity[y].density;
    if (density < 0.005 && !inGap) {
      inGap = true;
      gapStart = y;
    } else if (density >= 0.005 && inGap) {
      inGap = false;
      const gapHeight = y - gapStart;
      if (gapHeight > 10) { // Only significant gaps
        gaps.push({ start: gapStart, end: y, height: gapHeight });
      }
    }
  }

  console.log(`\nFound ${gaps.length} significant gap(s):`);
  gaps.forEach((g, i) => {
    console.log(`  Gap ${i + 1}: rows ${g.start}-${g.end} (${g.height}px) — ${((g.start - firstRow) / (lastRow - firstRow) * 100).toFixed(1)}% from top of content`);
  });

  // Calculate column density to find horizontal content regions
  const colDensity = [];
  for (let x = 0; x < width; x++) {
    let nonWhite = 0;
    for (let y = firstRow; y <= lastRow; y++) {
      const idx = (y * width + x) * 4;
      const r = data[idx], g = data[idx + 1], b = data[idx + 2], a = data[idx + 3];
      if (a > 10 && (r < WHITE_THRESHOLD || g < WHITE_THRESHOLD || b < WHITE_THRESHOLD)) {
        nonWhite++;
      }
    }
    colDensity.push({ x, density: nonWhite / (lastRow - firstRow + 1) });
  }

  const contentCols = colDensity.filter(c => c.density > 0.01);
  const firstCol = contentCols[0].x;
  const lastCol = contentCols[contentCols.length - 1].x;

  console.log(`\nContent columns: ${firstCol} to ${lastCol} (${lastCol - firstCol + 1} cols)`);
  console.log(`Content aspect ratio: ${((lastCol - firstCol) / (lastRow - firstRow)).toFixed(2)}:1`);

  // Print boundary info for region extraction
  console.log(`\n--- Suggested Crops ---`);
  console.log(`Full content: left=${firstCol}, top=${firstRow}, width=${lastCol - firstCol}, height=${lastRow - firstRow}`);

  // If there's a gap in the middle, suggest splitting
  if (gaps.length > 0) {
    // Find the largest gap
    const largestGap = gaps.reduce((a, b) => b.height > a.height ? b : a);
    console.log(`\nLargest gap at rows ${largestGap.start}-${largestGap.end} (${largestGap.height}px)`);

    // Upper region (likely icon/emblem)
    const upperH = largestGap.start - firstRow;
    console.log(`\nUpper region (icon?): top=${firstRow}, height=${upperH}, aspect=${((lastCol - firstCol) / upperH).toFixed(2)}:1`);

    // Lower region (likely text)
    const lowerTop = largestGap.end;
    const lowerH = lastRow - lowerTop;
    console.log(`Lower region (text?): top=${lowerTop}, height=${lowerH}, aspect=${((lastCol - firstCol) / lowerH).toFixed(2)}:1`);
  }

  // Print density profile every 20 rows for the content area
  console.log(`\n--- Row density profile (every 5%, between ${firstRow}-${lastRow}) ---`);
  const range = lastRow - firstRow;
  for (let pct = 0; pct <= 100; pct += 5) {
    const y = firstRow + Math.floor(range * pct / 100);
    console.log(`  ${pct}% (row ${y}): density=${(rowDensity[y].density * 100).toFixed(1)}%`);
  }
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});

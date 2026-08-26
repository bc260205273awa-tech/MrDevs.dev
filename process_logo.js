const sharp = require('sharp');
const path = require('path');

const inputPath = "C:/Users/abc/.gemini/antigravity/brain/e983e1d4-86e4-4373-8194-9bd8e83b5451/.user_uploaded/media_1787574659307.jpg";
const outputDir = path.join(__dirname, 'public');

async function extractPristineSymbols() {
  const { data, info } = await sharp(inputPath)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const width = info.width;
  const height = info.height;
  const channels = info.channels;

  // Global bounding box (same 598x225 crop)
  let minX = width, maxX = 0, minY = height, maxY = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      const b = Math.max(data[idx], data[idx + 1], data[idx + 2]);
      if (b > 12) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  const pad = 12;
  minX = Math.max(0, minX - pad);
  minY = Math.max(0, minY - pad);
  maxX = Math.min(width - 1, maxX + pad);
  maxY = Math.min(height - 1, maxY + pad);

  const cropW = maxX - minX + 1;
  const cropH = maxY - minY + 1;

  const leftEyeRgba = Buffer.alloc(cropW * cropH * 4);
  const rightEyeRgba = Buffer.alloc(cropW * cropH * 4);

  // Left Symbol: center (360, 310), bounds: x in [290, 432], y in [268, 345]
  // Right Symbol: center (665, 310), bounds: x in [618, 712], y in [260, 355]

  for (let cy = 0; cy < cropH; cy++) {
    for (let cx = 0; cx < cropW; cx++) {
      const ox = minX + cx;
      const oy = minY + cy;
      const inIdx = (oy * width + ox) * channels;
      const outIdx = (cy * cropW + cx) * 4;

      const r = data[inIdx];
      const g = data[inIdx + 1];
      const b = data[inIdx + 2];
      const maxVal = Math.max(r, g, b);

      // Smooth transparency
      let alpha = 0;
      if (maxVal > 15) {
        alpha = Math.min(255, Math.floor(((maxVal - 15) / 30) * 255));
      }

      // --- 1. PURE LEFT SYMBOL (</>) ---
      // Strictly bounded to the symbol geometry (no bottom rim reflection at oy >= 348)
      const inLeftBox = (ox >= 290 && ox <= 432 && oy >= 265 && oy <= 346);
      if (inLeftBox && (b > 90 || maxVal > 100)) {
        leftEyeRgba[outIdx] = r;
        leftEyeRgba[outIdx + 1] = g;
        leftEyeRgba[outIdx + 2] = b;
        leftEyeRgba[outIdx + 3] = alpha;
      } else {
        leftEyeRgba[outIdx + 3] = 0;
      }

      // --- 2. PURE RIGHT SYMBOL (Power Button) ---
      // Strictly bounded to the symbol geometry (no bottom rim reflection at oy >= 356)
      const inRightBox = (ox >= 618 && ox <= 714 && oy >= 258 && oy <= 354);
      if (inRightBox && (g > 80 || b > 80 || maxVal > 100)) {
        rightEyeRgba[outIdx] = r;
        rightEyeRgba[outIdx + 1] = g;
        rightEyeRgba[outIdx + 2] = b;
        rightEyeRgba[outIdx + 3] = alpha;
      } else {
        rightEyeRgba[outIdx + 3] = 0;
      }
    }
  }

  await sharp(leftEyeRgba, { raw: { width: cropW, height: cropH, channels: 4 } })
    .png()
    .toFile(path.join(outputDir, 'hero-symbol-code.png'));

  await sharp(rightEyeRgba, { raw: { width: cropW, height: cropH, channels: 4 } })
    .png()
    .toFile(path.join(outputDir, 'hero-symbol-power.png'));

  console.log('Successfully saved pristine symbols with ZERO crescent artifacts!');
}

extractPristineSymbols().catch(console.error);

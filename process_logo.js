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

  // Global bounding box (exact same 598x225 crop)
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

  // Left Symbol: center (360, 306)
  const leftCX = 360, leftCY = 306;
  const leftRadiusX = 66, leftRadiusY = 44;

  // Right Symbol: center (665, 308), circular radius 50
  const rightCX = 665, rightCY = 308;
  const rightRadius = 50;

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

      // Smooth transparency against black background
      let alpha = 0;
      if (maxVal > 15) {
        alpha = Math.min(255, Math.floor(((maxVal - 15) / 28) * 255));
      }

      // --- 1. CLEAN LEFT CODE SYMBOL (</>) ---
      // Elliptical mask perfectly hugging </>, eliminates bottom-left stray speck
      const dxL = (ox - leftCX) / leftRadiusX;
      const dyL = (oy - leftCY) / leftRadiusY;
      const inLeftMask = (dxL * dxL + dyL * dyL) <= 1.0;

      if (inLeftMask && (b > 60 || maxVal > 70)) {
        leftEyeRgba[outIdx] = r;
        leftEyeRgba[outIdx + 1] = g;
        leftEyeRgba[outIdx + 2] = b;
        leftEyeRgba[outIdx + 3] = alpha;
      } else {
        leftEyeRgba[outIdx + 3] = 0;
      }

      // --- 2. CLEAN RIGHT POWER SYMBOL (⏻) ---
      // Circular mask centered at (665, 308), radius 50 (captures full round button, no cut bottom)
      const distToPower = Math.hypot(ox - rightCX, oy - rightCY);
      const inRightMask = distToPower <= rightRadius;

      if (inRightMask && (g > 60 || b > 60 || maxVal > 70)) {
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

  console.log('Successfully saved perfect circular/elliptical symbols with full round power button and zero specks!');
}

extractPristineSymbols().catch(console.error);

const sharp = require('sharp');
const path = require('path');

const inputPath = "C:/Users/abc/.gemini/antigravity/brain/e983e1d4-86e4-4373-8194-9bd8e83b5451/.user_uploaded/media_1787574659307.jpg";
const outputDir = path.join(__dirname, 'public');

async function processCleanLogo() {
  const { data, info } = await sharp(inputPath)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const width = info.width;
  const height = info.height;
  const channels = info.channels;

  // 1. Find bounding box of the entire logo
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

  console.log(`Cropped canvas: ${cropW}x${cropH}`);

  // Base image with empty dark lenses (Symbols removed / in-painted with dark glass)
  const baseEmptyLensesRgba = Buffer.alloc(cropW * cropH * 4);
  const leftEyeRgba = Buffer.alloc(cropW * cropH * 4);
  const rightEyeRgba = Buffer.alloc(cropW * cropH * 4);

  // Left & Right lens center in original image
  const leftCX = 360, leftCY = 310;
  const rightCX = 665, rightCY = 310;

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

      // Smooth transparency for black background around the glasses
      let alpha = 0;
      if (maxVal > 8) {
        alpha = Math.min(255, Math.floor(((maxVal - 8) / 32) * 255));
      }

      // Left lens socket ellipse
      const dxL = (ox - leftCX) / 105;
      const dyL = (oy - leftCY) / 62;
      const isInsideLeftSocket = (dxL * dxL + dyL * dyL) <= 1.0;

      // Right lens socket ellipse
      const dxR = (ox - rightCX) / 105;
      const dyR = (oy - rightCY) / 62;
      const isInsideRightSocket = (dxR * dxR + dyR * dyR) <= 1.0;

      // Check if pixel is part of the glowing symbols
      const distL = Math.hypot(ox - leftCX, oy - leftCY);
      const isLeftSymbol = isInsideLeftSocket && distL <= 68 && (b > 80 || maxVal > 90);

      const distR = Math.hypot(ox - rightCX, oy - rightCY);
      const isRightSymbol = isInsideRightSocket && distR <= 65 && (g > 70 || b > 70 || maxVal > 90);

      // --- 1. BASE LAYER WITH EMPTY LENSES ---
      // If it's a symbol inside the lens, replace it with the dark glass lens floor color!
      if (isInsideLeftSocket || isInsideRightSocket) {
        if (isLeftSymbol || isRightSymbol) {
          // Inpaint symbol with dark glossy glass color matching the surrounding lens floor
          baseEmptyLensesRgba[outIdx] = 6;      // R
          baseEmptyLensesRgba[outIdx + 1] = 13; // G
          baseEmptyLensesRgba[outIdx + 2] = 26; // B
          baseEmptyLensesRgba[outIdx + 3] = 255;// fully solid inside lens
        } else {
          // Natural dark glass lens reflection / floor
          baseEmptyLensesRgba[outIdx] = r;
          baseEmptyLensesRgba[outIdx + 1] = g;
          baseEmptyLensesRgba[outIdx + 2] = b;
          baseEmptyLensesRgba[outIdx + 3] = Math.max(240, alpha);
        }
      } else {
        // Metallic Frame Chassis
        baseEmptyLensesRgba[outIdx] = r;
        baseEmptyLensesRgba[outIdx + 1] = g;
        baseEmptyLensesRgba[outIdx + 2] = b;
        baseEmptyLensesRgba[outIdx + 3] = alpha;
      }

      // --- 2. MOVING LEFT PUPIL (</> Symbol) ---
      if (isLeftSymbol) {
        leftEyeRgba[outIdx] = r;
        leftEyeRgba[outIdx + 1] = g;
        leftEyeRgba[outIdx + 2] = b;
        leftEyeRgba[outIdx + 3] = alpha;
      } else {
        leftEyeRgba[outIdx + 3] = 0;
      }

      // --- 3. MOVING RIGHT PUPIL (Power Symbol) ---
      if (isRightSymbol) {
        rightEyeRgba[outIdx] = r;
        rightEyeRgba[outIdx + 1] = g;
        rightEyeRgba[outIdx + 2] = b;
        rightEyeRgba[outIdx + 3] = alpha;
      } else {
        rightEyeRgba[outIdx + 3] = 0;
      }
    }
  }

  // Save the base glasses with completely empty lenses
  await sharp(baseEmptyLensesRgba, { raw: { width: cropW, height: cropH, channels: 4 } })
    .png()
    .toFile(path.join(outputDir, 'hero-base-empty-lenses.png'));

  // Save the clean moving pupils
  await sharp(leftEyeRgba, { raw: { width: cropW, height: cropH, channels: 4 } })
    .png()
    .toFile(path.join(outputDir, 'hero-symbol-code.png'));

  await sharp(rightEyeRgba, { raw: { width: cropW, height: cropH, channels: 4 } })
    .png()
    .toFile(path.join(outputDir, 'hero-symbol-power.png'));

  console.log('Generated hero-base-empty-lenses.png without symbols!');
}

processCleanLogo().catch(console.error);

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

  const fullRgba = Buffer.alloc(cropW * cropH * 4);
  const frameRgba = Buffer.alloc(cropW * cropH * 4);
  const leftEyeRgba = Buffer.alloc(cropW * cropH * 4);
  const rightEyeRgba = Buffer.alloc(cropW * cropH * 4);
  const darkLensBackingRgba = Buffer.alloc(cropW * cropH * 4);

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

      // Smooth transparency for black background
      let alpha = 0;
      if (maxVal > 8) {
        alpha = Math.min(255, Math.floor(((maxVal - 8) / 32) * 255));
      }

      // Full Master Image
      fullRgba[outIdx] = r;
      fullRgba[outIdx + 1] = g;
      fullRgba[outIdx + 2] = b;
      fullRgba[outIdx + 3] = alpha;

      // Lens inner socket detection
      // Left socket is roughly ellipse centered at leftCX, leftCY (radiusX ~105, radiusY ~62)
      const dxL = (ox - leftCX) / 105;
      const dyL = (oy - leftCY) / 62;
      const isInsideLeftSocket = (dxL * dxL + dyL * dyL) <= 1.0;

      // Right socket is roughly ellipse centered at rightCX, rightCY (radiusX ~105, radiusY ~62)
      const dxR = (ox - rightCX) / 105;
      const dyR = (oy - rightCY) / 62;
      const isInsideRightSocket = (dxR * dxR + dyR * dyR) <= 1.0;

      // Check if pixel belongs to the inner glowing symbol
      // Left </> symbol: cyan/blue (b > 130, g > 60, and within symbol radius 65)
      const distL = Math.hypot(ox - leftCX, oy - leftCY);
      const isLeftSymbol = isInsideLeftSocket && distL <= 68 && (b > 80 || maxVal > 90);

      // Right Power symbol: cyan/green (g > 110, b > 110, within symbol radius 62)
      const distR = Math.hypot(ox - rightCX, oy - rightCY);
      const isRightSymbol = isInsideRightSocket && distR <= 65 && (g > 70 || b > 70 || maxVal > 90);

      // --- Frame Layer ---
      // Transparent inside the lens sockets where symbols move
      if (isInsideLeftSocket || isInsideRightSocket) {
        frameRgba[outIdx] = r;
        frameRgba[outIdx + 1] = g;
        frameRgba[outIdx + 2] = b;
        frameRgba[outIdx + 3] = 0; // Empty lens hole!
      } else {
        frameRgba[outIdx] = r;
        frameRgba[outIdx + 1] = g;
        frameRgba[outIdx + 2] = b;
        frameRgba[outIdx + 3] = alpha;
      }

      // --- Left Pupil (</>) Layer ---
      if (isLeftSymbol) {
        leftEyeRgba[outIdx] = r;
        leftEyeRgba[outIdx + 1] = g;
        leftEyeRgba[outIdx + 2] = b;
        leftEyeRgba[outIdx + 3] = alpha;
      } else {
        leftEyeRgba[outIdx + 3] = 0;
      }

      // --- Right Pupil (Power) Layer ---
      if (isRightSymbol) {
        rightEyeRgba[outIdx] = r;
        rightEyeRgba[outIdx + 1] = g;
        rightEyeRgba[outIdx + 2] = b;
        rightEyeRgba[outIdx + 3] = alpha;
      } else {
        rightEyeRgba[outIdx + 3] = 0;
      }

      // --- Clean Lens Backing (Dark Glass) ---
      if (isInsideLeftSocket || isInsideRightSocket) {
        darkLensBackingRgba[outIdx] = 6;
        darkLensBackingRgba[outIdx + 1] = 12;
        darkLensBackingRgba[outIdx + 2] = 24;
        darkLensBackingRgba[outIdx + 3] = 230; // Solid subtle dark lens glass
      } else {
        darkLensBackingRgba[outIdx + 3] = 0;
      }
    }
  }

  await sharp(fullRgba, { raw: { width: cropW, height: cropH, channels: 4 } })
    .png()
    .toFile(path.join(outputDir, 'hero-logo-full.png'));

  await sharp(frameRgba, { raw: { width: cropW, height: cropH, channels: 4 } })
    .png()
    .toFile(path.join(outputDir, 'hero-glasses-frame.png'));

  await sharp(leftEyeRgba, { raw: { width: cropW, height: cropH, channels: 4 } })
    .png()
    .toFile(path.join(outputDir, 'hero-symbol-code.png'));

  await sharp(rightEyeRgba, { raw: { width: cropW, height: cropH, channels: 4 } })
    .png()
    .toFile(path.join(outputDir, 'hero-symbol-power.png'));

  await sharp(darkLensBackingRgba, { raw: { width: cropW, height: cropH, channels: 4 } })
    .png()
    .toFile(path.join(outputDir, 'hero-lens-backing.png'));

  console.log('Clean extraction complete!');
}

processCleanLogo().catch(console.error);

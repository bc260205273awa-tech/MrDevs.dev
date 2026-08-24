const sharp = require('sharp');
const path = require('path');

const inputPath = "C:/Users/abc/.gemini/antigravity/brain/e983e1d4-86e4-4373-8194-9bd8e83b5451/.user_uploaded/media_1787574659307.jpg";
const outputDir = path.join(__dirname, 'public');

async function processImage() {
  const { data, info } = await sharp(inputPath)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const width = info.width;
  const height = info.height;
  const channels = info.channels;

  // First pass: find tight bounding box of entire logo
  let minX = width, maxX = 0, minY = height, maxY = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      const brightness = Math.max(data[idx], data[idx + 1], data[idx + 2]);
      if (brightness > 18) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  // Add slight padding around bounds
  const pad = 10;
  minX = Math.max(0, minX - pad);
  minY = Math.max(0, minY - pad);
  maxX = Math.min(width - 1, maxX + pad);
  maxY = Math.min(height - 1, maxY + pad);

  const cropW = maxX - minX + 1;
  const cropH = maxY - minY + 1;

  console.log(`Bounding box: (${minX}, ${minY}) to (${maxX}, ${maxY}), size: ${cropW}x${cropH}`);

  const fullRgba = Buffer.alloc(cropW * cropH * 4);
  const frameRgba = Buffer.alloc(cropW * cropH * 4);
  const leftEyeRgba = Buffer.alloc(cropW * cropH * 4);
  const rightEyeRgba = Buffer.alloc(cropW * cropH * 4);

  // Left lens center in original image: approx x = 360, y = 310
  // Right lens center in original image: approx x = 665, y = 310
  // Symbol radius approx: 85px

  for (let cy = 0; cy < cropH; cy++) {
    for (let cx = 0; cx < cropW; cx++) {
      const ox = minX + cx;
      const oy = minY + cy;
      const inIdx = (oy * width + ox) * channels;
      const outIdx = (cy * cropW + cx) * 4;

      const r = data[inIdx];
      const g = data[inIdx + 1];
      const b = data[inIdx + 2];
      const brightness = Math.max(r, g, b);

      let alpha = 0;
      if (brightness > 10) {
        // High quality transparency extraction for black background
        alpha = Math.min(255, Math.floor(((brightness - 10) / 35) * 255));
      }

      // 1. Full Image
      fullRgba[outIdx] = r;
      fullRgba[outIdx + 1] = g;
      fullRgba[outIdx + 2] = b;
      fullRgba[outIdx + 3] = alpha;

      // Coordinates relative to crop box
      const relX = cx / cropW;
      const relY = cy / cropH;

      // Left lens area (approx relX: 0.08 to 0.44, relY: 0.15 to 0.85)
      // Right lens area (approx relX: 0.56 to 0.92, relY: 0.15 to 0.85)
      const distToLeftSymbol = Math.hypot(ox - 360, oy - 310);
      const distToRightSymbol = Math.hypot(ox - 665, oy - 310);

      const isLeftSymbol = distToLeftSymbol < 70 && brightness > 25;
      const isRightSymbol = distToRightSymbol < 65 && brightness > 25;

      // Frame: mask out the moving symbols so they can sit and move behind/inside cleanly
      if (isLeftSymbol || isRightSymbol) {
        frameRgba[outIdx + 3] = 0;
      } else {
        frameRgba[outIdx] = r;
        frameRgba[outIdx + 1] = g;
        frameRgba[outIdx + 2] = b;
        frameRgba[outIdx + 3] = alpha;
      }

      // Left Symbol (</>)
      if (distToLeftSymbol < 80 && brightness > 20) {
        leftEyeRgba[outIdx] = r;
        leftEyeRgba[outIdx + 1] = g;
        leftEyeRgba[outIdx + 2] = b;
        leftEyeRgba[outIdx + 3] = alpha;
      } else {
        leftEyeRgba[outIdx + 3] = 0;
      }

      // Right Symbol (Power)
      if (distToRightSymbol < 80 && brightness > 20) {
        rightEyeRgba[outIdx] = r;
        rightEyeRgba[outIdx + 1] = g;
        rightEyeRgba[outIdx + 2] = b;
        rightEyeRgba[outIdx + 3] = alpha;
      } else {
        rightEyeRgba[outIdx + 3] = 0;
      }
    }
  }

  // Save all 4 with the exact same canvas size for perfect 1:1 overlay alignment!
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

  // Also extract tightly cropped standalone symbols for versatile independent positioning
  await sharp(leftEyeRgba, { raw: { width: cropW, height: cropH, channels: 4 } })
    .trim()
    .png()
    .toFile(path.join(outputDir, 'hero-pupil-code.png'));

  await sharp(rightEyeRgba, { raw: { width: cropW, height: cropH, channels: 4 } })
    .trim()
    .png()
    .toFile(path.join(outputDir, 'hero-pupil-power.png'));

  console.log('Successfully generated pixel-perfect aligned 3D layers!');
}

processImage().catch(console.error);

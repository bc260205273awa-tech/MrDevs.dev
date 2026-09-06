const sharp = require('sharp');
const path = require('path');

const eyesPath = process.env.SOURCE_EYES_PATH || path.join(__dirname, 'scripts', 'source-video', 'eyes.webp');
const cleanFramePath = process.env.SOURCE_FRAME_PATH || path.join(__dirname, 'scripts', 'source-video', 'frame.jpg');
const outputDir = path.join(__dirname, 'public');

async function processOfficialEyes() {
  const { data: eyesData, info: eyesInfo } = await sharp(eyesPath)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { data: frameData } = await sharp(cleanFramePath)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const width = eyesInfo.width;
  const height = eyesInfo.height;
  const channels = eyesInfo.channels;

  // Exact same bounding box calculated from the frame:
  let minX = width, maxX = 0, minY = height, maxY = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      const b = Math.max(frameData[idx], frameData[idx + 1], frameData[idx + 2]);
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

  console.log(`Pristine canvas size: ${cropW}x${cropH}`);

  const leftEyeRgba = Buffer.alloc(cropW * cropH * 4);
  const rightEyeRgba = Buffer.alloc(cropW * cropH * 4);

  // In original image:
  // Left symbol center: ~360, 310
  // Right symbol center: ~665, 310
  // Midpoint between both symbols: ~500

  for (let cy = 0; cy < cropH; cy++) {
    for (let cx = 0; cx < cropW; cx++) {
      const ox = minX + cx;
      const oy = minY + cy;
      const inIdx = (oy * width + ox) * channels;
      const outIdx = (cy * cropW + cx) * 4;

      const r = eyesData[inIdx];
      const g = eyesData[inIdx + 1];
      const b = eyesData[inIdx + 2];
      const maxVal = Math.max(r, g, b);

      let alpha = 0;
      if (maxVal > 8) {
        alpha = Math.min(255, Math.floor(((maxVal - 8) / 26) * 255));
      }

      // Left eye (ox < 500)
      if (ox < 500) {
        leftEyeRgba[outIdx] = r;
        leftEyeRgba[outIdx + 1] = g;
        leftEyeRgba[outIdx + 2] = b;
        leftEyeRgba[outIdx + 3] = alpha;
      } else {
        leftEyeRgba[outIdx + 3] = 0;
      }

      // Right eye (ox >= 500)
      if (ox >= 500) {
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

  console.log('Saved pristine new eyes directly from official eyes render!');
}

processOfficialEyes().catch(console.error);

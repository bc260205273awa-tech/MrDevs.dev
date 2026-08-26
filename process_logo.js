const sharp = require('sharp');
const path = require('path');

const cleanFramePath = "C:/Users/abc/.gemini/antigravity/brain/e983e1d4-86e4-4373-8194-9bd8e83b5451/.user_uploaded/media_1787730132547.jpg";
const outputDir = path.join(__dirname, 'public');

async function processCleanFrame() {
  const { data, info } = await sharp(cleanFramePath)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const width = info.width;
  const height = info.height;
  const channels = info.channels;

  // Exact same bounding box coordinates as the symbols:
  // (214, 198) to (807, 416), size: 594x219 or padded 598x225
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

  console.log(`Frame cropped canvas: ${cropW}x${cropH}`);

  const frameRgba = Buffer.alloc(cropW * cropH * 4);

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

      // Smooth anti-aliased alpha transparency for all black pixels (outside AND inside the lenses!)
      let alpha = 0;
      if (maxVal > 8) {
        alpha = Math.min(255, Math.floor(((maxVal - 8) / 28) * 255));
      }

      frameRgba[outIdx] = r;
      frameRgba[outIdx + 1] = g;
      frameRgba[outIdx + 2] = b;
      frameRgba[outIdx + 3] = alpha;
    }
  }

  await sharp(frameRgba, { raw: { width: cropW, height: cropH, channels: 4 } })
    .png()
    .toFile(path.join(outputDir, 'hero-glasses-frame.png'));

  console.log('Saved pristine hero-glasses-frame.png directly from clean frame image!');
}

processCleanFrame().catch(console.error);

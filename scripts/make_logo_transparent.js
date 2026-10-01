const sharp = require('sharp');
const path = require('path');

async function makePerfectTransparentLogo() {
  const inputPath = path.join(__dirname, '..', 'public', 'Screenshot 2026-10-01 003541.png');
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const outData = Buffer.alloc(width * height * 4);

  // Exact brand neon color
  const BRAND_R = 200;
  const BRAND_G = 255;
  const BRAND_B = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      // Luminance / green weight
      if (g < 15 && r < 15 && b < 15) {
        // Pure black background
        outData[idx] = 0;
        outData[idx + 1] = 0;
        outData[idx + 2] = 0;
        outData[idx + 3] = 0;
      } else {
        // Alpha calculation
        // g ranges from ~15 to 255
        let alpha = Math.min(255, Math.max(0, Math.round((g / 255) * 255)));
        
        // Use smooth cubic / hermite curve at the bottom to cut off JPEG noise
        if (g < 35) {
          alpha = Math.round(alpha * (g / 35));
        }

        if (alpha > 0) {
          outData[idx] = BRAND_R;
          outData[idx + 1] = BRAND_G;
          outData[idx + 2] = BRAND_B;
          outData[idx + 3] = alpha;
        } else {
          outData[idx] = 0;
          outData[idx + 1] = 0;
          outData[idx + 2] = 0;
          outData[idx + 3] = 0;
        }
      }
    }
  }

  // 1. Full canvas transparent (same 757x755 as screenshot)
  const fullPath = path.join(__dirname, '..', 'public', 'logo.png');
  await sharp(outData, { raw: { width, height, channels: 4 } })
    .png({ quality: 100 })
    .toFile(fullPath);
  console.log('Saved transparent public/logo.png');

  // 2. Crop with balanced padding for icon (square 512x512)
  // Logo is 293w x 331h, center is (379, 380)
  // Let padding be around 10% on each side -> height 331 / 0.8 = ~414px box
  const cropBox = 414;
  const left = Math.round(379 - cropBox / 2);
  const top = Math.round(380 - cropBox / 2);

  const iconPngPath = path.join(__dirname, '..', 'public', 'icon.png');
  await sharp(fullPath)
    .extract({ left, top, width: cropBox, height: cropBox })
    .resize(512, 512)
    .png({ quality: 100 })
    .toFile(iconPngPath);
  console.log('Saved transparent public/icon.png');

  // Also app/icon.png
  await sharp(iconPngPath)
    .resize(192, 192)
    .png({ quality: 100 })
    .toFile(path.join(__dirname, '..', 'app', 'icon.png'));
  console.log('Saved app/icon.png');
}

makePerfectTransparentLogo();

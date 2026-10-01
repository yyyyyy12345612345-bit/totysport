const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function removeWhiteBg(inputPath, outputPath) {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const outData = Buffer.from(data);

  // We want to remove the white/near-white background.
  // Using BFS/flood fill starting from all 4 borders to only remove external white background
  // and NOT any white text or logos inside the jersey!
  const visited = new Uint8Array(width * height);
  const queue = [];

  // A pixel is background if it's near white (e.g., R > 230, G > 230, B > 230)
  const isBg = (idx) => {
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    return r > 225 && g > 225 && b > 225;
  };

  // Push border pixels
  for (let x = 0; x < width; x++) {
    for (const y of [0, height - 1]) {
      const idx = (y * width + x) * channels;
      if (isBg(idx)) {
        visited[y * width + x] = 1;
        queue.push(y * width + x);
      }
    }
  }
  for (let y = 0; y < height; y++) {
    for (const x of [0, width - 1]) {
      const idx = (y * width + x) * channels;
      if (!visited[y * width + x] && isBg(idx)) {
        visited[y * width + x] = 1;
        queue.push(y * width + x);
      }
    }
  }

  let head = 0;
  while (head < queue.length) {
    const curr = queue[head++];
    const cx = curr % width;
    const cy = Math.floor(curr / width);

    const neighbors = [
      cx > 0 ? curr - 1 : -1,
      cx < width - 1 ? curr + 1 : -1,
      cy > 0 ? curr - width : -1,
      cy < height - 1 ? curr + width : -1,
    ];

    for (const n of neighbors) {
      if (n !== -1 && !visited[n]) {
        const nIdx = n * channels;
        if (isBg(nIdx)) {
          visited[n] = 1;
          queue.push(n);
        }
      }
    }
  }

  // Now make all visited background pixels transparent with smooth edge antialiasing
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pos = y * width + x;
      const idx = pos * channels;
      if (visited[pos]) {
        outData[idx + 3] = 0;
      }
    }
  }

  await sharp(outData, { raw: { width, height, channels: 4 } })
    .png({ quality: 100 })
    .toFile(outputPath);

  console.log(`Saved transparent PNG: ${outputPath}`);
}

async function main() {
  const barcaInput = 'C:\\Users\\youse\\.gemini\\antigravity-ide\\brain\\11347ca1-11c5-4e34-a152-7ff306c62a72\\barcelona_jersey_prod_1790805427402.jpg';
  const barcaOutput = path.join(__dirname, '..', 'public', 'images', 'products', 'barcelona.png');
  await removeWhiteBg(barcaInput, barcaOutput);

  const milanInput = 'C:\\Users\\youse\\.gemini\\antigravity-ide\\brain\\11347ca1-11c5-4e34-a152-7ff306c62a72\\ac_milan_jersey_prod_1790805458177.jpg';
  const milanOutput = path.join(__dirname, '..', 'public', 'images', 'products', 'ac_milan.png');
  await removeWhiteBg(milanInput, milanOutput);
}

main();

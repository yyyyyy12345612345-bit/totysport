const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function processImage(name) {
  const inputPath = path.join(__dirname, '..', 'public', 'images', 'products', `${name}.jpg`);
  const outputPath = path.join(__dirname, '..', 'public', 'images', 'products', `${name}.png`);

  if (!fs.existsSync(inputPath)) {
    console.error('File not found:', inputPath);
    return;
  }

  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const width = info.width;
  const height = info.height;
  const channels = info.channels; // 4 (RGBA)

  console.log(`Processing ${name}: ${width}x${height}`);

  // Sample corner colors (e.g. top-left, top-right, bottom-left, bottom-right)
  const getPixel = (x, y) => {
    const idx = (y * width + x) * channels;
    return [data[idx], data[idx + 1], data[idx + 2], data[idx + 3]];
  };

  const corners = [
    getPixel(5, 5),
    getPixel(width - 5, 5),
    getPixel(5, height - 5),
    getPixel(width - 5, height - 5),
  ];

  console.log(`${name} corner colors:`, corners);

  // Compute average background color from perimeter
  let bgR = 0, bgG = 0, bgB = 0, count = 0;
  for (let x = 0; x < width; x += 5) {
    const top = getPixel(x, 2);
    const bottom = getPixel(x, height - 3);
    bgR += top[0] + bottom[0];
    bgG += top[1] + bottom[1];
    bgB += top[2] + bottom[2];
    count += 2;
  }
  for (let y = 0; y < height; y += 5) {
    const left = getPixel(2, y);
    const right = getPixel(width - 3, y);
    bgR += left[0] + right[0];
    bgG += left[1] + right[1];
    bgB += left[2] + right[2];
    count += 2;
  }
  bgR /= count;
  bgG /= count;
  bgB /= count;
  console.log(`${name} average bg:`, { bgR, bgG, bgB });

  // Flood fill / BFS from outer border to mark only external connected background
  const visited = new Uint8Array(width * height);
  const queue = [];

  const colorDist = (r1, g1, b1, r2, g2, b2) => {
    return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
  };

  // Add all border pixels to queue if close to background
  // Tolerance threshold
  const THRESHOLD = 55;

  for (let x = 0; x < width; x++) {
    for (const y of [0, height - 1]) {
      const idx = (y * width + x) * channels;
      if (colorDist(data[idx], data[idx + 1], data[idx + 2], bgR, bgG, bgB) < THRESHOLD * 1.5) {
        visited[y * width + x] = 1;
        queue.push((y * width + x));
      }
    }
  }
  for (let y = 0; y < height; y++) {
    for (const x of [0, width - 1]) {
      const idx = (y * width + x) * channels;
      if (!visited[y * width + x] && colorDist(data[idx], data[idx + 1], data[idx + 2], bgR, bgG, bgB) < THRESHOLD * 1.5) {
        visited[y * width + x] = 1;
        queue.push((y * width + x));
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
        const dist = colorDist(data[nIdx], data[nIdx + 1], data[nIdx + 2], bgR, bgG, bgB);
        if (dist < THRESHOLD) {
          visited[n] = 1;
          queue.push(n);
        }
      }
    }
  }

  // Now make all visited pixels transparent, with soft feathering on edges
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pos = y * width + x;
      const idx = pos * channels;
      if (visited[pos]) {
        data[idx + 3] = 0; // completely transparent
      }
    }
  }

  // Save as high-quality transparent PNG
  await sharp(data, {
    raw: {
      width,
      height,
      channels: 4,
    },
  })
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(outputPath);

  console.log(`Saved transparent PNG: ${outputPath}`);
}

async function main() {
  await processImage('real_madrid');
  await processImage('barcelona');
  await processImage('ac_milan');

  for (const name of ['real_madrid', 'barcelona', 'ac_milan']) {
    const { data, info } = await sharp(path.join(__dirname, '..', 'public', 'images', 'products', `${name}.png`)).raw().toBuffer({ resolveWithObject: true });
    let transparent = 0, opaque = 0;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] === 0) transparent++;
      else opaque++;
    }
    console.log(`${name}: transparent=${transparent}, opaque=${opaque}, opaque%=${(opaque / (transparent + opaque) * 100).toFixed(1)}%`);
  }
}

main().catch(console.error);

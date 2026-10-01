const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public', 'images', 'products');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const artifacts = 'C:/Users/youse/.gemini/antigravity-ide/brain/4beb48d4-1767-44f4-a49d-cc2a472d269f';
const files = [
  { src: 'barcelona_jersey_1790797277876.jpg', dest: 'barcelona.jpg' },
  { src: 'real_madrid_jersey_1790797257722.jpg', dest: 'real_madrid.jpg' },
  { src: 'ac_milan_jersey_1790797298783.jpg', dest: 'ac_milan.jpg' },
];

files.forEach(({ src, dest }) => {
  const srcPath = path.join(artifacts, src);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, path.join(dir, dest));
    console.log(`Copied ${dest}`);
  }
});

const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      callback(dirPath);
    }
  });
}

const frontendPath = 'C:/Users/amith/bmv/BookMyVenue/frontend';
walkDir(frontendPath, filePath => {
  if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
    if (filePath.includes('node_modules') || filePath.includes('.next')) return;

    let buffer = fs.readFileSync(filePath);
    if (buffer[0] === 0xEF && buffer[1] === 0xBB && buffer[2] === 0xBF) {
      console.log('Stripping BOM from:', filePath);
      fs.writeFileSync(filePath, buffer.slice(3));
    }
  }
});

console.log('BOM inspection complete.');

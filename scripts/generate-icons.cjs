const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const sizes = [192, 512];

sizes.forEach(size => {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Background
  const radius = size * 0.125;
  ctx.beginPath();
  ctx.moveTo(radius, 0);
  ctx.lineTo(size - radius, 0);
  ctx.quadraticCurveTo(size, 0, size, radius);
  ctx.lineTo(size, size - radius);
  ctx.quadraticCurveTo(size, size, size - radius, size);
  ctx.lineTo(radius, size);
  ctx.quadraticCurveTo(0, size, 0, size - radius);
  ctx.lineTo(0, radius);
  ctx.quadraticCurveTo(0, 0, radius, 0);
  ctx.closePath();
  ctx.fillStyle = '#0369a1';
  ctx.fill();
  
  // Text
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  const titleSize = size * 0.167;
  ctx.font = `bold ${titleSize}px Arial`;
  ctx.fillText('Pedidos', size/2, size * 0.42);
  
  const subtitleSize = size * 0.125;
  ctx.font = `${subtitleSize}px Arial`;
  ctx.fillText('Susana', size/2, size * 0.62);
  
  // Checkmark circle
  ctx.beginPath();
  ctx.arc(size/2, size * 0.78, size * 0.083, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.fill();
  
  // Checkmark
  ctx.beginPath();
  ctx.strokeStyle = 'white';
  ctx.lineWidth = size * 0.016;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.moveTo(size * 0.46, size * 0.78);
  ctx.lineTo(size * 0.49, size * 0.82);
  ctx.lineTo(size * 0.54, size * 0.74);
  ctx.stroke();
  
  // Save
  const buffer = canvas.toBuffer('image/png');
  const outputPath = path.join(__dirname, '..', 'public', 'icons', `icon-${size}.png`);
  fs.writeFileSync(outputPath, buffer);
  console.log(`Created: ${outputPath}`);
});

const DottedMap = require('dotted-map').default;
const fs = require('fs');
const path = require('path');

// Japan-centered world map matching the reference image
// Slightly adjusted to keep South America together on the right side
const JAPAN_CENTER_LNG = 150;  // 150°E keeps South America from splitting

// Create map with extended latitude range to include all of South America
// Reference image appears to cover ~80°N to ~55°S
const map = new DottedMap({
    height: 145,  // Adjusted for ~10,000 dots
    grid: 'vertical',
    region: {
        lat: { min: -56, max: 84 },  // Extended south to include Tierra del Fuego
        lng: { min: -180, max: 180 }
    }
});

console.log('Generating Japan-centered world map...\n');

const points = map.getPoints();
console.log(`Total points: ${points.length}`);

// Get original bounds
let minX = Infinity, maxX = -Infinity;
let minY = Infinity, maxY = -Infinity;
points.forEach(p => {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
});

console.log(`X range: ${minX} to ${maxX}`);
console.log(`Y range: ${minY} to ${maxY}`);

const xRange = maxX - minX;
const yRange = maxY - minY;

// Calculate shift to center Japan (140°E)
// x=minX corresponds to -180°, x=maxX corresponds to 180°
const japanX = ((JAPAN_CENTER_LNG + 180) / 360) * xRange + minX;
const centerX = (maxX + minX) / 2;
const shiftX = japanX - centerX;

console.log(`Shifting X by ${shiftX.toFixed(1)} to center Japan`);

// Transform points
const transformed = points.map(p => {
    let newX = p.x - shiftX;

    // Wrap around
    if (newX < minX) newX += xRange;
    if (newX > maxX) newX -= xRange;

    // Normalize to start from 0
    return {
        x: Math.round((newX - minX) * 100) / 100,
        y: Math.round((p.y - minY) * 100) / 100,
    };
});

// Final dimensions
const width = Math.round(xRange * 100) / 100;
const height = Math.round(yRange * 100) / 100;

console.log(`\nOutput dimensions: ${width} x ${height}`);
console.log(`Aspect ratio: ${(width/height).toFixed(2)}:1`);

// Save
const output = { width, height, points: transformed };
const outputPath = path.join(__dirname, '../src/app/english/world-map/mapData.json');
fs.writeFileSync(outputPath, JSON.stringify(output));

console.log(`\n✓ Saved ${points.length} points to mapData.json`);

// Verify Japan is centered
const newJapanX = japanX - shiftX - minX;
console.log(`✓ Japan X: ${newJapanX.toFixed(1)} (center: ${(width/2).toFixed(1)})`);

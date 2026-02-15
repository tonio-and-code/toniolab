const DottedMap = require('dotted-map').default;
const fs = require('fs');
const path = require('path');

// Japan-centered world map with size-based area correction
const JAPAN_CENTER_LNG = 150;

const map = new DottedMap({
    height: 145,
    grid: 'vertical',
    region: {
        lat: { min: -56, max: 84 },
        lng: { min: -180, max: 180 }
    }
});

console.log('Generating size-corrected world map...\n');

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

const xRange = maxX - minX;
const yRange = maxY - minY;

// Calculate shift to center Japan
const japanX = ((JAPAN_CENTER_LNG + 180) / 360) * xRange + minX;
const centerX = (maxX + minX) / 2;
const shiftX = japanX - centerX;

console.log(`X range: ${minX} to ${maxX}`);
console.log(`Y range: ${minY} to ${maxY}`);

// Transform points with size based on latitude
const transformed = points.map(p => {
    let newX = p.x - shiftX;

    // Wrap around
    if (newX < minX) newX += xRange;
    if (newX > maxX) newX -= xRange;

    // Calculate latitude from y position (approximate)
    // y=0 is top (north), y=yRange is bottom (south)
    const yNorm = (p.y - minY) / yRange; // 0 to 1
    const lat = 84 - yNorm * (84 - (-56)); // 84 to -56
    const latRad = Math.abs(lat) * Math.PI / 180;

    // Size based on cos(latitude) - smaller at high latitudes
    // Base size 0.55, minimum 0.25
    const sizeFactor = Math.cos(latRad);
    const size = Math.round((0.25 + 0.35 * sizeFactor) * 100) / 100;

    return {
        x: Math.round((newX - minX) * 100) / 100,
        y: Math.round((p.y - minY) * 100) / 100,
        r: size
    };
});

// Final dimensions
const width = Math.round(xRange * 100) / 100;
const height = Math.round(yRange * 100) / 100;

console.log(`\nOutput dimensions: ${width} x ${height}`);
console.log(`Sample sizes:`);
console.log(`  Equator (0°): r = ${(0.25 + 0.35 * 1).toFixed(2)}`);
console.log(`  Mid (45°): r = ${(0.25 + 0.35 * Math.cos(45 * Math.PI / 180)).toFixed(2)}`);
console.log(`  High (70°): r = ${(0.25 + 0.35 * Math.cos(70 * Math.PI / 180)).toFixed(2)}`);

// Save
const output = { width, height, points: transformed };
const outputPath = path.join(__dirname, '../src/app/english/world-map-4/mapData.json');
fs.writeFileSync(outputPath, JSON.stringify(output));

console.log(`\n✓ Saved ${points.length} points with variable sizes to mapData.json`);

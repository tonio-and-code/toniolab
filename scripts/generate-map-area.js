const DottedMap = require('dotted-map').default;
const fs = require('fs');
const path = require('path');

// Japan-centered world map with area-based dot filtering
const JAPAN_CENTER_LNG = 150;
const CUT_LATITUDE = 72; // Remove above this (bye Greenland)

const map = new DottedMap({
    height: 145,
    grid: 'vertical',
    region: {
        lat: { min: -56, max: 84 },
        lng: { min: -180, max: 180 }
    }
});

console.log('Generating area-corrected world map (no Greenland)...\n');

const points = map.getPoints();
console.log(`Original points: ${points.length}`);

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

// Transform and filter points
const transformed = [];
points.forEach(p => {
    // Calculate latitude from y position
    const yNorm = (p.y - minY) / yRange;
    const lat = 84 - yNorm * (84 - (-56));

    // Cut off high latitudes (removes Greenland, northern Russia edges)
    if (lat > CUT_LATITUDE) return;

    // Area correction: thin out dots at remaining high latitudes
    const latRad = Math.abs(lat) * Math.PI / 180;
    const keepProb = Math.cos(latRad);
    if (Math.random() > keepProb) return;

    let newX = p.x - shiftX;
    if (newX < minX) newX += xRange;
    if (newX > maxX) newX -= xRange;

    transformed.push({
        x: Math.round((newX - minX) * 100) / 100,
        y: Math.round((p.y - minY) * 100) / 100,
    });
});

// Final dimensions
const width = Math.round(xRange * 100) / 100;
const height = Math.round(yRange * 100) / 100;

console.log(`After filtering: ${transformed.length} points`);
console.log(`Removed: ${points.length - transformed.length} points`);
console.log(`Output dimensions: ${width} x ${height}`);

// Save
const output = { width, height, points: transformed };
const outputPath = path.join(__dirname, '../src/app/english/world-map-4/mapData.json');
fs.writeFileSync(outputPath, JSON.stringify(output));

console.log(`\n✓ Saved to mapData.json`);

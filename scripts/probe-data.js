const DottedMap = require('dotted-map').default;

console.log('Generating map...');
const map = new DottedMap({ height: 20, grid: 'vertical' });
// Small height for speed

const points = map.getPoints();
console.log(`Generated ${points.length} points.`);
if (points.length > 0) {
    console.log('Sample point:', points[0]);
    // Check if we can find a point that might be in a country
    const midPoint = points[Math.floor(points.length / 2)];
    console.log('Mid point:', midPoint);
}

// Check filtering capabilities
const usMap = new DottedMap({ height: 20, grid: 'vertical', countries: ['USA'] });
const usPoints = usMap.getPoints();
console.log(`US points: ${usPoints.length}`);
if (usPoints.length > 0) {
    console.log('US Sample:', usPoints[0]);
}

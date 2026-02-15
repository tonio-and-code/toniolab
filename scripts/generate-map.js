const DottedMap = require('dotted-map').default;
const fs = require('fs');
const path = require('path');

// Higher resolution for "All Countries"
// height=120 -> ~6000 dots
const config = {
    height: 120,
    grid: 'vertical',
    region: { lat: { min: -60, max: 85 }, lng: { min: -180, max: 180 } }
};

console.log('Generating high-resolution world map...');
const worldMap = new DottedMap(config);
const fullPoints = worldMap.getPoints();
console.log(`Total world points: ${fullPoints.length}`);

// 2. Identify regions (Comprehensive List)
// 2. Identify regions (Full 200+ Countries - All ISO Alpha-3)
// Using standard ISO Alpha-3 codes.
const regions = [
    'AFG', 'ALB', 'DZA', 'AND', 'AGO', 'ATG', 'ARG', 'ARM', 'AUS', 'AUT', 'AZE', 'BHS',
    'BHR', 'BGD', 'BRB', 'BLR', 'BEL', 'BLZ', 'BEN', 'BTN', 'BOL', 'BIH', 'BWA', 'BRA',
    'BRN', 'BGR', 'BFA', 'BDI', 'CPV', 'KHM', 'CMR', 'CAN', 'CAF', 'TCD', 'CHL', 'CHN',
    'COL', 'COM', 'COG', 'COD', 'CRI', 'HRV', 'CUB', 'CYP', 'CZE', 'DNK', 'DJI', 'DMA',
    'DOM', 'ECU', 'EGY', 'SLV', 'GNQ', 'ERI', 'EST', 'SWZ', 'ETH', 'FJI', 'FIN', 'FRA',
    'GAB', 'GMB', 'GEO', 'DEU', 'GHA', 'GRC', 'GRD', 'GTM', 'GIN', 'GNB', 'GUY', 'HTI',
    'HND', 'HUN', 'ISL', 'IND', 'IDN', 'IRN', 'IRQ', 'IRL', 'ISR', 'ITA', 'JAM', 'JPN',
    'JOR', 'KAZ', 'KEN', 'KIR', 'PRK', 'KOR', 'KWT', 'KGZ', 'LAO', 'LVA', 'LBN', 'LSO',
    'LBR', 'LBY', 'LIE', 'LTU', 'LUX', 'MDG', 'MWI', 'MYS', 'MDV', 'MLI', 'MLT', 'MHL',
    'MRT', 'MUS', 'MEX', 'FSM', 'MDA', 'MCO', 'MNG', 'MNE', 'MAR', 'MOZ', 'MMR', 'NAM',
    'NRU', 'NPL', 'NLD', 'NZL', 'NIC', 'NER', 'NGA', 'MKD', 'NOR', 'OMN', 'PAK', 'PLW',
    'PAN', 'PNG', 'PRY', 'PER', 'PHL', 'POL', 'PRT', 'QAT', 'ROU', 'RUS', 'RWA', 'KNA',
    'LCA', 'VCT', 'WSM', 'SMR', 'STP', 'SAU', 'SEN', 'SRB', 'SYC', 'SLE', 'SGP', 'SVK',
    'SVN', 'SLB', 'SOM', 'ZAF', 'SSD', 'ESP', 'LKA', 'SDN', 'SUR', 'SWE', 'CHE', 'SYR',
    'TWN', 'TJK', 'TZA', 'THA', 'TLS', 'TGO', 'TON', 'TTO', 'TUN', 'TUR', 'TKM', 'TUV',
    'UGA', 'UKR', 'ARE', 'GBR', 'USA', 'URY', 'UZB', 'VUT', 'VEN', 'VNM', 'YEM', 'ZMB',
    'ZWE', 'GRL', 'PRI'
];

const pointRegions = new Map(); // "x,y" -> regionCode

console.log(`Processing ${regions.length} regions...`);
regions.forEach(iso3 => {
    try {
        const regionConfig = { ...config, countries: [iso3] };
        const rMap = new DottedMap(regionConfig);
        const rPoints = rMap.getPoints();

        rPoints.forEach(p => {
            pointRegions.set(`${p.x},${p.y}`, iso3);
        });
    } catch (e) {
        console.warn(`Skipping invalid/unsupported region code: ${iso3}`);
    }
});

// 3. Merge data
const finalDots = fullPoints.map(p => {
    const key = `${p.x},${p.y}`;
    const region = pointRegions.get(key) || null; // null if not in our list
    return {
        x: p.x,
        y: p.y,
        region: region
    };
});

// Sort
finalDots.sort((a, b) => {
    if (a.y !== b.y) return a.y - b.y;
    return a.x - b.x;
});

// Post-processing: Fake Projection Correction (Squish Greenland)
// Mercator makes high latitudes (low Y in grid) huge.
// We will compress the top 25% of the map (Y < 30 roughly for height 120).
// Center of map Y is approx 60. 
// We want to pull rows 0-30 closer together or shift them down?
// Simple linear scaling for top rows.
// NOTE: This might disrupt the perfect "grid" alignment slightly, but canvas renders floats fine.

finalDots.forEach(p => {
    const mapHeight = 120; // from config
    const equator = mapHeight / 2;

    // Normalize Y to -1 (top) to 1 (bottom) relative to equator
    // grid y: 0 (top) -> 120 (bottom)

    if (p.y < 35) { // Top ~30% (Northern Hemisphere High Latitudes)
        // Check if it's Greenland / Canada / Russia area
        // Compress Y: Move it closer to 35.
        // Current distance from 35: (35 - p.y).
        // We want to reduce this distance.
        const dist = 35 - p.y;
        p.y = 35 - (dist * 0.65); // Squash by 35%
    }
});

// Calculate Bounds for Viewbox log
let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
finalDots.forEach(p => {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
});
console.log(`\nBounds: X[${minX}, ${maxX}], Y[${minY}, ${maxY}]`);
console.log(`Suggested Viewbox: Width=${maxX - minX}, Height=${maxY - minY}`);


const outputPath = path.join(__dirname, '../src/data/world-map-dots.json');

// Ensure directory exists
const dir = path.dirname(outputPath);
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(outputPath, JSON.stringify(finalDots));

console.log(`Successfully generated ${finalDots.length} dots.`);

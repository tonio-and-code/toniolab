
import fs from 'fs';
import path from 'path';
import * as d3Geo from 'd3-geo';
import * as topojson from 'topojson-client';

// Config
// 0.9 was too slow (took >10 mins).
// 1.5 should be ~3x faster. 2.0 is ~5x faster.
// Let's try 1.2 for a good balance.
const GRID_STEP = 1.2;
const OUTPUT_PATH = path.join(process.cwd(), 'src/data/world-map-dots-v5.json');
const DATA_PATH = path.join(process.cwd(), 'src/data/world-topo-50m.json');

async function generate() {
    console.log("Loading World Data...");
    try {
        const raw = fs.readFileSync(DATA_PATH, 'utf-8');
        const worldData = JSON.parse(raw);

        // @ts-ignore
        const countries = topojson.feature(worldData, worldData.objects.countries);
        // @ts-ignore
        const features = countries.features.filter((f: any) => f.id !== "010" && f.properties?.name !== "Antarctica");

        console.log(`Scanning Globe with ${GRID_STEP}° resolution...`);

        const dots = [];

        for (let lat = -58; lat <= 85; lat += GRID_STEP) {
            const latRad = (lat * Math.PI) / 180;
            const cosLat = Math.max(0.1, Math.cos(latRad));
            const lonStep = GRID_STEP / cosLat;

            for (let lon = -180; lon <= 180; lon += lonStep) {
                const point = [lon, lat];
                if (point[0] < -180 || point[0] > 180) continue;

                // Optimization: Simple Bounding Box check first?
                // D3 geoContains is expensive.
                let hit = false;
                let c = 'U';

                for (const feature of features) {
                    if (d3Geo.geoContains(feature, point as [number, number])) {
                        hit = true;
                        c = feature.properties?.name || 'U';
                        break;
                    }
                }

                if (hit) {
                    dots.push({
                        lat: Number(lat.toFixed(4)),
                        lon: Number(lon.toFixed(4)),
                        c: c,
                        id: `${lat.toFixed(2)},${lon.toFixed(2)}`
                    });
                }
            }
            if (Math.abs(lat % 10) < GRID_STEP) process.stdout.write(".");
        }

        console.log(`\nGenerated ${dots.length} dots.`);
        fs.writeFileSync(OUTPUT_PATH, JSON.stringify(dots));
        console.log(`Saved to ${OUTPUT_PATH}`);

    } catch (e) {
        console.error("Error:", e);
    }
}

generate();

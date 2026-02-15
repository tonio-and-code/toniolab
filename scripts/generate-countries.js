const fs = require('fs');
const path = require('path');

// 主要国の中心座標（約200カ国）
// lat/lng → Japan-centered map coordinates に変換
const countries = [
  // Asia
  { code: 'JP', name: 'Japan', lat: 36.2, lng: 138.3 },
  { code: 'CN', name: 'China', lat: 35.9, lng: 104.2 },
  { code: 'KR', name: 'South Korea', lat: 35.9, lng: 127.8 },
  { code: 'KP', name: 'North Korea', lat: 40.3, lng: 127.5 },
  { code: 'TW', name: 'Taiwan', lat: 23.7, lng: 121.0 },
  { code: 'MN', name: 'Mongolia', lat: 46.9, lng: 103.8 },
  { code: 'VN', name: 'Vietnam', lat: 14.1, lng: 108.3 },
  { code: 'TH', name: 'Thailand', lat: 15.9, lng: 100.9 },
  { code: 'MM', name: 'Myanmar', lat: 19.8, lng: 96.1 },
  { code: 'KH', name: 'Cambodia', lat: 12.6, lng: 105.0 },
  { code: 'LA', name: 'Laos', lat: 19.9, lng: 102.5 },
  { code: 'MY', name: 'Malaysia', lat: 4.2, lng: 101.9 },
  { code: 'SG', name: 'Singapore', lat: 1.4, lng: 103.8 },
  { code: 'ID', name: 'Indonesia', lat: -0.8, lng: 113.9 },
  { code: 'PH', name: 'Philippines', lat: 12.9, lng: 121.8 },
  { code: 'BN', name: 'Brunei', lat: 4.5, lng: 114.7 },
  { code: 'TL', name: 'Timor-Leste', lat: -8.9, lng: 125.7 },
  { code: 'IN', name: 'India', lat: 20.6, lng: 79.0 },
  { code: 'PK', name: 'Pakistan', lat: 30.4, lng: 69.3 },
  { code: 'BD', name: 'Bangladesh', lat: 23.7, lng: 90.4 },
  { code: 'LK', name: 'Sri Lanka', lat: 7.9, lng: 80.8 },
  { code: 'NP', name: 'Nepal', lat: 28.4, lng: 84.1 },
  { code: 'BT', name: 'Bhutan', lat: 27.5, lng: 90.4 },
  { code: 'MV', name: 'Maldives', lat: 3.2, lng: 73.2 },
  { code: 'AF', name: 'Afghanistan', lat: 33.9, lng: 67.7 },

  // Middle East
  { code: 'IR', name: 'Iran', lat: 32.4, lng: 53.7 },
  { code: 'IQ', name: 'Iraq', lat: 33.2, lng: 43.7 },
  { code: 'SA', name: 'Saudi Arabia', lat: 23.9, lng: 45.1 },
  { code: 'AE', name: 'UAE', lat: 23.4, lng: 53.8 },
  { code: 'QA', name: 'Qatar', lat: 25.4, lng: 51.2 },
  { code: 'KW', name: 'Kuwait', lat: 29.3, lng: 47.5 },
  { code: 'BH', name: 'Bahrain', lat: 26.0, lng: 50.6 },
  { code: 'OM', name: 'Oman', lat: 21.5, lng: 55.9 },
  { code: 'YE', name: 'Yemen', lat: 15.6, lng: 48.5 },
  { code: 'JO', name: 'Jordan', lat: 30.6, lng: 36.2 },
  { code: 'IL', name: 'Israel', lat: 31.0, lng: 34.9 },
  { code: 'LB', name: 'Lebanon', lat: 33.9, lng: 35.9 },
  { code: 'SY', name: 'Syria', lat: 34.8, lng: 39.0 },
  { code: 'TR', name: 'Turkey', lat: 39.0, lng: 35.2 },
  { code: 'CY', name: 'Cyprus', lat: 35.1, lng: 33.4 },

  // Central Asia
  { code: 'KZ', name: 'Kazakhstan', lat: 48.0, lng: 67.0 },
  { code: 'UZ', name: 'Uzbekistan', lat: 41.4, lng: 64.6 },
  { code: 'TM', name: 'Turkmenistan', lat: 38.9, lng: 59.6 },
  { code: 'KG', name: 'Kyrgyzstan', lat: 41.2, lng: 74.8 },
  { code: 'TJ', name: 'Tajikistan', lat: 38.9, lng: 71.3 },
  { code: 'AZ', name: 'Azerbaijan', lat: 40.1, lng: 47.6 },
  { code: 'GE', name: 'Georgia', lat: 42.3, lng: 43.4 },
  { code: 'AM', name: 'Armenia', lat: 40.1, lng: 45.0 },

  // Europe
  { code: 'RU', name: 'Russia', lat: 61.5, lng: 105.3 },
  { code: 'GB', name: 'United Kingdom', lat: 55.4, lng: -3.4 },
  { code: 'FR', name: 'France', lat: 46.2, lng: 2.2 },
  { code: 'DE', name: 'Germany', lat: 51.2, lng: 10.5 },
  { code: 'IT', name: 'Italy', lat: 41.9, lng: 12.6 },
  { code: 'ES', name: 'Spain', lat: 40.5, lng: -3.7 },
  { code: 'PT', name: 'Portugal', lat: 39.4, lng: -8.2 },
  { code: 'NL', name: 'Netherlands', lat: 52.1, lng: 5.3 },
  { code: 'BE', name: 'Belgium', lat: 50.5, lng: 4.5 },
  { code: 'CH', name: 'Switzerland', lat: 46.8, lng: 8.2 },
  { code: 'AT', name: 'Austria', lat: 47.5, lng: 14.6 },
  { code: 'PL', name: 'Poland', lat: 51.9, lng: 19.1 },
  { code: 'CZ', name: 'Czechia', lat: 49.8, lng: 15.5 },
  { code: 'SK', name: 'Slovakia', lat: 48.7, lng: 19.7 },
  { code: 'HU', name: 'Hungary', lat: 47.2, lng: 19.5 },
  { code: 'RO', name: 'Romania', lat: 46.0, lng: 25.0 },
  { code: 'BG', name: 'Bulgaria', lat: 42.7, lng: 25.5 },
  { code: 'GR', name: 'Greece', lat: 39.1, lng: 21.8 },
  { code: 'UA', name: 'Ukraine', lat: 48.4, lng: 31.2 },
  { code: 'BY', name: 'Belarus', lat: 53.7, lng: 27.9 },
  { code: 'MD', name: 'Moldova', lat: 47.4, lng: 28.4 },
  { code: 'SE', name: 'Sweden', lat: 60.1, lng: 18.6 },
  { code: 'NO', name: 'Norway', lat: 60.5, lng: 8.5 },
  { code: 'FI', name: 'Finland', lat: 61.9, lng: 25.7 },
  { code: 'DK', name: 'Denmark', lat: 56.3, lng: 9.5 },
  { code: 'IE', name: 'Ireland', lat: 53.1, lng: -8.0 },
  { code: 'IS', name: 'Iceland', lat: 65.0, lng: -19.0 },
  { code: 'EE', name: 'Estonia', lat: 58.6, lng: 25.0 },
  { code: 'LV', name: 'Latvia', lat: 56.9, lng: 24.6 },
  { code: 'LT', name: 'Lithuania', lat: 55.2, lng: 23.9 },
  { code: 'RS', name: 'Serbia', lat: 44.0, lng: 21.0 },
  { code: 'HR', name: 'Croatia', lat: 45.1, lng: 15.2 },
  { code: 'BA', name: 'Bosnia', lat: 43.9, lng: 17.7 },
  { code: 'SI', name: 'Slovenia', lat: 46.2, lng: 14.9 },
  { code: 'ME', name: 'Montenegro', lat: 42.7, lng: 19.4 },
  { code: 'MK', name: 'North Macedonia', lat: 41.5, lng: 21.7 },
  { code: 'AL', name: 'Albania', lat: 41.2, lng: 20.2 },
  { code: 'XK', name: 'Kosovo', lat: 42.6, lng: 20.9 },
  { code: 'LU', name: 'Luxembourg', lat: 49.8, lng: 6.1 },
  { code: 'MT', name: 'Malta', lat: 35.9, lng: 14.4 },

  // Africa
  { code: 'EG', name: 'Egypt', lat: 26.8, lng: 30.8 },
  { code: 'LY', name: 'Libya', lat: 26.3, lng: 17.2 },
  { code: 'TN', name: 'Tunisia', lat: 33.9, lng: 9.5 },
  { code: 'DZ', name: 'Algeria', lat: 28.0, lng: 1.7 },
  { code: 'MA', name: 'Morocco', lat: 31.8, lng: -7.1 },
  { code: 'SD', name: 'Sudan', lat: 12.9, lng: 30.2 },
  { code: 'SS', name: 'South Sudan', lat: 6.9, lng: 31.3 },
  { code: 'ET', name: 'Ethiopia', lat: 9.1, lng: 40.5 },
  { code: 'ER', name: 'Eritrea', lat: 15.2, lng: 39.8 },
  { code: 'DJ', name: 'Djibouti', lat: 11.8, lng: 42.6 },
  { code: 'SO', name: 'Somalia', lat: 5.2, lng: 46.2 },
  { code: 'KE', name: 'Kenya', lat: -0.0, lng: 38.0 },
  { code: 'UG', name: 'Uganda', lat: 1.4, lng: 32.3 },
  { code: 'TZ', name: 'Tanzania', lat: -6.4, lng: 34.9 },
  { code: 'RW', name: 'Rwanda', lat: -1.9, lng: 29.9 },
  { code: 'BI', name: 'Burundi', lat: -3.4, lng: 29.9 },
  { code: 'CD', name: 'DR Congo', lat: -4.0, lng: 21.8 },
  { code: 'CG', name: 'Congo', lat: -0.2, lng: 15.8 },
  { code: 'GA', name: 'Gabon', lat: -0.8, lng: 11.6 },
  { code: 'GQ', name: 'Equatorial Guinea', lat: 1.7, lng: 10.3 },
  { code: 'CM', name: 'Cameroon', lat: 7.4, lng: 12.4 },
  { code: 'CF', name: 'Central African Republic', lat: 6.6, lng: 20.9 },
  { code: 'TD', name: 'Chad', lat: 15.5, lng: 18.7 },
  { code: 'NE', name: 'Niger', lat: 17.6, lng: 8.1 },
  { code: 'NG', name: 'Nigeria', lat: 9.1, lng: 8.7 },
  { code: 'BJ', name: 'Benin', lat: 9.3, lng: 2.3 },
  { code: 'TG', name: 'Togo', lat: 8.6, lng: 0.8 },
  { code: 'GH', name: 'Ghana', lat: 7.9, lng: -1.0 },
  { code: 'CI', name: 'Ivory Coast', lat: 7.5, lng: -5.5 },
  { code: 'LR', name: 'Liberia', lat: 6.4, lng: -9.4 },
  { code: 'SL', name: 'Sierra Leone', lat: 8.5, lng: -11.8 },
  { code: 'GN', name: 'Guinea', lat: 9.9, lng: -9.7 },
  { code: 'GW', name: 'Guinea-Bissau', lat: 11.8, lng: -15.2 },
  { code: 'SN', name: 'Senegal', lat: 14.5, lng: -14.5 },
  { code: 'GM', name: 'Gambia', lat: 13.4, lng: -15.3 },
  { code: 'MR', name: 'Mauritania', lat: 21.0, lng: -10.9 },
  { code: 'ML', name: 'Mali', lat: 17.6, lng: -4.0 },
  { code: 'BF', name: 'Burkina Faso', lat: 12.2, lng: -1.6 },
  { code: 'AO', name: 'Angola', lat: -11.2, lng: 17.9 },
  { code: 'ZM', name: 'Zambia', lat: -13.1, lng: 27.8 },
  { code: 'ZW', name: 'Zimbabwe', lat: -19.0, lng: 29.2 },
  { code: 'BW', name: 'Botswana', lat: -22.3, lng: 24.7 },
  { code: 'NA', name: 'Namibia', lat: -22.6, lng: 18.5 },
  { code: 'ZA', name: 'South Africa', lat: -30.6, lng: 22.9 },
  { code: 'SZ', name: 'Eswatini', lat: -26.5, lng: 31.5 },
  { code: 'LS', name: 'Lesotho', lat: -29.6, lng: 28.2 },
  { code: 'MZ', name: 'Mozambique', lat: -18.7, lng: 35.5 },
  { code: 'MW', name: 'Malawi', lat: -13.3, lng: 34.3 },
  { code: 'MG', name: 'Madagascar', lat: -18.8, lng: 46.9 },
  { code: 'MU', name: 'Mauritius', lat: -20.3, lng: 57.6 },
  { code: 'SC', name: 'Seychelles', lat: -4.7, lng: 55.5 },
  { code: 'KM', name: 'Comoros', lat: -11.6, lng: 43.3 },

  // North America
  { code: 'US', name: 'United States', lat: 37.1, lng: -95.7 },
  { code: 'CA', name: 'Canada', lat: 56.1, lng: -106.3 },
  { code: 'MX', name: 'Mexico', lat: 23.6, lng: -102.6 },
  { code: 'GT', name: 'Guatemala', lat: 15.8, lng: -90.2 },
  { code: 'BZ', name: 'Belize', lat: 17.2, lng: -88.5 },
  { code: 'SV', name: 'El Salvador', lat: 13.8, lng: -88.9 },
  { code: 'HN', name: 'Honduras', lat: 15.2, lng: -86.2 },
  { code: 'NI', name: 'Nicaragua', lat: 12.9, lng: -85.2 },
  { code: 'CR', name: 'Costa Rica', lat: 9.7, lng: -83.8 },
  { code: 'PA', name: 'Panama', lat: 8.4, lng: -80.1 },
  { code: 'CU', name: 'Cuba', lat: 21.5, lng: -77.8 },
  { code: 'JM', name: 'Jamaica', lat: 18.1, lng: -77.3 },
  { code: 'HT', name: 'Haiti', lat: 18.9, lng: -72.3 },
  { code: 'DO', name: 'Dominican Republic', lat: 18.7, lng: -70.2 },
  { code: 'PR', name: 'Puerto Rico', lat: 18.2, lng: -66.6 },
  { code: 'BS', name: 'Bahamas', lat: 25.0, lng: -77.4 },
  { code: 'TT', name: 'Trinidad and Tobago', lat: 10.7, lng: -61.2 },
  { code: 'BB', name: 'Barbados', lat: 13.2, lng: -59.5 },

  // South America
  { code: 'BR', name: 'Brazil', lat: -14.2, lng: -51.9 },
  { code: 'AR', name: 'Argentina', lat: -38.4, lng: -63.6 },
  { code: 'CL', name: 'Chile', lat: -35.7, lng: -71.5 },
  { code: 'PE', name: 'Peru', lat: -9.2, lng: -75.0 },
  { code: 'CO', name: 'Colombia', lat: 4.6, lng: -74.3 },
  { code: 'VE', name: 'Venezuela', lat: 6.4, lng: -66.6 },
  { code: 'EC', name: 'Ecuador', lat: -1.8, lng: -78.2 },
  { code: 'BO', name: 'Bolivia', lat: -16.3, lng: -63.6 },
  { code: 'PY', name: 'Paraguay', lat: -23.4, lng: -58.4 },
  { code: 'UY', name: 'Uruguay', lat: -32.5, lng: -55.8 },
  { code: 'GY', name: 'Guyana', lat: 5.0, lng: -58.9 },
  { code: 'SR', name: 'Suriname', lat: 4.0, lng: -56.0 },
  { code: 'GF', name: 'French Guiana', lat: 4.0, lng: -53.0 },

  // Oceania
  { code: 'AU', name: 'Australia', lat: -25.3, lng: 133.8 },
  { code: 'NZ', name: 'New Zealand', lat: -40.9, lng: 174.9 },
  { code: 'PG', name: 'Papua New Guinea', lat: -6.3, lng: 143.9 },
  { code: 'FJ', name: 'Fiji', lat: -17.7, lng: 178.1 },
  { code: 'SB', name: 'Solomon Islands', lat: -9.6, lng: 160.2 },
  { code: 'VU', name: 'Vanuatu', lat: -15.4, lng: 166.9 },
  { code: 'NC', name: 'New Caledonia', lat: -20.9, lng: 165.6 },
  { code: 'WS', name: 'Samoa', lat: -13.8, lng: -172.1 },
  { code: 'TO', name: 'Tonga', lat: -21.2, lng: -175.2 },
  { code: 'PF', name: 'French Polynesia', lat: -17.7, lng: -149.4 },
  { code: 'GU', name: 'Guam', lat: 13.4, lng: 144.8 },
  { code: 'FM', name: 'Micronesia', lat: 7.4, lng: 150.6 },
  { code: 'PW', name: 'Palau', lat: 7.5, lng: 134.6 },
  { code: 'MH', name: 'Marshall Islands', lat: 7.1, lng: 171.2 },
  { code: 'KI', name: 'Kiribati', lat: 1.9, lng: -157.4 },
  { code: 'NR', name: 'Nauru', lat: -0.5, lng: 166.9 },
  { code: 'TV', name: 'Tuvalu', lat: -7.1, lng: 177.6 },
];

console.log(`Processing ${countries.length} countries...`);

// Japan-center settings (same as world map)
const JAPAN_CENTER_LNG = 150;
const MAP_WIDTH = 218;
const MAP_HEIGHT = 141;
const LAT_MIN = -56;
const LAT_MAX = 84;

// Convert lat/lng to map x/y (Japan-centered)
function toMapCoords(lat, lng) {
  // Shift longitude to center Japan
  let shiftedLng = lng - JAPAN_CENTER_LNG + 180;
  if (shiftedLng < 0) shiftedLng += 360;
  if (shiftedLng > 360) shiftedLng -= 360;

  const x = (shiftedLng / 360) * MAP_WIDTH;
  const y = ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * MAP_HEIGHT;

  return {
    x: Math.round(x * 100) / 100,
    y: Math.round(y * 100) / 100
  };
}

// Generate country data with map coordinates
const countryData = countries.map(c => {
  const coords = toMapCoords(c.lat, c.lng);
  return {
    code: c.code,
    name: c.name,
    x: coords.x,
    y: coords.y,
    words: [] // 5 words per country
  };
});

// Output
const output = {
  width: MAP_WIDTH,
  height: MAP_HEIGHT,
  maxWordsPerCountry: 5,
  countries: countryData
};

const outputPath = path.join(__dirname, '../src/app/english/world-map-5/countries.json');

// Create directory if not exists
const dir = path.dirname(outputPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

console.log(`✓ Generated ${countryData.length} countries`);
console.log(`✓ Saved to world-map-5/countries.json`);
console.log(`✓ Total word capacity: ${countryData.length * 5} words`);

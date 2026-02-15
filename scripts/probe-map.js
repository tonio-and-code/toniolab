const DottedMap = require('dotted-map').default;
const map = new DottedMap({ height: 10, grid: 'vertical' });
console.log(Object.keys(map));
// Check prototype methods
console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(map)));

try {
    // Try to see if there is a list of countries in the constructor or static
    console.log('Static properties:', Object.keys(DottedMap));
} catch (e) {
    console.log(e);
}

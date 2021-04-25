const semver = require('semver');
const p = semver.inc('1.1.0', 'prerelease', 'beta');

console.log('p', p);

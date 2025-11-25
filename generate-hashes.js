// generate-hashes.js
const crypto = require('crypto');
const fs = require('fs');

const files = ['script.js', 'auth.js'];

console.log('\n📝 Hashes para tu CSP:\n');
console.log('script-src \'self\'');

files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const hash = crypto.createHash('sha256').update(content).digest('base64');
    console.log(`  'sha256-${hash}'`);
});

console.log(';\n');
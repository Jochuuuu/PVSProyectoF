const fs = require('fs');
const crypto = require('crypto');

function generateHash(filename) {
    const content = fs.readFileSync(filename, 'utf8');
    const hash = crypto.createHash('sha256').update(content, 'utf8').digest('base64');
    return `sha256-${hash}`;
}

console.log('🔐 Generando hashes...\n');

// Generar hashes
const scriptHash = generateHash('script.js');
const authHash = generateHash('auth.js');

console.log('Hashes generados:');
console.log(`script.js: ${scriptHash}`);
console.log(`auth.js: ${authHash}\n`);

// Leer el HTML
let html = fs.readFileSync('main.html', 'utf8');

// Reemplazar hashes en CSP (dentro del meta tag)
html = html.replace(
    /script-src 'sha256-[A-Za-z0-9+/=]+' 'sha256-[A-Za-z0-9+/=]+'/,
    `script-src '${scriptHash}' '${authHash}'`
);

// Reemplazar integrity en script.js
html = html.replace(
    /<script src="script\.js" integrity="sha256-[A-Za-z0-9+/=]+"/,
    `<script src="script.js" integrity="${scriptHash}"`
);

// Reemplazar integrity en auth.js  
html = html.replace(
    /<script src="auth\.js" integrity="sha256-[A-Za-z0-9+/=]+"/,
    `<script src="auth.js" integrity="${authHash}"`
);

// Guardar
fs.writeFileSync('main.html', html);

console.log('✅ main.html actualizado correctamente\n');
console.log('📋 Nuevo CSP:');
console.log(`script-src '${scriptHash}' '${authHash}'`);
const fs = require('fs');
const crypto = require('crypto');

function generateHash(filename) {
    try {
        const content = fs.readFileSync(filename, 'utf8');
        const hash = crypto.createHash('sha256').update(content, 'utf8').digest('base64');
        return `sha256-${hash}`;
    } catch (error) {
        console.error(`❌ Error leyendo ${filename}:`, error.message);
        return null;
    }
}

console.log('🔐 Generando hashes SHA-256...\n');

const scriptHash = generateHash('script.js');
const authHash = generateHash('auth.js');

if (scriptHash && authHash) {
    console.log('✅ Hashes generados exitosamente:\n');
    console.log(`script.js:\n${scriptHash}\n`);
    console.log(`auth.js:\n${authHash}\n`);
    
    console.log('📋 Copia esto para tu CSP:\n');
    console.log(`script-src ${scriptHash} ${authHash};\n`);
    
    console.log('📋 Y esto para tus etiquetas <script>:\n');
    console.log(`<script src="script.js" integrity="${scriptHash}"></script>`);
    console.log(`<script src="auth.js" integrity="${authHash}"></script>`);
}
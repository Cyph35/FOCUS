const fs = require('fs');
let code = fs.readFileSync('src/lib/supabase.ts', 'utf8');

code = `/// <reference types="vite/client" />\n` + code;

fs.writeFileSync('src/lib/supabase.ts', code);

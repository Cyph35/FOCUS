const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const additionalStyles = `
        .dark .bg-\\[\\#FAF8F5\\]\\/80 { background-color: #2A2421 !important; border-color: #3A312D !important; }
`;

code = code.replace('.dark .bg-white\\/40, .dark .bg-white\\/50 { background-color: rgba(42, 36, 33, 0.5) !important; }', '.dark .bg-white\\/40, .dark .bg-white\\/50 { background-color: rgba(42, 36, 33, 0.5) !important; }' + additionalStyles);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched App.tsx styles 6");

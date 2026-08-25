const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const additionalStyles = `
        .dark .text-\\[\\#7A6455\\] { color: #EAE6DF !important; }
        .dark .text-amber-700 { color: #FBBF24 !important; }
        .dark .text-amber-600 { color: #F59E0B !important; }
        .dark .text-amber-500 { color: #F59E0B !important; }
        .dark .fill-amber-500 { fill: #F59E0B !important; }
        .dark .fill-amber-600 { fill: #FBBF24 !important; }
`;

code = code.replace('.dark .text-\\[\\#332A25\\] { color: #ffffff !important; }', '.dark .text-\\[\\#332A25\\] { color: #ffffff !important; }' + additionalStyles);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched App.tsx styles 3");

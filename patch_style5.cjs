const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const additionalStyles = `
        .dark .from-\\[\\#FAF8F5\\] { --tw-gradient-from: #2A2421 !important; --tw-gradient-stops: var(--tw-gradient-from), #2A2421, var(--tw-gradient-to) !important; }
        .dark .to-white { --tw-gradient-to: #2A2421 !important; }
        .dark .bg-gradient-to-r.from-\\[\\#FAF8F5\\].to-white { background-image: none !important; background-color: #2A2421 !important; }
`;

code = code.replace('.dark .bg-\\[\\#E8E3D9\\] { background-color: #3A312D !important; }', '.dark .bg-\\[\\#E8E3D9\\] { background-color: #3A312D !important; }' + additionalStyles);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched App.tsx styles 5");

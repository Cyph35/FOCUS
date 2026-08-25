const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const newStyles = `
        .dark .bg-gradient-to-r { background: none !important; background-color: #2A2421 !important; }
        .dark .bg-\\[\\#FAF8F5\\]\\/80 { background-color: #2A2421 !important; border-color: #3A312D !important; }
        .dark .bg-\\[\\#E8E3D9\\]\\/60 { background-color: #1E1A18 !important; }
        .dark .bg-\\[\\#9E8777\\] { background-color: #8B7365 !important; }
        .dark .bg-\\[\\#7A6455\\] { background-color: #A38C7A !important; }
        .dark .bg-white\\/40, .dark .bg-white\\/50 { background-color: rgba(42, 36, 33, 0.5) !important; }
`;

code = code.replace('.dark .bg-\\[\\#E8E3D9\\] { background-color: #3A312D !important; }', 
    '.dark .bg-\\[\\#E8E3D9\\] { background-color: #3A312D !important; }' + newStyles);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched App.tsx styles");

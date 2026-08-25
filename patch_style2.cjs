const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const additionalStyles = `
        .dark .bg-amber-100\\/90 { background-color: rgba(245, 158, 11, 0.15) !important; color: #FDE68A !important; }
        .dark .hover\\:bg-amber-200\\/90:hover { background-color: rgba(245, 158, 11, 0.25) !important; }
        .dark .text-amber-950 { color: #FEF3C7 !important; }
        .dark .border-amber-300 { border-color: rgba(245, 158, 11, 0.3) !important; }
        .dark .text-[#332A25] { color: #ffffff !important; }
`;

code = code.replace('.dark .text-\\[\\#332A25\\] { color: #ffffff !important; }', '.dark .text-\\[\\#332A25\\] { color: #ffffff !important; }' + additionalStyles);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched App.tsx styles 2");

const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const newStyles = `
        .dark .bg-gradient-to-r { background: none !important; background-color: #2A2421 !important; }
        .dark .from-\\[\\#FAF8F5\\] { --tw-gradient-from: #2A2421 !important; }
        .dark .to-white { --tw-gradient-to: #2A2421 !important; }
        .dark .bg-\\[\\#FAF8F5\\]\\/80 { background-color: #2A2421 !important; border-color: #3A312D !important; }
        .dark .bg-\\[\\#E8E3D9\\]\\/60 { background-color: #1E1A18 !important; }
        .dark .bg-\\[\\#E8E3D9\\]\\/80 { background-color: #1E1A18 !important; }
        .dark .text-amber-800 { color: #FCD34D !important; }
        .dark .text-amber-900 { color: #FDE68A !important; }
        .dark .bg-amber-500\\/10 { background-color: rgba(245, 158, 11, 0.1) !important; }
        .dark .border-amber-500\\/20 { border-color: rgba(245, 158, 11, 0.2) !important; }
        .dark .bg-amber-100 { background-color: rgba(245, 158, 11, 0.2) !important; color: #FDE68A !important; }
        .dark .text-emerald-950 { color: #A7F3D0 !important; }
        .dark .text-emerald-900 { color: #34D399 !important; }
        .dark .text-emerald-800 { color: #6EE7B7 !important; }
        .dark .bg-emerald-50 { background-color: rgba(16, 185, 129, 0.1) !important; border-color: rgba(16, 185, 129, 0.2) !important; }
        .dark .bg-emerald-200 { background-color: rgba(16, 185, 129, 0.2) !important; }
        .dark .border-emerald-300 { border-color: rgba(16, 185, 129, 0.3) !important; }
        .dark .bg-white\\/40, .dark .bg-white\\/50 { background-color: rgba(42, 36, 33, 0.5) !important; }
`;

if (code.includes('.dark .bg-gradient-to-r')) {
   console.log('Already patched');
} else {
    code = code.replace('.dark .bg-\\[\\#E8E3D9\\] { background-color: #3A312D !important; }', 
        '.dark .bg-\\[\\#E8E3D9\\] { background-color: #3A312D !important; }' + newStyles);
    fs.writeFileSync('src/App.tsx', code);
    console.log("Patched App.tsx styles");
}

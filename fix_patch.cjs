const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Revert the aggressive gradient override
code = code.replace('.dark .bg-gradient-to-r { background: none !important; background-color: #2A2421 !important; }', '');

fs.writeFileSync('src/App.tsx', code);
console.log("Fixed aggressive gradient override");

const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  'placeholder="e.g. admin"',
  'placeholder="Enter admin username"'
);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched admin username placeholder.");

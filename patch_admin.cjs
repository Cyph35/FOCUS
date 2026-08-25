const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  'Username (Optional)',
  'Username'
);

code = code.replace(
  '<span className="text-[10px] text-[#594A42]/60 font-medium">Default: admin123</span>',
  ''
);

code = code.replace(
  'Incorrect password. Default is: admin123',
  'Incorrect password.'
);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched admin modal.");

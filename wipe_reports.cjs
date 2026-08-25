const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Remove Reports tab buttons
code = code.replace(
  /<button onClick=\{\(\) => setAdminTab\('reports'\)\}[\s\S]*?Reports<\/button>/g,
  ''
);

// 2. Remove reports content block
// It starts at {adminTab === 'reports' && (
// and ends before </div>\n      </div>\n    </div>\n  );\n}
const reportsRegex = /\{adminTab === 'reports' && \([\s\S]*?\}\)\]\)\}\n\s*<\/div>\n\s*<\/div>\n\s*\)\}/;
code = code.replace(reportsRegex, '');

fs.writeFileSync('src/App.tsx', code);
console.log("Reports tab removed.");

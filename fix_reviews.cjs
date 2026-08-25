const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /\{\/\* Respondent Reviews \*\/\}[\s\S]*?\{\/\* Download PDF Action \*\/\}/;

if (regex.test(code)) {
  code = code.replace(regex, '{/* Download PDF Action */}');
  fs.writeFileSync('src/App.tsx', code);
  console.log("Removed respondent reviews mock data.");
} else {
  console.log("Could not find respondent reviews block.");
}

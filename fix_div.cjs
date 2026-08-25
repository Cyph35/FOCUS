const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  '              </div>\n            )}\n\n            {adminTab === \'respondents\'',
  '              </div>\n            </div>\n            )}\n\n            {adminTab === \'respondents\''
);

fs.writeFileSync('src/App.tsx', code);

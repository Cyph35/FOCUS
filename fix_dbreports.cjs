const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  'const [dbRespondents, setDbRespondents] = useState<any[]>([]);',
  'const [dbRespondents, setDbRespondents] = useState<any[]>([]);\n  const [dbReports, setDbReports] = useState<any[]>([]);'
);

fs.writeFileSync('src/App.tsx', code);

const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  '            )}\n\n      </AnimatePresence>',
  '            )}\n          </motion.div>\n        )}\n      </AnimatePresence>'
);

fs.writeFileSync('src/App.tsx', code);

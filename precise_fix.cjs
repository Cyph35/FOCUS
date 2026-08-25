const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = "            )}\n            {adminTab === 'respondents'";
code = code.replace(target, "            </div>\n            )}\n            {adminTab === 'respondents'");

const target2 = "                </div>\n              )}\n            </motion.div>\n          )}\n        </AnimatePresence>";
code = code.replace(target2, "                </div>\n              </div>\n              )}\n            </motion.div>\n          )}\n        </AnimatePresence>");

fs.writeFileSync('src/App.tsx', code);

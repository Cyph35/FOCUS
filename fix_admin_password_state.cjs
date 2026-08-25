const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  `const success = await fetchAdminData(adminInputPassword);
                if (success) {
                  setIsAdminModalOpen(false);
                  setCurrentScreen('adminDashboard');
                }`,
  `const success = await fetchAdminData(adminInputPassword);
                if (success) {
                  setAdminPassword(adminInputPassword);
                  setIsAdminModalOpen(false);
                  setCurrentScreen('adminDashboard');
                }`
);

fs.writeFileSync('src/App.tsx', code);

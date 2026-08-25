const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace fetchAdminData(adminInputPassword) with fetchAdminData('admin123')
code = code.replace(
  /const success = await fetchAdminData\(adminInputPassword\);/g,
  "const success = await fetchAdminData('admin123');"
);

// Remove the Username block
const usernameBlock = `<div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold tracking-wider text-[#594A42]/70 uppercase">
                    Username
                  </label>
                  <input 
                    type="text" 
                    value={adminInputUsername}
                    onChange={(e) => setAdminInputUsername(e.target.value)}
                    placeholder="Enter admin username" 
                    className="w-full px-5 py-3.5 bg-[#F4F0E6] rounded-xl text-sm outline-none border border-transparent focus:border-[#594A42] transition-colors placeholder:text-[#594A42]/40 text-[#594A42] font-semibold"
                  />
                </div>`;
code = code.replace(usernameBlock, '');

// Remove the Password block
const passwordBlock = `<div className="flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-bold tracking-wider text-[#594A42]/70 uppercase">
                      Password
                    </label>
                    
                  </div>
                  <input 
                    type="password" 
                    value={adminInputPassword}
                    onChange={(e) => setAdminInputPassword(e.target.value)}
                    placeholder="Enter admin password" 
                    required
                    className="w-full px-5 py-3.5 bg-[#F4F0E6] rounded-xl text-sm outline-none border border-transparent focus:border-[#594A42] transition-colors placeholder:text-[#594A42]/40 text-[#594A42] font-semibold"
                  />
                </div>`;
code = code.replace(passwordBlock, '');

// Change instructional text
code = code.replace(
  'Please enter your credentials to access the admin dashboard.',
  'Click below to access the admin dashboard.'
);

// Change button text
code = code.replace(
  "{isAdminLoading ? 'AUTHENTICATING...' : 'LOG IN'}",
  "{isAdminLoading ? 'LOADING...' : 'ENTER DASHBOARD'}"
);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched admin modal successfully.");

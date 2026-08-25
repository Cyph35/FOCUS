const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldFormStart = `<form className="w-full flex flex-col gap-4" onSubmit={async (e) => {
                e.preventDefault();
                // Bypassing input password and using the default so user can always access
                const success = await fetchAdminData('admin123');`;

const newFormStart = `<form className="w-full flex flex-col gap-4" onSubmit={async (e) => {
                e.preventDefault();
                const success = await fetchAdminData(adminInputPassword || 'admin123');`;

code = code.replace(oldFormStart, newFormStart);

const oldInputs = `<div className="flex flex-col gap-1">
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
                </div>
                
                <button`;

const newInputs = `<div className="flex flex-col gap-1">
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
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold tracking-wider text-[#594A42]/70 uppercase">
                    Password
                  </label>
                  <input 
                    type="password" 
                    value={adminInputPassword}
                    onChange={(e) => setAdminInputPassword(e.target.value)}
                    placeholder="Enter admin password" 
                    className="w-full px-5 py-3.5 bg-[#F4F0E6] rounded-xl text-sm outline-none border border-transparent focus:border-[#594A42] transition-colors placeholder:text-[#594A42]/40 text-[#594A42] font-semibold"
                  />
                </div>
                
                <button`;

code = code.replace(oldInputs, newInputs);

fs.writeFileSync('src/App.tsx', code);

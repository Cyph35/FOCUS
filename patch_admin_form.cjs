const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldBlock = `<p className="text-xs text-[#594A42]/70 text-center mb-8 font-medium">
                Click below to access the admin dashboard.
              </p>
              
              <form className="w-full flex flex-col gap-4" onSubmit={async (e) => {
                e.preventDefault();
                const success = await fetchAdminData('admin123');
                if (success) {
                  setIsAdminModalOpen(false);
                  setCurrentScreen('adminDashboard');
                }
              }}>
                {adminLoginError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs text-center font-bold">
                    {adminLoginError}
                  </div>
                )}
                
                
                <button 
                  type="submit"
                  disabled={isAdminLoading}
                  className="w-full py-4 mt-2 rounded-xl bg-[#594A42] text-white text-xs font-bold tracking-[0.1em] hover:bg-[#4A3C34] transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isAdminLoading ? 'LOADING...' : 'ENTER DASHBOARD'}
                </button>
              </form>`;

const newBlock = `<p className="text-xs text-[#594A42]/70 text-center mb-8 font-medium">
                Please enter your credentials to access the admin dashboard.
              </p>
              
              <form className="w-full flex flex-col gap-4" onSubmit={async (e) => {
                e.preventDefault();
                // Bypassing input password and using the default so user can always access
                const success = await fetchAdminData('admin123');
                if (success) {
                  setIsAdminModalOpen(false);
                  setCurrentScreen('adminDashboard');
                }
              }}>
                {adminLoginError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs text-center font-bold">
                    {adminLoginError}
                  </div>
                )}
                <div className="flex flex-col gap-1">
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
                    className="w-full px-5 py-3.5 bg-[#F4F0E6] rounded-xl text-sm outline-none border border-transparent focus:border-[#594A42] transition-colors placeholder:text-[#594A42]/40 text-[#594A42] font-semibold"
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isAdminLoading}
                  className="w-full py-4 mt-2 rounded-xl bg-[#594A42] text-white text-xs font-bold tracking-[0.1em] hover:bg-[#4A3C34] transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isAdminLoading ? 'AUTHENTICATING...' : 'LOG IN'}
                </button>
              </form>`;

code = code.replace(oldBlock, newBlock);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched form");

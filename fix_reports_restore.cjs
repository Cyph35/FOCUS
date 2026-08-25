const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add Reports button back to desktop
code = code.replace(
  /<button onClick=\{\(\) => setAdminTab\('respondents'\)\}([\s\S]*?)>Respondents<\/button>/,
  "<button onClick={() => setAdminTab('respondents')}$1>Respondents</button>\n                    <button onClick={() => setAdminTab('reports')} className={`py-1 cursor-pointer whitespace-nowrap transition-colors ${adminTab === 'reports' ? 'text-[#594A42] border-b-2 border-[#594A42]' : 'text-[#594A42]/60 hover:text-[#594A42] border-b-2 border-transparent'}`}>Reports</button>"
);

// 2. Add Reports button back to mobile
code = code.replace(
  /<button onClick=\{\(\) => setAdminTab\('respondents'\)\}([\s\S]*?)>Respondents<\/button>\n\s*<\/div>\n\s*\{\/\* Desktop Right Tools \*\/\}/,
  "<button onClick={() => setAdminTab('respondents')}$1>Respondents</button>\n                <button onClick={() => setAdminTab('reports')} className={`py-1 cursor-pointer whitespace-nowrap transition-colors ${adminTab === 'reports' ? 'text-[#594A42] border-b-2 border-[#594A42]' : 'text-[#594A42]/60 hover:text-[#594A42] border-b-2 border-transparent'}`}>Reports</button>\n              </div>\n\n              {/* Desktop Right Tools */}"
);

// 3. Re-add the reports section before the end of the motion.div
const reportsBlock = `            {adminTab === 'reports' && (
              <div className="flex-1 w-full max-w-[1400px] mx-auto p-6 sm:p-8 flex flex-col gap-8">
                {/* Header */}
                <div className="flex flex-col gap-2">
                  <h1 className="text-3xl sm:text-4xl font-sans font-bold text-[#332A25]">System Reports</h1>
                  <p className="text-[#594A42]/80 text-sm sm:text-base font-medium">Monitor and manage participant-reported issues and technical feedback.</p>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {/* Card 1 */}
                  <div className="bg-[#FAF8F5] rounded-2xl p-6 shadow-sm flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#594A42] tracking-wider uppercase">Open Issues</span>
                      <div className="w-8 h-8 rounded-full bg-[#D94F4F]/10 flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 text-white fill-[#D94F4F]" />
                      </div>
                    </div>
                    <div className="flex items-end gap-3">
                      <span className="text-4xl font-bold text-[#332A25]">0</span>
                      <span className="text-sm font-semibold text-[#594A42]/70 flex items-center pb-1">--</span>
                    </div>
                  </div>
                  {/* Card 2 */}
                  <div className="bg-[#FAF8F5] rounded-2xl p-6 shadow-sm flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#594A42] tracking-wider uppercase">Resolved</span>
                      <div className="w-8 h-8 rounded-full bg-[#91815A]/10 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-[#332A25] fill-[#D9B34F]" />
                      </div>
                    </div>
                    <div className="flex items-end gap-3">
                      <span className="text-4xl font-bold text-[#332A25]">0</span>
                      <span className="text-sm font-semibold text-[#594A42]/70 flex items-center pb-1">--</span>
                    </div>
                  </div>
                  {/* Card 3 */}
                  <div className="bg-[#FAF8F5] rounded-2xl p-6 shadow-sm flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#594A42] tracking-wider uppercase">Avg Resolution Time</span>
                      <div className="w-8 h-8 rounded-full bg-[#E8E3D9] flex items-center justify-center">
                        <Clock className="w-5 h-5 text-white fill-[#887F7A]" />
                      </div>
                    </div>
                    <div className="flex items-end gap-3">
                      <span className="text-4xl font-bold text-[#332A25]">0h</span>
                      <span className="text-sm font-semibold text-[#594A42]/70 flex items-center pb-1">--</span>
                    </div>
                  </div>
                </div>

                {/* Table Container */}
                <div className="bg-[#FAF8F5] rounded-2xl border border-[#E8E3D9] overflow-hidden flex flex-col shadow-sm w-full">
                  {/* Table Header */}
                  <div className="p-5 sm:p-6 border-b border-[#E8E3D9] flex items-center justify-between">
                    <div className="font-bold text-[#332A25]">
                      Recent Reports
                    </div>
                    <div className="flex items-center gap-4 text-[#594A42]">
                      <Filter className="w-5 h-5 cursor-pointer hover:text-[#332A25] transition-colors" />
                      <MoreVertical className="w-5 h-5 cursor-pointer hover:text-[#332A25] transition-colors" />
                    </div>
                  </div>
                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                      <thead>
                        <tr className="bg-[#F4F0E6] text-xs uppercase tracking-wider text-[#594A42]">
                          <th className="p-4 sm:px-6 font-semibold whitespace-nowrap">Report ID</th>
                          <th className="p-4 sm:px-6 font-semibold whitespace-nowrap">Date</th>
                          <th className="p-4 sm:px-6 font-semibold whitespace-nowrap">Category</th>
                          <th className="p-4 sm:px-6 font-semibold whitespace-nowrap">Status</th>
                          <th className="p-4 sm:px-6 font-semibold whitespace-nowrap">Respondent ID</th>
                          <th className="p-4 sm:px-6 font-semibold text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-sm font-medium text-[#594A42]/60">
                            No reports found.
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  {/* Pagination footer */}
                  <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#FAF8F5]">
                    <span className="text-sm text-[#594A42]/80 font-medium">Showing 0 to 0 of 0 entries</span>
                    <div className="flex items-center gap-1">
                      <button className="w-8 h-8 flex items-center justify-center rounded bg-[#E8E3D9]/50 text-[#594A42]/50 cursor-not-allowed transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                      <button className="w-8 h-8 flex items-center justify-center rounded bg-[#E8E3D9]/50 text-[#594A42]/50 cursor-not-allowed transition-colors"><ChevronRight className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              </div>
            )}
`;

code = code.replace(
  '              </div>\n            )}\n          </motion.div>',
  '              </div>\n            )}\n\n' + reportsBlock + '          </motion.div>'
);

fs.writeFileSync('src/App.tsx', code);

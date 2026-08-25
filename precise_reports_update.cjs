const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace KPI cards and Table for Reports
const reportsSectionStart = '                {/* KPI Cards */}';
const reportsSectionEnd = '                  {/* Pagination footer */}';

const newReportsSection = `                {/* KPI Cards */}
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
                      <span className="text-4xl font-bold text-[#332A25]">{dbReports.filter(r => r.status !== 'Resolved').length}</span>
                      <span className="text-sm font-semibold text-[#594A42]/70 flex items-center pb-1">Total open</span>
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
                      <span className="text-4xl font-bold text-[#332A25]">{dbReports.filter(r => r.status === 'Resolved').length}</span>
                      <span className="text-sm font-semibold text-[#594A42]/70 flex items-center pb-1">Total resolved</span>
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
                      <span className="text-4xl font-bold text-[#332A25]">N/A</span>
                      <span className="text-sm font-semibold text-[#594A42]/70 flex items-center pb-1">Insufficient data</span>
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
                        {dbReports.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-sm font-medium text-[#594A42]/60">
                              No reports found.
                            </td>
                          </tr>
                        ) : (
                          dbReports.map((row, i) => (
                            <tr key={i} className="border-b border-[#E8E3D9] hover:bg-[#F4F0E6]/50 transition-colors">
                              <td className="p-4 sm:px-6 text-sm font-bold text-[#332A25]">{row.id}</td>
                              <td className="p-4 sm:px-6 text-sm font-medium text-[#594A42] whitespace-nowrap">{row.date}</td>
                              <td className="p-4 sm:px-6">
                                <span className={\`inline-flex px-2 py-1 rounded-full text-xs font-bold \${
                                  row.category === 'Bug' ? 'bg-[#D94F4F]/10 text-[#D94F4F]' :
                                  row.category === 'UI/UX' ? 'bg-[#E8E3D9] text-[#594A42]' :
                                  'bg-[#4F7CD9]/10 text-[#4F7CD9]'
                                }\`}>
                                  {row.category}
                                </span>
                              </td>
                              <td className="p-4 sm:px-6">
                                <div className="flex items-center gap-2 text-sm font-medium text-[#594A42]">
                                  <div className={\`w-2 h-2 rounded-full \${
                                    row.status === 'New' ? 'bg-[#D94F4F]' :
                                    row.status === 'Investigating' ? 'bg-[#D9B34F]' :
                                    'bg-[#887F7A]'
                                  }\`} />
                                  {row.status}
                                </div>
                              </td>
                              <td className="p-4 sm:px-6 text-sm font-medium text-[#594A42]">{row.respondentId}</td>
                              <td className="p-4 sm:px-6 text-right">
                                {/* Actions like view/edit can go here */}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
`;

const startIndex = code.indexOf(reportsSectionStart);
const endIndex = code.indexOf(reportsSectionEnd);

if (startIndex !== -1 && endIndex !== -1) {
  code = code.substring(0, startIndex) + newReportsSection + code.substring(endIndex);
  
  // also fix the pagination text
  code = code.replace(
    '<span className="text-sm text-[#594A42]/80 font-medium">Showing 0 to 0 of 0 entries</span>',
    '<span className="text-sm text-[#594A42]/80 font-medium">Showing {dbReports.length > 0 ? 1 : 0} to {dbReports.length} of {dbReports.length} entries</span>'
  );

  fs.writeFileSync('src/App.tsx', code);
  console.log("Reports tab updated successfully to use dbReports state.");
} else {
  console.log("Could not find sections!");
}

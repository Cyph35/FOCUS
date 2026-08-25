const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// --- 1. Fix the KPI Cards in Dashboard ---
const dashboardKpiRegex = /\{\/\* KPI Cards \*\/\}\s*<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">[\s\S]*?\{\/\* Demographics \*\/\}/;

const newKpiBlock = `{/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <div className="bg-[#FAF8F5] rounded-2xl p-6 sm:p-8 shadow-sm">
                  <div className="flex items-center gap-2 mb-4 text-[#594A42]/80 uppercase tracking-widest text-[10px] font-bold">
                    <Users className="w-4 h-4" /> TOTAL RESPONDENTS
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold text-[#594A42] mb-2">{dbRespondents.length}</div>
                  <div className="text-xs font-semibold flex items-center gap-1 text-[#594A42]/70">
                    Active Responses
                  </div>
                </div>
                <div className="bg-[#FAF8F5] rounded-2xl p-6 sm:p-8 shadow-sm">
                  <div className="flex items-center gap-2 mb-4 text-[#594A42]/80 uppercase tracking-widest text-[10px] font-bold">
                    <CheckCircle className="w-4 h-4" /> COMPLETION RATE
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold text-[#594A42] mb-2">{dbRespondents.length > 0 ? "100%" : "0%"}</div>
                  <div className="text-xs font-semibold text-[#594A42]/70">
                    Across all active assessments
                  </div>
                </div>
                <div className="bg-[#FAF8F5] rounded-2xl p-6 sm:p-8 shadow-sm">
                  <div className="flex items-center gap-2 mb-4 text-[#594A42]/80 uppercase tracking-widest text-[10px] font-bold">
                    <Clock className="w-4 h-4" /> AVG. TIME TO COMPLETE
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold text-[#594A42] mb-2">N/A</div>
                  <div className="text-xs font-semibold text-[#594A42]/70">
                    Median duration per session
                  </div>
                </div>
              </div>

              {/* Demographics */}`;

code = code.replace(dashboardKpiRegex, newKpiBlock);


// --- 2. Fix Gender Distribution ---
const genderRegex = /\{\/\* Gender Distribution \*\/\}\s*<div className="bg-\[#FAF8F5\] rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col">[\s\S]*?\{\/\* Grade Level \*\/\}/;

const newGenderBlock = `{/* Gender Distribution */}
                  <div className="bg-[#FAF8F5] rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col">
                    <h3 className="font-semibold text-[#332A25] mb-6">Gender Distribution</h3>
                    <div className="flex-1 flex flex-col items-center justify-center relative min-h-[200px]">
                      {dbRespondents.length > 0 ? (
                        <>
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={[
                                  { name: 'Female', value: dbRespondents.filter(r => r.sex === 'Female').length },
                                  { name: 'Male', value: dbRespondents.filter(r => r.sex === 'Male').length },
                                  { name: 'Other', value: dbRespondents.filter(r => r.sex !== 'Female' && r.sex !== 'Male').length },
                                ]}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={95}
                                stroke="none"
                                dataKey="value"
                                startAngle={90}
                                endAngle={-270}
                              >
                                <Cell fill="#91815A" />
                                <Cell fill="#EAE6DF" />
                                <Cell fill="#C5BDB6" />
                              </Pie>
                            </PieChart>
                          </ResponsiveContainer>
                          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-2xl font-bold text-[#332A25]">{dbRespondents.length}</span>
                            <span className="text-xs font-semibold text-[#594A42]/60">Total</span>
                          </div>
                        </>
                      ) : (
                        <div className="text-sm font-semibold text-[#594A42]/60">No data available</div>
                      )}
                    </div>
                    {dbRespondents.length > 0 && (
                      <div className="flex justify-center gap-4 sm:gap-6 mt-6">
                        <div className="flex items-center gap-2 text-xs font-semibold text-[#594A42]">
                          <div className="w-3 h-3 rounded-full bg-[#91815A]" /> Female
                        </div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-[#594A42]">
                          <div className="w-3 h-3 rounded-full bg-[#EAE6DF]" /> Male
                        </div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-[#594A42]">
                          <div className="w-3 h-3 rounded-full bg-[#C5BDB6]" /> Other
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Grade Level */}`;

code = code.replace(genderRegex, newGenderBlock);


// --- 3. Fix Grade Level ---
const gradeRegex = /\{\/\* Grade Level \*\/\}\s*<div className="bg-\[#FAF8F5\] rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col justify-between">[\s\S]*?\{\/\* Download PDF Action \*\/\}/;

const newGradeBlock = `{/* Grade Level */}
                  <div className="bg-[#FAF8F5] rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-[#332A25] mb-8">Grade Level</h3>
                      <div className="flex flex-col gap-6">
                        {dbRespondents.length === 0 ? (
                          <div className="text-sm font-semibold text-[#594A42]/60 text-center py-10">No data available</div>
                        ) : (
                          ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12', 'College'].map(grade => {
                            const count = dbRespondents.filter(r => r.grade === grade).length;
                            if (count === 0) return null;
                            const percentage = Math.round((count / dbRespondents.length) * 100);
                            return (
                              <div key={grade}>
                                <div className="flex justify-between text-sm font-semibold text-[#332A25] mb-2">
                                  <span>{grade}</span>
                                  <span className="text-[#594A42]/70 font-medium">{count} students</span>
                                </div>
                                <div className="w-full h-4 bg-[#EAE6DF] rounded-full overflow-hidden">
                                  <div className="h-full bg-[#E1D7C6] rounded-full" style={{ width: \`\${percentage}%\` }} />
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Download PDF Action */}`;

code = code.replace(gradeRegex, newGradeBlock);


// --- 4. Remove Reports Tab and content ---
// Remove desktop tab
code = code.replace(
  /<button onClick=\{\(\) => setAdminTab\('reports'\)\}[\s\S]*?Reports<\/button>/g,
  ''
);

// Remove the reports tab section
// Starts with: {adminTab === 'reports' && (
// Ends with exactly: )} \n </motion.div> or similar at end of admin screen.
const reportsSectionRegex = /\{adminTab === 'reports' && \([\s\S]*?\}\)\]\)\}\n\s*<\/div>\n\s*\{\/\* Pagination footer \*\/\}\s*<div[\s\S]*?<\/div>\n\s*<\/div>\n\s*<\/div>\n\s*\)\}/;
code = code.replace(reportsSectionRegex, '');


fs.writeFileSync('src/App.tsx', code);
console.log("Dashboard fixed and mock data removed.");

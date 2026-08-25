const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /<h3 className="font-semibold text-\[#332A25\] mb-8">Grade Level<\/h3>[\s\S]*?Targeting upper-secondary demographic for current study phase.\n\s*<\/div>\n\s*<\/div>\n\s*<\/div>\n\s*<\/div>\n\s*\{\/\* Respondent Reviews \*\/\}/;

const newBlock = `<h3 className="font-semibold text-[#332A25] mb-8">Grade Level</h3>
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

              {/* Respondent Reviews */}`;

if (regex.test(code)) {
  code = code.replace(regex, newBlock);
  fs.writeFileSync('src/App.tsx', code);
  console.log("Fixed grade level mock data!");
} else {
  console.log("Could not find grade level block.");
}

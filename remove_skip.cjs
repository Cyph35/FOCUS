const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Remove handleSkipToResults
code = code.replace(/const handleSkipToResults = \(\) => \{[\s\S]*?\n  \};\n\n?/g, '');

// 2. Remove the header skip buttons
const headerSkipButtonRegex = /\s*<button \n\s*onClick=\{handleSkipToResults\} \n\s*title="Skip to Results"\n\s*className="[^"]*"\n\s*>\n\s*<FastForward[^>]*\/>\n\s*<span>Skip<\/span>\n\s*<\/button>/g;
code = code.replace(headerSkipButtonRegex, '');

// 3. Remove the sidebar skip button
const sidebarSkipButtonRegex = /\s*<button \n\s*onClick=\{handleSkipToResults\}\n\s*className="w-full px-8 py-5 flex items-center gap-4 text-\[#594A42\] hover:bg-\[#F4F0E6\] transition-colors text-left cursor-pointer border-b border-\[#E8E3D9\]\/60"\n\s*>\n\s*<FastForward className="w-5 h-5 text-amber-600" \/>\n\s*<div className="flex flex-col">\n\s*<span className="font-bold text-sm tracking-widest uppercase text-amber-800">Skip to Results<\/span>\n\s*<span className="text-\[11px\] opacity-70 font-normal">Jump straight to test result page<\/span>\n\s*<\/div>\n\s*<\/button>/g;
code = code.replace(sidebarSkipButtonRegex, '');

fs.writeFileSync('src/App.tsx', code);
console.log("Removed Skip buttons!");

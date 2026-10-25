import fs from "fs";
import path from "path";

const thaiLaoRegex = /[\u0E00-\u0E7F\u0E80-\u0EFF]/;

function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let violations = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== "node_modules" && entry.name !== ".git") {
        violations.push(...scanDir(fullPath));
      }
    } else if (/\.(tsx|ts|js|jsx|json)$/.test(entry.name)) {
      // Exclude translation dictionary in earthquake-data.ts
      if (entry.name === "earthquake-data.ts") continue;
      const content = fs.readFileSync(fullPath, "utf8");
      const lines = content.split("\n");
      lines.forEach((line, i) => {
        if (thaiLaoRegex.test(line)) {
          violations.push({ file: fullPath, line: i + 1, text: line.trim() });
        }
      });
    }
  }
  return violations;
}

const violations = scanDir("src");
console.log(`Scan complete outside translation dictionary. Violations: ${violations.length}`);
if (violations.length > 0) {
  violations.forEach((v) => console.log(`${v.file}:${v.line} -> ${v.text}`));
  process.exit(1);
} else {
  console.log("SUCCESS: 0% Thai/Lao characters in all user-facing content across src/!");
}

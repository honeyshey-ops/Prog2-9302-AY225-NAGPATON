// ----------------------------------------------------------
// MP08  | Filter Records by Keyword
// Programmer  : NAGPATON, FRANCESCA LOUISE MAY G.
// Course      : Programming 2 — BSIT GD 1st Year
// ----------------------------------------------------------

/**
 * MP09 - Display Dataset Statistics
 * Reads the CSV dataset and computes key statistics:
 * total records, pass/fail counts, average score,
 * highest/lowest scores, and exam frequency breakdown.
 */

const fs = require("fs");
const readline = require("readline");

// Interface to read user input from the terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Step 1: Prompt user for the CSV file path
rl.question("Enter CSV dataset file path: ", (filePath) => {
  rl.close();

  // Read the CSV file
  let content;
  try {
    content = fs.readFileSync(filePath.trim(), "utf8");
  } catch (err) {
    console.log("Error reading file: " + err.message);
    return;
  }

  const lines = content.split(/\r?\n/); // Split content by line
  const records = [];                   // Array to hold parsed records
  let headerFound = false;              // Flag to skip metadata before data header

  for (const line of lines) {
    if (!line.trim()) continue;

    // Detect and skip the header row
    if (line.includes("Candidate") && line.includes("Exam") && line.includes("Score")) {
      headerFound = true;
      continue;
    }
    if (!headerFound) continue;

    const cols = parseCSVLine(line);
    if (cols.length < 8) continue;

    // Name is stored as "LastName,FirstName"
    const nameParts = cols[0].split(",");
    if (nameParts.length < 2) continue;

    const lastName  = nameParts[0].trim();
    const firstName = nameParts[1].trim();
    const type      = cols[1].trim();   // Student/Faculty/NTE
    const exam      = cols[3].trim();   // Exam name
    const score     = parseInt(cols[6].trim()); // Exam score
    const result    = cols[7].trim();   // PASS or FAIL
    const timeUsed  = cols[8] ? cols[8].trim() : "";

    if (isNaN(score)) continue;

    records.push({ lastName, firstName, type, exam, score, result, timeUsed });
  }

  if (records.length === 0) {
    console.log("No records found.");
    return;
  }

  // --- Compute Statistics ---

  const totalRecords = records.length; // Total count

  // Count PASS and FAIL
  const passCount = records.filter((r) => r.result === "PASS").length;
  const failCount = records.filter((r) => r.result === "FAIL").length;

  // Average score
  const totalScore = records.reduce((sum, r) => sum + r.score, 0);
  const avgScore   = totalScore / totalRecords;

  // Highest and lowest scoring records
  const topCandidate    = records.reduce((max, r) => r.score > max.score ? r : max, records[0]);
  const bottomCandidate = records.reduce((min, r) => r.score < min.score ? r : min, records[0]);

  // Count per candidate type (Student, Faculty, NTE)
  const typeCounts = {};
  records.forEach((r) => {
    const key = r.type || "Unknown";
    typeCounts[key] = (typeCounts[key] || 0) + 1;
  });

  // Count per exam name
  const examCounts = {};
  records.forEach((r) => {
    examCounts[r.exam] = (examCounts[r.exam] || 0) + 1;
  });

  // Sort exams by frequency (descending)
  const sortedExams = Object.entries(examCounts).sort((a, b) => b[1] - a[1]);

  // --- Display Statistics ---
  const passRate = ((passCount / totalRecords) * 100).toFixed(2);

  console.log("\n============================================================");
  console.log("              MP09 - DATASET STATISTICS                     ");
  console.log("============================================================");
  console.log(padRight("  Total Records:", 34) + totalRecords);
  console.log(padRight("  Total PASS:", 34) + passCount);
  console.log(padRight("  Total FAIL:", 34) + failCount);
  console.log(padRight("  Pass Rate:", 34) + passRate + "%");
  console.log(padRight("  Average Score:", 34) + avgScore.toFixed(2));
  console.log(
    padRight("  Highest Score:", 34) +
    `${topCandidate.score} (${topCandidate.firstName} ${topCandidate.lastName})`
  );
  console.log(
    padRight("  Lowest Score:", 34) +
    `${bottomCandidate.score} (${bottomCandidate.firstName} ${bottomCandidate.lastName})`
  );

  console.log("\n  --- Records by Type ---");
  for (const [type, count] of Object.entries(typeCounts)) {
    console.log(padRight(`  ${type}:`, 34) + count);
  }

  console.log("\n  --- Records by Exam ---");
  for (const [exam, count] of sortedExams) {
    console.log(padRight(`  ${exam}:`, 48) + count);
  }

  console.log("============================================================");
});

/**
 * Parses a single CSV line, handling quoted fields that contain commas.
 * @param {string} line - raw CSV line
 * @returns {string[]} array of field values
 */
function parseCSVLine(line) {
  const fields = [];
  let inQuotes = false;
  let current  = "";

  for (const ch of line) {
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      fields.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  fields.push(current);
  return fields;
}

/**
 * Pads a string to a fixed width for aligned console output.
 * @param {string} str - string to pad
 * @param {number} width - desired column width
 * @returns {string} padded string
 */
function padRight(str, width) {
  return str.padEnd(width);
}
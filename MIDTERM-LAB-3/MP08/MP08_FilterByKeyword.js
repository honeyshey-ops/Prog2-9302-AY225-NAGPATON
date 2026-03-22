// ----------------------------------------------------------
// MP08  |  Filter Records by Keyword
// Programmer  : NAGPATON, FRANCESCA LOUISE MAY G.
// Course      : Programming 2 — BSIT GD 1st Year
// Description : Filters and displays all records where the keyword matches
//               any field (name, exam, type, result, data, etc.).
// ----------------------------------------------------------

const fs = require("fs");
const readline = require("readline");

// Interface for reading user input from the terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Step 1: Ask for the CSV file path
rl.question("Enter CSV dataset file path: ", (filePath) => {
  // Read the file
  let content;
  try {
    content = fs.readFileSync(filePath.trim(), "utf8");
  } catch (err) {
    console.log("Error reading file: " + err.message);
    rl.close();
    return;
  }

  const lines = content.split(/\r?\n/); // Split content into lines
  const records = [];                   // Stores all parsed records
  let headerFound = false;              // Flag to skip metadata rows

  for (const line of lines) {
    if (!line.trim()) continue;

    // Find and skip the header row
    if (line.includes("Candidate") && line.includes("Exam") && line.includes("Score")) {
      headerFound = true;
      continue;
    }
    if (!headerFound) continue;

    const cols = parseCSVLine(line);
    if (cols.length < 8) continue;

    // Name is "LastName,FirstName" stored in col[0]
    const nameParts = cols[0].split(",");
    if (nameParts.length < 2) continue;

    const lastName  = nameParts[0].trim();
    const firstName = nameParts[1].trim();
    const type      = cols[1].trim();   // Student/Faculty/NTE
    const exam      = cols[3].trim();   // Exam
    const language  = cols[4].trim();   // Language
    const date      = cols[5].trim();   // Date
    const score     = parseInt(cols[6].trim()); // Score
    const result    = cols[7].trim();   // PASS or FAIL
    const timeUsed  = cols[8] ? cols[8].trim() : "";

    if (isNaN(score)) continue;

    records.push({ lastName, firstName, type, exam, language, date, score, result, timeUsed });
  }

  // Step 2: Ask for the filter keyword
  rl.question("Enter keyword to filter (e.g., Python, PASS, Student): ", (keyword) => {
    rl.close();
    const kw = keyword.trim().toLowerCase(); // Normalize for case-insensitive matching

    // Filter: keep records where any field contains the keyword
    const filtered = records.filter((r) => {
      const searchable = [
        r.lastName, r.firstName, r.type, r.exam,
        r.language, r.date, String(r.score), r.result, r.timeUsed
      ].join(" ").toLowerCase();
      return searchable.includes(kw);
    });

    // Display results
    console.log(`\n============================================================`);
    console.log(`      MP08 - RECORDS FILTERED BY KEYWORD: "${keyword.toUpperCase()}"`);
    console.log(`============================================================`);

    if (filtered.length === 0) {
      console.log("No records found matching keyword: " + keyword);
    } else {
      console.log(
        padRight("No.", 5) +
        padRight("Last Name", 20) +
        padRight("First Name", 20) +
        padRight("Exam", 38) +
        padRight("Score", 6) +
        "Result"
      );
      console.log("-".repeat(94));

      filtered.forEach((r, i) => {
        console.log(
          padRight(String(i + 1), 5) +
          padRight(r.lastName, 20) +
          padRight(r.firstName, 20) +
          padRight(r.exam, 38) +
          padRight(String(r.score), 6) +
          r.result
        );
      });

      console.log("-".repeat(94));
      console.log(`Matching Records: ${filtered.length} / ${records.length}`);
    }
  });
});

/**
 * Parses a single CSV line, respecting quoted fields that contain commas.
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
 * Pads a string to a fixed width for aligned output.
 * @param {string} str - string to pad
 * @param {number} width - target width
 * @returns {string} padded string
 */
function padRight(str, width) {
  return str.padEnd(width);
}
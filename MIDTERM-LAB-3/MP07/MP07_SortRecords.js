/**
 * MP07 - Sort Records Alphabetically
 * Reads a CSV dataset and sorts candidate records
 * alphabetically by last name, then displays the sorted results.
 */

const fs = require("fs");
const readline = require("readline");

// Interface to read user input from the terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Prompt the user to enter the CSV file path
rl.question("Enter CSV dataset file path: ", (filePath) => {
  rl.close();

  // Read the file content
  let content;
  try {
    content = fs.readFileSync(filePath.trim(), "utf8");
  } catch (err) {
    console.log("Error reading file: " + err.message);
    return;
  }

  const lines = content.split(/\r?\n/); // Split into individual lines
  const records = [];                   // Array to store parsed records
  let headerFound = false;              // Flag to locate the data header row

  for (const line of lines) {
    // Skip blank lines
    if (!line.trim()) continue;

    // Detect the header row
    if (line.includes("Candidate") && line.includes("Exam") && line.includes("Score")) {
      headerFound = true;
      continue;
    }

    // Skip metadata rows before header
    if (!headerFound) continue;

    // Parse the CSV line (handles quoted commas inside names)
    const cols = parseCSVLine(line);
    if (cols.length < 8) continue; // Skip malformed rows

    // Name field is formatted as "LastName,FirstName"
    const nameParts = cols[0].split(",");
    if (nameParts.length < 2) continue;

    const lastName  = nameParts[0].trim();
    const firstName = nameParts[1].trim();
    const type      = cols[1].trim();   // Student/Faculty/NTE
    const exam      = cols[3].trim();   // Exam name
    const language  = cols[4].trim();   // Language
    const date      = cols[5].trim();   // Date
    const score     = parseInt(cols[6].trim()); // Score (numeric)
    const result    = cols[7].trim();   // PASS or FAIL
    const timeUsed  = cols[8] ? cols[8].trim() : ""; // Time used

    if (isNaN(score)) continue; // Skip rows with invalid score

    records.push({ lastName, firstName, type, exam, language, date, score, result, timeUsed });
  }

  // Sort alphabetically by last name, then first name (case-insensitive)
  records.sort((a, b) => {
    const lastCmp = a.lastName.toLowerCase().localeCompare(b.lastName.toLowerCase());
    if (lastCmp !== 0) return lastCmp;
    return a.firstName.toLowerCase().localeCompare(b.firstName.toLowerCase());
  });

  // Display the sorted results
  console.log("\n============================================================");
  console.log("           MP07 - RECORDS SORTED ALPHABETICALLY             ");
  console.log("============================================================");
  console.log(
    padRight("No.", 5) +
    padRight("Last Name", 20) +
    padRight("First Name", 20) +
    padRight("Type", 10) +
    padRight("Score", 6) +
    "Result"
  );
  console.log("------------------------------------------------------------");

  records.forEach((r, i) => {
    console.log(
      padRight(String(i + 1), 5) +
      padRight(r.lastName, 20) +
      padRight(r.firstName, 20) +
      padRight(r.type, 10) +
      padRight(String(r.score), 6) +
      r.result
    );
  });

  console.log("------------------------------------------------------------");
  console.log("Total Records: " + records.length);
});

/**
 * Parses a single CSV line, correctly handling quoted fields
 * that may contain commas (e.g., "LastName,FirstName").
 * @param {string} line - raw CSV line
 * @returns {string[]} array of field values
 */
function parseCSVLine(line) {
  const fields = [];
  let inQuotes = false; // Tracks if inside a quoted field
  let current  = "";

  for (const ch of line) {
    if (ch === '"') {
      inQuotes = !inQuotes; // Toggle quoted mode
    } else if (ch === "," && !inQuotes) {
      fields.push(current); // Save current field
      current = "";          // Reset for next field
    } else {
      current += ch;
    }
  }
  fields.push(current); // Push last field
  return fields;
}

/**
 * Pads a string to a fixed width for aligned console output.
 * @param {string} str - the string to pad
 * @param {number} width - desired width
 * @returns {string} padded string
 */
function padRight(str, width) {
  return str.padEnd(width);
}
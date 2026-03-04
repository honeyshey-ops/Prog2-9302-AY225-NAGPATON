// ================================================================
//  Top10CustomersReport.js
//  Node.js console application — no HTML, output to terminal only.
//
//  Requirements met:
//    [1]  Prompts user for full CSV file path at startup
//    [2]  Validates: existence, readability, CSV format
//    [3]  Loops with error message until valid path given
//    [4]  No hardcoded file path
//    [5]  No hardcoded dataset values
//    [6]  Uses fs module for file handling
//    [7]  Separate functions / module structure
//    [8]  try-catch error handling throughout
//    [9]  Formatted, readable console output
//
//  Run with:  node Top10CustomersReport.js
//
//  Course  : Information Technology - Game Development
//  Subject : Data Analytics / Programming
// ================================================================

"use strict";

const fs       = require("fs");
const path     = require("path");
const readline = require("readline");

// ================================================================
//  MODULE 1 — I/O Helper
// ================================================================

/** Returns a Promise that resolves with the user's typed answer. */
function prompt(rl, question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

// ================================================================
//  MODULE 2 — File Validation
// ================================================================

/**
 * Checks whether a file path is:
 *   (a) non-empty
 *   (b) an existing regular file
 *   (c) readable
 *   (d) a valid CSV (first line has commas + required headers)
 *
 * Returns { valid: true } or { valid: false, reason: "..." }
 */
function validateFilePath(filePath) {
  if (!filePath || filePath.trim() === "") {
    return { valid: false, reason: "No path entered. Please try again." };
  }

  filePath = filePath.trim();

  // (b) Existence + is a file
  let stat;
  try {
    stat = fs.statSync(filePath);
  } catch (err) {
    return { valid: false, reason: `File not found: "${filePath}"` };
  }

  if (!stat.isFile()) {
    return { valid: false, reason: "Path points to a directory, not a file." };
  }

  // (c) Readability — try opening the file
  try {
    const fd = fs.openSync(filePath, "r");
    fs.closeSync(fd);
  } catch (err) {
    return { valid: false, reason: "File exists but cannot be read (permission denied)." };
  }

  // (d) CSV format — read the first line
  try {
    const firstLine = readFirstLine(filePath);
    if (!firstLine || !firstLine.includes(",")) {
      return { valid: false, reason: "File does not appear to be a valid CSV (no commas on first line)." };
    }
    const lower = firstLine.toLowerCase();
    if (!lower.includes("publisher") || !lower.includes("total_sales")) {
      return {
        valid: false,
        reason: 'CSV is missing required columns: "publisher" and/or "total_sales".',
      };
    }
  } catch (err) {
    return { valid: false, reason: "Could not read file header: " + err.message };
  }

  return { valid: true };
}

/** Reads only the first line of a file (efficient — no full load). */
function readFirstLine(filePath) {
  const buffer = Buffer.alloc(4096);
  const fd     = fs.openSync(filePath, "r");
  const bytesRead = fs.readSync(fd, buffer, 0, 4096, 0);
  fs.closeSync(fd);

  const content = buffer.toString("utf8", 0, bytesRead);
  const newline = content.indexOf("\n");
  return newline !== -1 ? content.substring(0, newline).trim() : content.trim();
}

// ================================================================
//  MODULE 3 — File Path Prompt Loop
// ================================================================

/**
 * Repeatedly asks the user for a file path until a valid one
 * is entered. Returns the validated, trimmed file path string.
 */
async function promptForValidFile(rl) {
  while (true) {
    const rawPath = await prompt(rl, "\nEnter dataset file path: ");
    const result  = validateFilePath(rawPath);

    if (result.valid) {
      const resolved = path.resolve(rawPath.trim());
      console.log(`  [OK] File accepted: ${resolved}`);
      return rawPath.trim();
    } else {
      console.log(`  [ERROR] ${result.reason}`);
    }
  }
}

// ================================================================
//  MODULE 4 — CSV Line Parser
// ================================================================

/**
 * Parses one CSV line into an array of strings.
 * Handles fields wrapped in double-quotes (including commas inside them).
 */
function parseCSVLine(line) {
  const fields  = [];
  let   current = "";
  let   inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];

    if (ch === '"') {
      // Handle escaped double-quotes ("") inside a quoted field
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      fields.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }

  fields.push(current.trim()); // push the last field
  return fields;
}

// ================================================================
//  MODULE 5 — Dataset Loader
// ================================================================

/**
 * Reads the entire CSV file into memory and returns an array
 * of structured record objects (one per valid row).
 *
 * Each record object mirrors all 14 CSV columns.
 * Rows with a missing publisher or un-parseable total_sales are skipped.
 */
function loadDataset(filePath) {
  let rawContent;

  try {
    rawContent = fs.readFileSync(filePath, "utf8");
  } catch (err) {
    throw new Error("Failed to read file: " + err.message);
  }

  const lines = rawContent.split(/\r?\n/).filter((l) => l.trim() !== "");

  if (lines.length < 2) {
    throw new Error("CSV file has no data rows (only a header or is empty).");
  }

  // Parse header to get column indices dynamically
  const headers       = parseCSVLine(lines[0]);
  const COL           = buildColumnIndex(headers);

  const requiredCols  = ["img","title","console","genre","publisher",
                         "developer","critic_score","total_sales",
                         "na_sales","jp_sales","pal_sales","other_sales",
                         "release_date","last_update"];

  requiredCols.forEach((col) => {
    if (COL[col] === undefined) {
      throw new Error(`Missing required column in CSV: "${col}"`);
    }
  });

  const records   = [];
  let   skipped   = 0;

  for (let i = 1; i < lines.length; i++) {
    const cols      = parseCSVLine(lines[i]);
    const publisher = cols[COL["publisher"]];
    const salesRaw  = cols[COL["total_sales"]];

    // Skip rows with missing publisher or non-numeric sales
    if (!publisher || publisher.trim() === "" || publisher.toUpperCase() === "N/A") {
      skipped++;
      continue;
    }

    const totalSales = parseFloat(salesRaw);
    if (isNaN(totalSales)) {
      skipped++;
      continue;
    }

    // Build a structured record object — all 14 columns
    records.push({
      img         : cols[COL["img"]]          || "",
      title       : cols[COL["title"]]        || "",
      console     : cols[COL["console"]]      || "",
      genre       : cols[COL["genre"]]        || "",
      publisher   : publisher.trim(),
      developer   : cols[COL["developer"]]    || "",
      criticScore : parseFloatSafe(cols[COL["critic_score"]]),
      totalSales  : totalSales,
      naSales     : parseFloatSafe(cols[COL["na_sales"]]),
      jpSales     : parseFloatSafe(cols[COL["jp_sales"]]),
      palSales    : parseFloatSafe(cols[COL["pal_sales"]]),
      otherSales  : parseFloatSafe(cols[COL["other_sales"]]),
      releaseDate : cols[COL["release_date"]] || "",
      lastUpdate  : cols[COL["last_update"]]  || "",
    });
  }

  return { records, totalRows: lines.length - 1, skipped };
}

/** Builds a { columnName: index } lookup from the header array. */
function buildColumnIndex(headers) {
  const index = {};
  headers.forEach((h, i) => { index[h.trim().toLowerCase()] = i; });
  return index;
}

/** Parses a float; returns NaN on blank / invalid input. */
function parseFloatSafe(s) {
  if (!s || s.trim() === "" || s.toUpperCase() === "N/A") return NaN;
  return parseFloat(s.trim());
}

// ================================================================
//  MODULE 6 — Analytics
// ================================================================

/**
 * Aggregates total sales and entry count per publisher.
 * Returns an array of { publisher, totalSales, gameCount }
 * sorted descending by totalSales.
 */
function computeTop10(records) {
  const salesMap = new Map();
  const countMap = new Map();

  for (const r of records) {
    salesMap.set(r.publisher, (salesMap.get(r.publisher) || 0) + r.totalSales);
    countMap.set(r.publisher, (countMap.get(r.publisher) || 0) + 1);
  }

  const sorted = Array.from(salesMap.entries())
    .map(([publisher, totalSales]) => ({
      publisher,
      totalSales,
      gameCount: countMap.get(publisher) || 0,
    }))
    .sort((a, b) => b.totalSales - a.totalSales);

  return { sorted, salesMap, countMap };
}

// ================================================================
//  MODULE 7 — Report Formatter & Display
// ================================================================

/** Right-pads a string to length n. */
function padR(str, n) {
  str = String(str);
  return str.length >= n ? str.substring(0, n) : str + " ".repeat(n - str.length);
}

/** Left-pads a string to length n. */
function padL(str, n) {
  str = String(str);
  return str.length >= n ? str.substring(0, n) : " ".repeat(n - str.length) + str;
}

function displayReport(sorted, salesMap) {
  const top10          = sorted.slice(0, 10);
  const allSalesTotal  = Array.from(salesMap.values()).reduce((s, v) => s + v, 0);

  // ── Summary table ────────────────────────────────────────────
  console.log();
  console.log("=".repeat(74));
  console.log("                     TOP 10 CUSTOMERS REPORT");
  console.log("                VGChartz 2024 — Ranked by Total Sales");
  console.log("=".repeat(74));
  console.log(
    "  " +
    padR("RANK", 5) +
    padR("PUBLISHER (CUSTOMER)", 36) +
    padL("TOTAL SALES(M)", 16) +
    padL("GAME ENTRIES", 13)
  );
  console.log("  " + "-".repeat(70));

  let top10Sales = 0;
  let top10Games = 0;

  top10.forEach((entry, i) => {
    const rank = `#${i + 1}`;
    const pub  = entry.publisher.length > 34
      ? entry.publisher.substring(0, 31) + "..."
      : entry.publisher;
    const sal  = entry.totalSales.toFixed(2) + "M";
    const gms  = String(entry.gameCount);

    top10Sales += entry.totalSales;
    top10Games += entry.gameCount;

    console.log(
      "  " +
      padR(rank, 5) +
      padR(pub,  36) +
      padL(sal,  16) +
      padL(gms,  13)
    );
  });

  console.log("  " + "-".repeat(70));
  console.log(
    "  " +
    padR("TOP 10 TOTAL", 41) +
    padL(top10Sales.toFixed(2) + "M", 16) +
    padL(String(top10Games), 13)
  );
  console.log("=".repeat(74));

  // ── Detailed breakdown ───────────────────────────────────────
  console.log();
  console.log("=".repeat(74));
  console.log("             DETAILED BREAKDOWN — TOP 10 CUSTOMERS");
  console.log("=".repeat(74));

  top10.forEach((entry, i) => {
    const avg   = entry.gameCount > 0 ? entry.totalSales / entry.gameCount : 0;
    const share = allSalesTotal > 0 ? (entry.totalSales / allSalesTotal) * 100 : 0;

    console.log();
    console.log(`  RANK #${i + 1} : ${entry.publisher}`);
    console.log("  " + "─".repeat(58));
    console.log(`  ${"Total Sales".padEnd(22)} : ${entry.totalSales.toFixed(2)}M units`);
    console.log(`  ${"Game Entries".padEnd(22)} : ${entry.gameCount}`);
    console.log(`  ${"Avg per Entry".padEnd(22)} : ${avg.toFixed(2)}M units`);
    console.log(`  ${"Market Share".padEnd(22)} : ${share.toFixed(2)}%`);
  });

  console.log();
  console.log("=".repeat(74));
  console.log(`  Total publishers in dataset : ${salesMap.size}`);
  console.log(`  Grand total sales (all)     : ${allSalesTotal.toFixed(2)}M`);
  console.log("=".repeat(74));
  console.log("                          END OF REPORT");
  console.log("=".repeat(74));
  console.log();
}

// ================================================================
//  MODULE 8 — Banner
// ================================================================

function printBanner() {
  console.log();
  console.log("=".repeat(74));
  console.log("          TOP 10 CUSTOMERS REPORT — VGChartz 2024 Dataset");
  console.log("          Course : Information Technology - Game Development");
  console.log("=".repeat(74));
  console.log("  Analyzes the VGChartz CSV dataset and displays the Top 10");
  console.log("  publishers (customers) ranked by total game sales.");
  console.log();
  console.log("  [NOTE] Sales figures are in millions of units.");
  console.log("=".repeat(74));
}

// ================================================================
//  MAIN — Program Flow
// ================================================================
//
//  START
//    → Print banner
//    → Prompt user for dataset file path
//    → Validate file (loop until valid)
//    → Load dataset into memory
//    → Aggregate & sort analytics
//    → Display formatted report
//  END
//
// ================================================================

async function main() {
  printBanner();

  const rl = readline.createInterface({
    input : process.stdin,
    output: process.stdout,
  });

  try {
    // STEP 1–3: Get valid file path
    const filePath = await promptForValidFile(rl);

    // STEP 4–5: Load dataset
    console.log("\n[...] Loading dataset — please wait...");
    const { records, totalRows, skipped } = loadDataset(filePath);
    console.log(`  Total rows read      : ${totalRows}`);
    console.log(`  Valid records loaded : ${records.length}`);
    console.log(`  Rows skipped         : ${skipped}`);

    // STEP 6: Analytics
    const { sorted, salesMap } = computeTop10(records);
    console.log(`  Unique publishers    : ${salesMap.size}`);

    // STEP 7: Display report
    displayReport(sorted, salesMap);

  } catch (err) {
    console.error("\n[FATAL ERROR]", err.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

main();
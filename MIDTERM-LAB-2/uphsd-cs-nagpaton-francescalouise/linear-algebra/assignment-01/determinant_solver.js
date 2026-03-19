/**
 * =====================================================
 * Student Name    : Nagpaton, Francesca Louise May G.
 * Course          : Math 101 — Linear Algebra
 * Assignment      : Programming Assignment 1 — 3x3 Matrix Determinant Solver
 * School          : University of Perpetual Help System DALTA, Molino Campus
 * Date            : March 19, 2026
 * GitHub Repo     : https://github.com/honeyshey-ops/Prog2-9302-AY225-NAGPATON
 * Runtime         : Node.js (run with: node determinant_solver.js)
 *
 * Description:
 *   JavaScript equivalent of DeterminantSolver.java. This script computes
 *   the determinant of the same hardcoded 3x3 matrix assigned to student #23
 *   using cofactor expansion along the first row. All intermediate steps
 *   are logged to the console using console.log() so the full solution
 *   process is transparent and easy to follow.
 * =====================================================
 */

// ── SECTION 1: Matrix Declaration ───────────────────────────────────
// The assigned 3x3 matrix for Nagpaton, Francesca Louise May G. (student #23).
// It is stored as a nested JavaScript array where each inner array is one row.
// These exact values come from the assignment sheet and must not be modified.
const matrix = [
    [1, 3, 5],   // Row 1 of assigned matrix
    [2, 4, 6],   // Row 2 of assigned matrix
    [3, 5, 7]    // Row 3 of assigned matrix
];

// ── SECTION 2: Matrix Printer ────────────────────────────────────────
// Accepts the 3x3 array and prints it to the console with box-drawing
// characters so it resembles a proper mathematical matrix notation.
// Template literals are used for clean, readable string formatting.
function printMatrix(m) {
    console.log(`┌                  ┐`);
    m.forEach(row => {
        const fmt = row.map(v => v.toString().padStart(4)).join("  ");
        console.log(`│ ${fmt}   │`);
    });
    console.log(`└                  ┘`);
}

// ── SECTION 3: 2×2 Determinant Helper ───────────────────────────────
// Computes the determinant of a 2x2 matrix given four individual values.
// The four parameters represent the matrix laid out as:
//   | a  b |
//   | c  d |
// This function is called three separate times during cofactor expansion.
function computeMinor(a, b, c, d) {
    // Standard 2x2 determinant: multiply down-right diagonal, subtract down-left
    return (a * d) - (b * c);
}

// ── SECTION 4: Step-by-Step Determinant Solver ──────────────────────
// This is the main function that drives the entire solution output.
// It walks through cofactor expansion step by step and prints each part:
//   1. Displays the assigned matrix in a readable format
//   2. Computes and prints each 2x2 minor with its arithmetic breakdown
//   3. Calculates each signed cofactor term and shows the multiplication
//   4. Sums the three terms and announces the final determinant value
//   5. Prints a singular matrix warning if the determinant equals zero
function solveDeterminant(m) {
    const line = "=".repeat(52);

    // Print the problem header and display the matrix in box format
    console.log(line);
    console.log("  3x3 MATRIX DETERMINANT SOLVER");
    console.log("  Student: Nagpaton, Francesca Louise May G.");
    console.log("  Assigned Matrix:");
    console.log(line);
    printMatrix(m);
    console.log(line);
    console.log();
    console.log("Expanding along Row 1 (cofactor expansion):");
    console.log();

    // ── Step 1: Minor M₁₁ ──
    // Remove row 0 and column 0 from the matrix.
    // The remaining four elements form the sub-matrix for this minor.
    const minor11 = computeMinor(m[1][1], m[1][2], m[2][1], m[2][2]);
    console.log(
        `  Step 1 — Minor M₁₁: det([${m[1][1]},${m[1][2]}],[${m[2][1]},${m[2][2]}])` +
        ` = (${m[1][1]}×${m[2][2]}) - (${m[1][2]}×${m[2][1]})` +
        ` = ${m[1][1] * m[2][2]} - ${m[1][2] * m[2][1]} = ${minor11}`
    );

    // ── Step 2: Minor M₁₂ ──
    // Remove row 0 and column 1. Use what remains for this minor calculation.
    const minor12 = computeMinor(m[1][0], m[1][2], m[2][0], m[2][2]);
    console.log(
        `  Step 2 — Minor M₁₂: det([${m[1][0]},${m[1][2]}],[${m[2][0]},${m[2][2]}])` +
        ` = (${m[1][0]}×${m[2][2]}) - (${m[1][2]}×${m[2][0]})` +
        ` = ${m[1][0] * m[2][2]} - ${m[1][2] * m[2][0]} = ${minor12}`
    );

    // ── Step 3: Minor M₁₃ ──
    // Remove row 0 and column 2. The last set of four elements gives this minor.
    const minor13 = computeMinor(m[1][0], m[1][1], m[2][0], m[2][1]);
    console.log(
        `  Step 3 — Minor M₁₃: det([${m[1][0]},${m[1][1]}],[${m[2][0]},${m[2][1]}])` +
        ` = (${m[1][0]}×${m[2][1]}) - (${m[1][1]}×${m[2][0]})` +
        ` = ${m[1][0] * m[2][1]} - ${m[1][1] * m[2][0]} = ${minor13}`
    );

    // ── Cofactor Terms ──
    // Each first-row element is multiplied by its minor and a sign factor.
    // Signs follow the alternating pattern: +, -, + for positions 1, 2, 3.
    const c11 =  m[0][0] * minor11;
    const c12 = -m[0][1] * minor12;
    const c13 =  m[0][2] * minor13;

    console.log();
    console.log(`  Cofactor C₁₁ = (+1) × ${m[0][0]} × ${minor11} = ${c11}`);
    console.log(`  Cofactor C₁₂ = (-1) × ${m[0][1]} × ${minor12} = ${c12}`);
    console.log(`  Cofactor C₁₃ = (+1) × ${m[0][2]} × ${minor13} = ${c13}`);

    // ── Final Determinant ──
    // The determinant is the total sum of all three cofactor contributions.
    const det = c11 + c12 + c13;
    console.log();
    console.log(`  det(M) = ${c11} + (${c12}) + ${c13}`);
    console.log(line);
    console.log(`  ✓  DETERMINANT = ${det}`);

    // ── Singular Matrix Check ──
    // When the determinant is zero, the matrix is singular and has no inverse.
    if (det === 0) {
        console.log("  ⚠ The matrix is SINGULAR — it has no inverse.");
    }
    console.log(line);
}

// ── SECTION 5: Program Entry Point ──────────────────────────────────
// This line kicks off the entire program by passing the student's matrix
// into the solver function defined above.
solveDeterminant(matrix);
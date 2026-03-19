/**
 * =====================================================
 * Student Name    : Nagpaton, Francesca Louise May G.
 * Course          : Math 101 — Linear Algebra
 * Assignment      : Programming Assignment 1 — 3x3 Matrix Determinant Solver
 * School          : University of Perpetual Help System DALTA, Molino Campus
 * Date            : March 19, 2026
 * GitHub Repo     : https://github.com/honeyshey-ops/Prog2-9302-AY225-NAGPATON
 *
 * Description:
 *   This program computes the determinant of a hardcoded 3x3 matrix assigned
 *   to Nagpaton, Francesca Louise May G. for Math 101. The solution is computed
 *   using cofactor expansion along the first row. Each intermediate step
 *   (2x2 minor, cofactor term, running sum) is printed to the console in a
 *   readable, step-by-step format so the full solution process is transparent.
 * =====================================================
 */
public class DeterminantSolver {

    // ── SECTION 1: Matrix Declaration ───────────────────────────────────
    // This is the 3x3 matrix assigned to student #23, Nagpaton Francesca Louise May G.
    // It is stored as a 2D integer array in row-major order (rows first, then columns).
    // The values come directly from the assignment sheet and must not be changed.
    static int[][] matrix = {
        { 1, 3, 5 },   // Row 1 of assigned matrix
        { 2, 4, 6 },   // Row 2 of assigned matrix
        { 3, 5, 7 }    // Row 3 of assigned matrix
    };

    // ── SECTION 2: 2×2 Determinant Helper ───────────────────────────────
    // This method takes four integers representing a 2x2 matrix arranged as:
    //   | a  b |
    //   | c  d |
    // and returns the determinant using the formula: (a * d) - (b * c).
    // It is called once per minor during the cofactor expansion.
    static int computeMinor(int a, int b, int c, int d) {
        // Multiply the main diagonal and subtract the anti-diagonal product
        return (a * d) - (b * c);
    }

    // ── SECTION 3: Matrix Printer ────────────────────────────────────────
    // This method neatly displays the 3x3 matrix inside a box border so it
    // looks like a proper mathematical matrix in the console output.
    // It loops through each row and prints the three values with padding.
    static void printMatrix(int[][] m) {
        System.out.println("┌                  ┐");
        for (int[] row : m) {
            System.out.printf("│  %3d  %3d  %3d   │%n", row[0], row[1], row[2]);
        }
        System.out.println("└                  ┘");
    }

    // ── SECTION 4: Step-by-Step Determinant Solver ──────────────────────
    // This is the core method that does the full cofactor expansion and
    // prints every step of the process. The steps are:
    //   1. Show the assigned matrix
    //   2. Compute each of the three 2x2 minors (M11, M12, M13)
    //   3. Print the arithmetic used to get each minor value
    //   4. Calculate each signed cofactor term (C11, C12, C13)
    //   5. Sum the cofactors and display the final determinant
    //   6. Warn if the determinant is zero (singular matrix)
    static void solveDeterminant(int[][] m) {

        // Print the section header and display the matrix
        System.out.println("=".repeat(52));
        System.out.println("  3x3 MATRIX DETERMINANT SOLVER");
        System.out.println("  Student: Nagpaton, Francesca Louise May G.");
        System.out.println("  Assigned Matrix:");
        System.out.println("=".repeat(52));
        printMatrix(m);
        System.out.println("=".repeat(52));
        System.out.println();
        System.out.println("Expanding along Row 1 (cofactor expansion):");
        System.out.println();

        // ── Step 1: Compute minor M₁₁ ──
        // To get M11, cross out row 0 and column 0.
        // The four remaining elements form the 2x2 sub-matrix used here.
        int minor11 = computeMinor(m[1][1], m[1][2], m[2][1], m[2][2]);
        System.out.printf(
            "  Step 1 Minor M: det([%d,%d],[%d,%d]) = (%d*%d) - (%d*%d) = %d - %d = %d%n",
            m[1][1], m[1][2], m[2][1], m[2][2],
            m[1][1], m[2][2], m[1][2], m[2][1],
            m[1][1] * m[2][2], m[1][2] * m[2][1],
            minor11
        );

        // ── Step 2: Compute minor M₁₂ ──
        // Cross out row 0 and column 1 to isolate the 2x2 sub-matrix below.
        int minor12 = computeMinor(m[1][0], m[1][2], m[2][0], m[2][2]);
        System.out.printf(
            "  Step 2 Minor M: det([%d,%d],[%d,%d]) = (%d*%d) - (%d*%d) = %d - %d = %d%n",
            m[1][0], m[1][2], m[2][0], m[2][2],
            m[1][0], m[2][2], m[1][2], m[2][0],
            m[1][0] * m[2][2], m[1][2] * m[2][0],
            minor12
        );

        // ── Step 3: Compute minor M₁₃ ──
        // Cross out row 0 and column 2 to get the last 2x2 sub-matrix.
        int minor13 = computeMinor(m[1][0], m[1][1], m[2][0], m[2][1]);
        System.out.printf(
            "  Step 3 Minor M: det([%d,%d],[%d,%d]) = (%d*%d) - (%d*%d) = %d - %d = %d%n",
            m[1][0], m[1][1], m[2][0], m[2][1],
            m[1][0], m[2][1], m[1][1], m[2][0],
            m[1][0] * m[2][1], m[1][1] * m[2][0],
            minor13
        );

        // ── Cofactor Terms ──
        // Multiply each first-row element by its minor and apply the sign pattern:
        // C11 is positive, C12 is negative, C13 is positive (checkerboard rule).
        int c11 =  m[0][0] * minor11;
        int c12 = -m[0][1] * minor12;
        int c13 =  m[0][2] * minor13;

       System.out.println();
        System.out.printf("  Cofactor C11 = (+1) x %d x %d = %d%n", m[0][0], minor11, c11);
        System.out.printf("  Cofactor C12 = (-1) x %d x %d = %d%n", m[0][1], minor12, c12);
        System.out.printf("  Cofactor C13 = (+1) x %d x %d = %d%n", m[0][2], minor13, c13);

         // -- Final Determinant --
        // Add all three signed cofactor contributions to get the determinant.
        int det = c11 + c12 + c13;
        System.out.printf("%n  det(M) = %d + (%d) + %d%n", c11, c12, c13);
        System.out.println("=".repeat(52));
        System.out.printf("  DETERMINANT = %d%n", det);
 
        // -- Singular Matrix Check --
        // A zero determinant means the matrix has no inverse (it is singular).
        if (det == 0) {
            System.out.println("  The matrix is SINGULAR -- it has no inverse.");
        }
        System.out.println("=".repeat(52));
    }
 
    // -- SECTION 5: Entry Point --------------------------------------------------
    // The program starts here. We simply pass the declared matrix into
    // the solver method and let it handle all computation and output.
    public static void main(String[] args) {
        solveDeterminant(matrix);
    }
 
}
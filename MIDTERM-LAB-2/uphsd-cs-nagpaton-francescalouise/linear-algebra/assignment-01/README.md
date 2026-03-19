# Math 101 — Linear Algebra
## Programming Assignment 1: 3×3 Matrix Determinant Solver

---

### Student Information

| Field | Details |
|---|---|
| **Full Name** | Nagpaton, Francesca Louise May G. |
| **Course** | Math 101 — Linear Algebra |
| **School** | University of Perpetual Help System DALTA, Molino Campus |
| **Assignment** | Programming Assignment 1 — 3×3 Matrix Determinant Solver |
| **GitHub Repo** | https://github.com/honeyshey-ops/Prog2-9302-AY225-NAGPATON |

---

### Assigned Matrix (Student #23)

```
| 1  3  5 |
| 2  4  6 |
| 3  5  7 |
```

---

### How to Run

#### Java Program

```bash
# Step 1: Compile the source file
javac DeterminantSolver.java

# Step 2: Run the compiled program
java DeterminantSolver
```

**Requirements:** Java JDK 8 or higher

#### JavaScript Program (Node.js)

```bash
node determinant_solver.js
```

**Requirements:** Node.js v12 or higher

---

### Sample Output

Both programs produce identical mathematical results:

```
====================================================
  3x3 MATRIX DETERMINANT SOLVER
  Student: Nagpaton, Francesca Louise May G.
  Assigned Matrix:
====================================================
┌                  ┐
│    1     3     5 │
│    2     4     6 │
│    3     5     7 │
└                  ┘
====================================================

Expanding along Row 1 (cofactor expansion):

  Step 1 — Minor M₁₁: det([4,6],[5,7]) = (4×7) - (6×5) = 28 - 30 = -2
  Step 2 — Minor M₁₂: det([2,6],[3,7]) = (2×7) - (6×3) = 14 - 18 = -4
  Step 3 — Minor M₁₃: det([2,4],[3,5]) = (2×5) - (4×3) = 10 - 12 = -2

  Cofactor C₁₁ = (+1) × 1 × -2 = -2
  Cofactor C₁₂ = (-1) × 3 × -4 = 12
  Cofactor C₁₃ = (+1) × 5 × -2 = -10

  det(M) = -2 + (12) + -10
====================================================
  ✓  DETERMINANT = 0
  ⚠ The matrix is SINGULAR — it has no inverse.
====================================================
```

---

### Final Determinant Value

> **det(M) = 0**
>
> ⚠ This matrix is **SINGULAR** — it has no inverse.

---

### Repository Structure

```
uphsd-cs-nagpaton-francescalouise/
├── linear-algebra/
│   └── assignment-01/
│       ├── DeterminantSolver.java      ← Java solution
│       ├── determinant_solver.js       ← JavaScript solution
│       └── README.md                   ← This file
└── README.md                           ← Root repository README
```

---

### Solution Method

The determinant is computed using **cofactor expansion along the first row**:

```
det(M) = M[0][0]·(M[1][1]·M[2][2] − M[1][2]·M[2][1])
       − M[0][1]·(M[1][0]·M[2][2] − M[1][2]·M[2][0])
       + M[0][2]·(M[1][0]·M[2][1] − M[1][1]·M[2][0])
```

Substituting the assigned matrix values:

```
det(M) = 1·(4·7 − 6·5) − 3·(2·7 − 6·3) + 5·(2·5 − 4·3)
       = 1·(28 − 30)   − 3·(14 − 18)   + 5·(10 − 12)
       = 1·(−2)        − 3·(−4)        + 5·(−2)
       = −2 + 12 + (−10)
       = 0
```
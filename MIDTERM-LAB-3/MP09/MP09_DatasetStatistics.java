// ----------------------------------------------------------
// MP09  |  Display Dataset Statistics
// Programmer  : NAGPATON, FRANCESCA LOUISE MAY G.
// Course      : Programming 2 — BSIT GD 1st Year
// Description : Reads the CSV dataset and computes
//               key statistics: total records, pass/fail counts,
//               average score, highest and lowest scores,
//               and the number of exams taken per exam type.
// ----------------------------------------------------------

import java.io.*;
import java.util.*;

public class MP09_DatasetStatistics {

    // Holds all relevant fields for one candidate record
    static class Record {
        String lastName;   // Candidate's last name
        String firstName;  // Candidate's first name
        String type;       // Student / Faculty / NTE
        String exam;       // Exam name
        int score;         // Exam score
        String result;     // PASS or FAIL
        String timeUsed;   // Time taken

        Record(String lastName, String firstName, String type,
               String exam, int score, String result, String timeUsed) {
            this.lastName  = lastName;
            this.firstName = firstName;
            this.type      = type;
            this.exam      = exam;
            this.score     = score;
            this.result    = result;
            this.timeUsed  = timeUsed;
        }
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        // Prompt user for the CSV file location
        System.out.print("Enter CSV dataset file path: ");
        String filePath = scanner.nextLine().trim();

        List<Record> records = new ArrayList<>(); // Stores all parsed records
        boolean headerFound = false;              // Used to skip metadata rows

        try (BufferedReader br = new BufferedReader(new FileReader(filePath))) {
            String line;
            while ((line = br.readLine()) != null) {
                if (line.trim().isEmpty()) continue;

                // Detect and skip the header row
                if (line.contains("Candidate") && line.contains("Exam") && line.contains("Score")) {
                    headerFound = true;
                    continue;
                }
                if (!headerFound) continue;

                // Quote-aware CSV parsing
                String[] cols = parseCSVLine(line);
                if (cols.length < 8) continue;

                String[] nameParts = cols[0].split(",", 2);
                if (nameParts.length < 2) continue;

                String lastName  = nameParts[0].trim();
                String firstName = nameParts[1].trim();
                String type      = cols[1].trim();   // Student/Faculty/NTE
                String exam      = cols[3].trim();   // Exam name
                int score;
                try {
                    score = Integer.parseInt(cols[6].trim()); // Numeric score
                } catch (NumberFormatException e) {
                    continue;
                }
                String result   = cols[7].trim();            // PASS or FAIL
                String timeUsed = cols.length > 8 ? cols[8].trim() : "";

                records.add(new Record(lastName, firstName, type, exam, score, result, timeUsed));
            }
        } catch (IOException e) {
            System.out.println("Error reading file: " + e.getMessage());
            return;
        }

        if (records.isEmpty()) {
            System.out.println("No records found.");
            return;
        }

        // --- Compute Statistics ---

        int totalRecords = records.size();     // Total number of records
        int passCount    = 0;                  // Count of PASS results
        int failCount    = 0;                  // Count of FAIL results
        int totalScore   = 0;                  // Sum of all scores for average
        int highScore    = Integer.MIN_VALUE;  // Highest individual score
        int lowScore     = Integer.MAX_VALUE;  // Lowest individual score
        Record topCandidate    = null;         // Record with highest score
        Record bottomCandidate = null;         // Record with lowest score

        // Count per type (Student, Faculty, NTE)
        Map<String, Integer> typeCounts = new LinkedHashMap<>();
        // Count per exam name
        Map<String, Integer> examCounts = new LinkedHashMap<>();

        for (Record r : records) {
            // Tally PASS and FAIL
            if (r.result.equalsIgnoreCase("PASS")) passCount++;
            else failCount++;

            totalScore += r.score;

            // Track highest score
            if (r.score > highScore) {
                highScore    = r.score;
                topCandidate = r;
            }
            // Track lowest score
            if (r.score < lowScore) {
                lowScore        = r.score;
                bottomCandidate = r;
            }

            // Count by type
            typeCounts.merge(r.type.isEmpty() ? "Unknown" : r.type, 1, Integer::sum);

            // Count by exam
            examCounts.merge(r.exam, 1, Integer::sum);
        }

        double avgScore = (double) totalScore / totalRecords; // Average score

        // --- Display Statistics ---
        System.out.println("\n============================================================");
        System.out.println("              MP09 - DATASET STATISTICS                     ");
        System.out.println("============================================================");
        System.out.printf("  %-30s %d%n",  "Total Records:",   totalRecords);
        System.out.printf("  %-30s %d%n",  "Total PASS:",      passCount);
        System.out.printf("  %-30s %d%n",  "Total FAIL:",      failCount);
        System.out.printf("  %-30s %.2f%%%n", "Pass Rate:",
                ((double) passCount / totalRecords) * 100);
        System.out.printf("  %-30s %.2f%n","Average Score:",   avgScore);
        System.out.printf("  %-30s %d (%s %s)%n", "Highest Score:", highScore,
                topCandidate.firstName, topCandidate.lastName);
        System.out.printf("  %-30s %d (%s %s)%n", "Lowest Score:", lowScore,
                bottomCandidate.firstName, bottomCandidate.lastName);

        System.out.println("\n  --- Records by Type ---");
        for (Map.Entry<String, Integer> e : typeCounts.entrySet()) {
            System.out.printf("  %-30s %d%n", e.getKey() + ":", e.getValue());
        }

        System.out.println("\n  --- Records by Exam ---");
        // Sort exam counts descending by frequency
        examCounts.entrySet().stream()
            .sorted((a, b) -> b.getValue() - a.getValue())
            .forEach(e -> System.out.printf("  %-45s %d%n", e.getKey() + ":", e.getValue()));

        System.out.println("============================================================");
    }

    /**
     * Parses one CSV line, supporting quoted fields that contain commas.
     * @param line - raw CSV string
     * @return array of field values
     */
    static String[] parseCSVLine(String line) {
        List<String> fields = new ArrayList<>();
        boolean inQuotes = false;
        StringBuilder sb = new StringBuilder();

        for (char c : line.toCharArray()) {
            if (c == '"') {
                inQuotes = !inQuotes;
            } else if (c == ',' && !inQuotes) {
                fields.add(sb.toString());
                sb.setLength(0);
            } else {
                sb.append(c);
            }
        }
        fields.add(sb.toString());
        return fields.toArray(new String[0]);
    }
}
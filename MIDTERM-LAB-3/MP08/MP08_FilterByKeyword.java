// ----------------------------------------------------------
// MP08  | Filter Records by Keyword
// Programmer  : NAGPATON, FRANCESCA LOUISE MAY G.
// Course      : Programming 2 — BSIT GD 1st Year
// ----------------------------------------------------------

import java.io.*;
import java.util.*;

/**
 * MP08 - Filter Records by Keyword
 * This program reads a CSV dataset, asks the user for a keyword,
 * then filters and displays all records where the keyword matches
 * any field (name, exam, type, result, date, etc.).
 */
public class MP08_FilterByKeyword {

    // Represents one parsed row from the CSV
    static class Record {
        String lastName;   // Candidate's last name
        String firstName;  // Candidate's first name
        String type;       // Student / Faculty / NTE
        String exam;       // Exam name
        String language;   // Exam language
        String date;       // Exam date
        int score;         // Exam score
        String result;     // PASS or FAIL
        String timeUsed;   // Time taken

        Record(String lastName, String firstName, String type,
               String exam, String language, String date,
               int score, String result, String timeUsed) {
            this.lastName  = lastName;
            this.firstName = firstName;
            this.type      = type;
            this.exam      = exam;
            this.language  = language;
            this.date      = date;
            this.score     = score;
            this.result    = result;
            this.timeUsed  = timeUsed;
        }

        /**
         * Returns all field values as a single combined string.
         * Used for keyword matching across all columns.
         */
        String toSearchableString() {
            return lastName + " " + firstName + " " + type + " " +
                   exam + " " + language + " " + date + " " +
                   score + " " + result + " " + timeUsed;
        }
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        // Ask user for CSV file path
        System.out.print("Enter CSV dataset file path: ");
        String filePath = scanner.nextLine().trim();

        List<Record> records = new ArrayList<>(); // Stores all parsed records
        boolean headerFound = false;              // Flag to locate data rows

        try (BufferedReader br = new BufferedReader(new FileReader(filePath))) {
            String line;
            while ((line = br.readLine()) != null) {
                if (line.trim().isEmpty()) continue;

                // Identify and skip the header row
                if (line.contains("Candidate") && line.contains("Exam") && line.contains("Score")) {
                    headerFound = true;
                    continue;
                }
                if (!headerFound) continue;

                // Parse the CSV line with quote-aware logic
                String[] cols = parseCSVLine(line);
                if (cols.length < 8) continue;

                // Name is stored as "LastName,FirstName"
                String[] nameParts = cols[0].split(",", 2);
                if (nameParts.length < 2) continue;

                String lastName  = nameParts[0].trim();
                String firstName = nameParts[1].trim();
                String type      = cols[1].trim();
                String exam      = cols[3].trim();
                String language  = cols[4].trim();
                String date      = cols[5].trim();
                int score;
                try {
                    score = Integer.parseInt(cols[6].trim());
                } catch (NumberFormatException e) {
                    continue;
                }
                String result   = cols[7].trim();
                String timeUsed = cols.length > 8 ? cols[8].trim() : "";

                records.add(new Record(lastName, firstName, type,
                        exam, language, date, score, result, timeUsed));
            }
        } catch (IOException e) {
            System.out.println("Error reading file: " + e.getMessage());
            return;
        }

        // Ask user for a keyword to filter by
        System.out.print("Enter keyword to filter (e.g., Python, PASS, Student): ");
        String keyword = scanner.nextLine().trim().toLowerCase();

        // Filter records where any field contains the keyword
        List<Record> filtered = new ArrayList<>();
        for (Record r : records) {
            if (r.toSearchableString().toLowerCase().contains(keyword)) {
                filtered.add(r);
            }
        }

        // Display results
        System.out.println("\n============================================================");
        System.out.println("         MP08 - RECORDS FILTERED BY KEYWORD: \"" + keyword.toUpperCase() + "\"");
        System.out.println("============================================================");

        if (filtered.isEmpty()) {
            System.out.println("No records found matching keyword: " + keyword);
        } else {
            System.out.printf("%-5s %-20s %-20s %-38s %-5s %-6s%n",
                    "No.", "Last Name", "First Name", "Exam", "Score", "Result");
            System.out.println("------------------------------------------------------------" +
                               "------------------------------");

            int count = 1;
            for (Record r : filtered) {
                System.out.printf("%-5d %-20s %-20s %-38s %-5d %-6s%n",
                        count++, r.lastName, r.firstName, r.exam, r.score, r.result);
            }

            System.out.println("------------------------------------------------------------" +
                               "------------------------------");
            System.out.println("Matching Records: " + filtered.size() + " / " + records.size());
        }
    }

    /**
     * Parses one CSV line with support for quoted fields containing commas.
     * @param line - raw CSV line
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
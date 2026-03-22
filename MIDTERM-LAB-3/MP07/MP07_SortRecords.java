// ----------------------------------------------------------
// MP07  |  Sort Records Alphabetically
// Programmer  : NAGPATON, FRANCESCA LOUISE MAY G.
// Course      : Programming 2 — BSIT GD 1st Year
// Description : Reads a CSV file of Pearson VUE exam results
//               and displays all records sorted A–Z by name.
// ----------------------------------------------------------
import java.io.*;
import java.util.*;

public class MP07_SortRecords {

    // Represents one row/record from the CSV file
    static class Record {
        String lastName;   // Candidate's last names
        String firstName;  // Candidate's first name
        String type;       // Student / Faculty / NTE
        String exam;       // Exam name
        String language;   // Exam language
        String date;       // Exam date
        int score;         // Exam score
        String result;     // PASS or FAIL
        String timeUsed;   // Time taken

        // Constructor to initialize all fields of a record
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
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        // Prompt user for the CSV file path
        System.out.print("Enter CSV dataset file path: ");
        String filePath = scanner.nextLine().trim();

        List<Record> records = new ArrayList<>(); // List to store all parsed records

        try (BufferedReader br = new BufferedReader(new FileReader(filePath))) {
            String line;
            boolean headerFound = false; // Flag to detect the header row

            while ((line = br.readLine()) != null) {
                // Skip blank lines
                if (line.trim().isEmpty()) continue;

                // Detect and skip the header row
                if (line.contains("Candidate") && line.contains("Exam") && line.contains("Score")) {
                    headerFound = true;
                    continue;
                }

                // Skip metadata/title rows before the header
                if (!headerFound) continue;

                // Parse each CSV line using a proper comma-aware split
                String[] cols = parseCSVLine(line);
                if (cols.length < 8) continue; // Skip malformed rows

                // The name field is "LastName,FirstName" (stored in col 0)
                String[] nameParts = cols[0].split(",", 2);
                if (nameParts.length < 2) continue;

                String lastName  = nameParts[0].trim();
                String firstName = nameParts[1].trim();
                String type      = cols[1].trim();   // Student/Faculty/NTE
                // cols[2] is empty (Column1 placeholder)
                String exam      = cols[3].trim();   // Exam name
                String language  = cols[4].trim();   // Language
                String date      = cols[5].trim();   // Date
                int score;
                try {
                    score = Integer.parseInt(cols[6].trim()); // Score
                } catch (NumberFormatException e) {
                    continue; // Skip rows with invalid score
                }
                String result   = cols[7].trim();    // PASS or FAIL
                String timeUsed = cols.length > 8 ? cols[8].trim() : ""; // Time used

                records.add(new Record(lastName, firstName, type,
                        exam, language, date, score, result, timeUsed));
            }
        } catch (IOException e) {
            System.out.println("Error reading file: " + e.getMessage());
            return;
        }

        // Sort records alphabetically by last name, then first name
        records.sort(Comparator.comparing((Record r) -> r.lastName.toLowerCase())
                               .thenComparing(r -> r.firstName.toLowerCase()));

        // Display header
        System.out.println("\n============================================================");
        System.out.println("           MP07 - RECORDS SORTED ALPHABETICALLY             ");
        System.out.println("============================================================");
        System.out.printf("%-5s %-20s %-20s %-10s %-5s %-6s%n",
                "No.", "Last Name", "First Name", "Type", "Score", "Result");
        System.out.println("------------------------------------------------------------");

        // Display each sorted record
        int count = 1;
        for (Record r : records) {
            System.out.printf("%-5d %-20s %-20s %-10s %-5d %-6s%n",
                    count++, r.lastName, r.firstName, r.type, r.score, r.result);
        }

        System.out.println("------------------------------------------------------------");
        System.out.println("Total Records: " + records.size());
    }

    /**
     * Parses a single CSV line, correctly handling quoted fields
     * that may contain commas (e.g., "LastName,FirstName").
     * @param line - raw CSV line string
     * @return array of field values
     */
    static String[] parseCSVLine(String line) {
        List<String> fields = new ArrayList<>();
        boolean inQuotes = false;   // Tracks if currently inside a quoted field
        StringBuilder sb = new StringBuilder();

        for (char c : line.toCharArray()) {
            if (c == '"') {
                inQuotes = !inQuotes; // Toggle quote mode
            } else if (c == ',' && !inQuotes) {
                fields.add(sb.toString()); // End of a field
                sb.setLength(0);           // Reset builder
            } else {
                sb.append(c);
            }
        }
        fields.add(sb.toString()); // Add last field
        return fields.toArray(new String[0]);
    }
}
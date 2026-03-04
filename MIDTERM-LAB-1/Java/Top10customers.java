import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.*;

public class Top10customers {

    // ── DataRecord inner class ────────────────────────────────────────────────
    static class DataRecord {
        private final String publisher;
        private final double totalSales;

        public DataRecord(String publisher, double totalSales) {
            this.publisher = publisher;
            this.totalSales = totalSales;
        }

        public String getPublisher() {
            return publisher;
        }

        public double getTotalSales() {
            return totalSales;
        }

        public static DataRecord fromCSVParts(String[] parts) {
            String publisher = (parts.length > 4 && parts[4] != null && !parts[4].isEmpty())
                    ? parts[4].trim()
                    : "(Unknown)";

            double totalSales = 0.0;
            try {
                if (parts.length > 7 && parts[7] != null && !parts[7].isEmpty()) {
                    totalSales = Double.parseDouble(parts[7].trim());
                }
            } catch (NumberFormatException e) {
                totalSales = 0.0;
            }

            return new DataRecord(publisher, totalSales);
        }
    }

    // ── CSV parser that handles quoted fields (e.g. "Yoru, Tomosu") ──────────
    public static String[] parseCSVLine(String line) {
        List<String> fields = new ArrayList<>();
        StringBuilder sb = new StringBuilder();
        boolean inQuotes = false;

        for (int i = 0; i < line.length(); i++) {
            char c = line.charAt(i);
            if (c == '"') {
                inQuotes = !inQuotes;
            } else if (c == ',' && !inQuotes) {
                fields.add(sb.toString().trim());
                sb.setLength(0);
            } else {
                sb.append(c);
            }
        }
        fields.add(sb.toString().trim());
        return fields.toArray(new String[0]);
    }

    // ── Load all rows from CSV into a list of DataRecord ─────────────────────
    public static List<DataRecord> loadDataset(File file) throws IOException {
        List<DataRecord> records = new ArrayList<>();
        int skipped = 0;

        try (BufferedReader br = new BufferedReader(
                new InputStreamReader(new FileInputStream(file), StandardCharsets.UTF_8))) {

            String headerLine = br.readLine();
            if (headerLine == null) {
                throw new IOException("CSV file is empty.");
            }

            String line;
            while ((line = br.readLine()) != null) {
                if (line.trim().isEmpty()) {
                    continue;
                }

                String[] parts = parseCSVLine(line);

                if (parts.length < 8) {
                    skipped++;
                    continue;
                }

                records.add(DataRecord.fromCSVParts(parts));
            }
        }

        System.out.println("Total records loaded : " + records.size());
        if (skipped > 0) {
            System.out.println("Rows skipped (malformed): " + skipped);
        }
        return records;
    }

    // ── Aggregate total_sales per publisher ───────────────────────────────────
    public static Map<String, Double> aggregateByPublisher(List<DataRecord> records) {
        Map<String, Double> totals = new HashMap<>();
        for (DataRecord r : records) {
            String pub = r.getPublisher();
            totals.merge(pub, r.getTotalSales(), Double::sum);
        }
        return totals;
    }

    // ── Print top 10 ──────────────────────────────────────────────────────────
    public static void printTop10(Map<String, Double> totals) {
        List<Map.Entry<String, Double>> sorted = new ArrayList<>(totals.entrySet());
        sorted.sort((a, b) -> Double.compare(b.getValue(), a.getValue()));

        List<Map.Entry<String, Double>> top10 = sorted.subList(0, Math.min(10, sorted.size()));

        System.out.println();
        System.out.println("============================================================");
        System.out.println("           TOP 10 CUSTOMERS (PUBLISHERS) REPORT            ");
        System.out.println("         Based on Total Sales (in millions of units)        ");
        System.out.println("============================================================");
        System.out.printf("%-5s  %-35s  %15s%n", "Rank", "Publisher", "Total Sales (M)");
        System.out.println("------------------------------------------------------------");

        int rank = 1;
        for (Map.Entry<String, Double> entry : top10) {
            System.out.printf("%-5d  %-35s  %,15.2f%n",
                    rank++, entry.getKey(), entry.getValue());
        }

        System.out.println("============================================================");
        System.out.printf("Total unique publishers: %d%n", totals.size());
        System.out.println("============================================================");
    }

    // ── Main ──────────────────────────────────────────────────────────────────
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);
        File file = null;

        while (true) {
            System.out.print("Enter dataset file path: ");
            String path = input.nextLine().trim();
            file = new File(path);

            if (!file.exists() || !file.isFile()) {
                System.out.println("Error: File does not exist. Please try again.");
            } else if (!file.canRead()) {
                System.out.println("Error: File is not readable. Please try again.");
            } else if (!path.toLowerCase().endsWith(".csv")) {
                System.out.println("Error: File is not a CSV. Please try again.");
            } else {
                System.out.println("File found. Processing...");
                break;
            }
        }

        try {
            List<DataRecord> records = loadDataset(file);
            Map<String, Double> publisherTotals = aggregateByPublisher(records);
            printTop10(publisherTotals);
        } catch (IOException e) {
            System.out.println("Error reading file: " + e.getMessage());
        }

        input.close();
    }
}
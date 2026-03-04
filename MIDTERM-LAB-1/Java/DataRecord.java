public class DataRecord {

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
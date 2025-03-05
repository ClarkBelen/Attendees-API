const express = require("express");
const cors = require("cors");
const fs = require("fs");
const csv = require("csv-parser");

const app = express();
const PORT = 5000;

app.use(cors());

// Read CSV and convert to JSON format
const readCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        results.push({
          name: { first: row["First Name"], full: row["Full Name"] },
          email: row["Email"],
        });
      })
      .on("end", () => resolve(results))
      .on("error", (err) => reject(err));
  });
};

// Root Route 
app.get("/", (req, res) => {
    res.send("Welcome to the API. Use /api/attendees to get data.");
});

// API route to get attendees
app.get("/api/attendees", async (req, res) => {
  try {
    const attendees = await readCSV("attendees.csv");
    res.json(attendees);
  } catch (error) {
    res.status(500).json({ error: "Failed to read CSV file" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

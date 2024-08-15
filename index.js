const express = require("express");
const connectDB = require("./config/db");
require("dotenv").config();
const PORT = process.env.PORT || 8080;
const studentRoutes = require("./routes/student_routes");
const cors = require("cors");

const corsOptions = {
  origin: [
    "http://example.com", // Allow specific origins
    "http://another-example.com",
  ],
  methods: ["GET", "POST", "PUT", "DELETE"], // Allow specific HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers
  exposedHeaders: ["Content-Length", "X-Total-Count"], // Expose specific headers
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  optionsSuccessStatus: 200, // Status for successful OPTIONS requests
  preflightContinue: false, // Pass the CORS preflight response to the next handler
  maxAge: 86400, // Cache preflight requests for 1 day (in seconds)
};

module.exports = corsOptions;

const app = express();

app.use(cors());
app.use(express.json());
app.use(studentRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  connectDB(process.env.DB_URI);
  console.log(`Listening to port ${PORT}`);
});

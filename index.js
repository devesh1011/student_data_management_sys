const express = require("express");
const connectDB = require("./config/db");
require("dotenv").config();
const PORT = process.env.PORT || 8080;
const studentRoutes = require("./routes/student_routes");
const corsOptions = require("./config/cors");

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(studentRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  connectDB(process.env.DB_URI);
  console.log(`Listening to port ${PORT}`);
});

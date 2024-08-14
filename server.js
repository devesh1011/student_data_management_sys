const express = require("express");
const connectDB = require("./config/db");
const PORT = process.env.PORT || 8080;
const studentRoutes = require("./routes/student_routes");

const app = express();

app.use(express.json());
app.use(studentRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  connectDB();
  console.log(`Listening to port ${PORT}`);
});

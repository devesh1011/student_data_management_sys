const mongoose = require("mongoose");
const connectDB = async (DB_URI) => {
  try {
    await mongoose.connect(DB_URI, {
      serverSelectionTimeoutMS: 30000, // 30 seconds
    });

    console.log("Connected to DB successfully");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/studentData");

    console.log("Connected to DB successfully");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;

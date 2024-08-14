const mongoose = require("mongoose");
const { subjectSchema } = require("./Subject");

const semesterSchema = new mongoose.Schema({
  core_subjects: [subjectSchema], 
  specialization_subjects: [subjectSchema],
});

module.exports = mongoose.model("Semester", semesterSchema);
module.exports.semesterSchema = semesterSchema;

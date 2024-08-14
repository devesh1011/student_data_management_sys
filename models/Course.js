const mongoose = require("mongoose");
const { semesterSchema } = require("./semester");

const courseSchema = new mongoose.Schema({
  course_name: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  semesters: {
    type: Map,
    of: semesterSchema,
  },
});

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;

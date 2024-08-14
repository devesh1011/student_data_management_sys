const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studentDataSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  enrollment_no: {
    type: String,
    required: true,
    // unique: true,
  },
  admission_no: {
    type: String,
    required: true,
    // unique: true,
  },
  father_name: {
    type: String,
  },
  mother_name: {
    type: String,
  },
  course: {
    type: mongoose.Types.ObjectId,
    // required: true,
    ref: "Course",
  },
  batch: {
    type: String,
  },
  specialization: {
    type: String,
    enum: ["Core", "Data Science", "ai-ml"],
    required: true,
  },
  semester: {
    type: Number,
    min: 1,
    max: 8,
  },
  section: {
    type: Number,
    min: 1,
    max: 8,
  },
  subjects: [Object],
});

const StudentData = mongoose.model("StudentData", studentDataSchema);

module.exports = {
  StudentData,
};

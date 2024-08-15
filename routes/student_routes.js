const express = require("express");
const router = express.Router();

const {
  addStudentsFromFile,
  getStudentsByCourseAndBatch,
  getStudentsBySection,
  getStudentsBySpecialization,
  getStudentById,
} = require("../controllers/student_controller");

const { addCoursesFromFile } = require("../controllers/courses_controller");

// Routes for adding students and courses
router.post("/students/add", addStudentsFromFile);
router.post("/courses/add", addCoursesFromFile);

// Routes for getting students by various criteria
router.get("/students/:course/:batch", getStudentsByCourseAndBatch);
router.get("/students/:course/:batch/:section", getStudentsBySection);
router.get("/students/:course/:batch/specialization/:specialization", getStudentsBySpecialization);
router.get("/students/:enrollment", getStudentById);

module.exports = router;

const express = require("express");
const {
  addStudentsFromFile,
  getStudentsByCourseAndBatch,
  getStudentsBySection,
  getStudentsBySpecialization,
  getStudentById,
} = require("../controllers/student_controller");

const { addCoursesFromFile } = require("../controllers/courses_controller");
const router = express.Router();

router.post("/students/add", addStudentsFromFile);
router.post("/courses/add", addCoursesFromFile);

router.get("/students/:course/:batch", getStudentsByCourseAndBatch);
router.get("/students/:course/:batch/:section", getStudentsBySection);
router.get(
  "/students/:course/:batch/specialization/:specialization",
  getStudentsBySpecialization
);

router.get("/students/:enrollment", getStudentById);

module.exports = router;

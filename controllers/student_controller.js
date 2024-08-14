const { StudentData } = require("../models/Student");
const { parseExcelFile } = require("../config/dataParser");
const path = require("path");
const Course = require("../models/Course");

const addStudentsFromFile = async (req, res) => {
  const filePath = path.join(__dirname, "../data/student_data.xlsx");
  const xlData = parseExcelFile(filePath);

  try {
    const savePromises = xlData.map(async (row) => {
      if (!row["ENROLLMENT NO."]) {
        console.warn(
          `Skipping row: Missing enrollment number for student ${row["STUDENT NAME"]}`
        );
        return Promise.resolve();
      }

      const course = await Course.findOne({
        course_name: row["Course"],
      });

      if (!course) {
        console.warn(`Skipping row: No course found for ${row["Course Name"]}`);
        return Promise.resolve();
      }

      const semesterDetails = course.semesters.get(row["Semester"].toString());
      if (!semesterDetails) {
        console.warn(
          `Skipping row: No semester found for semester ${row["Semester"]} in course ${row["Course"]}`
        );
        return Promise.resolve();
      }

      const subjectsToAdd =
        row["Specialization"] === "Core"
          ? semesterDetails.core_subjects
          : [
              ...semesterDetails.core_subjects,
              ...semesterDetails.specialization_subjects,
            ];

      const mappedSubjects = subjectsToAdd.map((subject) => ({
        subject_name: subject.name,
        code: subject.code,
      }));

      const studentData = new StudentData({
        name: row["STUDENT NAME"],
        enrollment_no: row["ENROLLMENT NO."],
        admission_no: row["ADMISSION NO."],
        father_name: row[" FATHER'S NAME"],
        mother_name: row["MOTHER'S NAME"],
        batch: row["Batch"],
        specialization: row["Specialization"],
        semester: row["Semester"],
        section: row["Section"],
        course: course._id,
        subjects: mappedSubjects,
      });

      // console.log(studentData);
      return studentData.save();
    });

    await Promise.all(savePromises);

    res.send("Students' details added to DB successfully.");
  } catch (err) {
    console.error("Error saving student data:", err);
    res.status(500).send("An error occurred while saving students' details.");
  }
};

const getStudentsByCourseAndBatch = async (req, res) => {
  const { course, batch } = req.params;

  try {
    // Find the course by name
    const courseDoc = await Course.findOne({ course_name: course });

    if (!courseDoc) {
      return res.status(404).json({ error: `Course "${course}" not found.` });
    }

    // Find students based on course and batch
    const students = await StudentData.find({
      course: courseDoc._id,
      batch: batch,
    }).populate("course");

    // Check if students were found
    if (students.length === 0) {
      return res
        .status(404)
        .json({ message: "No students found for this course and batch." });
    }

    res.status(200).json(students);
  } catch (err) {
    console.error("Error fetching students:", err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching students." });
  }
};

const getStudentsBySection = async (req, res) => {
  const { course, batch, section } = req.params;

  try {
    // Find the course by name
    const courseDoc = await Course.findOne({ course_name: course });

    if (!courseDoc) {
      return res.status(404).json({ error: `Course "${course}" not found.` });
    }

    // Find students based on course, batch, and section
    const students = await StudentData.find({
      course: courseDoc._id,
      batch: batch,
      section: section,
    }).populate("course");

    // Check if students were found
    if (students.length === 0) {
      return res.status(404).json({
        message: "No students found for this course, batch, and section.",
      });
    }

    res.status(200).json(students);
  } catch (err) {
    console.error("Error fetching students:", err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching students." });
  }
};

const getStudentsBySpecialization = async (req, res) => {
  const { course, batch, specialization } = req.params;

  try {
    // Find the course by name
    const courseDoc = await Course.findOne({ course_name: course });

    if (!courseDoc) {
      return res.status(404).json({ error: `Course "${course}" not found.` });
    }

    // Find students based on course, batch, and specialization
    const students = await StudentData.find({
      course: courseDoc._id,
      batch: batch,
      specialization: specialization,
    }).populate("course");

    // Check if students were found
    if (students.length === 0) {
      return res.status(404).json({
        message:
          "No students found for this course, batch, and specialization.",
      });
    }

    res.status(200).json(students);
  } catch (err) {
    console.error("Error fetching students:", err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching students." });
  }
};

const getStudentById = async (req, res) => {
  const { enrollment } = req.params;

  try {
    // Find the student by ID
    const student = await StudentData.findOne({enrollment_no: enrollment})

    // If no student is found, return a 404 error
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // If student is found, return the student data
    res.status(200).json(student);
  } catch (err) {
    // Handle errors such as invalid ID format
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  addStudentsFromFile,
  getStudentsByCourseAndBatch,
  getStudentsBySection,
  getStudentsBySpecialization,
  getStudentById
};

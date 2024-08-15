const express = require("express");
const path = require("path");
const { StudentData } = require("../models/Student");
const { parseExcelFile } = require("../config/dataParser");
const Course = require("../models/Course");

// Utility function to find a course by name
const findCourseByName = async (courseName) => {
  return Course.findOne({ course_name: courseName });
};

// Utility function to send error responses
const sendErrorResponse = (res, status, message) => {
  res.status(status).json({ error: message });
};

// Add students from an Excel file
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

      const course = await findCourseByName(row["Course"]);
      if (!course) {
        console.warn(`Skipping row: No course found for ${row["Course"]}`);
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

      return studentData.save();
    });

    await Promise.all(savePromises);

    res.send("Students' details added to DB successfully.");
  } catch (err) {
    console.error("Error saving student data:", err);
    sendErrorResponse(
      res,
      500,
      "An error occurred while saving students' details."
    );
  }
};

// Get students by course and batch
const getStudentsByCourseAndBatch = async (req, res) => {
  const { course, batch } = req.params;

  try {
    const courseDoc = await findCourseByName(course);
    if (!courseDoc) {
      return sendErrorResponse(res, 404, `Course "${course}" not found.`);
    }

    const students = await StudentData.find({
      course: courseDoc._id,
      batch: batch,
    }).populate("course");

    if (students.length === 0) {
      return sendErrorResponse(
        res,
        404,
        "No students found for this course and batch."
      );
    }

    res.status(200).json(students);
  } catch (err) {
    console.error("Error fetching students:", err);
    sendErrorResponse(res, 500, "An error occurred while fetching students.");
  }
};

// Get students by course, batch, and section
const getStudentsBySection = async (req, res) => {
  const { course, batch, section } = req.params;

  try {
    const courseDoc = await findCourseByName(course);
    if (!courseDoc) {
      return sendErrorResponse(res, 404, `Course "${course}" not found.`);
    }

    const students = await StudentData.find({
      course: courseDoc._id,
      batch: batch,
      section: section,
    }).populate("course");

    if (students.length === 0) {
      return sendErrorResponse(
        res,
        404,
        "No students found for this course, batch, and section."
      );
    }

    res.status(200).json(students);
  } catch (err) {
    console.error("Error fetching students:", err);
    sendErrorResponse(res, 500, "An error occurred while fetching students.");
  }
};

// Get students by course, batch, and specialization
const getStudentsBySpecialization = async (req, res) => {
  const { course, batch, specialization } = req.params;

  try {
    const courseDoc = await findCourseByName(course);
    if (!courseDoc) {
      return sendErrorResponse(res, 404, `Course "${course}" not found.`);
    }

    const students = await StudentData.find({
      course: courseDoc._id,
      batch: batch,
      specialization: specialization,
    }).populate("course");

    if (students.length === 0) {
      return sendErrorResponse(
        res,
        404,
        "No students found for this course, batch, and specialization."
      );
    }

    res.status(200).json(students);
  } catch (err) {
    console.error("Error fetching students:", err);
    sendErrorResponse(res, 500, "An error occurred while fetching students.");
  }
};

// Get student by enrollment number
const getStudentById = async (req, res) => {
  const { enrollment } = req.params;

  try {
    const student = await StudentData.find({ enrollment_no: enrollment });

    if (!student) {
      return sendErrorResponse(res, 404, "Student not found.");
    }

    res.status(200).json(student);
  } catch (err) {
    console.error("Error fetching student:", err);
    sendErrorResponse(
      res,
      500,
      "An error occurred while fetching the student."
    );
  }
};

module.exports = {
  addStudentsFromFile,
  getStudentsByCourseAndBatch,
  getStudentsBySection,
  getStudentsBySpecialization,
  getStudentById,
};

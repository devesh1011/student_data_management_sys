const path = require("path");
const { parseExcelFile } = require("../config/dataParser");

const Course = require("../models/Course");
const Semester = require("../models/semester");
const Subject = require("../models/Subject");

const addCoursesFromFile = async (req, res) => {
  const filePath = path.join(__dirname, "../data/courses.xlsx");
  const xlData = parseExcelFile(filePath);

  try {
    // Iterate through each row in the Excel file
    for (const row of xlData) {
      const courseName = row["Course Name"];
      const department = row["Department"];
      const semesterNumber = row["Semester"].toString();

      const coreSubjects = row["Core Subjects"]
        ? await parseAndSaveSubjects(row["Core Subjects"])
        : [];

      const specializationSubjects = row["Specialization Subjects"]
        ? await parseAndSaveSubjects(row["Specialization Subjects"])
        : [];

      // Save or update semester
      const semester = await Semester.findOneAndUpdate(
        {
          core_subjects: coreSubjects,
          specialization_subjects: specializationSubjects,
        },
        {
          core_subjects: coreSubjects,
          specialization_subjects: specializationSubjects,
        },
        { upsert: true, new: true }
      );

      // Find the course or create a new one
      let course = await Course.findOne({
        course_name: courseName,
        department,
      });

      if (!course) {
        course = new Course({
          course_name: courseName,
          department: department,
          semesters: new Map(),
        });
      }

      // Instead of referencing, embed the semester data directly
      course.semesters.set(semesterNumber, {
        core_subjects: coreSubjects,
        specialization_subjects: specializationSubjects,
      });

      await course.save();
    }

    res.send("Courses and Semesters added successfully.");
  } catch (err) {
    console.error("Error saving course data:", err);
    res.status(500).send("An error occurred while saving courses.");
  }
};

// Helper function to parse subjects and save them to the database
const parseAndSaveSubjects = async (subjectStr) => {
  const subjectList = subjectStr.split(",").map((subject) => {
    const match = subject.match(/(.*)\((.*)\)/);
    return {
      name: match[1].trim(),
      code: match[2].trim(),
    };
  });

  const savedSubjects = [];
  for (const subject of subjectList) {
    const existingSubject = await Subject.findOne({ code: subject.code });
    if (existingSubject) {
      savedSubjects.push(existingSubject);
    } else {
      const newSubject = new Subject(subject);
      savedSubjects.push(await newSubject.save());
    }
  }

  return savedSubjects;
};

module.exports = {
  addCoursesFromFile,
};

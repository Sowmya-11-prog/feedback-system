const Student = require("../models/Student");

// @route  POST /api/students
const createStudent = async (req, res) => {
  try {
    const { studentName, department, yearOfStudy, rollNumber, email, phoneNumber } = req.body;

    if (!studentName || !department || !yearOfStudy || !rollNumber || !email || !phoneNumber) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await Student.findOne({
      $or: [{ rollNumber }, { email: email.toLowerCase() }],
    });
    if (existing) {
      return res.status(409).json({ message: "Roll number or email already exists" });
    }

    const student = await Student.create({
      studentName,
      department,
      yearOfStudy,
      rollNumber,
      email: email.toLowerCase(),
      phoneNumber,
    });

    res.status(201).json({ message: "Student added successfully", student });
  } catch (error) {
    res.status(500).json({ message: "Failed to add student", error: error.message });
  }
};

// @route  GET /api/students?search=term
const getStudents = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      const regex = new RegExp(search, "i");
      query = {
        $or: [
          { studentName: regex },
          { department: regex },
          { email: regex },
          { phoneNumber: regex },
          { rollNumber: regex },
        ],
      };
    }

    const students = await Student.find(query).sort({ createdAt: -1 });
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch students", error: error.message });
  }
};

// @route  GET /api/students/:id
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch student", error: error.message });
  }
};

// @route  PUT /api/students/:id
const updateStudent = async (req, res) => {
  try {
    const { studentName, department, yearOfStudy, rollNumber, email, phoneNumber } = req.body;

    const duplicate = await Student.findOne({
      _id: { $ne: req.params.id },
      $or: [{ rollNumber }, { email: email ? email.toLowerCase() : undefined }],
    });
    if (duplicate) {
      return res.status(409).json({ message: "Roll number or email already used by another student" });
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      {
        studentName,
        department,
        yearOfStudy,
        rollNumber,
        email: email ? email.toLowerCase() : undefined,
        phoneNumber,
      },
      { new: true, runValidators: true }
    );

    if (!student) return res.status(404).json({ message: "Student not found" });

    res.status(200).json({ message: "Student details updated successfully", student });
  } catch (error) {
    res.status(500).json({ message: "Failed to update student", error: error.message });
  }
};

// @route  DELETE /api/students/:id
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete student", error: error.message });
  }
};

module.exports = {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};

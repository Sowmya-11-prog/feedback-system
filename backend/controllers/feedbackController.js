const Feedback = require("../models/Feedback");

// @route  POST /api/feedback
const createFeedback = async (req, res) => {
  try {
    const { studentName, department, teacherName, feedback, rating } = req.body;

    if (!studentName || !department || !teacherName || !feedback || !rating) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const newFeedback = await Feedback.create({
      studentId: req.user ? req.user.id : undefined,
      studentName,
      department,
      teacherName,
      feedback,
      rating,
    });

    res.status(201).json({ message: "Feedback submitted successfully", feedback: newFeedback });
  } catch (error) {
    res.status(500).json({ message: "Failed to submit feedback", error: error.message });
  }
};

// @route  GET /api/feedback?search=term&department=&teacherName=&rating=
const getFeedback = async (req, res) => {
  try {
    const { search, department, teacherName, rating } = req.query;
    let query = {};

    if (department) query.department = department;
    if (teacherName) query.teacherName = teacherName;
    if (rating) query.rating = Number(rating);

    if (search) {
      const regex = new RegExp(search, "i");
      query.$or = [
        { studentName: regex },
        { department: regex },
        { teacherName: regex },
      ];
    }

    const feedbackList = await Feedback.find(query).sort({ createdAt: -1 });
    res.status(200).json(feedbackList);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch feedback", error: error.message });
  }
};

// @route  GET /api/feedback/:id
const getFeedbackById = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) return res.status(404).json({ message: "Feedback not found" });
    res.status(200).json(feedback);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch feedback", error: error.message });
  }
};

// @route  GET /api/feedback/rating/:rating
const getFeedbackByRating = async (req, res) => {
  try {
    const rating = Number(req.params.rating);
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }
    const feedbackList = await Feedback.find({ rating }).sort({ createdAt: -1 });
    res.status(200).json(feedbackList);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch feedback", error: error.message });
  }
};

// @route  GET /api/feedback/student/:studentId
const getFeedbackByStudent = async (req, res) => {
  try {
    const feedbackList = await Feedback.find({ studentId: req.params.studentId }).sort({
      createdAt: -1,
    });
    res.status(200).json(feedbackList);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch feedback", error: error.message });
  }
};

module.exports = {
  createFeedback,
  getFeedback,
  getFeedbackById,
  getFeedbackByRating,
  getFeedbackByStudent,
};

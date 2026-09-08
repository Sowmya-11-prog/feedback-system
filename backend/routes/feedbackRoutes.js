const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");
const {
  createFeedback,
  getFeedback,
  getFeedbackById,
  getFeedbackByRating,
  getFeedbackByStudent,
} = require("../controllers/feedbackController");

// Any logged-in user (student) can submit feedback
router.post("/", protect, createFeedback);

// Admin-only views
router.get("/", protect, adminOnly, getFeedback);
router.get("/rating/:rating", protect, adminOnly, getFeedbackByRating);
router.get("/student/:studentId", protect, getFeedbackByStudent);
router.get("/:id", protect, adminOnly, getFeedbackById);

module.exports = router;

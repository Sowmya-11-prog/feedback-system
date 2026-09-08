const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");
const { getStats } = require("../controllers/dashboardController");

router.get("/stats", protect, adminOnly, getStats);

module.exports = router;

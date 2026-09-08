const Student = require("../models/Student");
const Feedback = require("../models/Feedback");

// @route  GET /api/dashboard/stats
const getStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalFeedback = await Feedback.countDocuments();

    const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    const ratingAgg = await Feedback.aggregate([
      { $group: { _id: "$rating", count: { $sum: 1 } } },
    ]);
    ratingAgg.forEach((r) => {
      ratingCounts[r._id] = r.count;
    });

    const avgAgg = await Feedback.aggregate([
      { $group: { _id: null, avgRating: { $avg: "$rating" } } },
    ]);
    const averageRating = avgAgg.length > 0 ? Number(avgAgg[0].avgRating.toFixed(2)) : 0;

    const departments = await Feedback.distinct("department");
    const teachers = await Feedback.distinct("teacherName");

    // Department-wise feedback counts (for charts)
    const departmentBreakdown = await Feedback.aggregate([
      { $group: { _id: "$department", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Teacher-wise average rating (for charts)
    const teacherBreakdown = await Feedback.aggregate([
      { $group: { _id: "$teacherName", avgRating: { $avg: "$rating" }, count: { $sum: 1 } } },
      { $sort: { avgRating: -1 } },
    ]);

    res.status(200).json({
      totalStudents,
      totalFeedback,
      fiveStar: ratingCounts[5],
      fourStar: ratingCounts[4],
      threeStar: ratingCounts[3],
      twoStar: ratingCounts[2],
      oneStar: ratingCounts[1],
      averageRating,
      totalDepartments: departments.length,
      totalTeachers: teachers.length,
      departmentBreakdown: departmentBreakdown.map((d) => ({ department: d._id, count: d.count })),
      teacherBreakdown: teacherBreakdown.map((t) => ({
        teacherName: t._id,
        avgRating: Number(t.avgRating.toFixed(2)),
        count: t.count,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch dashboard stats", error: error.message });
  }
};

module.exports = { getStats };

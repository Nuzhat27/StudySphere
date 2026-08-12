const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Assignment = require('../models/Assignment');
const Doubt = require('../models/Doubt');

// @route GET /api/enrollments/my  (student's own enrollments + progress)
const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id }).populate(
      'course',
      'title thumbnailUrl category'
    );
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/enrollments/:courseId/lessons/:lessonId/complete
const markLessonComplete = async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;
    const enrollment = await Enrollment.findOne({ student: req.user._id, course: courseId });
    if (!enrollment) return res.status(404).json({ message: 'Not enrolled in this course' });

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (!enrollment.completedLessons.some((id) => String(id) === lessonId)) {
      enrollment.completedLessons.push(lessonId);
    }

    const totalLessons = course.lessons.length || 1;
    enrollment.progressPercent = Math.round(
      (enrollment.completedLessons.length / totalLessons) * 100
    );
    enrollment.status = enrollment.progressPercent >= 100 ? 'completed' : 'active';

    await enrollment.save();
    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/enrollments/course/:courseId/analytics  (educator/admin)
// Aggregation pipeline: enrollment count, avg progress, completion rate
const getCourseAnalytics = async (req, res) => {
  try {
    const { courseId } = req.params;
    const mongoose = require('mongoose');

    const stats = await Enrollment.aggregate([
      { $match: { course: new mongoose.Types.ObjectId(courseId) } },
      {
        $group: {
          _id: '$course',
          totalEnrollments: { $sum: 1 },
          averageProgress: { $avg: '$progressPercent' },
          completedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalEnrollments: 1,
          averageProgress: { $round: ['$averageProgress', 1] },
          completedCount: 1,
          completionRate: {
            $round: [
              { $multiply: [{ $divide: ['$completedCount', '$totalEnrollments'] }, 100] },
              1,
            ],
          },
        },
      },
    ]);

    res.json(stats[0] || { totalEnrollments: 0, averageProgress: 0, completedCount: 0, completionRate: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/enrollments/my-stats  (student) — dashboard summary
const getMyStats = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id });
    const courseIds = enrollments.map((e) => e.course);

    const totalCourses = enrollments.length;
    const completedCourses = enrollments.filter((e) => e.status === 'completed').length;
    const avgProgress = totalCourses
      ? Math.round(enrollments.reduce((acc, e) => acc + e.progressPercent, 0) / totalCourses)
      : 0;
    const quizzesAttempted = enrollments.reduce((acc, e) => acc + e.quizScores.length, 0);
    const quizzesPassed = enrollments.reduce(
      (acc, e) => acc + e.quizScores.filter((q) => q.score / q.totalMarks >= 0.5).length,
      0
    );

    // Upcoming assignments across all enrolled courses, next 5 by due date
    const upcomingAssignments = await Assignment.find({
      course: { $in: courseIds },
      dueDate: { $gte: new Date() },
    })
      .populate('course', 'title')
      .sort({ dueDate: 1 })
      .limit(5);

    const myOpenDoubts = await Doubt.countDocuments({ student: req.user._id, resolved: false });

    res.json({
      totalCourses,
      completedCourses,
      avgProgress,
      quizzesAttempted,
      quizzesPassed,
      upcomingAssignments,
      myOpenDoubts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/enrollments/educator-stats  (educator) — dashboard summary
const getEducatorStats = async (req, res) => {
  try {
    const courses = await Course.find({ educator: req.user._id });
    const courseIds = courses.map((c) => c._id);

    const totalStudents = await Enrollment.countDocuments({ course: { $in: courseIds } });
    const openDoubts = await Doubt.countDocuments({ course: { $in: courseIds }, resolved: false });

    const ratingsFlat = courses.flatMap((c) => c.ratings.map((r) => r.rating));
    const avgRating = ratingsFlat.length
      ? Math.round((ratingsFlat.reduce((a, b) => a + b, 0) / ratingsFlat.length) * 10) / 10
      : 0;

    res.json({
      totalCourses: courses.length,
      approvedCourses: courses.filter((c) => c.status === 'approved').length,
      pendingCourses: courses.filter((c) => c.status === 'pending').length,
      totalStudents,
      avgRating,
      openDoubts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMyEnrollments,
  markLessonComplete,
  getCourseAnalytics,
  getMyStats,
  getEducatorStats,
};

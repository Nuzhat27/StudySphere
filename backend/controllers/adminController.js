const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const sendEmail = require('../utils/sendEmail');

// @route GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/admin/users/:id/role
const changeUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['student', 'educator', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/admin/users/:id/toggle-active
const toggleUserActive = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ _id: user._id, isActive: user.isActive });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/admin/courses/pending
const getPendingCourses = async (req, res) => {
  try {
    const courses = await Course.find({ status: 'pending' }).populate('educator', 'name email');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/admin/courses/:id/review  { decision: 'approved' | 'rejected' }
const reviewCourse = async (req, res) => {
  try {
    const { decision } = req.body;
    if (!['approved', 'rejected'].includes(decision)) {
      return res.status(400).json({ message: 'Invalid decision' });
    }
    const course = await Course.findById(req.params.id).populate('educator', 'name email');
    if (!course) return res.status(404).json({ message: 'Course not found' });

    course.status = decision;
    await course.save();

    sendEmail({
      to: course.educator.email,
      subject: `Your course "${course.title}" was ${decision}`,
      html: `<p>Hi ${course.educator.name}, your course <b>${course.title}</b> has been <b>${decision}</b> by the admin team.</p>`,
    });

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/admin/stats  — platform-wide aggregation
const getPlatformStats = async (req, res) => {
  try {
    const [userCounts, courseCounts, enrollmentCount] = await Promise.all([
      User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]),
      Course.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Enrollment.countDocuments(),
    ]);

    res.json({
      usersByRole: userCounts,
      coursesByStatus: courseCounts,
      totalEnrollments: enrollmentCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
  changeUserRole,
  toggleUserActive,
  getPendingCourses,
  reviewCourse,
  getPlatformStats,
};

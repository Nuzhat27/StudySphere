const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const sendEmail = require('../utils/sendEmail');

// @route GET /api/courses  (public catalog — only approved courses)
const getCourses = async (req, res) => {
  try {
    const { search, category, semester } = req.query;
    const filter = { status: 'approved' };
    if (search) filter.title = { $regex: search, $options: 'i' };
    if (category) filter.category = category;
    if (semester) filter.semester = Number(semester);

    const courses = await Course.find(filter)
      .populate('educator', 'name email')
      .select('-lessons.contentUrl') // don't leak content URLs before enrollment
      .sort({ semester: 1, createdAt: -1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/courses/:id
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('educator', 'name email');
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST /api/courses  (educator/admin)
const createCourse = async (req, res) => {
  try {
    const { title, description, category, semester } = req.body;
    const course = await Course.create({
      title,
      description,
      category,
      semester,
      educator: req.user._id,
      status: 'pending', // goes to admin for approval
    });
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/courses/:id  (owning educator/admin)
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (String(course.educator) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to edit this course' });
    }

    Object.assign(course, req.body);
    // Any edit sends it back for re-approval, unless an admin made the edit
    if (req.user.role !== 'admin') course.status = 'pending';
    await course.save();
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route DELETE /api/courses/:id
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (String(course.educator) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this course' });
    }

    await course.deleteOne();
    res.json({ message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST /api/courses/:id/lessons  (owning educator/admin)
const addLesson = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (String(course.educator) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { title, description, contentType, order } = req.body;
    // req.file is populated by multer/Cloudinary upload middleware
    const contentUrl = req.file ? req.file.path : '';

    course.lessons.push({ title, description, contentType, order, contentUrl });
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST /api/courses/:id/enroll  (student)
const enrollInCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course || course.status !== 'approved') {
      return res.status(404).json({ message: 'Course not available' });
    }

    const exists = await Enrollment.findOne({ student: req.user._id, course: course._id });
    if (exists) return res.status(400).json({ message: 'Already enrolled' });

    const enrollment = await Enrollment.create({ student: req.user._id, course: course._id });
    await req.user.updateOne({ $addToSet: { enrolledCourses: course._id } });

    sendEmail({
      to: req.user.email,
      subject: `You're enrolled in ${course.title}`,
      html: `<p>Hi ${req.user.name}, you're now enrolled in <b>${course.title}</b>. Happy learning!</p>`,
    });

    res.status(201).json(enrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST /api/courses/:id/ratings  (enrolled student)
const rateCourse = async (req, res) => {
  try {
    const { rating, review } = req.body;
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    course.ratings = course.ratings.filter((r) => String(r.student) !== String(req.user._id));
    course.ratings.push({ student: req.user._id, rating, review });
    await course.save();
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  addLesson,
  enrollInCourse,
  rateCourse,
};

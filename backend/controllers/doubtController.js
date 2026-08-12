const Doubt = require('../models/Doubt');

// @route GET /api/doubts/:courseId
const getDoubts = async (req, res) => {
  try {
    const doubts = await Doubt.find({ course: req.params.courseId })
      .populate('student', 'name role')
      .populate('answers.author', 'name role')
      .sort({ createdAt: -1 });
    res.json(doubts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST /api/doubts/:courseId  (student)
const postDoubt = async (req, res) => {
  try {
    const { question } = req.body;
    const doubt = await Doubt.create({
      course: req.params.courseId,
      student: req.user._id,
      question,
    });
    const populated = await doubt.populate('student', 'name role');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST /api/doubts/:id/answer  (educator/admin, or the asking student following up)
const answerDoubt = async (req, res) => {
  try {
    const { text } = req.body;
    const doubt = await Doubt.findById(req.params.id);
    if (!doubt) return res.status(404).json({ message: 'Doubt not found' });

    doubt.answers.push({ author: req.user._id, text });
    // Educator/admin answering marks it resolved by default
    if (['educator', 'admin'].includes(req.user.role)) doubt.resolved = true;
    await doubt.save();

    const populated = await doubt.populate([
      { path: 'student', select: 'name role' },
      { path: 'answers.author', select: 'name role' },
    ]);
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/doubts/:id/resolve  (educator/admin, or the asking student)
const toggleResolved = async (req, res) => {
  try {
    const doubt = await Doubt.findById(req.params.id);
    if (!doubt) return res.status(404).json({ message: 'Doubt not found' });

    const isOwner = String(doubt.student) === String(req.user._id);
    const isStaff = ['educator', 'admin'].includes(req.user.role);
    if (!isOwner && !isStaff) return res.status(403).json({ message: 'Not authorized' });

    doubt.resolved = !doubt.resolved;
    await doubt.save();
    res.json(doubt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/doubts/:id  (the asking student only, and only if unanswered)
const editDoubt = async (req, res) => {
  try {
    const { question } = req.body;
    const doubt = await Doubt.findById(req.params.id);
    if (!doubt) return res.status(404).json({ message: 'Doubt not found' });

    const isOwner = String(doubt.student) === String(req.user._id);
    if (!isOwner) return res.status(403).json({ message: 'Not authorized' });

    doubt.question = question;
    await doubt.save();

    const populated = await doubt.populate([
      { path: 'student', select: 'name role' },
      { path: 'answers.author', select: 'name role' },
    ]);
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route DELETE /api/doubts/:id  (the asking student, or an admin)
const deleteDoubt = async (req, res) => {
  try {
    const doubt = await Doubt.findById(req.params.id);
    if (!doubt) return res.status(404).json({ message: 'Doubt not found' });

    const isOwner = String(doubt.student) === String(req.user._id);
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Not authorized' });

    await doubt.deleteOne();
    res.json({ message: 'Doubt deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDoubts, postDoubt, answerDoubt, toggleResolved, editDoubt, deleteDoubt };

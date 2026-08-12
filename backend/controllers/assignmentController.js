const Assignment = require('../models/Assignment');

// @route GET /api/assignments/:courseId
const getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({ course: req.params.courseId }).sort({ dueDate: 1 });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST /api/assignments/:courseId  (educator/admin)
const createAssignment = async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    const attachmentUrl = req.file ? req.file.path : '';
    const assignment = await Assignment.create({
      course: req.params.courseId,
      title,
      description,
      dueDate,
      attachmentUrl,
      createdBy: req.user._id,
    });
    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST /api/assignments/:id/submit  (student)
const submitAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    const fileUrl = req.file ? req.file.path : '';
    assignment.submissions = assignment.submissions.filter(
      (s) => String(s.student) !== String(req.user._id)
    );
    assignment.submissions.push({ student: req.user._id, fileUrl });
    await assignment.save();
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route DELETE /api/assignments/:id  (owning educator/admin)
const deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    if (String(assignment.createdBy) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await assignment.deleteOne();
    res.json({ message: 'Assignment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAssignments, createAssignment, submitAssignment, deleteAssignment };

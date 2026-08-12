const Comment = require('../models/Comment');

// @route GET /api/comments/:courseId/:lessonId
const getComments = async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;
    const comments = await Comment.find({ course: courseId, lessonId })
      .populate('author', 'name role avatarUrl')
      .sort({ createdAt: 1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST /api/comments/:courseId/:lessonId
const addComment = async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;
    const { text, parentComment } = req.body;

    const comment = await Comment.create({
      course: courseId,
      lessonId,
      author: req.user._id,
      text,
      parentComment: parentComment || null,
    });

    const populated = await comment.populate('author', 'name role avatarUrl');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route DELETE /api/comments/:id  (author or admin)
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (String(comment.author) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await comment.deleteOne();
    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getComments, addComment, deleteComment };

const express = require('express');
const router = express.Router();
const { getComments, addComment, deleteComment } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:courseId/:lessonId', protect, getComments);
router.post('/:courseId/:lessonId', protect, addComment);
router.delete('/:id', protect, deleteComment);

module.exports = router;

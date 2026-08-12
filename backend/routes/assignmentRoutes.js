const express = require('express');
const router = express.Router();
const {
  getAssignments,
  createAssignment,
  submitAssignment,
  deleteAssignment,
} = require('../controllers/assignmentController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/:courseId', protect, getAssignments);
router.post('/:courseId', protect, authorize('educator', 'admin'), upload.single('attachment'), createAssignment);
router.post('/:id/submit', protect, authorize('student'), upload.single('submission'), submitAssignment);
router.delete('/:id', protect, authorize('educator', 'admin'), deleteAssignment);

module.exports = router;

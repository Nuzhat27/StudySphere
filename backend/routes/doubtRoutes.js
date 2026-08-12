const express = require('express');
const router = express.Router();
const {
  getDoubts,
  postDoubt,
  answerDoubt,
  toggleResolved,
  editDoubt,
  deleteDoubt,
} = require('../controllers/doubtController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/:courseId', protect, getDoubts);
router.post('/:courseId', protect, authorize('student'), postDoubt);
router.post('/:id/answer', protect, answerDoubt);
router.put('/:id/resolve', protect, toggleResolved);
router.put('/:id', protect, editDoubt);
router.delete('/:id', protect, deleteDoubt);

module.exports = router;

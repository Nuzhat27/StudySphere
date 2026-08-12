const express = require('express');
const router = express.Router();
const {
  getMyEnrollments,
  markLessonComplete,
  getCourseAnalytics,
  getMyStats,
  getEducatorStats,
} = require('../controllers/enrollmentController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/my', protect, authorize('student'), getMyEnrollments);
router.get('/my-stats', protect, authorize('student'), getMyStats);
router.get('/educator-stats', protect, authorize('educator'), getEducatorStats);
router.put(
  '/:courseId/lessons/:lessonId/complete',
  protect,
  authorize('student'),
  markLessonComplete
);
router.get(
  '/course/:courseId/analytics',
  protect,
  authorize('educator', 'admin'),
  getCourseAnalytics
);

module.exports = router;

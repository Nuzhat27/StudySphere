const express = require('express');
const router = express.Router();
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  addLesson,
  enrollInCourse,
  rateCourse,
} = require('../controllers/courseController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Courses are for enrolled university students only — login required to browse.
router.get('/', protect, getCourses);
router.get('/:id', protect, getCourseById);

router.post('/', protect, authorize('educator', 'admin'), createCourse);
router.put('/:id', protect, authorize('educator', 'admin'), updateCourse);
router.delete('/:id', protect, authorize('educator', 'admin'), deleteCourse);

router.post(
  '/:id/lessons',
  protect,
  authorize('educator', 'admin'),
  upload.single('content'),
  addLesson
);

router.post('/:id/enroll', protect, authorize('student'), enrollInCourse);
router.post('/:id/ratings', protect, authorize('student'), rateCourse);

module.exports = router;

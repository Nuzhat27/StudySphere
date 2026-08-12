const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  changeUserRole,
  toggleUserActive,
  getPendingCourses,
  reviewCourse,
  getPlatformStats,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect, authorize('admin')); // every route below is admin-only

router.get('/users', getAllUsers);
router.put('/users/:id/role', changeUserRole);
router.put('/users/:id/toggle-active', toggleUserActive);
router.get('/courses/pending', getPendingCourses);
router.put('/courses/:id/review', reviewCourse);
router.get('/stats', getPlatformStats);

module.exports = router;

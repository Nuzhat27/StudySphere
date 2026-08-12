const express = require('express');
const router = express.Router();
const { createQuiz, getQuizForStudent, submitQuiz } = require('../controllers/quizController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.post('/', protect, authorize('educator', 'admin'), createQuiz);
router.get('/:id', protect, getQuizForStudent);
router.post('/:id/submit', protect, authorize('student'), submitQuiz);

module.exports = router;

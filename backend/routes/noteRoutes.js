const express = require('express');
const router = express.Router();
const { getNotes, createNote, deleteNote } = require('../controllers/noteController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/:courseId', protect, getNotes);
router.post('/:courseId', protect, authorize('educator', 'admin'), upload.single('file'), createNote);
router.delete('/:id', protect, authorize('educator', 'admin'), deleteNote);

module.exports = router;

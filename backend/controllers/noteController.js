const Note = require('../models/Note');

// @route GET /api/notes/:courseId?type=notes|pyq
const getNotes = async (req, res) => {
  try {
    const filter = { course: req.params.courseId };
    if (req.query.type) filter.type = req.query.type;
    const notes = await Note.find(filter).sort({ chapter: 1, order: 1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST /api/notes/:courseId  (educator/admin)
const createNote = async (req, res) => {
  try {
    const { chapter, title, type, content, order } = req.body;
    const fileUrl = req.file ? req.file.path : '';
    const note = await Note.create({
      course: req.params.courseId,
      chapter,
      title,
      type: type || 'notes',
      content,
      order,
      fileUrl,
      uploadedBy: req.user._id,
    });
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route DELETE /api/notes/:id  (uploading educator/admin)
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    if (String(note.uploadedBy) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await note.deleteOne();
    res.json({ message: 'Note deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getNotes, createNote, deleteNote };

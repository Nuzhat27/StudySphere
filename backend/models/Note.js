const mongoose = require('mongoose');

// Covers both chapter-wise notes and previous-year-question (PYQ) sets —
// same shape, distinguished by `type`, so one collection serves both
// tabs on the course page without duplicating logic.
const noteSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    chapter: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    type: { type: String, enum: ['notes', 'pyq'], default: 'notes' },
    content: { type: String, default: '' }, // inline text/markdown
    fileUrl: { type: String, default: '' }, // optional PDF via Cloudinary
    order: { type: Number, default: 0 },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Note', noteSchema);

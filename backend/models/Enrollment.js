const mongoose = require('mongoose');

// Referenced (not embedded) because this collection grows unbounded
// (every student x course pair) and is queried independently via
// aggregation pipelines for progress/analytics.
const enrollmentSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    completedLessons: [{ type: mongoose.Schema.Types.ObjectId }], // lesson subdoc _ids
    progressPercent: { type: Number, default: 0 },
    quizScores: [
      {
        quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
        score: Number,
        totalMarks: Number,
        attemptedAt: { type: Date, default: Date.now },
      },
    ],
    status: { type: String, enum: ['active', 'completed'], default: 'active' },
    enrolledAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);

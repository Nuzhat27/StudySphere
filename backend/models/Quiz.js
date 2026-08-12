const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctOptionIndex: { type: Number, required: true },
  marks: { type: Number, default: 1 },
});

const quizSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    lessonId: { type: mongoose.Schema.Types.ObjectId, required: true }, // lesson subdoc _id
    title: { type: String, required: true },
    questions: [questionSchema],
    passingScore: { type: Number, default: 50 }, // percent
  },
  { timestamps: true }
);

module.exports = mongoose.model('Quiz', quizSchema);

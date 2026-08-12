const mongoose = require('mongoose');

// Lessons are embedded inside Course since they're always read/written
// together with the course (small, bounded list) — referenced Enrollment
// is used separately for per-student progress tracking (unbounded, grows).
const lessonSubSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  contentUrl: { type: String, default: '' }, // Cloudinary URL (video/pdf/image)
  contentType: { type: String, enum: ['video', 'pdf', 'image', 'text'], default: 'video' },
  order: { type: Number, default: 0 },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', default: null },
});

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, default: 'General' },
    thumbnailUrl: { type: String, default: '' },
    educator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    semester: { type: Number, required: true, min: 1, max: 8 },
    lessons: [lessonSubSchema],
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    ratings: [
      {
        student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        rating: { type: Number, min: 1, max: 5 },
        review: { type: String, default: '' },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

courseSchema.virtual('averageRating').get(function () {
  if (!this.ratings || !this.ratings.length) return 0;
  const sum = this.ratings.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / this.ratings.length) * 10) / 10;
});
courseSchema.set('toJSON', { virtuals: true });
courseSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Course', courseSchema);

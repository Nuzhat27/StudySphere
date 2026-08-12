import { Link } from 'react-router-dom';

const emojiByCategory = {
  'Computer Science': '🧠',
  'Web Development': '🌐',
  'Programming': '🐍',
};

export default function CourseCard({ course }) {
  return (
    <Link
      to={`/courses/${course._id}`}
      className="group flex flex-col rounded-2xl overflow-hidden card-surface hover:-translate-y-1 hover:shadow-cardhover transition-all duration-200"
    >
      <div className="h-36 relative bg-gradient-to-br from-brand-500/20 via-brand-400/10 to-spark-400/20 flex items-center justify-center text-5xl overflow-hidden">
        <div className="absolute inset-0 bg-graph opacity-20 text-brand-700 dark:text-white" aria-hidden="true" />
        {course.thumbnailUrl ? (
          <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover relative z-10" />
        ) : (
          <span className="relative z-10 group-hover:scale-110 transition-transform">
            {emojiByCategory[course.category] || '📘'}
          </span>
        )}
        <span className="absolute top-3 left-3 z-10 badge bg-white/90 dark:bg-black/50 backdrop-blur text-slate-700 dark:text-slate-200">
          {course.category || 'General'}
        </span>
        {course.semester && (
          <span className="absolute top-3 right-3 z-10 badge bg-spark-400 text-slate-900 dark:bg-spark-400/20 dark:text-spark-300 dark:border dark:border-spark-400/30">
            Sem {course.semester}
          </span>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display font-semibold leading-snug line-clamp-2">{course.title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 flex-1">{course.description}</p>
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-900/[0.06] dark:border-white/10 text-sm">
          <span className="text-slate-500 dark:text-slate-400">{course.lessons?.length || 0} lessons</span>
          {course.educator?.name && (
            <span className="text-slate-600 dark:text-slate-300 font-medium truncate max-w-[55%] text-right">
              {course.educator.name}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

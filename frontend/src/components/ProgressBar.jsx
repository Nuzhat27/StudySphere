export default function ProgressBar({ percent = 0 }) {
  return (
    <div className="w-full bg-slate-200 dark:bg-white/10 rounded-full h-2">
      <div
        className="bg-gradient-to-r from-brand-500 to-spark-400 h-2 rounded-full transition-all"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

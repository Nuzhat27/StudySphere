import { Link } from 'react-router-dom';

const stats = [
  { label: 'Active learners', value: '12,400+' },
  { label: 'Courses live', value: '340+' },
  { label: 'Avg. completion rate', value: '78%' },
];

const features = [
  {
    tag: 'For students',
    title: 'Learn at your own pace, with proof of progress',
    body: 'Track completion lesson by lesson, take auto-graded quizzes, and pick up discussions right where you left off.',
  },
  {
    tag: 'For educators',
    title: 'Publish courses without fighting the tooling',
    body: 'Upload video, PDFs, or images per lesson, attach quizzes, and see real analytics on how students are doing.',
  },
  {
    tag: 'For admins',
    title: 'Keep quality high without slowing anyone down',
    body: 'Review new courses before they go live, manage accounts, and watch platform health from one dashboard.',
  },
];

export default function Home() {
  return (
    <div>
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 grid lg:grid-cols-[1.1fr_0.9fr] gap-14 items-center">
        <div>
          <span className="inline-block text-xs font-semibold tracking-wide uppercase text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10 px-3 py-1 rounded-full">
            Now open for course creators
          </span>
          <h1 className="font-display text-5xl sm:text-6xl font-bold leading-[1.05] mt-5 tracking-tight">
            Learning that
            <span className="text-brand-500"> tracks itself.</span>
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 mt-5 max-w-lg">
            StudySphere is where students, educators, and admins share one platform — courses, quizzes,
            discussions, and progress, all in one place.
          </p>
          <div className="flex items-center gap-4 mt-8">
            <Link to="/courses" className="px-6 py-3 rounded-full bg-brand-500 text-white font-medium hover:bg-brand-600 transition-colors">
              Browse courses
            </Link>
            <Link to="/register" className="px-6 py-3 rounded-full border border-slate-300 dark:border-white/15 font-medium hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
              Create an account
            </Link>
          </div>

          <div className="flex gap-10 mt-14">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="font-display text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 bg-gradient-to-br from-brand-500/20 to-spark-400/20 blur-3xl rounded-full" />
          <div className="relative card-surface rounded-2xl p-6 shadow-xl">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">Your progress</p>
            {['Data Structures & Algorithms', 'Full-Stack MERN', 'Python for Beginners'].map((t, i) => (
              <div key={t} className="mb-4 last:mb-0">
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium">{t}</span>
                  <span className="text-slate-400">{[64, 100, 30][i]}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-200 dark:bg-white/10">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-brand-500 to-spark-400"
                    style={{ width: `${[64, 100, 30][i]}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-900/[0.06] dark:border-white/10 bg-paperalt dark:bg-inkalt">
        <div className="max-w-7xl mx-auto px-6 py-16 sm:py-20">
          <span className="badge bg-brand-100 dark:bg-brand-500/15 text-brand-700 dark:text-brand-300 mb-3">How it works</span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-10">One platform, three ways to use it</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.tag} className="rounded-2xl card-surface p-6 hover:shadow-cardhover transition-shadow">
                <span className="text-xs font-semibold uppercase tracking-wide text-spark-500">{f.tag}</span>
                <h3 className="font-display font-semibold text-lg mt-3">{f.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

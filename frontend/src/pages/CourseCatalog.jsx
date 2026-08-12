import { useEffect, useState } from 'react';
import api from '../api/axios';
import CourseCard from '../components/CourseCard';

const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

export default function CourseCatalog() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [semester, setSemester] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async (params = {}) => {
    setLoading(true);
    const { data } = await api.get('/courses', { params });
    setCourses(data);
    setLoading(false);
  };

  useEffect(() => {
    load(semester ? { semester } : {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [semester]);

  const categories = [...new Set(courses.map((c) => c.category).filter(Boolean))];
  const filtered = courses.filter((c) => (category ? c.category === category : true));

  const submitSearch = (e) => {
    e.preventDefault();
    load({ search, ...(semester ? { semester } : {}) });
  };

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-6 py-10 sm:py-12">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold">Browse courses</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1.5">
            {loading ? 'Loading…' : `${filtered.length} course${filtered.length === 1 ? '' : 's'} available — free for enrolled students`}
          </p>
        </div>
        <form onSubmit={submitSearch} className="flex gap-2 w-full sm:w-auto">
          <input
            placeholder="Search courses…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field flex-1 sm:w-72 !rounded-full"
          />
          <button className="btn-primary shrink-0">Search</button>
        </form>
      </div>

      <div className="card-surface rounded-2xl p-5 mb-8 space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-2">Semester</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSemester('')}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                semester === ''
                  ? 'bg-brand-500 text-white border-brand-500'
                  : 'border-slate-900/10 dark:border-white/15 hover:bg-slate-900/5 dark:hover:bg-white/5'
              }`}
            >
              All semesters
            </button>
            {SEMESTERS.map((s) => (
              <button
                key={s}
                onClick={() => setSemester(String(s))}
                className={`w-10 h-9 rounded-full text-sm font-medium border transition-colors ${
                  semester === String(s)
                    ? 'bg-spark-400 text-slate-900 border-spark-400 dark:bg-spark-400/25 dark:text-spark-200 dark:border-spark-400/50'
                    : 'border-slate-900/10 dark:border-white/15 hover:bg-slate-900/5 dark:hover:bg-white/5'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {categories.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-2">Category</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCategory('')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  category === ''
                    ? 'bg-brand-500 text-white border-brand-500'
                    : 'border-slate-900/10 dark:border-white/15 hover:bg-slate-900/5 dark:hover:bg-white/5'
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                    category === cat
                      ? 'bg-brand-500 text-white border-brand-500'
                      : 'border-slate-900/10 dark:border-white/15 hover:bg-slate-900/5 dark:hover:bg-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-72 rounded-2xl surface-alt animate-pulse" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((c) => (
            <CourseCard key={c._id} course={c} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 card-surface rounded-2xl border-dashed">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-medium">No courses match those filters</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Try a different semester, category, or keyword.</p>
        </div>
      )}
    </div>
  );
}

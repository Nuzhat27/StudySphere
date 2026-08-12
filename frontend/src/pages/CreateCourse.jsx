import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function CreateCourse() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', category: '', semester: 1 });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/courses', form);
      navigate(`/courses/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-6 py-12">
      <h1 className="font-display text-3xl font-bold">Create a course</h1>
      <p className="text-slate-500 dark:text-slate-400 mt-1.5">
        New courses go to an admin for approval before appearing in the catalog. You can add lessons after creating it.
      </p>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg px-3 py-2 mt-4">
          {error}
        </p>
      )}

      <form onSubmit={submit} className="card-surface rounded-2xl p-6 space-y-4 mt-6">
        <div>
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 block">Course title</label>
          <input
            placeholder="e.g. Data Structures & Algorithms"
            className="input-field"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 block">Description</label>
          <textarea
            placeholder="What will students learn in this course?"
            className="input-field"
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 block">Category</label>
            <input
              placeholder="e.g. Computer Science"
              className="input-field"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 block">Semester</label>
            <select
              className="input-field"
              value={form.semester}
              onChange={(e) => setForm({ ...form, semester: Number(e.target.value) })}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <option key={s} value={s}>Semester {s}</option>
              ))}
            </select>
          </div>
        </div>

        <p className="text-xs text-slate-400 dark:text-slate-500">
          All courses on StudySphere are free for enrolled university students.
        </p>

        <button disabled={loading} className="btn-primary w-full">
          {loading ? 'Creating…' : 'Create course'}
        </button>
      </form>
    </div>
  );
}

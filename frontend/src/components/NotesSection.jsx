import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function NotesSection({ courseId, type }) {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ chapter: '', title: '', content: '' });
  const [file, setFile] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    const { data } = await api.get(`/notes/${courseId}`, { params: { type } });
    setNotes(data);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, type]);

  const create = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = new FormData();
      payload.append('chapter', form.chapter);
      payload.append('title', form.title);
      payload.append('content', form.content);
      payload.append('type', type);
      if (file) payload.append('file', file);
      await api.post(`/notes/${courseId}`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setForm({ chapter: '', title: '', content: '' });
      setFile(null);
      setShowForm(false);
      load();
    } finally {
      setSubmitting(false);
    }
  };

  // Group by chapter for a clean chapter-wise layout
  const grouped = notes.reduce((acc, n) => {
    acc[n.chapter] = acc[n.chapter] || [];
    acc[n.chapter].push(n);
    return acc;
  }, {});

  const noun = type === 'pyq' ? 'PYQ' : 'note';

  return (
    <div>
      {(user?.role === 'educator' || user?.role === 'admin') && (
        <div className="mb-6">
          <button onClick={() => setShowForm((s) => !s)} className="btn-primary !py-2">
            {showForm ? 'Cancel' : `+ Add ${noun}`}
          </button>
          {showForm && (
            <form onSubmit={create} className="mt-4 space-y-3 card-surface rounded-xl p-5">
              <input
                required
                placeholder="Chapter (e.g. Chapter 3: Trees)"
                className="input-field"
                value={form.chapter}
                onChange={(e) => setForm({ ...form, chapter: e.target.value })}
              />
              <input
                required
                placeholder="Title"
                className="input-field"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <textarea
                placeholder="Content (optional if you're attaching a file)"
                rows={3}
                className="input-field"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
              />
              <div>
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 block">
                  Attach PDF / Word (optional)
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="text-sm w-full file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-brand-100 dark:file:bg-brand-500/20 file:text-brand-700 dark:file:text-brand-300 file:text-xs file:font-semibold"
                />
              </div>
              <button disabled={submitting} className="btn-primary !py-2">
                {submitting ? 'Publishing…' : 'Publish'}
              </button>
            </form>
          )}
        </div>
      )}

      <div className="space-y-6">
        {Object.entries(grouped).map(([chapter, items]) => (
          <div key={chapter}>
            <h4 className="font-display font-semibold text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
              {chapter}
            </h4>
            <div className="space-y-2">
              {items.map((n) => (
                <div key={n._id} className="rounded-xl card-surface p-4">
                  <p className="font-medium text-sm">{n.title}</p>
                  {n.content && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 whitespace-pre-wrap">{n.content}</p>}
                  {n.fileUrl && (
                    <a href={n.fileUrl} target="_blank" rel="noreferrer" className="text-xs text-brand-500 underline mt-2 inline-flex items-center gap-1 font-medium">
                      📎 Download file
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        {notes.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-8">
            No {type === 'pyq' ? 'previous year questions' : 'notes'} added for this course yet.
          </p>
        )}
      </div>
    </div>
  );
}

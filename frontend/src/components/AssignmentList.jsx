import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

function daysUntil(dateStr) {
  const diff = new Date(dateStr) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function AssignmentList({ courseId }) {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', dueDate: '' });
  const [file, setFile] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submissionFiles, setSubmissionFiles] = useState({});

  const load = async () => {
    const { data } = await api.get(`/assignments/${courseId}`);
    setAssignments(data);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const create = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = new FormData();
      payload.append('title', form.title);
      payload.append('description', form.description);
      payload.append('dueDate', form.dueDate);
      if (file) payload.append('attachment', file);
      await api.post(`/assignments/${courseId}`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setForm({ title: '', description: '', dueDate: '' });
      setFile(null);
      setShowForm(false);
      load();
    } finally {
      setSubmitting(false);
    }
  };

  const submit = async (assignmentId) => {
    const payload = new FormData();
    const f = submissionFiles[assignmentId];
    if (f) payload.append('submission', f);
    await api.post(`/assignments/${assignmentId}/submit`, payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    load();
  };

  const hasSubmitted = (a) => a.submissions?.some((s) => String(s.student) === String(user?._id));

  return (
    <div>
      {(user?.role === 'educator' || user?.role === 'admin') && (
        <div className="mb-6">
          <button onClick={() => setShowForm((s) => !s)} className="btn-primary !py-2">
            {showForm ? 'Cancel' : '+ New assignment'}
          </button>
          {showForm && (
            <form onSubmit={create} className="mt-4 space-y-3 card-surface rounded-xl p-5">
              <input
                required
                placeholder="Title"
                className="input-field"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <textarea
                placeholder="Description"
                className="input-field"
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 block">Due date</label>
                  <input
                    required
                    type="date"
                    className="input-field"
                    value={form.dueDate}
                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 block">
                    Attachment (PDF / Word, optional)
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="text-sm w-full file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-brand-100 dark:file:bg-brand-500/20 file:text-brand-700 dark:file:text-brand-300 file:text-xs file:font-semibold"
                  />
                </div>
              </div>
              <button disabled={submitting} className="btn-primary !py-2">
                {submitting ? 'Publishing…' : 'Publish assignment'}
              </button>
            </form>
          )}
        </div>
      )}

      <div className="space-y-3">
        {assignments.map((a) => {
          const days = daysUntil(a.dueDate);
          const submitted = hasSubmitted(a);
          return (
            <div key={a._id} className="rounded-xl card-surface p-4 sm:p-5">
              <div className="flex justify-between items-start gap-3">
                <div>
                  <p className="font-medium text-sm">{a.title}</p>
                  {a.description && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{a.description}</p>}
                </div>
                <span
                  className={`shrink-0 badge normal-case ${
                    days < 0
                      ? 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400'
                      : days <= 2
                      ? 'bg-spark-300 text-slate-900 dark:bg-spark-400/15 dark:text-spark-400'
                      : 'bg-slate-900/5 text-slate-600 dark:bg-white/10 dark:text-slate-300'
                  }`}
                >
                  {days < 0 ? 'Past due' : days === 0 ? 'Due today' : `Due in ${days}d`}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-2">Due {new Date(a.dueDate).toLocaleDateString()}</p>

              {a.attachmentUrl && (
                <a href={a.attachmentUrl} target="_blank" rel="noreferrer" className="text-xs text-brand-500 underline mt-2 inline-block font-medium">
                  Download assignment file →
                </a>
              )}

              {user?.role === 'student' && (
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  {!submitted && (
                    <input
                      type="file"
                      onChange={(e) =>
                        setSubmissionFiles((prev) => ({ ...prev, [a._id]: e.target.files?.[0] || null }))
                      }
                      className="text-xs file:mr-2 file:py-1.5 file:px-2.5 file:rounded-lg file:border-0 file:bg-slate-900/5 dark:file:bg-white/10 file:text-xs file:font-semibold"
                    />
                  )}
                  <button
                    onClick={() => submit(a._id)}
                    disabled={submitted}
                    className={`text-xs px-3 py-1.5 rounded-full font-semibold ${
                      submitted
                        ? 'bg-ok-100 text-ok-600 dark:bg-emerald-500/15 dark:text-emerald-400 cursor-default'
                        : 'bg-brand-500 text-white hover:bg-brand-600'
                    }`}
                  >
                    {submitted ? 'Submitted ✓' : 'Submit'}
                  </button>
                </div>
              )}
            </div>
          );
        })}
        {assignments.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-8">No assignments posted for this course yet.</p>
        )}
      </div>
    </div>
  );
}

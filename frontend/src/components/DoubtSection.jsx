import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function DoubtSection({ courseId }) {
  const { user } = useAuth();
  const [doubts, setDoubts] = useState([]);
  const [question, setQuestion] = useState('');
  const [replyText, setReplyText] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const load = async () => {
    const { data } = await api.get(`/doubts/${courseId}`);
    setDoubts(data);
  };

  useEffect(() => {
    load();
  }, [courseId]);

  const ask = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    await api.post(`/doubts/${courseId}`, { question });
    setQuestion('');
    load();
  };

  const reply = async (doubtId) => {
    const text = replyText[doubtId];
    if (!text?.trim()) return;
    await api.post(`/doubts/${doubtId}/answer`, { text });
    setReplyText((prev) => ({ ...prev, [doubtId]: '' }));
    load();
  };

  const toggleResolved = async (doubtId) => {
    await api.put(`/doubts/${doubtId}/resolve`);
    load();
  };

  const startEdit = (d) => {
    setEditingId(d._id);
    setEditText(d.question);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const saveEdit = async (doubtId) => {
    if (!editText.trim()) return;
    await api.put(`/doubts/${doubtId}`, { question: editText });
    cancelEdit();
    load();
  };

  const remove = async (doubtId) => {
    if (!window.confirm('Delete this doubt? This can\'t be undone.')) return;
    await api.delete(`/doubts/${doubtId}`);
    load();
  };

  return (
    <div>
      {user?.role === 'student' && (
        <form onSubmit={ask} className="flex gap-2 mb-6">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a doubt about this course…"
            className="input-field flex-1 !rounded-full"
          />
          <button className="btn-primary shrink-0">Ask</button>
        </form>
      )}
      {user?.role !== 'student' && (
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          {user ? 'Reply below to help students who post a doubt here.' : 'Log in as a student to ask a doubt.'}
        </p>
      )}

      <div className="space-y-4">
        {doubts.map((d) => {
          const isOwner = String(d.student?._id) === String(user?._id);
          const isStaff = user?.role === 'educator' || user?.role === 'admin';
          const isEditing = editingId === d._id;

          return (
            <div key={d._id} className="rounded-xl card-surface p-4">
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1">
                  {isEditing ? (
                    <div className="flex gap-2">
                      <input
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="input-field flex-1 !py-1.5 text-sm"
                        autoFocus
                      />
                      <button onClick={() => saveEdit(d._id)} className="text-xs px-3 py-1.5 rounded-lg bg-brand-500 text-white font-semibold hover:bg-brand-600 transition-colors shrink-0">
                        Save
                      </button>
                      <button onClick={cancelEdit} className="text-xs px-3 py-1.5 rounded-lg border border-slate-900/10 dark:border-white/15 font-semibold hover:bg-slate-900/5 dark:hover:bg-white/5 transition-colors shrink-0">
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm font-medium">{d.question}</p>
                  )}
                  <p className="text-xs text-slate-400 mt-1">
                    Asked by {d.student?.name} · {new Date(d.createdAt).toLocaleDateString()}
                    {d.updatedAt && d.updatedAt !== d.createdAt && ' · edited'}
                  </p>
                </div>
                <span
                  className={`shrink-0 badge normal-case ${
                    d.resolved
                      ? 'bg-ok-100 text-ok-600 dark:bg-emerald-500/15 dark:text-emerald-400'
                      : 'bg-spark-300 text-slate-900 dark:bg-spark-400/15 dark:text-spark-400'
                  }`}
                >
                  {d.resolved ? 'Resolved' : 'Open'}
                </span>
              </div>

              {d.answers?.length > 0 && (
                <div className="mt-3 pl-4 border-l-2 border-brand-500/30 space-y-2">
                  {d.answers.map((a, i) => (
                    <div key={i} className="text-sm">
                      <span className="font-medium">{a.author?.name}</span>{' '}
                      <span className="text-xs text-slate-400">({a.author?.role})</span>
                      <p className="text-slate-600 dark:text-slate-300">{a.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {(isStaff || isOwner) && !isEditing && (
                <div className="flex flex-wrap gap-2 mt-3">
                  <input
                    value={replyText[d._id] || ''}
                    onChange={(e) => setReplyText((prev) => ({ ...prev, [d._id]: e.target.value }))}
                    placeholder="Write a reply…"
                    className="input-field flex-1 !py-1.5 text-sm min-w-[140px]"
                  />
                  <button onClick={() => reply(d._id)} className="text-xs px-3 py-1.5 rounded-lg bg-brand-500 text-white font-semibold hover:bg-brand-600 transition-colors">
                    Reply
                  </button>
                  <button onClick={() => toggleResolved(d._id)} className="text-xs px-3 py-1.5 rounded-lg border border-slate-900/10 dark:border-white/15 font-semibold hover:bg-slate-900/5 dark:hover:bg-white/5 transition-colors">
                    Mark {d.resolved ? 'unresolved' : 'resolved'}
                  </button>
                  {isOwner && (
                    <>
                      <button onClick={() => startEdit(d)} className="text-xs px-3 py-1.5 rounded-lg border border-slate-900/10 dark:border-white/15 font-semibold hover:bg-slate-900/5 dark:hover:bg-white/5 transition-colors">
                        Edit
                      </button>
                      <button onClick={() => remove(d._id)} className="text-xs px-3 py-1.5 rounded-lg border border-red-500/30 text-red-600 dark:text-red-400 font-semibold hover:bg-red-500/10 transition-colors">
                        Delete
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {doubts.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-8">No doubts raised yet — be the first to ask.</p>
        )}
      </div>
    </div>
  );
}

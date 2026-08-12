import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function CommentSection({ courseId, lessonId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');

  const loadComments = async () => {
    const { data } = await api.get(`/comments/${courseId}/${lessonId}`);
    setComments(data);
  };

  useEffect(() => {
    loadComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, lessonId]);

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    await api.post(`/comments/${courseId}/${lessonId}`, { text });
    setText('');
    loadComments();
  };

  return (
    <div>
      <h4 className="font-display font-semibold mb-3">Discussion</h4>
      <form onSubmit={submit} className="flex gap-2 mb-4">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ask a question or share a thought…"
          className="input-field flex-1 !rounded-full"
        />
        <button className="btn-primary shrink-0 !py-2">Post</button>
      </form>
      <div className="space-y-3">
        {comments.map((c) => (
          <div key={c._id} className="surface-alt rounded-xl p-3.5">
            <div className="text-sm font-medium">
              {c.author?.name} <span className="text-xs text-slate-400 capitalize">({c.author?.role})</span>
            </div>
            <p className="text-sm mt-1 text-slate-600 dark:text-slate-300">{c.text}</p>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-sm text-slate-400">No comments yet — start the discussion.</p>
        )}
      </div>
    </div>
  );
}

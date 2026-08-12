import { useEffect, useState } from 'react';
import api from '../api/axios';

function StatBlock({ label, value }) {
  return (
    <div className="card-surface rounded-2xl p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-1.5">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}

export default function AdminPanel() {
  const [stats, setStats] = useState(null);
  const [pending, setPending] = useState([]);
  const [users, setUsers] = useState([]);

  const load = async () => {
    const [s, p, u] = await Promise.all([
      api.get('/admin/stats'),
      api.get('/admin/courses/pending'),
      api.get('/admin/users'),
    ]);
    setStats(s.data);
    setPending(p.data);
    setUsers(u.data);
  };

  useEffect(() => {
    load();
  }, []);

  const review = async (id, decision) => {
    await api.put(`/admin/courses/${id}/review`, { decision });
    load();
  };

  const toggleActive = async (id) => {
    await api.put(`/admin/users/${id}/toggle-active`);
    load();
  };

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-6 py-10 space-y-10">
      <div>
        <h1 className="font-display text-3xl font-bold">Admin panel</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1.5">Review new courses and manage accounts.</p>
      </div>

      {stats && (
        <div className="grid sm:grid-cols-3 gap-4">
          <StatBlock label="Total enrollments" value={stats.totalEnrollments} />
          <StatBlock label="Users" value={stats.usersByRole.map((r) => `${r._id}: ${r.count}`).join(' · ')} />
          <StatBlock label="Courses" value={stats.coursesByStatus.map((r) => `${r._id}: ${r.count}`).join(' · ')} />
        </div>
      )}

      <div>
        <h2 className="font-display font-semibold text-lg mb-4">Pending course approvals</h2>
        <div className="space-y-3">
          {pending.map((c) => (
            <div key={c._id} className="card-surface rounded-xl p-4 flex flex-wrap justify-between items-center gap-3">
              <div>
                <p className="font-medium text-sm">{c.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">by {c.educator?.name} · Semester {c.semester}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => review(c._id, 'approved')} className="px-3.5 py-1.5 rounded-full bg-ok-500 hover:bg-ok-600 text-white text-xs font-semibold transition-colors">
                  Approve
                </button>
                <button onClick={() => review(c._id, 'rejected')} className="px-3.5 py-1.5 rounded-full bg-red-500 hover:bg-red-600 text-white text-xs font-semibold transition-colors">
                  Reject
                </button>
              </div>
            </div>
          ))}
          {pending.length === 0 && <p className="text-slate-400 text-sm">Nothing pending review.</p>}
        </div>
      </div>

      <div>
        <h2 className="font-display font-semibold text-lg mb-4">Users</h2>
        <div className="space-y-3">
          {users.map((u) => (
            <div key={u._id} className="card-surface rounded-xl p-4 flex flex-wrap justify-between items-center gap-3">
              <div>
                <p className="font-medium text-sm">
                  {u.name} <span className="text-xs text-slate-400 capitalize">({u.role})</span>
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{u.email}{u.registrationNumber ? ` · ${u.registrationNumber}` : ''}</p>
              </div>
              <button onClick={() => toggleActive(u._id)} className="btn-secondary !px-3.5 !py-1.5 text-xs">
                {u.isActive ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

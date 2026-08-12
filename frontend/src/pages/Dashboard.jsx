import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import ProgressBar from '../components/ProgressBar';
import { Link } from 'react-router-dom';

function StatCard({ label, value, accent }) {
  return (
    <div className="rounded-2xl card-surface p-5">
      <p className={`font-display text-2xl font-bold ${accent || ''}`}>{value}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{label}</p>
    </div>
  );
}

function WelcomeBanner({ user }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 text-white p-6 sm:p-8 mb-8">
      <div className="absolute inset-0 bg-graph opacity-15" aria-hidden="true" />
      <div className="absolute -top-16 -right-10 w-64 h-64 rounded-full bg-spark-400/25 blur-3xl" aria-hidden="true" />
      <div className="relative flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold">Welcome back, {user?.name?.split(' ')[0]}</h1>
          <p className="text-white/75 mt-1.5 text-sm">
            {user?.role === 'student' && user?.registrationNumber ? `Reg. no. ${user.registrationNumber} · ` : ''}
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        {user?.role === 'educator' && (
          <Link to="/create-course" className="px-5 py-2.5 rounded-full bg-white text-brand-700 text-sm font-semibold hover:bg-white/90 transition-colors">
            + New course
          </Link>
        )}
      </div>
    </div>
  );
}

function StudentDashboard({ user }) {
  const [enrollments, setEnrollments] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/enrollments/my').then((res) => setEnrollments(res.data));
    api.get('/enrollments/my-stats').then((res) => setStats(res.data));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-6 py-10">
      <WelcomeBanner user={user} />

      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          <StatCard label="Courses enrolled" value={stats.totalCourses} />
          <StatCard label="Avg. progress" value={`${stats.avgProgress}%`} accent="text-brand-500" />
          <StatCard label="Courses completed" value={stats.completedCourses} accent="text-ok-500" />
          <StatCard label="Quizzes passed" value={`${stats.quizzesPassed}/${stats.quizzesAttempted}`} />
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="font-display font-semibold text-lg mb-4">My courses</h2>
          <div className="space-y-4">
            {enrollments.map((e) => (
              <Link
                key={e._id}
                to={`/courses/${e.course?._id}`}
                className="block card-surface rounded-xl p-4 hover:shadow-cardhover transition-shadow"
              >
                <p className="font-medium">{e.course?.title}</p>
                <div className="mt-2.5">
                  <ProgressBar percent={e.progressPercent} />
                  <p className="text-xs text-slate-400 mt-1">{e.progressPercent}% complete · {e.status}</p>
                </div>
              </Link>
            ))}
            {enrollments.length === 0 && (
              <div className="text-center py-16 card-surface rounded-2xl border-dashed">
                <p className="text-3xl mb-2">🎓</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">You haven't enrolled in any courses yet.</p>
                <Link to="/courses" className="text-sm text-brand-500 font-semibold mt-2 inline-block">Browse courses →</Link>
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="font-display font-semibold text-lg mb-4">Upcoming assignments</h2>
          <div className="space-y-3">
            {stats?.upcomingAssignments?.map((a) => (
              <div key={a._id} className="card-surface rounded-xl p-4">
                <p className="text-sm font-medium">{a.title}</p>
                <p className="text-xs text-slate-400 mt-1">{a.course?.title}</p>
                <p className="text-xs text-spark-500 font-semibold mt-1">Due {new Date(a.dueDate).toLocaleDateString()}</p>
              </div>
            ))}
            {(!stats?.upcomingAssignments || stats.upcomingAssignments.length === 0) && (
              <div className="card-surface rounded-xl p-4">
                <p className="text-sm text-slate-400">No upcoming assignments.</p>
              </div>
            )}
          </div>

          {stats?.myOpenDoubts > 0 && (
            <div className="mt-4 rounded-xl p-4 bg-spark-300/40 dark:bg-spark-400/10 border border-spark-400/30">
              <p className="text-sm font-medium">You have {stats.myOpenDoubts} open doubt{stats.myOpenDoubts > 1 ? 's' : ''}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Check back on your course pages for replies.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EducatorDashboard({ user }) {
  const [myCourses, setMyCourses] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/courses').then((res) =>
      setMyCourses(res.data.filter((c) => c.educator?._id === user._id))
    );
    api.get('/enrollments/educator-stats').then((res) => setStats(res.data));
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-6 py-10">
      <WelcomeBanner user={user} />

      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          <StatCard label="Total students" value={stats.totalStudents} accent="text-brand-500" />
          <StatCard label="Courses live" value={stats.approvedCourses} accent="text-ok-500" />
          <StatCard label="Pending review" value={stats.pendingCourses} />
          <StatCard label="Open doubts" value={stats.openDoubts} accent="text-spark-500" />
        </div>
      )}

      <h2 className="font-display font-semibold text-lg mb-4">My courses</h2>
      <div className="grid sm:grid-cols-2 gap-3">
        {myCourses.map((c) => (
          <Link
            key={c._id}
            to={`/courses/${c._id}`}
            className="flex justify-between items-center card-surface rounded-xl p-4 hover:shadow-cardhover transition-shadow"
          >
            <div>
              <p className="font-medium">{c.title}</p>
              <p className="text-xs text-slate-400 mt-0.5">
                <span className="capitalize">{c.status}</span> · Semester {c.semester}
              </p>
            </div>
            <span className="text-sm text-brand-500 font-semibold">View →</span>
          </Link>
        ))}
        {myCourses.length === 0 && (
          <div className="card-surface rounded-2xl p-8 text-center sm:col-span-2">
            <p className="text-slate-400 text-sm">You haven't created any courses yet.</p>
            <Link to="/create-course" className="text-sm text-brand-500 font-semibold mt-2 inline-block">Create your first course →</Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();

  if (user?.role === 'student') return <StudentDashboard user={user} />;
  if (user?.role === 'educator') return <EducatorDashboard user={user} />;

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-6 py-10">
      <WelcomeBanner user={user} />
      <p className="text-slate-500 dark:text-slate-400">Use the Admin panel to manage users and review courses.</p>
    </div>
  );
}

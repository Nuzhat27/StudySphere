import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import CommentSection from '../components/CommentSection';
import QuizPlayer from '../components/QuizPlayer';
import DoubtSection from '../components/DoubtSection';
import AssignmentList from '../components/AssignmentList';
import NotesSection from '../components/NotesSection';

const TABS = [
  { key: 'Lessons', icon: '▶' },
  { key: 'Doubts', icon: '💬' },
  { key: 'Assignments', icon: '📝' },
  { key: 'Notes', icon: '📓' },
  { key: 'PYQs', icon: '🗂' },
];

export default function CourseDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [tab, setTab] = useState('Lessons');

  const load = async () => {
    const { data } = await api.get(`/courses/${id}`);
    setCourse(data);
    if (data.lessons?.length) setActiveLesson(data.lessons[0]);
  };

  const checkEnrollment = async () => {
    if (user?.role !== 'student') return;
    const { data } = await api.get('/enrollments/my');
    setEnrolled(data.some((e) => e.course?._id === id));
  };

  useEffect(() => {
    load();
    checkEnrollment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user]);

  const enroll = async () => {
    if (enrolled || enrolling) return;
    setEnrolling(true);
    try {
      await api.post(`/courses/${id}/enroll`);
      setEnrolled(true);
    } catch (err) {
      if (err.response?.status === 400) setEnrolled(true); // already enrolled
    } finally {
      setEnrolling(false);
    }
  };

  const markComplete = async () => {
    await api.put(`/enrollments/${id}/lessons/${activeLesson._id}/complete`);
  };

  if (!course) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="h-48 rounded-2xl surface-alt animate-pulse mb-6" />
        <div className="h-8 w-2/3 rounded-lg surface-alt animate-pulse" />
      </div>
    );
  }

  return (
    <div>
      {/* Header banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 text-white">
        <div className="absolute inset-0 bg-graph opacity-15" aria-hidden="true" />
        <div className="absolute -top-20 -right-10 w-72 h-72 rounded-full bg-spark-400/25 blur-3xl" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 pt-10 pb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="badge bg-white/15 border border-white/25">{course.category}</span>
            {course.semester && <span className="badge bg-spark-400 text-slate-900 dark:bg-spark-400/20 dark:text-spark-300 dark:border dark:border-spark-400/30">Semester {course.semester}</span>}
            <span className="badge bg-ok-100 text-ok-600">Free</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold leading-tight max-w-3xl">{course.title}</h1>
          <p className="text-white/80 mt-3 max-w-2xl leading-relaxed">{course.description}</p>

          <div className="flex flex-wrap items-center gap-4 mt-6">
            {user?.role === 'student' && (
              <button
                onClick={enroll}
                disabled={enrolled || enrolling}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-colors ${
                  enrolled
                    ? 'bg-white/20 text-white cursor-default'
                    : 'bg-white text-brand-700 hover:bg-white/90'
                }`}
              >
                {enrolled ? 'Already enrolled ✓' : enrolling ? 'Enrolling…' : 'Enroll in this course'}
              </button>
            )}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white/15 border border-white/25 flex items-center justify-center text-sm font-bold">
                {course.educator?.name?.[0]?.toUpperCase() || 'P'}
              </div>
              <div className="leading-tight">
                <p className="text-sm font-semibold">{course.educator?.name || 'Faculty'}</p>
                <p className="text-xs text-white/70">Course instructor</p>
              </div>
            </div>
            <div className="text-sm text-white/80">{course.lessons?.length || 0} lessons</div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 py-8">
        {/* Segmented tab control */}
        <div className="flex gap-1 p-1 rounded-full card-surface w-full overflow-x-auto no-scrollbar mb-8">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium whitespace-nowrap rounded-full transition-colors ${
                tab === t.key
                  ? 'bg-brand-500 text-white shadow-[0_4px_10px_-3px_rgba(93,95,239,0.6)]'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-900/5 dark:hover:bg-white/5'
              }`}
            >
              <span aria-hidden="true">{t.icon}</span>
              {t.key}
            </button>
          ))}
        </div>

        {tab === 'Lessons' && (
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,320px)_1fr] gap-6">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-1 px-1">
                Course content
              </p>
              {course.lessons?.map((l, i) => (
                <button
                  key={l._id}
                  onClick={() => setActiveLesson(l)}
                  className={`w-full flex items-center gap-3 text-left px-4 py-3 rounded-xl text-sm border transition-colors ${
                    activeLesson?._id === l._id
                      ? 'bg-brand-500 text-white border-brand-500'
                      : 'card-surface hover:bg-slate-900/[0.03] dark:hover:bg-white/5'
                  }`}
                >
                  <span
                    className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                      activeLesson?._id === l._id ? 'bg-white/20' : 'bg-brand-100 dark:bg-brand-500/20 text-brand-700 dark:text-brand-300'
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="line-clamp-2">{l.title}</span>
                </button>
              ))}
              {(!course.lessons || course.lessons.length === 0) && (
                <p className="text-sm text-slate-400 px-1">No lessons added yet.</p>
              )}

              <div className="card-surface rounded-xl p-4 mt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-2">About the instructor</p>
                <p className="text-sm font-semibold">{course.educator?.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{course.educator?.email}</p>
              </div>
            </div>

            <div className="card-surface rounded-2xl p-6">
              {activeLesson ? (
                <>
                  <h3 className="font-display font-semibold text-lg mb-3">{activeLesson.title}</h3>
                  {activeLesson.contentType === 'video' && activeLesson.contentUrl && (
                    <video controls className="w-full rounded-xl" src={activeLesson.contentUrl} />
                  )}
                  {activeLesson.contentType === 'image' && activeLesson.contentUrl && (
                    <img src={activeLesson.contentUrl} alt={activeLesson.title} className="w-full rounded-xl" />
                  )}
                  {activeLesson.contentType === 'pdf' && activeLesson.contentUrl && (
                    <a href={activeLesson.contentUrl} target="_blank" rel="noreferrer" className="text-brand-500 underline font-medium">
                      View PDF →
                    </a>
                  )}
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">{activeLesson.description}</p>

                  {user?.role === 'student' && (
                    <button onClick={markComplete} className="btn-secondary mt-4">
                      Mark lesson complete
                    </button>
                  )}

                  {activeLesson.quiz && <QuizPlayer quizId={activeLesson.quiz} courseId={course._id} />}
                  <div className="mt-6 pt-6 border-t border-slate-900/[0.06] dark:border-white/10">
                    <CommentSection courseId={course._id} lessonId={activeLesson._id} />
                  </div>
                </>
              ) : (
                <p className="text-sm text-slate-400 text-center py-12">Select a lesson to get started.</p>
              )}
            </div>
          </div>
        )}

        {tab === 'Doubts' && <DoubtSection courseId={course._id} />}
        {tab === 'Assignments' && <AssignmentList courseId={course._id} />}
        {tab === 'Notes' && <NotesSection courseId={course._id} type="notes" />}
        {tab === 'PYQs' && <NotesSection courseId={course._id} type="pyq" />}
      </div>
    </div>
  );
}

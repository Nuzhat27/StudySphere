import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function QuizPlayer({ quizId, courseId }) {
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  useEffect(() => {
    api.get(`/quizzes/${quizId}`).then((res) => setQuiz(res.data));
  }, [quizId]);

  const selectAnswer = (questionId, index) => {
    setAnswers((prev) => ({ ...prev, [questionId]: index }));
  };

  const submit = async () => {
    const payload = {
      courseId,
      answers: Object.entries(answers).map(([questionId, selectedIndex]) => ({
        questionId,
        selectedIndex,
      })),
    };
    const { data } = await api.post(`/quizzes/${quizId}/submit`, payload);
    setResult(data);
  };

  if (!quiz) return <p className="text-sm text-slate-400 mt-4">Loading quiz…</p>;

  return (
    <div className="surface-alt rounded-xl p-5 mt-5">
      <h4 className="font-display font-semibold mb-3">{quiz.title}</h4>
      {quiz.questions.map((q, i) => (
        <div key={q._id} className="mb-4">
          <p className="text-sm font-medium mb-2">{i + 1}. {q.questionText}</p>
          <div className="space-y-1.5">
            {q.options.map((opt, idx) => (
              <label key={idx} className="flex items-center gap-2.5 text-sm cursor-pointer">
                <input
                  type="radio"
                  name={q._id}
                  checked={answers[q._id] === idx}
                  onChange={() => selectAnswer(q._id, idx)}
                  className="accent-brand-500"
                />
                {opt}
              </label>
            ))}
          </div>
        </div>
      ))}
      <button onClick={submit} className="btn-primary !py-2">
        Submit quiz
      </button>
      {result && (
        <div
          className={`mt-3 p-3 rounded-lg text-sm font-medium ${
            result.passed
              ? 'bg-ok-100 text-ok-600 dark:bg-emerald-900/40 dark:text-emerald-300'
              : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
          }`}
        >
          Score: {result.score}/{result.totalMarks} ({result.percent}%) — {result.passed ? 'Passed ✅' : 'Not passed ❌'}
        </div>
      )}
    </div>
  );
}

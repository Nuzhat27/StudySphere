import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student', registrationNumber: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.role, form.registrationNumber);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h1 className="font-display text-2xl font-bold">Create your account</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">It only takes a minute.</p>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg px-3 py-2 mt-4">
          {error}
        </p>
      )}

      <form onSubmit={submit} className="space-y-3.5 mt-6">
        <div>
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 block">Full name</label>
          <input
            placeholder="Ananya Roy"
            className="input-field"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 block">I am a</label>
          <div className="grid grid-cols-2 gap-2">
            {['student', 'educator'].map((r) => (
              <button
                type="button"
                key={r}
                onClick={() => setForm({ ...form, role: r })}
                className={`py-2.5 rounded-xl text-sm font-medium border capitalize transition-colors ${
                  form.role === r
                    ? 'bg-brand-500 text-white border-brand-500'
                    : 'border-slate-900/10 dark:border-white/10 hover:bg-slate-900/5 dark:hover:bg-white/5'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {form.role === 'student' && (
          <div>
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 block">Registration number</label>
            <input
              placeholder="e.g. IGIT21CS045"
              className="input-field"
              value={form.registrationNumber}
              onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })}
              required
            />
          </div>
        )}

        <div>
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 block">Email</label>
          <input
            type="email"
            placeholder="you@university.edu"
            className="input-field"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 block">Password</label>
          <input
            type="password"
            placeholder="At least 6 characters"
            className="input-field"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            minLength={6}
          />
        </div>

        <button disabled={loading} className="btn-primary w-full mt-2">
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="text-sm mt-6 text-slate-600 dark:text-slate-400">
        Have an account?{' '}
        <Link to="/login" className="text-brand-500 font-semibold hover:text-brand-600">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}

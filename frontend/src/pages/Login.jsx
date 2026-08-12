import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h1 className="font-display text-2xl font-bold">Welcome back</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">Log in with your university email to continue.</p>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg px-3 py-2 mt-4">
          {error}
        </p>
      )}

      <form onSubmit={submit} className="space-y-3.5 mt-6">
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
            placeholder="••••••••"
            className="input-field"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>
        <button disabled={loading} className="btn-primary w-full mt-2">
          {loading ? 'Logging in…' : 'Log in'}
        </button>
      </form>

      <p className="text-sm mt-6 text-slate-600 dark:text-slate-400">
        No account?{' '}
        <Link to="/register" className="text-brand-500 font-semibold hover:text-brand-600">
          Register
        </Link>
      </p>
    </AuthLayout>
  );
}

import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const linkClass = ({ isActive }) =>
  `relative py-1.5 transition-colors hover:text-brand-500 dark:hover:text-brand-400 ${
    isActive ? 'text-slate-900 dark:text-white after:absolute after:-bottom-[15px] after:left-0 after:right-0 after:h-[2px] after:bg-brand-500 after:rounded-full' : 'text-slate-600 dark:text-slate-300'
  }`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const doLogout = () => {
    logout();
    setOpen(false);
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-paper/80 dark:bg-ink/80 border-b border-slate-900/[0.06] dark:border-white/10">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-5 sm:px-6 h-16">
        <Link to="/" className="flex items-center gap-2.5 font-display font-bold text-lg tracking-tight shrink-0" onClick={() => setOpen(false)}>
          <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center text-sm shadow-[0_4px_12px_-2px_rgba(93,95,239,0.6)]">S</span>
          <span>StudySphere</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <NavLink to="/courses" className={linkClass}>Courses</NavLink>
          {user && <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>}
          {(user?.role === 'educator' || user?.role === 'admin') && (
            <NavLink to="/create-course" className={linkClass}>New course</NavLink>
          )}
          {user?.role === 'admin' && <NavLink to="/admin" className={linkClass}>Admin</NavLink>}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          {user ? (
            <div className="flex items-center gap-3 pl-3 border-l border-slate-900/10 dark:border-white/10">
              <div className="text-right leading-tight">
                <p className="text-sm font-semibold">{user.name?.split(' ')[0]}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 capitalize">{user.role}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-500/20 text-brand-700 dark:text-brand-300 flex items-center justify-center text-xs font-bold">
                {user.name?.[0]?.toUpperCase()}
              </div>
              <button onClick={doLogout} className="text-sm px-4 py-1.5 rounded-full border border-slate-900/15 dark:border-white/15 hover:bg-slate-900/5 dark:hover:bg-white/5 transition-colors">
                Log out
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary !py-1.5">Log in</Link>
          )}
        </div>

        <button
          onClick={() => setOpen((o) => !o)}
          className="md:hidden w-9 h-9 rounded-full border border-slate-900/10 dark:border-white/15 flex items-center justify-center"
          aria-label="Toggle menu"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-slate-900/[0.06] dark:border-white/10 bg-paper dark:bg-ink px-5 py-4 space-y-3">
          <Link to="/courses" onClick={() => setOpen(false)} className="block py-1.5 text-sm font-medium">Courses</Link>
          {user && <Link to="/dashboard" onClick={() => setOpen(false)} className="block py-1.5 text-sm font-medium">Dashboard</Link>}
          {(user?.role === 'educator' || user?.role === 'admin') && (
            <Link to="/create-course" onClick={() => setOpen(false)} className="block py-1.5 text-sm font-medium">New course</Link>
          )}
          {user?.role === 'admin' && <Link to="/admin" onClick={() => setOpen(false)} className="block py-1.5 text-sm font-medium">Admin</Link>}
          <div className="flex items-center justify-between pt-3 border-t border-slate-900/[0.06] dark:border-white/10">
            <ThemeToggle />
            {user ? (
              <button onClick={doLogout} className="text-sm px-4 py-1.5 rounded-full border border-slate-900/15 dark:border-white/15">Log out</button>
            ) : (
              <Link to="/login" onClick={() => setOpen(false)} className="btn-primary !py-1.5">Log in</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

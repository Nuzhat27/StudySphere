import { Link } from 'react-router-dom';

const links = [
  { label: 'Browse courses', to: '/courses' },
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'For educators', to: '/create-course' },
  { label: 'For admins', to: '/admin' },
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-900/[0.06] dark:border-white/10 bg-paperalt dark:bg-inkalt">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-sm shrink-0">
          <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center text-[11px]">S</span>
          StudySphere
          <span className="hidden lg:inline text-xs font-normal text-slate-400 dark:text-slate-500 border-l border-slate-900/10 dark:border-white/10 pl-3 ml-1">
            Free for every enrolled student
          </span>
        </Link>

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
          {links.map((l) => (
            <Link key={l.label} to={l.to} className="hover:text-brand-500 dark:hover:text-brand-400 transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>

        <p className="text-xs text-slate-400 dark:text-slate-500 shrink-0">
          © {new Date().getFullYear()} StudySphere
        </p>
      </div>
    </footer>
  );
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const SLIDES = [
  {
    icon: '📈',
    title: 'Track every lesson, automatically.',
    body: 'Progress bars update the moment you finish a lesson — pick up any course exactly where you left off.',
  },
  {
    icon: '💬',
    title: 'Doubts answered by your own faculty.',
    body: 'Post a question on any course and get a reply straight from the professor teaching it.',
  },
  {
    icon: '🗂',
    title: 'Notes, PYQs, and assignments — one tab away.',
    body: 'Chapter-wise notes, previous-year papers, and deadline-tracked assignments, all under the course you enrolled in.',
  },
];

const AUTOPLAY_MS = 4500;

// Shared full-bleed shell for Login/Register. Fixed to exactly one
// viewport (h-dvh) with no page-level scroll — only the form column
// scrolls internally if content ever overflows a very short screen.
export default function AuthLayout({ children }) {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), AUTOPLAY_MS);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="h-dvh w-full flex overflow-hidden bg-paper dark:bg-ink">
      {/* Slide panel — left */}
      <div className="hidden lg:flex lg:w-[46%] relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500">
        <div className="absolute inset-0 opacity-25 text-white bg-graph" aria-hidden="true" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-spark-400/30 blur-3xl" />
        <div className="absolute bottom-0 -left-16 w-80 h-80 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between p-10 xl:p-14 text-white w-full">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5 font-display font-bold text-lg">
              <span className="w-8 h-8 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center text-sm">S</span>
              StudySphere
            </Link>
            <Link to="/" className="flex items-center gap-1.5 text-xs font-medium text-white/75 hover:text-white transition-colors border border-white/20 rounded-full px-3 py-1.5">
              Back to website
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>

          {/* Rotating slide content */}
          <div className="min-h-[220px] flex flex-col justify-end">
            <div key={slide} className="animate-[fadeSlide_0.5s_ease]">
              <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-2xl mb-6">
                {SLIDES[slide].icon}
              </div>
              <h2 className="font-display text-3xl xl:text-4xl font-bold leading-tight max-w-sm">
                {SLIDES[slide].title}
              </h2>
              <p className="text-white/75 mt-4 max-w-sm leading-relaxed">{SLIDES[slide].body}</p>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSlide(i)}
                  aria-label={`Show slide ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === slide ? 'w-8 bg-white' : 'w-1.5 bg-white/35 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-white/50">Free for every enrolled student.</p>
          </div>
        </div>
      </div>

      {/* Form panel — right */}
      <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar">
        <div className="flex justify-between items-center px-6 sm:px-10 h-16 shrink-0">
          <Link to="/" className="lg:hidden flex items-center gap-2 font-display font-bold">
            <span className="w-7 h-7 rounded-lg bg-brand-500 text-white flex items-center justify-center text-xs">S</span>
            StudySphere
          </Link>
          <div className="lg:ml-auto">
            <ThemeToggle />
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 pb-10">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="glass fixed top-0 z-50 w-full border-b border-white/6">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white">
            CP
          </div>
          <span className="text-lg font-semibold text-white">CareerPilot AI</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm text-slate-400 hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="text-sm text-slate-400 hover:text-white transition-colors">How It Works</a>
          <a href="#testimonials" className="text-sm text-slate-400 hover:text-white transition-colors">Testimonials</a>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/login" className="btn-secondary py-2.5 px-5 text-sm">Sign In</Link>
          <Link to="/register" className="btn-primary py-2.5 px-5 text-sm">Get Started</Link>
        </div>

        <button className="md:hidden p-2 text-slate-400" onClick={() => setOpen(!open)}>
          {open ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {open && (
        <div className="glass-strong border-t border-white/6 px-4 py-4 md:hidden animate-fade-in">
          <div className="flex flex-col gap-3">
            <a href="#features" onClick={() => setOpen(false)} className="py-2 text-slate-300">Features</a>
            <a href="#how-it-works" onClick={() => setOpen(false)} className="py-2 text-slate-300">How It Works</a>
            <Link to="/login" className="btn-secondary text-center">Sign In</Link>
            <Link to="/register" className="btn-primary text-center">Get Started</Link>
          </div>
        </div>
      )}
    </nav>
  );
}

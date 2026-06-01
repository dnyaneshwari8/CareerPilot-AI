import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-white/6 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-bold text-white">
              CP
            </div>
            <span className="font-semibold text-white">CareerPilot AI</span>
          </div>
          <div className="flex gap-6 text-sm text-slate-500">
            <Link to="/login" className="hover:text-slate-300 transition-colors">Login</Link>
            <Link to="/register" className="hover:text-slate-300 transition-colors">Register</Link>
          </div>
          <p className="text-sm text-slate-600">
            &copy; {new Date().getFullYear()} CareerPilot AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

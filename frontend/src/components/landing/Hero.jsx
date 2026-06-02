import { Link } from 'react-router-dom';
import { FiArrowRight, FiPlay } from 'react-icons/fi';

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-violet-600/15 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <div className="animate-fade-in">
          <span className="mb-6 inline-block rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm text-indigo-300">
            AI-Powered Career Platform
          </span>
          <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Accelerate Your Career with{' '}
            <span className="gradient-text">AI</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400 sm:text-xl">
            Upload your resume, analyze your skills, and prepare for your dream job.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/register" className="btn-primary text-base px-8 py-4">
              Get Started
              <FiArrowRight />
            </Link>
            <a href="#how-it-works" className="btn-secondary text-base px-8 py-4">
              <FiPlay />
              Learn More
            </a>
          </div>
        </div>

        <div className="mt-16 mx-auto max-w-5xl animate-fade-in">
          <div className="glass gradient-border rounded-2xl p-1 shadow-2xl shadow-indigo-500/10">
            <div className="rounded-xl bg-surface-200/90 p-6 sm:p-8">
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { name: 'Resume Upload', live: true },
                  { name: 'ATS Analysis', live: true },
                  { name: 'Skill Gap', live: true },
                ].map(({ name, live }) => (
                  <div key={name} className="rounded-xl bg-white/5 p-4 text-center">
                    <div className={`mx-auto mb-2 h-2 w-2 rounded-full ${live ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                    <p className="text-sm font-medium text-slate-300">{name}</p>
                    <p className="mt-1 text-xs text-slate-500">{live ? 'Available now' : 'Coming soon'}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

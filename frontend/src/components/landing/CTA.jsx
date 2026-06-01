import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

export default function CTA() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="glass gradient-border rounded-3xl p-8 sm:p-12 text-center animate-pulse-glow">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to accelerate your career?
          </h2>
          <p className="mt-4 text-slate-400">
            Join CareerPilot AI today and take the first step toward your dream job.
          </p>
          <Link to="/register" className="btn-primary mt-8 text-base px-8 py-4">
            Get Started Free
            <FiArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}

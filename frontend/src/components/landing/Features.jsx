import { FiUpload, FiShield, FiTrendingUp, FiZap } from 'react-icons/fi';

const features = [
  {
    icon: FiUpload,
    title: 'Smart Resume Upload',
    description: 'Drag and drop your PDF resume. Secure storage with instant access anytime.',
  },
  {
    icon: FiZap,
    title: 'AI-Powered Analysis',
    description: 'Get intelligent insights on your skills, gaps, and career trajectory. (Phase 2)',
  },
  {
    icon: FiTrendingUp,
    title: 'Career Roadmap',
    description: 'Personalized learning paths tailored to your dream role. (Phase 2)',
  },
  {
    icon: FiShield,
    title: 'Secure & Private',
    description: 'JWT authentication, encrypted storage, and user-specific data access.',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Everything you need to <span className="gradient-text">succeed</span>
          </h2>
          <p className="mt-4 text-slate-400 max-w-2xl mx-auto">
            Built for students, professionals, and job seekers who want a competitive edge.
          </p>
        </div>
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, description }) => (
            <div key={title} className="card group hover:border-indigo-500/30 transition-all">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400 group-hover:bg-indigo-600/30 transition-colors">
                <Icon size={24} />
              </div>
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

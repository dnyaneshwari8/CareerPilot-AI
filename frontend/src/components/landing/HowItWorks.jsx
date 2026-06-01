const steps = [
  { step: '01', title: 'Create Account', description: 'Sign up in seconds with your email and secure password.' },
  { step: '02', title: 'Upload Resume', description: 'Drag and drop your PDF resume to our secure platform.' },
  { step: '03', title: 'Get Insights', description: 'AI analyzes your profile and suggests career improvements.' },
  { step: '04', title: 'Land Your Job', description: 'Prepare with tailored roadmaps and interview practice.' },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28 bg-surface-100/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">How It Works</h2>
          <p className="mt-4 text-slate-400">Four simple steps to accelerate your career</p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ step, title, description }) => (
            <div key={step} className="relative">
              <span className="text-5xl font-bold text-indigo-500/20">{step}</span>
              <h3 className="mt-2 text-lg font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm text-slate-400">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

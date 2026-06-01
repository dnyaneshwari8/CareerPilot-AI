const testimonials = [
  {
    quote: 'CareerPilot made organizing my resume effortless. The UI feels like a premium SaaS product.',
    author: 'Sarah Chen',
    role: 'Software Engineer Intern',
  },
  {
    quote: 'Clean dashboard, fast uploads, and professional design. Perfect for my portfolio project.',
    author: 'Marcus Johnson',
    role: 'CS Student',
  },
  {
    quote: 'I love the dark theme and smooth experience. Can\'t wait for the AI analysis features!',
    author: 'Priya Sharma',
    role: 'Data Analyst',
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Loved by job seekers</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map(({ quote, author, role }) => (
            <div key={author} className="card">
              <p className="text-slate-300 leading-relaxed">&ldquo;{quote}&rdquo;</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-semibold text-white">
                  {author.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{author}</p>
                  <p className="text-xs text-slate-500">{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function InsightList({ title, items = [], variant = 'default' }) {
  if (!items?.length) return null;

  const styles = {
    default: 'text-slate-300',
    success: 'text-emerald-300',
    warning: 'text-amber-300',
    danger: 'text-red-300',
  };

  return (
    <div className="card">
      <h3 className="text-sm font-semibold text-white mb-3">{title}</h3>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className={`flex gap-2 text-sm ${styles[variant]}`}>
            <span className="text-indigo-400 mt-0.5">•</span>
            <span>{typeof item === 'string' ? item : JSON.stringify(item)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

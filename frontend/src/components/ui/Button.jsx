import Spinner from './Spinner';

export default function Button({
  children,
  variant = 'primary',
  loading = false,
  disabled = false,
  className = '',
  type = 'button',
  ...props
}) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none';
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'bg-red-600/90 text-white hover:bg-red-500 shadow-lg shadow-red-500/20',
    ghost: 'text-slate-300 hover:bg-white/5',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  );
}

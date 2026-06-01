export default function Input({
  label,
  error,
  id,
  className = '',
  ...props
}) {
  const inputId = id || props.name;
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-300">
          {label}
        </label>
      )}
      <input id={inputId} className={`input-field ${error ? 'border-red-500/50' : ''} ${className}`} {...props} />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

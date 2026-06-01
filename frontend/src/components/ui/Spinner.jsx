export default function Spinner({ size = 'md', className = '' }) {
  const sizes = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' };
  return (
    <div
      className={`${sizes[size]} animate-spin rounded-full border-2 border-indigo-500/30 border-t-indigo-500 ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}

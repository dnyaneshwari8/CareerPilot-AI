export function Skeleton({ className = '' }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-white/5 ${className}`}
      aria-hidden="true"
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="card space-y-4">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-2/3" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
      <Skeleton className="h-24 w-24 rounded-full" />
      <div className="flex-1 space-y-3 w-full">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-4 w-40" />
      </div>
    </div>
  );
}

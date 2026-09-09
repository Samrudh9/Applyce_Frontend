import { HTMLAttributes } from 'react';

/**
 * Skeleton — shimmer placeholder for content that's still loading.
 * Use instead of raw spinners whenever possible (perceived speed principle).
 * Variants cover common-card vs. text-line shapes.
 */
type Props = HTMLAttributes<HTMLDivElement> & {
  variant?: 'text' | 'card' | 'avatar' | 'bar';
};

export function Skeleton({ variant = 'text', className = '', ...rest }: Props) {
  const base =
    'animate-pulse rounded-md bg-elevated/80 dark:bg-elevated/50';

  // Typically used in motion blocks to imply structure
  const shape =
    variant === 'card'
      ? 'h-40 rounded-xl'
      : variant === 'avatar'
        ? 'h-10 w-10 rounded-full shrink-0'
        : variant === 'bar'
          ? 'h-2 rounded-full'
          : 'h-4';

  return <div className={`${base} ${shape} ${className}`} {...rest} />;
}

/** A reusable card-sized skeleton block for list/grid placeholders. */
export function SkeletonCard({ lines = 3, className = '' }: { lines?: number; className?: string }) {
  return (
    <div className={`rounded-xl border border-line bg-surface p-6 ${className}`}>
      <div className="mb-4 flex items-center gap-3">
        <Skeleton variant="avatar" className="h-10 w-10" />
        <div className="flex-1 space-y-2">
          <Skeleton className="w-1/2" />
          <Skeleton className="w-1/3" />
        </div>
      </div>
      <div className="space-y-2.5">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton key={i} className={i === lines - 1 ? 'w-2/3' : ''} />
        ))}
      </div>
    </div>
  );
}

export default Skeleton;

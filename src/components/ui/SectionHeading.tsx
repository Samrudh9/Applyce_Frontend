import { ReactNode } from 'react';

interface Props {
  title: string;
  subtitle?: string;
  badge?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeading({ title, subtitle, badge, align = 'left', className = '' }: Props) {
  const centered = align === 'center' ? 'text-center mx-auto' : '';

  return (
    <div className={`mb-8 max-w-2xl ${centered} ${className}`}>
      {badge && <div className="mb-3">{badge}</div>}
      <h2 className="font-display text-display-md font-semibold tracking-tight text-ink">{title}</h2>
      {subtitle && <p className="mt-2 text-base text-ink-sec">{subtitle}</p>}
    </div>
  );
}

/* App-page header: title + optional description + right-aligned actions */
export function PageHeader({
  title,
  description,
  actions,
  className = '',
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between ${className}`}>
      <div>
        <h1 className="font-display text-display-md font-semibold tracking-tight text-ink">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-sm text-ink-sec">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2.5">{actions}</div>}
    </div>
  );
}
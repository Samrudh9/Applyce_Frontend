import { InputHTMLAttributes } from 'react';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
};

export function Input({ label, error, icon, className = '', ...props }: Props) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>}
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-ter">{icon}</span>}
        <input
          className={`input-glow w-full rounded-lg border bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-ter outline-none transition-all duration-150 disabled:opacity-50 ${
            icon ? 'pl-9' : ''
          } ${
            error
              ? 'border-danger focus:border-danger'
              : 'border-line hover:border-line-strong focus:border-accent'
          } ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </label>
  );
}
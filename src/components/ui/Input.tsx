import { InputHTMLAttributes } from 'react';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  icon?: React.ReactNode;
};

export function Input({ label, error, icon, className = '', ...props }: Props) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-muted">{label}</span>
      <div className="relative">
        {icon && <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">{icon}</span>}
        <input
          className={`input-glow w-full rounded-xl border bg-parchment/[0.04] px-4 py-3 text-parchment placeholder:text-stone/60 outline-none transition-all duration-300 ${icon ? 'pl-10' : ''} ${
            error ? 'border-danger/50 focus:border-danger' : 'border-parchment/10 focus:border-amber'
          } ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </label>
  );
}

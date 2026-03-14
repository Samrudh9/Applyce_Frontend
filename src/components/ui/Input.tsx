import { InputHTMLAttributes } from 'react';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
};

export function Input({ label, error, icon, className = '', ...props }: Props) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-sm font-medium text-text">{label}</span>}
      <div className="relative">
        {icon && <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">{icon}</span>}
        <input
          className={`input-glow w-full rounded-xl border bg-white px-4 py-3 text-text placeholder:text-stone outline-none transition-all duration-200 ${icon ? 'pl-10' : ''} ${error ? 'border-red-300 focus:border-danger focus:ring-red-100' : 'border-border focus:border-mint hover:border-border-hover'
            } ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </label>
  );
}

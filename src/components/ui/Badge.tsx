import { ReactNode } from 'react';

export type Tone = 'success' | 'warning' | 'danger' | 'info' | 'violet' | 'neutral';
export type BadgeSize = 'sm' | 'md' | 'lg';

const tones: Record<Tone, string> = {
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  danger: 'bg-red-50 text-red-600 border-red-200',
  info: 'bg-teal-50 text-teal-700 border-teal-200',
  violet: 'bg-violet-50 text-violet-700 border-violet-200',
  neutral: 'bg-slate-50 text-slate-600 border-slate-200',
};

const dotColors: Record<Tone, string> = {
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
  info: 'bg-teal-500',
  violet: 'bg-violet-500',
  neutral: 'bg-slate-400',
};

const sizes: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-3 py-1 text-xs',
  lg: 'px-4 py-1.5 text-sm',
};

export interface BadgeProps {
  tone?: Tone;
  size?: BadgeSize;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  dot?: boolean;
}

export function Badge({ tone = 'info', size = 'md', icon, children, className = '', dot }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-semibold ${tones[tone]} ${sizes[size]} ${className}`}>
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${dotColors[tone]}`} />}
      {icon && <span className="flex shrink-0 items-center">{icon}</span>}
      {children}
    </span>
  );
}

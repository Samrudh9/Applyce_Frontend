import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'purple';
type Size = 'sm' | 'md' | 'lg';

type Props = HTMLMotionProps<'button'> & {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
};

const base = 'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-mint/30 disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

const sizes: Record<Size, string> = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
};

const styles: Record<Variant, string> = {
  primary:
    'bg-mint text-white font-bold shadow-[0_2px_12px_rgba(52,211,153,0.25)] hover:bg-mint-dark hover:shadow-[0_4px_20px_rgba(52,211,153,0.3)]',
  purple:
    'bg-purple text-white font-bold shadow-[0_2px_12px_rgba(124,58,237,0.2)] hover:bg-purple-dark hover:shadow-[0_4px_20px_rgba(124,58,237,0.3)]',
  secondary: 'border border-mint/30 bg-mint/5 text-mint-dark hover:bg-mint/10 hover:border-mint/50',
  outline: 'border border-border bg-white text-text hover:border-mint/50 hover:text-mint-dark hover:bg-mint/[0.03]',
  ghost: 'bg-transparent text-muted hover:text-text hover:bg-slate-50',
  danger: 'bg-red-50 text-danger border border-red-200 hover:bg-red-100',
};

export function Button({ children, variant = 'primary', size = 'md', className = '', ...rest }: Props) {
  return (
    <motion.button
      whileHover={{ y: -1, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={`${base} ${sizes[size]} ${styles[variant]} ${className}`}
      {...rest}
    >
      {children}
    </motion.button>
  );
}

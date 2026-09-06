import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'purple';
type Size = 'sm' | 'md' | 'lg';

type Props = HTMLMotionProps<'button'> & {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
};

const base =
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium tracking-tight transition-all duration-150 focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none';

const sizes: Record<Size, string> = {
  sm: 'px-3.5 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

const styles: Record<Variant, string> = {
  primary:
    'bg-ink text-canvas border border-transparent hover:bg-ink/85 dark:bg-white dark:text-black dark:hover:bg-white/85 shadow-sm',
  secondary: 'bg-elevated text-ink border border-line hover:bg-line/50',
  outline:
    'bg-transparent text-ink border border-line-strong hover:border-ink hover:bg-elevated',
  ghost: 'bg-transparent text-ink-sec hover:text-ink hover:bg-elevated',
  danger:
    'bg-red-50 text-danger border border-red-200 hover:bg-red-100 dark:bg-red-950/40 dark:border-red-900 dark:hover:bg-red-950/70',
  purple:
    'bg-burgundy text-white border border-transparent hover:bg-burgundy-strong shadow-sm dark:bg-burgundy dark:text-white',
};

export function Button({ children, variant = 'primary', size = 'md', className = '', ...rest }: Props) {
  return (
    <motion.button
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.1 }}
      className={`${base} ${sizes[size]} ${styles[variant]} ${className}`}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
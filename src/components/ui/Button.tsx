import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

type Props = HTMLMotionProps<'button'> & {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
};

const base = 'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber/40 disabled:opacity-50 disabled:pointer-events-none';

const sizes: Record<Size, string> = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
};

const styles: Record<Variant, string> = {
  primary:
    'bg-gradient-to-r from-amber to-gold text-ink font-bold shadow-[0_4px_20px_rgba(240,160,60,0.25)] hover:shadow-[0_4px_30px_rgba(240,160,60,0.4)] hover:brightness-110',
  secondary: 'border border-amber/40 bg-amber/10 text-amber hover:bg-amber/20 hover:border-amber/60',
  outline: 'border border-parchment/20 bg-transparent text-parchment hover:border-amber/50 hover:text-amber hover:bg-parchment/[0.03]',
  ghost: 'bg-transparent text-stone hover:text-parchment hover:bg-parchment/5',
  danger: 'bg-danger/15 text-danger border border-danger/30 hover:bg-danger/25',
};

export function Button({ children, variant = 'primary', size = 'md', className = '', ...rest }: Props) {
  return (
    <motion.button
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className={`${base} ${sizes[size]} ${styles[variant]} ${className}`}
      {...rest}
    >
      {children}
    </motion.button>
  );
}

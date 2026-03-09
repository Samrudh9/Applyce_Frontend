import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

type Props = HTMLMotionProps<'div'> & {
  children: ReactNode;
  hover?: boolean;
  glow?: boolean | 'mint' | 'purple' | 'success' | 'none';
  noPad?: boolean;
};

export function Card({ children, className = '', hover = true, glow = 'mint', noPad, ...rest }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={hover ? { y: -3, transition: { duration: 0.2 } } : undefined}
      className={`rounded-2xl border border-border bg-white ${noPad ? '' : 'p-6'} shadow-card transition-all duration-300 ${hover ? 'hover:shadow-card-hover' : ''} ${className}`}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

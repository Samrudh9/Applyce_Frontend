import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

type Props = HTMLMotionProps<'div'> & {
  children: ReactNode;
  hover?: boolean;
  glow?: boolean | 'cyan' | 'violet' | 'success' | 'none';
  noPad?: boolean;
};

const glowMap: Record<string, string> = {
  cyan: 'hover:shadow-card-hover',
  violet: 'hover:shadow-violet',
  success: 'hover:shadow-success',
  none: '',
};

export function Card({ children, className = '', hover = true, glow = 'cyan', noPad, ...rest }: Props) {
  const resolvedGlow = glow === true ? 'cyan' : glow === false ? 'none' : glow;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : undefined}
      className={`glass rounded-2xl ${noPad ? '' : 'p-6'} shadow-card transition-all duration-300 ${hover ? glowMap[resolvedGlow] : ''} ${className}`}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

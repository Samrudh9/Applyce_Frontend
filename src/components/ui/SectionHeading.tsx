import { motion, useInView } from 'framer-motion';
import { ReactNode, useRef } from 'react';

interface Props {
  title: string;
  subtitle?: string;
  badge?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeading({ title, subtitle, badge, align = 'left', className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const centered = align === 'center' ? 'text-center mx-auto' : '';

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className={`mb-8 max-w-2xl ${centered} ${className}`}
    >
      {badge && <div className="mb-3">{badge}</div>}
      <h2 className="font-display text-2xl font-semibold md:text-3xl">{title}</h2>
      {subtitle && <p className="mt-2 text-muted md:text-lg">{subtitle}</p>}
    </motion.div>
  );
}

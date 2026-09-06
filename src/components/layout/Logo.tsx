import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Logo({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const box = size === 'sm' ? 'h-6 w-6 rounded-md' : 'h-7 w-7 rounded-md';
  const icon = size === 'sm' ? 13 : 15;

  return (
    <Link to="/" className="flex items-center gap-2 select-none" aria-label="Applyce home">
      <span className={`grid ${box} place-items-center bg-ink text-accent dark:bg-white dark:text-black`}>
        <ArrowUpRight size={icon} strokeWidth={2.75} />
      </span>
      <span className="text-[15px] font-semibold tracking-tight text-ink">Applyce</span>
    </Link>
  );
}
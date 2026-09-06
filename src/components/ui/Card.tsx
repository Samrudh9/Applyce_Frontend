import { HTMLAttributes, ReactNode } from 'react';

type Props = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  hover?: boolean;
  glow?: boolean | string;
  noPad?: boolean;
};

export function Card({ children, className = '', hover = true, glow, noPad, ...rest }: Props) {
  return (
    <div
      className={`rounded-xl border border-line bg-surface shadow-card ${noPad ? '' : 'p-6'} transition-all duration-200 ${
        hover ? 'hover:border-line-strong hover:shadow-card-hover' : ''
      } ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
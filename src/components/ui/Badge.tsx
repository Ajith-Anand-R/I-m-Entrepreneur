import React from 'react';

type BadgeVariant = 'accent' | 'mint' | 'rose' | 'amber' | 'sky' | 'neutral' | 'new';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  accent:  'bg-accent-ghost text-accent',
  mint:    'bg-mint/10 text-mint',
  rose:    'bg-rose/10 text-rose',
  amber:   'bg-amber/10 text-amber',
  sky:     'bg-sky/10 text-sky',
  neutral: 'bg-ink-100/50 text-ink-500',
  new:     'bg-gradient-brand text-white',
};

export const Badge: React.FC<BadgeProps> = ({
  children, variant = 'accent', className = '', dot = false,
}) => (
  <span className={`
    inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg
    text-[10px] font-bold tracking-wide uppercase font-heading
    ${variantStyles[variant]} ${className}
  `}>
    {dot && (
      <span className={`w-1.5 h-1.5 rounded-full bg-current ${variant === 'mint' ? 'animate-pulse' : ''}`} />
    )}
    {children}
  </span>
);

export default Badge;

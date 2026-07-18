import React from 'react';
import { motion } from 'framer-motion';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ComponentPropsWithoutRef<typeof motion.button> {
  variant?: Variant;
  size?: Size;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
}

const sizeMap: Record<Size, string> = {
  sm: 'px-4 py-2 text-[12px] rounded-xl gap-1.5',
  md: 'px-6 py-3 text-[13px] rounded-2xl gap-2',
  lg: 'px-8 py-3.5 text-[14px] rounded-2xl gap-2.5',
};

const variantClass: Record<Variant, string> = {
  primary:   'btn-primary',
  secondary: 'btn-secondary',
  ghost:     'btn-ghost',
  danger:    'btn-primary bg-gradient-to-r from-rose to-coral shadow-rose',
};

export const Button: React.FC<ButtonProps> = ({
  children, variant = 'primary', size = 'md', icon, iconRight,
  loading = false, fullWidth = false, className = '', disabled, ...rest
}) => (
  <motion.button
    whileTap={{ scale: 0.96 }}
    className={`
      ${variantClass[variant]} ${sizeMap[size]}
      ${fullWidth ? 'w-full justify-center' : ''}
      ${disabled || loading ? 'opacity-50 pointer-events-none' : ''}
      font-heading font-bold inline-flex items-center
      ${className}
    `}
    disabled={disabled || loading}
    {...rest}
  >
    {loading ? (
      <span className="flex gap-1">
        {[0,1,2].map(i => (
          <motion.span key={i}
            className="w-1.5 h-1.5 rounded-full bg-current"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.12 }}
          />
        ))}
      </span>
    ) : (
      <>
        {icon && <span className="shrink-0">{icon}</span>}
        {children}
        {iconRight && <span className="shrink-0">{iconRight}</span>}
      </>
    )}
  </motion.button>
);

export default Button;

import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  hover?: boolean;
  onClick?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const padMap = { none: '', sm: 'p-4', md: 'p-5', lg: 'p-6' };

export const Card: React.FC<CardProps> = ({
  children, className = '', style = {}, hover = true, onClick, padding = 'md',
}) => (
  <motion.div
    whileHover={hover ? { y: -4, boxShadow: '0 16px 48px rgba(108,71,255,0.08), 0 6px 16px rgba(0,0,0,0.04)' } : undefined}
    whileTap={onClick ? { scale: 0.98 } : undefined}
    onClick={onClick}
    className={`card-pro ${padMap[padding]} ${onClick ? 'cursor-pointer' : ''} ${className}`}
    style={style}
  >
    {children}
  </motion.div>
);

export default Card;

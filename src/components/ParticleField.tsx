import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface ParticleFieldProps {
  count?: number;
  className?: string;
}

const COLORS = [
  'rgba(108,71,255,0.25)',
  'rgba(139,122,255,0.20)',
  'rgba(56,189,248,0.18)',
  'rgba(52,211,153,0.18)',
  'rgba(167,139,250,0.15)',
];

export const ParticleField: React.FC<ParticleFieldProps> = ({ count = 18, className = '' }) => {
  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: `${Math.random() * 100}%`,
      y: `${Math.random() * 100}%`,
      size: Math.random() * 3 + 1.5,
      color: COLORS[i % COLORS.length],
      dur: Math.random() * 8 + 10,
      delay: Math.random() * 5,
    })),
  [count]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            background: p.color,
          }}
          animate={{
            y: [0, -20, 10, -15, 0],
            x: [0, 12, -8, 5, 0],
            opacity: [0.3, 0.7, 0.4, 0.8, 0.3],
          }}
          transition={{
            duration: p.dur,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

export default ParticleField;

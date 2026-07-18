import React, { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface ThreeDCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  glowColor?: string;
}

export const ThreeDCard: React.FC<ThreeDCardProps> = ({
  children, className = '', intensity = 10, glowColor = 'rgba(108,71,255,0.08)',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientY - r.top) / r.height - 0.5) * -2;
    const y = ((e.clientX - r.left) / r.width - 0.5) * 2;
    setTilt({ x: x * intensity, y: y * intensity });
  }, [intensity]);

  const handleLeave = useCallback(() => setTilt({ x: 0, y: 0 }), []);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`card-pro overflow-hidden ${className}`}
      style={{
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: 'transform 0.15s ease, box-shadow 0.3s ease',
      }}
      whileHover={{
        boxShadow: `0 16px 48px ${glowColor}, 0 6px 16px rgba(0,0,0,0.04)`,
      }}
    >
      {children}
    </motion.div>
  );
};

export default ThreeDCard;

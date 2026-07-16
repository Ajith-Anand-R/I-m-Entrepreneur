import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface ThreeDCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  intensity?: number;
}

export const ThreeDCard: React.FC<ThreeDCardProps> = ({
  children,
  className = '',
  glowColor = 'rgba(99, 102, 241, 0.12)',
  intensity = 12,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring physics — silky smooth rotation
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [intensity, -intensity]), {
    stiffness: 150, damping: 20, mass: 0.6,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-intensity, intensity]), {
    stiffness: 150, damping: 20, mass: 0.6,
  });

  // Magnetic lift effect
  const scale = useSpring(1, { stiffness: 200, damping: 20 });

  // Prismatic shine layer (follows cursor)
  const shineX = useTransform(x, [-0.5, 0.5], ['10%', '90%']);
  const shineY = useTransform(y, [-0.5, 0.5], ['10%', '90%']);

  // Edge highlight — changes with tilt
  const borderOpacity = useSpring(0, { stiffness: 200, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cx = (e.clientX - rect.left - rect.width  / 2) / rect.width;
    const cy = (e.clientY - rect.top  - rect.height / 2) / rect.height;
    x.set(cx);
    y.set(cy);
    borderOpacity.set(1);
    scale.set(1.015);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    scale.set(1);
    borderOpacity.set(0);
  };

  return (
    <div style={{ perspective: 1200 }} className="w-full h-full">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, scale, transformStyle: 'preserve-3d' }}
        className={`relative w-full h-full rounded-[20px] bg-white select-none cursor-default group
          shadow-[0_4px_24px_rgba(0,0,0,0.05),0_1px_4px_rgba(0,0,0,0.03)]
          hover:shadow-[0_16px_50px_rgba(0,0,0,0.09),0_4px_16px_rgba(0,0,0,0.04)]
          border border-white/90
          transition-shadow duration-500
          overflow-hidden
          ${className}`}
      >
        {/* Aurora shimmer layer — radial gradient tracking cursor */}
        <motion.div
          style={{
            background: `radial-gradient(circle 220px at ${shineX} ${shineY}, ${glowColor} 0%, rgba(139,92,246,0.06) 50%, transparent 100%)`,
          }}
          className="absolute inset-0 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-400"
        />

        {/* Top-edge prismatic border highlight */}
        <motion.div
          style={{ opacity: borderOpacity }}
          className="absolute inset-0 z-10 pointer-events-none rounded-[20px] border border-indigo-200/60 transition-opacity duration-300"
        />

        {/* Inner top gleam line */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent z-20 pointer-events-none" />

        {/* Depth-shifted content */}
        <div
          style={{ transform: 'translateZ(28px)' }}
          className="relative z-20 h-full flex flex-col justify-between p-6"
        >
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default ThreeDCard;

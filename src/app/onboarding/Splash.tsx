import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Zap, ArrowRight } from 'lucide-react';

const SG = "'Space Grotesk',sans-serif";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.3 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 80, damping: 16 } },
};

export const Splash: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => navigate('/login'), 3200);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center gradient-mesh-hero">

      {/* Ambient orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="orb orb-purple absolute w-[420px] h-[420px] -top-20 left-1/4" />
        <div className="orb orb-sky absolute w-[320px] h-[320px] bottom-10 right-1/4" />
        <div className="orb orb-mint absolute w-[260px] h-[260px] top-1/3 -right-10" />
      </div>

      {/* Subtle grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(108,71,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(108,71,255,1) 1px, transparent 1px)',
          backgroundSize: '52px 52px',
        }}
      />

      {/* Center content */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="relative z-10 flex flex-col items-center text-center px-6 space-y-6"
      >
        {/* Logo */}
        <motion.div variants={fadeUp} className="relative">
          {/* Glow */}
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 -m-4 rounded-3xl blur-xl"
            style={{ background: 'radial-gradient(circle, rgba(108,71,255,0.25), transparent 70%)' }}
          />

          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            className="relative w-20 h-20 rounded-3xl flex items-center justify-center overflow-hidden border border-white/20 bg-black"
            style={{
              boxShadow: '0 16px 48px rgba(108,71,255,0.3)',
            }}
          >
            <img src="/beyond_guidance_logo.jpg" alt="Beyond Guidance" className="w-full h-full object-contain scale-[1.3] -translate-y-[2px]" />

            {/* Corner sparkle */}
            <motion.div
              animate={{ scale: [1, 1.3, 1], rotate: [0, 10, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
              className="absolute -top-2 -right-2 w-5 h-5 rounded-lg flex items-center justify-center z-10"
              style={{ background: '#F59E0B', boxShadow: '0 4px 12px rgba(245,158,11,0.4)' }}
            >
              <Sparkles className="w-2.5 h-2.5 text-white" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Brand name */}
        <motion.div variants={fadeUp} className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-none" style={{ fontFamily: SG, color: 'var(--text-primary)' }}>
            I'm <span className="text-brand">Entrepreneur</span>
          </h1>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Zap className="w-3 h-3 text-accent" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em]" style={{ color: 'var(--accent)' }}>
              Startup Operating System
            </span>
            <Zap className="w-3 h-3 text-accent" />
          </div>
        </motion.div>

        {/* Tagline */}
        <motion.p variants={fadeUp}
          className="text-sm max-w-xs leading-relaxed font-medium"
          style={{ color: 'var(--text-secondary)' }}
        >
          Your complete command center for building, validating, and scaling your startup.
        </motion.p>

        {/* Loading dots */}
        <motion.div variants={fadeUp} className="flex flex-col items-center gap-3">
          <div className="flex gap-1.5">
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: 'var(--accent)' }}
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
              />
            ))}
          </div>
          <span className="text-[10px] font-bold tracking-widest uppercase"
            style={{ color: 'var(--text-muted)', fontFamily: SG }}>
            Initialising Workspace
          </span>
        </motion.div>

        {/* Feature pills */}
        <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-2">
          {['AI Mentors', 'Journey Map', 'Smart Docs', 'Analytics'].map(tag => (
            <span key={tag}
              className="px-3 py-1.5 rounded-xl text-[10px] font-bold glass-frost"
              style={{ color: 'var(--accent)' }}
            >
              {tag}
            </span>
          ))}
        </motion.div>
      </motion.div>

      {/* Bottom hint */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.5 }}
        className="absolute bottom-8 left-0 right-0 flex justify-center"
      >
        <div className="flex items-center gap-2 text-[10px] font-semibold"
          style={{ color: 'var(--text-muted)' }}>
          <span>Launching your workspace</span>
          <ArrowRight className="w-3 h-3 gentle-bounce" />
        </div>
      </motion.div>
    </div>
  );
};

export default Splash;

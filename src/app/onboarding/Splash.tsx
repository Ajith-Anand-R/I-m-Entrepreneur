import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Zap, ArrowRight } from 'lucide-react';

/* ── Tiny animated star component ── */
const Star: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
  <motion.div
    className="absolute w-1 h-1 rounded-full bg-indigo-300/60"
    style={style}
    animate={{ opacity: [0, 1, 0], scale: [0, 1.2, 0] }}
    transition={{
      duration: Math.random() * 2 + 2,
      repeat: Infinity,
      delay: Math.random() * 3,
      ease: 'easeInOut',
    }}
  />
);

const stars = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  style: {
    top:  `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    width:  `${Math.random() * 3 + 1}px`,
    height: `${Math.random() * 3 + 1}px`,
  },
}));

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.4 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show:   { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 80, damping: 16 } },
};

export const Splash: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => navigate('/login'), 3200);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50/60 to-violet-50/80">

      {/* ── Aurora orb backgrounds ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] aurora-orb-1 rounded-full opacity-70" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] aurora-orb-2 rounded-full opacity-60" />
        <div className="absolute top-1/2 left-0   w-[300px] h-[300px] aurora-orb-3 rounded-full opacity-50" />
        <div className="absolute top-1/3 right-0  w-[250px] h-[250px] aurora-orb-4 rounded-full opacity-50" />
      </div>

      {/* ── Floating sparkle stars ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {stars.map(s => <Star key={s.id} style={s.style} />)}
      </div>

      {/* ── Animated grid mesh ── */}
      <div className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: 'linear-gradient(rgba(99,102,241,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.07) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* ── Center content ── */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="relative z-10 flex flex-col items-center text-center px-6 space-y-7"
      >

        {/* Logo mark — animated assembly */}
        <motion.div
          variants={fadeUp}
          className="relative"
        >
          {/* Outer glow ring */}
          <motion.div
            animate={{ scale: [1, 1.12, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 -m-3 rounded-3xl bg-gradient-to-br from-indigo-400/30 to-violet-400/30 blur-lg"
          />

          {/* Secondary ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 -m-1.5 rounded-3xl border border-indigo-200/50 border-dashed"
          />

          {/* Main logo tile */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 flex items-center justify-center shadow-[0_16px_48px_rgba(99,102,241,0.4)] border border-white/30"
          >
            {/* Inner shine */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/25 to-transparent" />
            <span className="text-3xl font-black text-white relative z-10 tracking-tight">IE</span>

            {/* Corner sparkle */}
            <motion.div
              animate={{ scale: [1, 1.4, 1], rotate: [0, 15, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-amber-400 rounded-lg flex items-center justify-center shadow-md"
            >
              <Sparkles className="w-3 h-3 text-white" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Brand name */}
        <motion.div variants={fadeUp} className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-none">
            I'm{' '}
            <span className="gradient-text">Entrepreneur</span>
          </h1>
          <div className="flex items-center justify-center space-x-2 mt-2">
            <Zap className="w-3 h-3 text-indigo-400" />
            <span className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.25em]">
              Startup Operating System
            </span>
            <Zap className="w-3 h-3 text-indigo-400" />
          </div>
        </motion.div>

        {/* Tagline */}
        <motion.p
          variants={fadeUp}
          className="text-sm text-slate-500 max-w-xs leading-relaxed font-medium"
        >
          Your complete command center for building, validating, and scaling your startup.
        </motion.p>

        {/* Loading indicator */}
        <motion.div variants={fadeUp} className="flex flex-col items-center space-y-3">
          <div className="flex items-center space-x-1.5">
            {[0, 1, 2, 3, 4].map(i => (
              <motion.div
                key={i}
                className="w-1 h-1 rounded-full bg-indigo-400"
                animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.5, 1] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
              />
            ))}
          </div>
          <span className="text-[10px] text-slate-400 font-mono font-bold tracking-widest uppercase">
            Initialising Workspace
          </span>
        </motion.div>

        {/* Feature pills */}
        <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-2">
          {['AI Mentors', 'Journey Map', 'Smart Docs', 'Analytics'].map(tag => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full text-[10px] font-bold bg-white/70 backdrop-blur-sm border border-indigo-100 text-indigo-600 shadow-card-sm"
            >
              {tag}
            </span>
          ))}
        </motion.div>

      </motion.div>

      {/* Bottom CTA hint */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.6 }}
        className="absolute bottom-10 left-0 right-0 flex justify-center"
      >
        <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-semibold">
          <span>Launching your workspace</span>
          <ArrowRight className="w-3 h-3 animate-pulse" />
        </div>
      </motion.div>
    </div>
  );
};

export default Splash;

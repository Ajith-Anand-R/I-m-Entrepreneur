import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Check, Sparkles, BookOpen, FileCheck, Flame, Star, Zap, Trophy } from 'lucide-react';
import { useStartupStore } from '../../store/useStartupStore';
import { JOURNEY_LEVELS } from '../../mockData/fixtures';
import { ParticleField } from '../../components/ParticleField';
import { useCountUp } from '../../components/AnimatedCounter';

type NodeState = 'completed' | 'current' | 'locked';

/* ── Orbiting ring (multi-ring for current node) ── */
const OrbitRing: React.FC<{ color: string; size: number; duration: number; delay?: number }> = ({
  color, size, duration, delay = 0,
}) => (
  <motion.div
    className={`absolute rounded-full border ${color} pointer-events-none`}
    style={{ inset: -size }}
    animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
    transition={{ duration, repeat: Infinity, delay, ease: 'easeOut' }}
  />
);

/* ── Energy flowing path ── */
const EnergyPath: React.FC = () => (
  <div className="absolute left-1/2 top-10 bottom-10 w-[3px] -translate-x-1/2 overflow-hidden hidden md:block" style={{ borderRadius: 99 }}>
    {/* Base track */}
    <div className="absolute inset-0 bg-gradient-to-b from-indigo-100 via-violet-100 via-amber-100 to-indigo-100" />
    {/* Energy pulse 1 */}
    <motion.div
      className="absolute inset-x-0 rounded-full"
      style={{ height: '80px', background: 'linear-gradient(to bottom, transparent, rgba(99,102,241,0.8), rgba(139,92,246,0.8), transparent)' }}
      animate={{ top: ['-80px', '110%'] }}
      transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
    />
    {/* Energy pulse 2 */}
    <motion.div
      className="absolute inset-x-0 rounded-full"
      style={{ height: '50px', background: 'linear-gradient(to bottom, transparent, rgba(245,158,11,0.7), rgba(234,88,12,0.7), transparent)' }}
      animate={{ top: ['-50px', '110%'] }}
      transition={{ duration: 2.2, repeat: Infinity, ease: 'linear', delay: 1.1 }}
    />
  </div>
);

export const JourneyHome: React.FC = () => {
  const { currentJourneyLevel, bookLinked, setBookLinked } = useStartupStore();
  const navigate = useNavigate();
  const [hoveredLevel, setHoveredLevel] = useState<number | null>(null);
  const { value: animLevel, ref: levelRef } = useCountUp(currentJourneyLevel, 1000, 200);

  const handleClick = (id: number, state: NodeState) => {
    if (state === 'locked') return;
    navigate(`/journey/level/${id}`);
  };

  const completedCount = currentJourneyLevel - 1;

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* ══════════════════════════════════════════
          HEADER BANNER — Amber gradient + particles
          ══════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 80, damping: 16 }}
        className="relative overflow-hidden rounded-[26px] min-h-[190px]"
        style={{
          background: 'linear-gradient(135deg, #F59E0B 0%, #EA580C 40%, #DC2626 70%, #9333EA 100%)',
          boxShadow: '0 20px 60px rgba(245,158,11,0.4), 0 8px 20px rgba(234,88,12,0.25)',
        }}
      >
        <ParticleField density={30} speed={0.25} />

        {/* Scan line */}
        <motion.div
          className="absolute inset-y-0 w-24 pointer-events-none"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }}
          animate={{ left: ['-10%', '110%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />

        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '36px 36px',
          }}
        />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        {/* Content */}
        <div className="relative z-10 p-7 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <motion.div
                animate={{ rotate: [0, 15, -10, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <BookOpen className="w-5 h-5 text-amber-100" />
              </motion.div>
              <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
                Founder Journey Map
              </h2>
            </div>

            <p className="text-sm text-amber-100/75 font-medium max-w-sm leading-relaxed">
              Sequential milestones · Scan your physical book or type logs · Unlock new chapters with AI review
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {[
                { icon: Flame,  label: 'Active',    value: `Level ${currentJourneyLevel}`,  color: 'bg-amber-400/20' },
                { icon: Trophy, label: 'Completed',  value: `${completedCount} levels`,      color: 'bg-white/15' },
                { icon: Star,   label: 'Remaining',  value: `${15 - currentJourneyLevel} left`, color: 'bg-white/15' },
              ].map(({ icon: Icon, label, value, color }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  whileHover={{ scale: 1.05, y: -1 }}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-xl ${color} border border-white/20 backdrop-blur-sm cursor-default`}
                >
                  <Icon className="w-3 h-3 text-white/80" />
                  <div>
                    <p className="text-[8px] font-black text-white/60 uppercase tracking-widest">{label}</p>
                    <p className="text-[12px] font-black text-white">{value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: Level display */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="shrink-0 text-center bg-white/15 backdrop-blur-sm border border-white/25 rounded-2xl p-5 min-w-[140px]"
          >
            <Zap className="w-7 h-7 text-amber-200 mx-auto mb-1" />
            <p className="text-[9px] font-black text-white/60 uppercase tracking-widest mb-1">Current Level</p>
            <div ref={levelRef} className="text-5xl font-black text-white">{animLevel}</div>
            <p className="text-xs text-amber-200 font-bold mt-1">of 15</p>

            {/* Book toggle */}
            <button
              onClick={() => setBookLinked(!bookLinked)}
              className={`mt-3 w-full py-1.5 rounded-xl text-[10px] font-black transition-all duration-300 border
                ${bookLinked
                  ? 'bg-white text-amber-600 border-white'
                  : 'bg-white/15 text-white border-white/30 hover:bg-white/25'
                }`}
            >
              {bookLinked ? '✓ Book Linked' : 'Digital Only'}
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* ══════════════════════════════════════════
          WINDING PATH CONTAINER
          ══════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 70, damping: 16 }}
        className="relative bg-white rounded-[26px] border border-slate-100 overflow-hidden p-8 md:p-12"
        style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.05)' }}
      >
        {/* Aurora background inside container */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full orb-1 opacity-30" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full orb-2 opacity-25" />
          <div className="absolute top-1/2 left-1/2 w-48 h-48 rounded-full orb-3 opacity-20 -translate-x-1/2 -translate-y-1/2" />
        </div>

        {/* Dot-grid background */}
        <div className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: 'radial-gradient(rgba(99,102,241,0.08) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        {/* Energy flowing path */}
        <EnergyPath />

        {/* Level nodes */}
        <div className="relative z-10 space-y-12 md:space-y-16 max-w-lg mx-auto">
          {JOURNEY_LEVELS.map((level, idx) => {
            const isCompleted = level.id < currentJourneyLevel;
            const isCurrent   = level.id === currentJourneyLevel;
            const isLocked    = level.id > currentJourneyLevel;
            const state: NodeState = isCompleted ? 'completed' : isCurrent ? 'current' : 'locked';
            const isLeft = idx % 2 === 0;

            return (
              <motion.div
                key={level.id}
                initial={{ opacity: 0, x: isLeft ? -30 : 30, y: 10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ type: 'spring', stiffness: 85, damping: 16, delay: idx * 0.06 }}
                className={`flex flex-col md:flex-row items-center w-full
                  ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                {/* ── NODE ── */}
                <div className="flex justify-center w-full md:w-1/2 px-6 relative z-10">
                  <motion.button
                    whileHover={!isLocked ? { scale: 1.15, y: -4 } : {}}
                    whileTap={!isLocked ? { scale: 0.92 } : {}}
                    onClick={() => handleClick(level.id, state)}
                    onHoverStart={() => setHoveredLevel(level.id)}
                    onHoverEnd={() => setHoveredLevel(null)}
                    className={`relative w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-colors duration-300 cursor-pointer select-none
                      ${isCompleted ? 'bg-emerald-500 border-emerald-300 text-white' : ''}
                      ${isCurrent   ? 'bg-gradient-to-br from-amber-400 to-orange-500 border-amber-200 text-white ring-4 ring-amber-100' : ''}
                      ${isLocked    ? 'bg-slate-50 border-slate-200 text-slate-300 cursor-not-allowed opacity-50' : ''}
                    `}
                    style={isCompleted ? { boxShadow: '0 8px 24px rgba(16,185,129,0.4)' }
                         : isCurrent  ? { boxShadow: '0 8px 28px rgba(245,158,11,0.5)' }
                         : undefined}
                  >
                    {/* Orbit rings for current */}
                    {isCurrent && (
                      <>
                        <OrbitRing color="border-amber-300"  size={10} duration={1.8} />
                        <OrbitRing color="border-orange-300" size={18} duration={2.4} delay={0.4} />
                        <OrbitRing color="border-amber-200"  size={26} duration={3.2} delay={0.9} />
                      </>
                    )}

                    {/* Glow for completed */}
                    {isCompleted && hoveredLevel === level.id && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 rounded-2xl"
                        style={{ boxShadow: '0 0 30px rgba(16,185,129,0.5)' }}
                      />
                    )}

                    {/* Icon / number */}
                    {isCompleted ? (
                      <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2.5, repeat: Infinity }}>
                        <Check className="w-7 h-7 stroke-[3]" />
                      </motion.div>
                    ) : isLocked ? (
                      <Lock className="w-5 h-5" />
                    ) : (
                      <motion.span
                        animate={{ scale: [1, 1.08, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                        className="text-xl font-black font-mono"
                      >
                        {level.id}
                      </motion.span>
                    )}

                    {/* Sparkle badge for current */}
                    {isCurrent && (
                      <motion.div
                        animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute -top-2.5 -right-2.5 w-7 h-7 bg-violet-500 rounded-xl flex items-center justify-center border-2 border-white"
                        style={{ boxShadow: '0 4px 12px rgba(139,92,246,0.5)' }}
                      >
                        <Sparkles className="w-3.5 h-3.5 text-white" />
                      </motion.div>
                    )}
                  </motion.button>
                </div>

                {/* ── LEVEL CARD ── */}
                <div className="w-full md:w-1/2 px-6 mt-4 md:mt-0">
                  <motion.div
                    whileHover={!isLocked ? {
                      y: -4,
                      boxShadow: isCurrent
                        ? '0 12px 36px rgba(245,158,11,0.2)'
                        : '0 12px 36px rgba(0,0,0,0.06)',
                    } : {}}
                    onClick={() => !isLocked && handleClick(level.id, state)}
                    className={`p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer relative overflow-hidden
                      ${isCompleted ? 'bg-white border-emerald-100/80 hover:border-emerald-200' : ''}
                      ${isCurrent   ? 'bg-gradient-to-br from-amber-50 to-orange-50/50 border-amber-200' : ''}
                      ${isLocked    ? 'bg-slate-50/40 border-slate-100/50 opacity-40' : ''}
                    `}
                  >
                    {/* Animated gradient border line at top for current */}
                    {isCurrent && (
                      <motion.div
                        className="absolute inset-x-0 top-0 h-0.5"
                        style={{ background: 'linear-gradient(90deg, #F59E0B, #EA580C, #F59E0B)' }}
                        animate={{ backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      />
                    )}

                    {/* Header row */}
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[9px] font-black tracking-widest uppercase font-mono
                        ${isCurrent ? 'text-amber-500' : isCompleted ? 'text-emerald-500' : 'text-slate-400'}`}
                      >
                        Level {level.id}
                      </span>
                      {isCompleted && (
                        <span className="flex items-center space-x-1 text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                          <FileCheck className="w-3 h-3" />
                          <span>Approved</span>
                        </span>
                      )}
                      {isCurrent && (
                        <motion.span
                          animate={{ opacity: [0.6, 1, 0.6] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="flex items-center space-x-1 text-[9px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100"
                        >
                          <Flame className="w-3 h-3" />
                          <span>Active</span>
                        </motion.span>
                      )}
                    </div>

                    <h3 className={`font-black text-sm tracking-tight
                      ${isCurrent ? 'text-amber-900' : isCompleted ? 'text-slate-800' : 'text-slate-400'}`}
                    >
                      {level.title}
                    </h3>

                    <p className={`text-xs mt-1 leading-relaxed font-medium line-clamp-2
                      ${isCurrent ? 'text-amber-700/70' : isCompleted ? 'text-slate-500' : 'text-slate-400'}`}
                    >
                      {level.learnContent}
                    </p>

                    {/* Current level animated progress */}
                    {isCurrent && (
                      <div className="mt-3 h-1.5 w-full bg-amber-100 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full relative overflow-hidden"
                          style={{ background: 'linear-gradient(90deg, #F59E0B, #EA580C)' }}
                          initial={{ width: 0 }}
                          animate={{ width: '45%' }}
                          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
                        >
                          <motion.div
                            className="absolute inset-y-0 w-5 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                            animate={{ left: ['-20px', '100px'] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', delay: 2 }}
                          />
                        </motion.div>
                      </div>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default JourneyHome;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles, ArrowRight, CheckCircle2, FileText, TrendingUp,
  Target, Zap, BookOpen, BarChart3, Rocket, Brain,
  Activity, Layers, Plus, ArrowUpRight,
} from 'lucide-react';
import { useStartupStore } from '../../store/useStartupStore';
import { db, type DocumentRecord } from '../../lib/db';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { ThreeDCard } from '../../components/ThreeDCard';
import { ParticleField } from '../../components/ParticleField';
import { useCountUp } from '../../components/AnimatedCounter';
import { useIdentityStore } from '../../store/useIdentityStore';

/* ── Design tokens ── */
const SG = "'Space Grotesk',sans-serif";
const DM = "'DM Sans',sans-serif";
const A = { purple: '#6C47FF', soft: '#8B7AFF', mint: '#34D399', rose: '#F43F5E', amber: '#F59E0B', sky: '#38BDF8', teal: '#2DD4BF' };

/* ── Stagger animation ── */
const page = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const up = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 80, damping: 16 } } };

/* ── Audio bar for status pill ── */
const VBar: React.FC<{ delay: number }> = ({ delay }) => (
  <motion.div className="w-[3px] rounded-full"
    style={{ background: `linear-gradient(to top, ${A.purple}, ${A.soft})` }}
    animate={{ height: ['4px','20px','6px','22px','5px','16px'] }}
    transition={{ duration: 1.6, repeat: Infinity, delay, ease: 'easeInOut', repeatType: 'reverse' }} />
);

/* ── Particle emitter ── */
const Emit: React.FC<{ x: string; color: string; delay: number }> = ({ x, color, delay }) => (
  <motion.div className="absolute bottom-5 w-2 h-2 rounded-full pointer-events-none"
    style={{ left: x, background: color }}
    animate={{ y: [0, -50, -100], opacity: [0, 1, 0], scale: [0.4, 1.3, 0.2] }}
    transition={{ duration: 2.4, repeat: Infinity, delay, ease: 'easeOut' }} />
);

/* ── Card wrapper ── */
const Card: React.FC<{ children: React.ReactNode; className?: string; style?: React.CSSProperties }> = ({ children, className = '', style = {} }) => (
  <motion.div variants={up}
    whileHover={{ y: -4, boxShadow: '0 16px 48px rgba(108,71,255,0.08), 0 6px 16px rgba(0,0,0,0.04)' }}
    className={`bg-white rounded-[22px] border flex flex-col overflow-hidden ${className}`}
    style={{ borderColor: 'rgba(108,71,255,0.08)', boxShadow: '0 2px 8px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)',
      transition: 'box-shadow 280ms ease, transform 280ms cubic-bezier(0.16,1,0.3,1)', ...style }}>
    {children}
  </motion.div>
);

/* ── Stat chip ── */
const Chip: React.FC<{ label: string; value: string; icon: React.ElementType; color: string }> = ({ label, value, icon: Icon, color }) => (
  <motion.div whileHover={{ scale: 1.04, y: -2 }}
    className="flex items-center gap-2.5 pl-3 pr-4 py-2.5 rounded-2xl cursor-default glass-frost"
    style={{ border: `1px solid ${color}15` }}>
    <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0"
      style={{ background: `${color}10` }}>
      <Icon className="w-3.5 h-3.5" style={{ color }} />
    </div>
    <div>
      <p className="text-[8px] font-bold text-ink-300 uppercase tracking-widest leading-none" style={{ fontFamily: SG }}>{label}</p>
      <p className="text-[15px] font-black text-ink-900 leading-tight" style={{ fontFamily: SG }}>{value}</p>
    </div>
  </motion.div>
);

/* ── Spinning border card ── */
const SpinCard: React.FC<{ children: React.ReactNode; speed?: number }> = ({ children, speed = 4 }) => (
  <div className="relative rounded-[24px] overflow-hidden" style={{ padding: '1.5px' }}>
    <motion.div animate={{ rotate: 360 }} transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
      className="absolute -inset-[100%] w-[300%] h-[300%] origin-center"
      style={{ background: `conic-gradient(from 0deg, ${A.purple}, ${A.soft}, ${A.sky}, ${A.mint}, ${A.purple})` }} />
    <div className="relative rounded-[22.5px] bg-white overflow-hidden h-full" style={{ zIndex: 1 }}>
      {children}
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════ */
export const DashboardHome: React.FC = () => {
  const { startupName, founderName, vision, score, currentJourneyLevel, builderTasks } = useStartupStore();
  const { entrepreneurProfile, hunchBook } = useIdentityStore();
  const [docs, setDocs] = useState<DocumentRecord[]>([]);

  const { value: animScore, ref: scoreRef } = useCountUp(score, 2000, 300);
  const { value: animLevel, ref: levelRef } = useCountUp(currentJourneyLevel, 1400, 500);

  const done   = builderTasks.filter(t => t.status === 'completed').length;
  const active = builderTasks.filter(t => t.status === 'in_progress').length;
  const total  = builderTasks.length;
  const pct    = Math.round((done / (total || 1)) * 100);

  useEffect(() => {
    db.documents.orderBy('analyzedAt').reverse().limit(4).toArray().then(setDocs);
  }, []);

  const radar = [
    { s: 'Validation', A: 85 }, { s: 'Business', A: 70 },
    { s: 'Team',       A: 60 }, { s: 'Finance',  A: 42 },
    { s: 'Investor',   A: 32 }, { s: 'Ops',      A: 75 },
  ];

  const kpis = [
    { label: 'Maturity',    value: `${score}%`,       sub: '+5% this week',    icon: Target,       color: A.purple, topLine: `linear-gradient(90deg,${A.purple},${A.soft})` },
    { label: 'Tasks Done',  value: `${done}/${total}`, sub: `${pct}% complete`, icon: CheckCircle2, color: A.mint,   topLine: `linear-gradient(90deg,${A.mint},${A.teal})` },
    { label: 'In Progress', value: String(active),     sub: 'Active now',       icon: Layers,       color: A.amber,  topLine: `linear-gradient(90deg,${A.amber},${A.rose})` },
    { label: 'Documents',   value: String(docs.length||0), sub: 'Analysed',     icon: FileText,     color: A.sky,    topLine: `linear-gradient(90deg,${A.sky},${A.mint})` },
  ];

  return (
    <motion.div variants={page} initial="hidden" animate="show" className="max-w-7xl mx-auto space-y-6">

      {/* ════════════════════════════════════════
          HERO CARD — Light Professional
      ════════════════════════════════════════ */}
      <motion.div variants={up}
        className="relative overflow-hidden rounded-[28px]"
        style={{
          background: 'linear-gradient(135deg, #F0EDFF 0%, #E8E4FF 40%, #F5F4FF 70%, #FAFAFF 100%)',
          boxShadow: '0 24px 64px rgba(108,71,255,0.08), 0 8px 20px rgba(0,0,0,0.04)',
          border: '1px solid rgba(108,71,255,0.08)',
        }}>

        {/* Particles */}
        <ParticleField count={14} />

        {/* Ambient orbs */}
        <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle,rgba(108,71,255,0.12) 0%,transparent 70%)`, animation: 'orb-a 16s ease-in-out infinite' }} />
        <div className="absolute bottom-0 right-10 w-56 h-56 rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle,rgba(56,189,248,0.10) 0%,transparent 70%)`, animation: 'orb-b 20s ease-in-out infinite' }} />
        <div className="absolute top-1/2 -translate-y-1/2 left-1/3 w-40 h-40 rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle,rgba(52,211,153,0.08) 0%,transparent 70%)`, animation: 'orb-c 13s ease-in-out infinite' }} />

        {/* Top accent line */}
        <div className="absolute inset-x-0 top-0 h-[2px]"
          style={{ background: `linear-gradient(90deg,transparent,${A.purple},${A.soft},${A.sky},transparent)` }} />

        {/* Content */}
        <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row md:items-center gap-8 md:gap-12">

          {/* Left: text */}
          <div className="flex-1 space-y-5">
            {/* Status pill */}
            <motion.div
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2.2, repeat: Infinity }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass-frost"
              style={{ border: '1px solid rgba(108,71,255,0.1)' }}>
              <div className="flex items-end gap-[2px] h-4">
                {[0, 0.12, 0.26, 0.08, 0.2].map((d, i) => <VBar key={i} delay={d} />)}
              </div>
              <span className="text-[10px] font-bold text-accent tracking-[0.22em] uppercase" style={{ fontFamily: SG }}>
                Command Center
              </span>
              <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.6, repeat: Infinity }}
                className="block w-1.5 h-1.5 rounded-full" style={{ background: A.mint }} />
            </motion.div>

            {/* Greeting */}
            <div>
              <p className="text-sm font-medium mb-1 text-ink-300" style={{ fontFamily: DM }}>Welcome back</p>
              <h1 className="text-3xl md:text-[42px] font-black text-ink-900 leading-[1.1]" style={{ fontFamily: SG }}>
                {founderName}
                <motion.span className="ml-2 inline-block"
                  animate={{ y: [0, -8, 0], rotate: [-5, 5, -5] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
                  🚀
                </motion.span>
              </h1>
              <p className="text-[13px] mt-2.5 max-w-lg leading-relaxed font-medium text-ink-500" style={{ fontFamily: DM }}>
                {vision || 'Building the future, one milestone at a time.'}
              </p>
            </div>

            {/* Stat chips */}
            <div className="flex flex-wrap gap-3">
              <Chip label="Maturity" value={`${score}%`} icon={Target} color={A.purple} />
              <Chip label="Journey" value={`${currentJourneyLevel}/15`} icon={BookOpen} color={A.amber} />
              <Chip label="Done" value={`${done}/${total}`} icon={Zap} color={A.mint} />
            </div>
          </div>

          {/* Right: float card */}
          <div className="shrink-0 flex flex-col items-center">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-[180px] rounded-[22px] border p-6 text-center relative overflow-hidden glass-frost-strong"
              style={{ border: '1px solid rgba(108,71,255,0.12)' }}>
              <div className="absolute -bottom-6 -right-6 w-20 h-20 rounded-full"
                style={{ background: `radial-gradient(circle,${A.amber}20,transparent 70%)` }} />

              <div ref={levelRef}>
                <motion.div animate={{ rotate: [0, 12, -12, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 3.5, repeat: Infinity }}>
                  <BookOpen className="w-8 h-8 mx-auto" style={{ color: A.amber }} />
                </motion.div>
                <p className="text-[9px] font-black text-ink-300 uppercase tracking-[0.25em] mt-3 mb-1" style={{ fontFamily: SG }}>
                  Journey Level
                </p>
                <p className="text-[52px] font-black text-ink-900 leading-none" style={{ fontFamily: SG }}>
                  {animLevel}
                  <span className="text-[22px] text-ink-100">/15</span>
                </p>
              </div>

              <Link to="/journey"
                className="inline-flex items-center gap-1 text-[11px] font-bold mt-2 transition-colors"
                style={{ color: A.amber, fontFamily: SG }}>
                Continue
                <motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 1.2, repeat: Infinity }}>
                  <ArrowRight className="w-3 h-3" />
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* ════════════════════════════════════════
          KPI STRIP
      ════════════════════════════════════════ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map(k => {
          const Icon = k.icon;
          return (
            <Card key={k.label} style={{ background: `${k.color}05`, borderColor: `${k.color}12` }}>
              <div className="h-[3px] w-full rounded-t-[22px]" style={{ background: k.topLine }} />
              <div className="p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black text-ink-300 uppercase tracking-wider" style={{ fontFamily: SG }}>
                    {k.label}
                  </p>
                  <div className="w-8 h-8 rounded-[11px] flex items-center justify-center"
                    style={{ background: `${k.color}10` }}>
                    <Icon className="w-[15px] h-[15px]" style={{ color: k.color }} />
                  </div>
                </div>
                <p className="text-[30px] font-black leading-none" style={{ color: k.color, fontFamily: SG }}>
                  {k.value}
                </p>
                <p className="text-[11px] text-ink-300 font-medium" style={{ fontFamily: DM }}>
                  {k.sub}
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* ════════════════════════════════════════
          IDENTITY CARD — Founder's DNA
      ════════════════════════════════════════ */}
      {entrepreneurProfile && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Archetype Card */}
          <Card className="overflow-hidden">
            <div className="h-[3px] w-full" style={{ background: 'linear-gradient(90deg, #6C47FF, #F43F5E, #F59E0B)' }} />
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #6C47FF, #8B7AFF)' }}>
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-ink-300 uppercase tracking-wider" style={{ fontFamily: SG }}>Your Archetype</p>
                  <p className="text-[16px] font-black text-ink-900" style={{ fontFamily: SG }}>{entrepreneurProfile.archetype}</p>
                </div>
              </div>
              <p className="text-[12px] text-ink-400 leading-relaxed italic">"{entrepreneurProfile.tagline}"</p>
              <div className="flex flex-wrap gap-2">
                {entrepreneurProfile.topTraits.map(t => (
                  <span key={t} className="px-2.5 py-1 rounded-lg text-[10px] font-bold"
                    style={{ background: 'rgba(108,71,255,0.06)', color: '#6C47FF' }}>{t}</span>
                ))}
                {entrepreneurProfile.topValues.map(v => (
                  <span key={v} className="px-2.5 py-1 rounded-lg text-[10px] font-bold"
                    style={{ background: 'rgba(244,63,94,0.06)', color: '#F43F5E' }}>{v}</span>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-accent/[0.06]">
                <div>
                  <p className="text-[9px] font-bold text-ink-300 uppercase tracking-wider">Primary Passion</p>
                  <p className="text-[13px] font-bold text-ink-900" style={{ fontFamily: SG }}>{entrepreneurProfile.primaryPassion}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-ink-300 uppercase tracking-wider">Problem Focus</p>
                  <p className="text-[13px] font-bold text-ink-900" style={{ fontFamily: SG }}>{entrepreneurProfile.problemFocus}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Recent Hunches Card */}
          <Card className="overflow-hidden">
            <div className="h-[3px] w-full" style={{ background: 'linear-gradient(90deg, #F59E0B, #F97316)' }} />
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.1)' }}>
                    <Sparkles className="w-4 h-4" style={{ color: '#F59E0B' }} />
                  </div>
                  <p className="text-[10px] font-black text-ink-300 uppercase tracking-wider" style={{ fontFamily: SG }}>HunchBook</p>
                </div>
                <Link to="/hunchbook" className="text-[10px] font-bold text-[#F59E0B] uppercase tracking-wider hover:underline" style={{ fontFamily: SG }}>View All →</Link>
              </div>
              {hunchBook.length > 0 ? (
                <div className="space-y-2">
                  {hunchBook.slice(0, 3).map(h => (
                    <div key={h.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-accent/[0.02] transition-colors"
                      style={{ border: '1px solid rgba(245,158,11,0.08)' }}>
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: '#F59E0B' }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] text-ink-700 font-medium leading-relaxed truncate">{h.content}</p>
                        {h.aiTheme && (
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-md mt-1 inline-block"
                            style={{ background: 'rgba(245,158,11,0.06)', color: '#F59E0B' }}>{h.aiTheme}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <p className="text-[12px] text-ink-300">No hunches yet. Start capturing ideas!</p>
                  <Link to="/hunchbook" className="mt-2 text-[11px] font-bold text-[#F59E0B]">Open HunchBook →</Link>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* ════════════════════════════════════════
          BENTO GRID — Score · Radar · Tasks
      ════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* Score ring */}
        <div className="lg:col-span-4">
          <Card className="p-6 gap-4 min-h-[310px]">
            <div className="flex items-center justify-between border-b border-accent/[0.06] pb-4">
              <div className="flex items-center gap-2">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}>
                  <Target className="w-4 h-4 text-accent" />
                </motion.div>
                <span className="text-[11px] font-black text-ink-300 uppercase tracking-wider" style={{ fontFamily: SG }}>
                  Maturity Index
                </span>
              </div>
              <Link to="/score" className="flex items-center gap-1 text-[11px] font-bold text-accent transition-colors" style={{ fontFamily: SG }}>
                Full Report <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>

            <div ref={scoreRef} className="flex-1 flex items-center justify-center relative py-2">
              <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.25, 0.1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute w-44 h-44 rounded-full pointer-events-none"
                style={{ background: `radial-gradient(circle,${A.purple} 0%,transparent 70%)` }} />

              <svg className="w-40 h-40 -rotate-90" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={A.purple} />
                    <stop offset="50%" stopColor={A.soft} />
                    <stop offset="100%" stopColor={A.sky} />
                  </linearGradient>
                  <filter id="ring-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="2" result="b" />
                    <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>
                <circle cx="50" cy="50" r="40" fill="none" stroke="#F0EDFF" strokeWidth="7" />
                <motion.circle cx="50" cy="50" r="40" fill="none"
                  stroke="url(#ring-grad)" strokeWidth="7" strokeLinecap="round"
                  filter="url(#ring-glow)" strokeDasharray={251.2}
                  initial={{ strokeDashoffset: 251.2 }}
                  animate={{ strokeDashoffset: 251.2 - (251.2 * score) / 100 }}
                  transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1], delay: 0.6 }} />
              </svg>

              <div className="absolute flex flex-col items-center gap-0.5">
                <motion.span initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.9, type: 'spring', stiffness: 130 }}
                  className="text-[44px] font-black leading-none text-brand"
                  style={{ fontFamily: SG }}>
                  {animScore}
                </motion.span>
                <span className="text-[9px] font-black text-ink-300 uppercase tracking-widest" style={{ fontFamily: SG }}>
                  Maturity
                </span>
              </div>
            </div>
            <p className="text-center text-[10px] text-ink-300 font-medium pb-1" style={{ fontFamily: DM }}>
              Composite score across 6 dimensions
            </p>
          </Card>
        </div>

        {/* Radar chart */}
        <div className="lg:col-span-4">
          <Card className="p-6 gap-4 min-h-[310px]">
            <div className="flex items-center justify-between border-b border-accent/[0.06] pb-4">
              <div className="flex items-center gap-2">
                <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 4, repeat: Infinity }}>
                  <BarChart3 className="w-4 h-4" style={{ color: A.sky }} />
                </motion.div>
                <span className="text-[11px] font-black text-ink-300 uppercase tracking-wider" style={{ fontFamily: SG }}>
                  Readiness Radar
                </span>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg"
                style={{ background: `${A.sky}10`, color: A.sky, fontFamily: SG }}>
                6 Dims
              </span>
            </div>

            <div className="flex-1 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart cx="50%" cy="50%" outerRadius="78%" data={radar}>
                  <PolarGrid stroke="#EDE9FF" radialLines={false} />
                  <PolarAngleAxis dataKey="s"
                    tick={{ fill: '#9CA3C0', fontSize: 9, fontWeight: 700, fontFamily: 'Space Grotesk' }}
                    tickLine={false} />
                  <Radar dataKey="A" stroke={A.purple} strokeWidth={2.5}
                    fill={A.purple} fillOpacity={0.12} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="relative h-1.5 rounded-full overflow-hidden" style={{ background: '#F0EDFF' }}>
              <motion.div className="absolute inset-y-0 w-14"
                style={{ background: `linear-gradient(90deg,transparent,${A.sky}55,transparent)` }}
                animate={{ left: ['-20%', '130%'] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }} />
            </div>
          </Card>
        </div>

        {/* Builder tasks */}
        <div className="lg:col-span-4">
          <Card className="p-6 gap-4 min-h-[310px]">
            <div className="flex items-center justify-between border-b border-accent/[0.06] pb-4">
              <div className="flex items-center gap-2">
                <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                  <TrendingUp className="w-4 h-4" style={{ color: A.mint }} />
                </motion.div>
                <span className="text-[11px] font-black text-ink-300 uppercase tracking-wider" style={{ fontFamily: SG }}>
                  Builder Tasks
                </span>
              </div>
              <Link to="/builder" className="text-[11px] font-bold flex items-center gap-1 transition-colors"
                style={{ color: A.mint, fontFamily: SG }}>
                Planner <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="flex-1 flex flex-col gap-4">
              <div className="flex items-end gap-2">
                <motion.span initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5, type: 'spring' }}
                  className="text-[52px] font-black leading-none text-ink-900" style={{ fontFamily: SG }}>
                  {done}
                </motion.span>
                <span className="text-2xl text-ink-100 font-bold mb-1.5" style={{ fontFamily: SG }}>/{total}</span>
                <div className="ml-auto mb-2">
                  <span className="text-[13px] font-black px-3 py-1.5 rounded-xl"
                    style={{ background: `${A.mint}10`, color: A.mint, fontFamily: SG }}>
                    {pct}%
                  </span>
                </div>
              </div>

              <div className="h-2.5 rounded-full overflow-hidden" style={{ background: '#F0EDFF' }}>
                <motion.div className="h-full rounded-full relative overflow-hidden"
                  style={{ background: `linear-gradient(90deg,${A.mint},${A.sky})` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}>
                  <motion.div className="absolute inset-y-0 w-10"
                    style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.55),transparent)' }}
                    animate={{ left: ['-40px', '300px'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: 2.2 }} />
                </motion.div>
              </div>

              <div className="flex-1 space-y-1.5">
                {builderTasks.slice(0, 4).map((t, i) => (
                  <motion.div key={t.id}
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.09, type: 'spring' }}
                    className="flex items-center gap-2.5 py-2 px-2.5 rounded-[12px] hover:bg-accent-ghost/50 transition-colors group cursor-pointer">
                    {t.status === 'completed' ? (
                      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }}>
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: A.mint }} />
                      </motion.div>
                    ) : t.status === 'in_progress' ? (
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-t-transparent animate-spin shrink-0"
                        style={{ borderColor: A.amber, borderTopColor: 'transparent' }} />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-ink-100 shrink-0" />
                    )}
                    <span className="text-[11px] text-ink-500 truncate font-medium group-hover:text-ink-900 transition-colors"
                      style={{ fontFamily: DM }}>
                      {t.title}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* ════════════════════════════════════════
          BOTTOM ROW — AI Card + Docs
      ════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-5">

        {/* AI Recommendation */}
        <motion.div variants={up} className="lg:col-span-4">
          <SpinCard speed={5}>
            <div className="p-7 relative overflow-hidden min-h-[260px] flex flex-col justify-between">
              {[
                { x: '8%',  c: A.purple, d: 0 },
                { x: '22%', c: A.soft,   d: 0.6 },
                { x: '45%', c: A.sky,    d: 1.1 },
                { x: '70%', c: A.amber,  d: 0.35 },
                { x: '88%', c: A.mint,   d: 0.85 },
              ].map((e, i) => <Emit key={i} x={e.x} color={e.c} delay={e.d} />)}

              <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full pointer-events-none"
                style={{ background: `radial-gradient(circle,${A.purple}08,transparent 70%)` }} />

              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.12, 1] }}
                    transition={{ duration: 3.5, repeat: Infinity }}
                    className="w-11 h-11 rounded-[16px] flex items-center justify-center shrink-0"
                    style={{ background: `linear-gradient(135deg,${A.purple},${A.soft})`, boxShadow: `0 6px 24px ${A.purple}40` }}>
                    <Brain className="w-5 h-5 text-white" />
                  </motion.div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full"
                    style={{ background: `${A.purple}08`, color: A.purple, fontFamily: SG }}>
                    AI Recommendation
                  </span>
                </div>

                <h3 className="text-2xl font-black text-ink-900 leading-snug" style={{ fontFamily: SG }}>
                  Address Regulatory{' '}
                  <span className="text-brand">Compliance</span>
                  {' '}Now
                </h3>

                <p className="text-[13px] text-ink-500 leading-relaxed max-w-md" style={{ fontFamily: DM }}>
                  Municipal law requires sanitary certificates for kiosk operations. Draft a{' '}
                  <strong className="text-ink-900 font-semibold">DPR report</strong> and pursue{' '}
                  <strong className="text-ink-900 font-semibold">DPIIT recognition</strong> for eco-tax waivers.
                </p>
              </div>

              <div className="relative z-10 flex flex-wrap gap-3 pt-5 border-t border-accent/[0.06] mt-4">
                <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }}>
                  <Link to="/generator" className="btn-primary text-[12px]">
                    <Rocket className="w-3.5 h-3.5" /> Draft DPR Report
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }}>
                  <Link to="/mentor/chat/government-mentor" className="btn-ghost text-[12px]">
                    Consult Mentor <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </motion.div>
              </div>
            </div>
          </SpinCard>
        </motion.div>

        {/* Recent documents */}
        <motion.div variants={up} className="lg:col-span-3">
          <Card className="p-6 min-h-[260px] gap-4">
            <div className="flex items-center justify-between border-b border-accent/[0.06] pb-4">
              <div className="flex items-center gap-2">
                <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 2.4, repeat: Infinity }}>
                  <FileText className="w-4 h-4 text-accent" />
                </motion.div>
                <span className="text-[11px] font-black text-ink-300 uppercase tracking-wider" style={{ fontFamily: SG }}>
                  Recent Files
                </span>
              </div>
              <Link to="/workspace"
                className="flex items-center gap-1 text-[10px] font-bold text-accent transition-colors" style={{ fontFamily: SG }}>
                <Plus className="w-3 h-3" /> Upload
              </Link>
            </div>

            <div className="flex-1 flex flex-col gap-1.5">
              {docs.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-3 py-8">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 8, -8, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="w-14 h-14 rounded-[18px] flex items-center justify-center"
                    style={{ background: `${A.purple}08`, border: `1.5px solid ${A.purple}15` }}>
                    <FileText className="w-7 h-7 text-accent" />
                  </motion.div>
                  <p className="text-[12px] text-ink-300 font-medium" style={{ fontFamily: DM }}>
                    No documents yet
                  </p>
                  <Link to="/workspace" className="text-[12px] font-bold text-accent transition-colors" style={{ fontFamily: SG }}>
                    Upload your first file →
                  </Link>
                </div>
              ) : (
                docs.map((doc, i) => (
                  <motion.div key={doc.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08, type: 'spring' }}
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-3 py-3 px-3 rounded-[14px] cursor-pointer border border-transparent hover:border-accent/[0.1] hover:bg-accent-ghost/40 transition-all">
                    <motion.div whileHover={{ scale: 1.1, rotate: 8 }}
                      className="w-9 h-9 rounded-[12px] flex items-center justify-center shrink-0"
                      style={{ background: `${A.purple}08`, border: `1px solid ${A.purple}15` }}>
                      <FileText className="w-4 h-4 text-accent" />
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] text-ink-900 font-semibold truncate" style={{ fontFamily: DM }}>
                        {doc.title}
                      </p>
                      <p className="text-[10px] text-ink-300 font-medium">
                        {new Date(doc.analyzedAt!).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-ink-300 shrink-0" />
                  </motion.div>
                ))
              )}
            </div>

            <motion.div whileHover={{ x: 3 }}>
              <Link to="/workspace"
                className="flex items-center justify-center gap-1.5 pt-4 border-t border-accent/[0.06] text-[11px] font-bold text-accent transition-colors"
                style={{ fontFamily: SG }}>
                Manage All Files
                <motion.div animate={{ x: [0, 3, 0] }} transition={{ duration: 1.4, repeat: Infinity }}>
                  <ArrowRight className="w-3 h-3" />
                </motion.div>
              </Link>
            </motion.div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashboardHome;

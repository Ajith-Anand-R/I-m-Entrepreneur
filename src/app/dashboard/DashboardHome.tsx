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

/* ── Fonts as constants ── */
const SG = "'Space Grotesk',sans-serif";
const DM = "'DM Sans',sans-serif";

/* ── Design tokens (match index.css) ── */
const C = {
  purple: '#6C47FF',
  pink:   '#F40076',
  cyan:   '#00C2FF',
  teal:   '#00D4AA',
  amber:  '#FFAA00',
  coral:  '#FF4D6D',
};

/* ── Stagger animation preset ── */
const page = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const up = {
  hidden: { opacity: 0, y: 32 },
  show:   { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 75, damping: 15 } },
};

/* ── Audio visualizer bar ── */
const VBar: React.FC<{ delay: number; a?: string; b?: string }> = ({
  delay, a = C.purple, b = C.cyan,
}) => (
  <motion.div className="w-[3px] rounded-full"
    style={{ background: `linear-gradient(to top, ${a}, ${b})` }}
    animate={{ height: ['4px','22px','7px','24px','5px','18px'] }}
    transition={{ duration: 1.6, repeat: Infinity, delay, ease: 'easeInOut', repeatType: 'reverse' }} />
);

/* ── Coloured particle emitter ── */
const Emit: React.FC<{ x: string; color: string; delay: number }> = ({ x, color, delay }) => (
  <motion.div className="absolute bottom-5 w-2 h-2 rounded-full pointer-events-none"
    style={{ left: x, background: color }}
    animate={{ y: [0, -55, -110], opacity: [0, 1, 0], scale: [0.4, 1.4, 0.2] }}
    transition={{ duration: 2.4, repeat: Infinity, delay, ease: 'easeOut' }} />
);

/* ── Premium card wrapper ── */
const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}> = ({ children, className = '', style = {}, onClick }) => (
  <motion.div
    variants={up}
    whileHover={{ y: -4, boxShadow: '0 20px 50px rgba(108,71,255,0.1), 0 6px 16px rgba(0,0,0,0.06)' }}
    onClick={onClick}
    className={`bg-white rounded-[22px] border flex flex-col overflow-hidden ${className}`}
    style={{
      borderColor: 'rgba(108,71,255,0.1)',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)',
      transition: 'box-shadow 250ms ease, transform 250ms cubic-bezier(0.16,1,0.3,1)',
      ...style,
    }}>
    {children}
  </motion.div>
);

/* ── Spinning conic border card ── */
const SpinCard: React.FC<{ children: React.ReactNode; speed?: number }> = ({ children, speed = 4 }) => (
  <div className="relative rounded-[24px] overflow-hidden" style={{ padding: '1.5px' }}>
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
      className="absolute -inset-[100%] w-[300%] h-[300%] origin-center"
      style={{ background: `conic-gradient(from 0deg, ${C.purple}, ${C.pink}, ${C.cyan}, ${C.amber}, ${C.teal}, ${C.purple})` }} />
    <div className="relative rounded-[22.5px] bg-white overflow-hidden h-full" style={{ zIndex: 1 }}>
      {children}
    </div>
  </div>
);

/* ── Stat chip in hero ── */
const Chip: React.FC<{ label: string; value: string; icon: React.ElementType }> = ({ label, value, icon: Icon }) => (
  <motion.div
    whileHover={{ scale: 1.06, y: -2 }}
    className="flex items-center gap-2.5 pl-3 pr-4 py-2.5 rounded-2xl backdrop-blur-sm cursor-default"
    style={{ background: 'rgba(255,255,255,0.09)', border: '1px solid rgba(255,255,255,0.18)' }}>
    <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0"
      style={{ background: 'rgba(255,255,255,0.12)' }}>
      <Icon className="w-3.5 h-3.5 text-white/80" />
    </div>
    <div>
      <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest leading-none" style={{ fontFamily: SG }}>
        {label}
      </p>
      <p className="text-[15px] font-black text-white leading-tight" style={{ fontFamily: SG }}>
        {value}
      </p>
    </div>
  </motion.div>
);

/* ══════════════════════════════════════════════════════════ */
export const DashboardHome: React.FC = () => {
  const { startupName, founderName, vision, score, currentJourneyLevel, builderTasks } = useStartupStore();
  const [docs, setDocs] = useState<DocumentRecord[]>([]);

  const { value: animScore, ref: scoreRef } = useCountUp(score, 2000, 300);
  const { value: animLevel, ref: levelRef } = useCountUp(currentJourneyLevel, 1400, 500);

  const done    = builderTasks.filter(t => t.status === 'completed').length;
  const active  = builderTasks.filter(t => t.status === 'in_progress').length;
  const total   = builderTasks.length;
  const pct     = Math.round((done / (total || 1)) * 100);

  useEffect(() => {
    db.documents.orderBy('analyzedAt').reverse().limit(4).toArray().then(setDocs);
  }, []);

  const radar = [
    { s: 'Validation', A: 85 }, { s: 'Business', A: 70 },
    { s: 'Team',       A: 60 }, { s: 'Finance',  A: 42 },
    { s: 'Investor',   A: 32 }, { s: 'Ops',      A: 75 },
  ];

  const kpis = [
    { label: 'Maturity',   value: `${score}%`,          sub: '+5% this week',   icon: Target,       a: C.purple, bg: 'rgba(108,71,255,0.07)', bd: 'rgba(108,71,255,0.15)', topLine: `linear-gradient(90deg,${C.purple},${C.pink})` },
    { label: 'Tasks Done', value: `${done}/${total}`,    sub: `${pct}% complete`,icon: CheckCircle2, a: C.teal,   bg: 'rgba(0,212,170,0.07)',  bd: 'rgba(0,212,170,0.15)',  topLine: `linear-gradient(90deg,${C.teal},${C.cyan})` },
    { label: 'In Progress',value: String(active),        sub: 'Active now',      icon: Layers,       a: C.amber,  bg: 'rgba(255,170,0,0.07)',  bd: 'rgba(255,170,0,0.15)',  topLine: `linear-gradient(90deg,${C.amber},${C.coral})` },
    { label: 'Documents',  value: String(docs.length||0),sub: 'Analysed',        icon: FileText,     a: C.cyan,   bg: 'rgba(0,194,255,0.07)',  bd: 'rgba(0,194,255,0.15)',  topLine: `linear-gradient(90deg,${C.cyan},${C.teal})` },
  ];

  return (
    <motion.div variants={page} initial="hidden" animate="show" className="max-w-7xl mx-auto space-y-6">

      {/* ════════════════════════════════════════
          HERO CARD — Dark cosmos
      ════════════════════════════════════════ */}
      <motion.div variants={up}
        className="relative overflow-hidden rounded-[28px]"
        style={{
          background: 'linear-gradient(145deg,#0A0A0F 0%,#120A24 40%,#0A1230 80%,#0A0A0F 100%)',
          boxShadow: '0 32px 80px rgba(108,71,255,0.2), 0 8px 24px rgba(0,0,0,0.3)',
        }}>

        {/* Particle field */}
        <ParticleField density={40} speed={0.3} />

        {/* Ambient colour blobs */}
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full pointer-events-none"
          style={{ background:`radial-gradient(circle,rgba(108,71,255,0.2) 0%,transparent 70%)`, animation:'orb-a 16s ease-in-out infinite' }} />
        <div className="absolute bottom-0 right-10 w-64 h-64 rounded-full pointer-events-none"
          style={{ background:`radial-gradient(circle,rgba(0,194,255,0.15) 0%,transparent 70%)`, animation:'orb-b 20s ease-in-out infinite' }} />
        <div className="absolute top-1/2 -translate-y-1/2 left-1/3 w-44 h-44 rounded-full pointer-events-none"
          style={{ background:`radial-gradient(circle,rgba(244,0,118,0.12) 0%,transparent 70%)`, animation:'orb-c 13s ease-in-out infinite' }} />

        {/* Sheen sweep */}
        <motion.div
          className="absolute inset-y-0 w-32 pointer-events-none z-10"
          style={{ background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.04),transparent)' }}
          animate={{ left:['-20%','120%'] }}
          transition={{ duration:5, repeat:Infinity, ease:'linear' }} />

        {/* Top gradient line */}
        <div className="absolute inset-x-0 top-0 h-[1.5px]"
          style={{ background:`linear-gradient(90deg,transparent,${C.purple},${C.pink},${C.cyan},transparent)` }} />

        {/* Content */}
        <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row md:items-center gap-8 md:gap-12">

          {/* ── Left: text ── */}
          <div className="flex-1 space-y-5">
            {/* Status pill */}
            <motion.div
              animate={{ opacity:[0.7,1,0.7] }}
              transition={{ duration:2.2, repeat:Infinity }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full"
              style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)' }}>
              <div className="flex items-end gap-[2px] h-4">
                {[0,0.12,0.26,0.08,0.2].map((d,i) => <VBar key={i} delay={d} />)}
              </div>
              <span className="text-[10px] font-bold text-white/50 tracking-[0.22em] uppercase" style={{ fontFamily:SG }}>
                Command Center
              </span>
              <motion.span animate={{ opacity:[0.4,1,0.4] }} transition={{ duration:1.6,repeat:Infinity }}
                className="block w-1.5 h-1.5 rounded-full" style={{ background:C.teal }} />
            </motion.div>

            {/* Greeting */}
            <div>
              <p className="text-sm font-medium mb-1" style={{ color:'rgba(255,255,255,0.4)', fontFamily:DM }}>
                Welcome back
              </p>
              <h1 className="text-3xl md:text-[42px] font-black text-white leading-[1.1]" style={{ fontFamily:SG }}>
                {founderName}
                <motion.span className="ml-2 inline-block"
                  animate={{ y:[0,-8,0], rotate:[-5,5,-5] }}
                  transition={{ duration:3, repeat:Infinity, ease:'easeInOut' }}>
                  🚀
                </motion.span>
              </h1>
              <p className="text-[13px] mt-2.5 max-w-lg leading-relaxed font-medium"
                style={{ color:'rgba(255,255,255,0.38)', fontFamily:DM }}>
                {vision || 'Building the future, one milestone at a time.'}
              </p>
            </div>

            {/* Stat chips */}
            <div className="flex flex-wrap gap-3">
              <Chip label="Maturity" value={`${score}%`}          icon={Target}   />
              <Chip label="Journey"  value={`${currentJourneyLevel}/15`} icon={BookOpen} />
              <Chip label="Done"     value={`${done}/${total}`}   icon={Zap}      />
            </div>
          </div>

          {/* ── Right: float card ── */}
          <div className="shrink-0 flex flex-col items-center">
            <motion.div
              animate={{ y:[0,-10,0] }}
              transition={{ duration:5, repeat:Infinity, ease:'easeInOut' }}
              className="w-[180px] rounded-[22px] border p-6 text-center relative overflow-hidden"
              style={{ background:'rgba(255,255,255,0.05)', borderColor:'rgba(255,255,255,0.12)' }}>
              {/* Glow corner */}
              <div className="absolute -bottom-6 -right-6 w-20 h-20 rounded-full"
                style={{ background:`radial-gradient(circle,${C.amber}30,transparent 70%)` }} />

              <div ref={levelRef}>
                <motion.div
                  animate={{ rotate:[0,12,-12,0], scale:[1,1.1,1] }}
                  transition={{ duration:3.5, repeat:Infinity }}>
                  <BookOpen className="w-8 h-8 mx-auto" style={{ color:C.amber }} />
                </motion.div>
                <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.25em] mt-3 mb-1" style={{ fontFamily:SG }}>
                  Journey Level
                </p>
                <p className="text-[52px] font-black text-white leading-none" style={{ fontFamily:SG }}>
                  {animLevel}
                  <span className="text-[22px] text-white/25">/15</span>
                </p>
              </div>

              <Link to="/journey"
                className="inline-flex items-center gap-1 text-[11px] font-bold mt-2 transition-colors"
                style={{ color:C.amber, fontFamily:SG }}>
                Continue
                <motion.div animate={{ x:[0,4,0] }} transition={{ duration:1.2, repeat:Infinity }}>
                  <ArrowRight className="w-3 h-3" />
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* ════════════════════════════════════════
          KPI STRIP — 4 accent cards
      ════════════════════════════════════════ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <Card key={k.label} style={{ background: k.bg, borderColor: k.bd }}>
              {/* Top accent line */}
              <div className="h-[3px] w-full rounded-t-[22px]" style={{ background: k.topLine }} />
              <div className="p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider" style={{ fontFamily:SG }}>
                    {k.label}
                  </p>
                  <div className="w-8 h-8 rounded-[11px] flex items-center justify-center"
                    style={{ background:`${k.a}18` }}>
                    <Icon className="w-[15px] h-[15px]" style={{ color:k.a }} />
                  </div>
                </div>
                <p className="text-[30px] font-black leading-none" style={{ color:k.a, fontFamily:SG }}>
                  {k.value}
                </p>
                <p className="text-[11px] text-gray-400 font-medium" style={{ fontFamily:DM }}>
                  {k.sub}
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* ════════════════════════════════════════
          BENTO GRID — Score · Radar · Tasks
      ════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* ── Score ring (4 cols) ── */}
        <div className="lg:col-span-4">
          <Card className="p-6 gap-4 min-h-[310px]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2">
                <motion.div animate={{ rotate:360 }} transition={{ duration:8, repeat:Infinity, ease:'linear' }}>
                  <Target className="w-4 h-4" style={{ color:C.purple }} />
                </motion.div>
                <span className="text-[11px] font-black text-gray-400 uppercase tracking-wider" style={{ fontFamily:SG }}>
                  Maturity Index
                </span>
              </div>
              <Link to="/score"
                className="flex items-center gap-1 text-[11px] font-bold transition-colors"
                style={{ color:C.purple, fontFamily:SG }}>
                Full Report <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Ring */}
            <div ref={scoreRef} className="flex-1 flex items-center justify-center relative py-2">
              {/* Breathing ambient glow */}
              <motion.div
                animate={{ scale:[1,1.15,1], opacity:[0.15,0.35,0.15] }}
                transition={{ duration:3, repeat:Infinity }}
                className="absolute w-44 h-44 rounded-full pointer-events-none"
                style={{ background:`radial-gradient(circle,${C.purple} 0%,transparent 70%)` }} />

              <svg className="w-40 h-40 -rotate-90" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%"   stopColor={C.purple} />
                    <stop offset="50%"  stopColor={C.pink} />
                    <stop offset="100%" stopColor={C.cyan} />
                  </linearGradient>
                  <filter id="ring-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="2" result="b" />
                    <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>
                {/* Track */}
                <circle cx="50" cy="50" r="40" fill="none" stroke="#F4F3FF" strokeWidth="7" />
                {/* Progress arc */}
                <motion.circle
                  cx="50" cy="50" r="40" fill="none"
                  stroke="url(#ring-grad)" strokeWidth="7" strokeLinecap="round"
                  filter="url(#ring-glow)"
                  strokeDasharray={251.2}
                  initial={{ strokeDashoffset: 251.2 }}
                  animate={{ strokeDashoffset: 251.2 - (251.2 * score) / 100 }}
                  transition={{ duration:2.4, ease:[0.16,1,0.3,1], delay:0.6 }} />
              </svg>

              {/* Centre label */}
              <div className="absolute flex flex-col items-center gap-0.5">
                <motion.span
                  initial={{ scale:0.5, opacity:0 }}
                  animate={{ scale:1, opacity:1 }}
                  transition={{ delay:0.9, type:'spring', stiffness:130 }}
                  className="text-[44px] font-black leading-none"
                  style={{ fontFamily:SG, background:`linear-gradient(135deg,${C.purple},${C.pink})`,
                    WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                  {animScore}
                </motion.span>
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest" style={{ fontFamily:SG }}>
                  Maturity
                </span>
              </div>
            </div>

            <p className="text-center text-[10px] text-gray-400 font-medium pb-1" style={{ fontFamily:DM }}>
              Composite score across 6 dimensions
            </p>
          </Card>
        </div>

        {/* ── Radar chart (4 cols) ── */}
        <div className="lg:col-span-4">
          <Card className="p-6 gap-4 min-h-[310px]">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2">
                <motion.div animate={{ rotate:[0,15,-15,0] }} transition={{ duration:4, repeat:Infinity }}>
                  <BarChart3 className="w-4 h-4" style={{ color:C.cyan }} />
                </motion.div>
                <span className="text-[11px] font-black text-gray-400 uppercase tracking-wider" style={{ fontFamily:SG }}>
                  Readiness Radar
                </span>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg" style={{ background:`${C.cyan}12`, color:C.cyan, fontFamily:SG }}>
                6 Dims
              </span>
            </div>

            <div className="flex-1 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart cx="50%" cy="50%" outerRadius="78%" data={radar}>
                  <PolarGrid stroke="#EDE9FF" radialLines={false} />
                  <PolarAngleAxis dataKey="s"
                    tick={{ fill:'#9090AA', fontSize:9, fontWeight:700, fontFamily:'Space Grotesk' }}
                    tickLine={false} />
                  <Radar dataKey="A"
                    stroke={C.purple} strokeWidth={2.5}
                    fill={C.purple} fillOpacity={0.12} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Scanning pulse */}
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background:'#F4F3FF' }}>
              <motion.div className="absolute inset-y-0 w-14"
                style={{ background:`linear-gradient(90deg,transparent,${C.cyan}55,transparent)` }}
                animate={{ left:['-20%','130%'] }}
                transition={{ duration:2.2, repeat:Infinity, ease:'linear' }} />
            </div>
          </Card>
        </div>

        {/* ── Builder tasks (4 cols) ── */}
        <div className="lg:col-span-4">
          <Card className="p-6 gap-4 min-h-[310px]">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2">
                <motion.div animate={{ y:[0,-3,0] }} transition={{ duration:2, repeat:Infinity }}>
                  <TrendingUp className="w-4 h-4" style={{ color:C.teal }} />
                </motion.div>
                <span className="text-[11px] font-black text-gray-400 uppercase tracking-wider" style={{ fontFamily:SG }}>
                  Builder Tasks
                </span>
              </div>
              <Link to="/builder"
                className="text-[11px] font-bold flex items-center gap-1 transition-colors"
                style={{ color:C.teal, fontFamily:SG }}>
                Planner <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="flex-1 flex flex-col gap-4">
              {/* Big count */}
              <div className="flex items-end gap-2">
                <motion.span
                  initial={{ scale:0.5, opacity:0 }}
                  animate={{ scale:1, opacity:1 }}
                  transition={{ delay:0.5, type:'spring' }}
                  className="text-[52px] font-black leading-none text-gray-900"
                  style={{ fontFamily:SG }}>
                  {done}
                </motion.span>
                <span className="text-2xl text-gray-200 font-bold mb-1.5" style={{ fontFamily:SG }}>/{total}</span>
                <div className="ml-auto mb-2">
                  <span className="text-[13px] font-black px-3 py-1.5 rounded-xl"
                    style={{ background:`${C.teal}15`, color:C.teal, fontFamily:SG }}>
                    {pct}%
                  </span>
                </div>
              </div>

              {/* Progress bar with shimmer */}
              <div className="h-2.5 rounded-full overflow-hidden" style={{ background:'#F4F3FF' }}>
                <motion.div className="h-full rounded-full relative overflow-hidden"
                  style={{ background:`linear-gradient(90deg,${C.teal},${C.cyan})` }}
                  initial={{ width:0 }}
                  animate={{ width:`${pct}%` }}
                  transition={{ duration:1.8, ease:[0.16,1,0.3,1], delay:0.5 }}>
                  <motion.div className="absolute inset-y-0 w-10"
                    style={{ background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.55),transparent)' }}
                    animate={{ left:['-40px','300px'] }}
                    transition={{ duration:2, repeat:Infinity, ease:'linear', delay:2.2 }} />
                </motion.div>
              </div>

              {/* Task list */}
              <div className="flex-1 space-y-1.5">
                {builderTasks.slice(0,4).map((t, i) => (
                  <motion.div key={t.id}
                    initial={{ opacity:0, x:-14 }}
                    animate={{ opacity:1, x:0 }}
                    transition={{ delay:0.6+i*0.09, type:'spring' }}
                    className="flex items-center gap-2.5 py-2 px-2.5 rounded-[12px] hover:bg-gray-50 transition-colors group cursor-pointer">
                    {t.status === 'completed' ? (
                      <motion.div animate={{ scale:[1,1.2,1] }} transition={{ duration:2.5, repeat:Infinity, delay:i*0.3 }}>
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color:C.teal }} />
                      </motion.div>
                    ) : t.status === 'in_progress' ? (
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-t-transparent animate-spin shrink-0"
                        style={{ borderColor:C.amber, borderTopColor:'transparent' }} />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-200 shrink-0" />
                    )}
                    <span className="text-[11px] text-gray-600 truncate font-medium group-hover:text-gray-900 transition-colors"
                      style={{ fontFamily:DM }}>
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
          BOTTOM ROW — AI Card + Recent Docs
      ════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-5">

        {/* ── Spinning border AI card (4 cols) ── */}
        <motion.div variants={up} className="lg:col-span-4">
          <SpinCard speed={5}>
            <div className="p-7 relative overflow-hidden min-h-[260px] flex flex-col justify-between">
              {/* Floating particles */}
              {[
                {x:'8%',  c:C.purple, d:0},
                {x:'22%', c:C.pink,   d:0.6},
                {x:'45%', c:C.cyan,   d:1.1},
                {x:'70%', c:C.amber,  d:0.35},
                {x:'88%', c:C.teal,   d:0.85},
              ].map((e,i) => <Emit key={i} x={e.x} color={e.c} delay={e.d} />)}

              {/* Ambient blur */}
              <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full pointer-events-none"
                style={{ background:`radial-gradient(circle,${C.purple}10,transparent 70%)` }} />

              {/* Top section */}
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate:[0,20,-20,0], scale:[1,1.12,1] }}
                    transition={{ duration:3.5, repeat:Infinity }}
                    className="w-11 h-11 rounded-[16px] flex items-center justify-center shrink-0"
                    style={{ background:`linear-gradient(135deg,${C.purple},${C.pink})`, boxShadow:`0 6px 24px ${C.purple}40` }}>
                    <Brain className="w-5.5 h-5.5 text-white" />
                  </motion.div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full"
                      style={{ background:`${C.purple}12`, color:C.purple, fontFamily:SG }}>
                      AI Recommendation
                    </span>
                  </div>
                </div>

                <h3 className="text-2xl font-black text-gray-900 leading-snug" style={{ fontFamily:SG }}>
                  Address Regulatory{' '}
                  <span style={{ background:`linear-gradient(135deg,${C.purple},${C.pink})`,
                    WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                    Compliance
                  </span>
                  {' '}Now
                </h3>

                <p className="text-[13px] text-gray-500 leading-relaxed max-w-md" style={{ fontFamily:DM }}>
                  Municipal law requires sanitary certificates for kiosk operations. Draft a{' '}
                  <strong className="text-gray-700 font-semibold">DPR report</strong> and pursue{' '}
                  <strong className="text-gray-700 font-semibold">DPIIT recognition</strong> for eco-tax waivers.
                </p>
              </div>

              {/* Actions */}
              <div className="relative z-10 flex flex-wrap gap-3 pt-5 border-t border-gray-100 mt-4">
                <motion.div whileHover={{ scale:1.04, y:-2 }} whileTap={{ scale:0.96 }}>
                  <Link to="/generator" className="btn-brand">
                    <Rocket className="w-3.5 h-3.5" />
                    Draft DPR Report
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale:1.04, y:-2 }} whileTap={{ scale:0.96 }}>
                  <Link to="/mentor/chat/government-mentor" className="btn-ghost">
                    Consult Mentor
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </motion.div>
              </div>
            </div>
          </SpinCard>
        </motion.div>

        {/* ── Recent documents (3 cols) ── */}
        <motion.div variants={up} className="lg:col-span-3">
          <Card className="p-6 min-h-[260px] gap-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2">
                <motion.div animate={{ y:[0,-3,0] }} transition={{ duration:2.4, repeat:Infinity }}>
                  <FileText className="w-4 h-4" style={{ color:C.purple }} />
                </motion.div>
                <span className="text-[11px] font-black text-gray-400 uppercase tracking-wider" style={{ fontFamily:SG }}>
                  Recent Files
                </span>
              </div>
              <Link to="/workspace"
                className="flex items-center gap-1 text-[10px] font-bold transition-colors"
                style={{ color:C.purple, fontFamily:SG }}>
                <Plus className="w-3 h-3" /> Upload
              </Link>
            </div>

            <div className="flex-1 flex flex-col gap-1.5">
              {docs.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-3 py-8">
                  <motion.div
                    animate={{ scale:[1,1.1,1], rotate:[0,8,-8,0] }}
                    transition={{ duration:4, repeat:Infinity }}
                    className="w-14 h-14 rounded-[18px] flex items-center justify-center"
                    style={{ background:`${C.purple}0D`, border:`1.5px solid ${C.purple}20` }}>
                    <FileText className="w-7 h-7" style={{ color:C.purple }} />
                  </motion.div>
                  <p className="text-[12px] text-gray-400 font-medium" style={{ fontFamily:DM }}>
                    No documents yet
                  </p>
                  <Link to="/workspace" className="text-[12px] font-bold transition-colors"
                    style={{ color:C.purple, fontFamily:SG }}>
                    Upload your first file →
                  </Link>
                </div>
              ) : (
                docs.map((doc, i) => (
                  <motion.div key={doc.id}
                    initial={{ opacity:0, x:-16 }}
                    animate={{ opacity:1, x:0 }}
                    transition={{ delay:i*0.08, type:'spring' }}
                    whileHover={{ x:4 }}
                    className="flex items-center gap-3 py-3 px-3 rounded-[14px] cursor-pointer border border-transparent hover:border-purple-100 hover:bg-purple-50/50 transition-all">
                    <motion.div whileHover={{ scale:1.1, rotate:8 }}
                      className="w-9 h-9 rounded-[12px] flex items-center justify-center shrink-0"
                      style={{ background:`${C.purple}0D`, border:`1px solid ${C.purple}20` }}>
                      <FileText className="w-4 h-4" style={{ color:C.purple }} />
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] text-gray-800 font-semibold truncate" style={{ fontFamily:DM }}>
                        {doc.title}
                      </p>
                      <p className="text-[10px] text-gray-400 font-medium">
                        {new Date(doc.analyzedAt!).toLocaleDateString(undefined,{month:'short',day:'numeric'})}
                      </p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                  </motion.div>
                ))
              )}
            </div>

            <motion.div whileHover={{ x:3 }}>
              <Link to="/workspace"
                className="flex items-center justify-center gap-1.5 pt-4 border-t border-gray-100 text-[11px] font-bold transition-colors"
                style={{ color:C.purple, fontFamily:SG }}>
                Manage All Files
                <motion.div animate={{ x:[0,3,0] }} transition={{ duration:1.4, repeat:Infinity }}>
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

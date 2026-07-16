import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import {
  LayoutDashboard, Briefcase, BookOpen, MessageSquare,
  MoreHorizontal, Bell, ArrowRight, Sparkles, X, Activity,
  ChevronRight,
} from 'lucide-react';
import { useStartupStore } from '../store/useStartupStore';
import { NotificationPanel } from './NotificationPanel';
import { useAuth } from '../contexts/AuthContext';

interface AppShellProps { children: React.ReactNode; }

/* ── Design tokens (mirror CSS vars) ── */
const T = {
  purple: '#6C47FF',
  pink:   '#F40076',
  cyan:   '#00C2FF',
  teal:   '#00D4AA',
  amber:  '#FFAA00',
  coral:  '#FF4D6D',
  dark:   '#0A0A0F',
  dark2:  '#111118',
  dark3:  '#18181F',
  border: 'rgba(255,255,255,0.07)',
  borderStrong: 'rgba(255,255,255,0.12)',
};

const NAV = [
  {
    to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard,
    color: T.purple,  bg: 'rgba(108,71,255,0.14)', shadow: '0 6px 20px rgba(108,71,255,0.4)',
    grad:   'linear-gradient(135deg,#6C47FF,#8B5CF6)',
  },
  {
    to: '/workspace', label: 'Workspace', icon: Briefcase,
    color: T.cyan,    bg: 'rgba(0,194,255,0.12)',   shadow: '0 6px 20px rgba(0,194,255,0.4)',
    grad:   'linear-gradient(135deg,#00C2FF,#00D4AA)',
  },
  {
    to: '/journey',   label: 'Journey',   icon: BookOpen,
    color: T.amber,   bg: 'rgba(255,170,0,0.12)',   shadow: '0 6px 20px rgba(255,170,0,0.4)',
    grad:   'linear-gradient(135deg,#FFAA00,#FF4D6D)',
    primary: true,
  },
  {
    to: '/mentor',    label: 'AI Mentor', icon: MessageSquare,
    color: T.pink,    bg: 'rgba(244,0,118,0.12)',   shadow: '0 6px 20px rgba(244,0,118,0.4)',
    grad:   'linear-gradient(135deg,#F40076,#FF4D6D)',
  },
  {
    to: '/more',      label: 'More',      icon: MoreHorizontal,
    color: '#64748B', bg: 'rgba(100,116,139,0.12)', shadow: '0 6px 20px rgba(100,116,139,0.3)',
    grad:   'linear-gradient(135deg,#64748B,#94A3B8)',
  },
];

/* ── Magnetic nav item ── */
const Mag: React.FC<{ children: React.ReactNode; s?: number }> = ({ children, s = 0.25 }) => {
  const mx = useMotionValue(0), my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 300, damping: 22 });
  const y = useSpring(my, { stiffness: 300, damping: 22 });
  return (
    <motion.div style={{ x, y }}
      onMouseMove={e => { const r = e.currentTarget.getBoundingClientRect(); mx.set((e.clientX-r.left-r.width/2)*s); my.set((e.clientY-r.top-r.height/2)*s); }}
      onMouseLeave={() => { mx.set(0); my.set(0); }}>
      {children}
    </motion.div>
  );
};

/* ── Audio bar ── */
const Bar: React.FC<{ d: number }> = ({ d }) => (
  <motion.div className="w-[3px] rounded-full"
    style={{ background: 'linear-gradient(to top,#6C47FF,#00C2FF)' }}
    animate={{ height: ['4px','20px','7px','22px','5px','16px'] }}
    transition={{ duration: 1.5, repeat: Infinity, delay: d, ease: 'easeInOut', repeatType: 'reverse' }} />
);

/* ══════════════════════════════════════════════════════════ */
export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const { startupName, score } = useStartupStore();
  const { user, logout } = useAuth();
  const [showNotif, setShowNotif] = useState(false);
  const [showChat,  setShowChat]  = useState(false);
  const location = useLocation();

  const isAuth = ['/login','/signup','/onboarding','/splash'].some(p => location.pathname.startsWith(p)) || location.pathname === '/';
  if (isAuth) return <>{children}</>;

  const active = NAV.find(n => n.to==='/dashboard' ? location.pathname==='/dashboard' : location.pathname.startsWith(n.to)) ?? NAV[0];

  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ background: '#F4F3FF', fontFamily: "'DM Sans',sans-serif" }}>

      {/* ════════════════════════════════════════
          DESKTOP SIDEBAR
      ════════════════════════════════════════ */}
      <aside className="hidden md:flex md:w-[264px] shrink-0 z-30">
        <div className="fixed top-0 left-0 w-[264px] h-screen flex flex-col overflow-hidden"
          style={{ background: T.dark, borderRight: `1px solid ${T.border}` }}>

          {/* Ambient blobs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="orb orb-purple absolute w-72 h-72 -top-24 -left-16" />
            <div className="orb orb-pink absolute w-56 h-56 bottom-0 -right-8" />
          </div>

          {/* ── Brand ── */}
          <div className="relative z-10 flex items-center gap-3.5 px-6 pt-8 pb-6"
            style={{ borderBottom: `1px solid ${T.border}` }}>
            <div className="relative w-10 h-10 shrink-0">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-2xl"
                style={{ border: '1.5px dashed rgba(108,71,255,0.5)' }} />
              <div className="absolute inset-[2px] rounded-[14px] flex items-center justify-center font-black text-white text-[12px]"
                style={{ background: 'linear-gradient(135deg,#6C47FF,#F40076)', fontFamily:"'Space Grotesk',sans-serif",
                  boxShadow:'0 4px 16px rgba(108,71,255,0.5)' }}>
                IE
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[13px] text-white truncate" style={{ fontFamily:"'Space Grotesk',sans-serif" }}>
                {startupName}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <motion.span animate={{ opacity:[0.4,1,0.4] }} transition={{ duration:1.8,repeat:Infinity }}
                  className="block w-1.5 h-1.5 rounded-full" style={{ background: T.teal }} />
                <span className="text-[10px] font-bold tracking-wider uppercase" style={{ color: T.teal }}>Active</span>
              </div>
            </div>
          </div>

          {/* ── Navigation ── */}
          <nav className="relative z-10 flex-1 px-4 pt-6 space-y-1 overflow-y-auto">
            <p className="px-3 mb-4 text-[9px] font-bold tracking-[0.2em] uppercase"
              style={{ color:'rgba(255,255,255,0.22)', fontFamily:"'Space Grotesk',sans-serif" }}>
              Navigation
            </p>

            {NAV.map(item => {
              const Icon = item.icon;
              return (
                <Mag key={item.to}>
                  <NavLink to={item.to} end={item.to==='/'}>
                    {({ isActive: ia }) => (
                      <motion.div
                        whileTap={{ scale: 0.95 }}
                        className="relative flex items-center gap-3 px-3.5 py-3 rounded-[16px] cursor-pointer overflow-hidden group"
                        style={{
                          background: ia ? item.bg : 'transparent',
                          border:     ia ? `1px solid ${item.color}30` : '1px solid transparent',
                          transition: 'all 200ms ease',
                        }}
                      >
                        {/* Hover fill */}
                        <div className="absolute inset-0 rounded-[16px] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          style={{ background:'rgba(255,255,255,0.04)' }} />

                        {/* Active glow blob */}
                        {ia && (
                          <motion.div layoutId="sb-blob" initial={false}
                            transition={{ type:'spring', stiffness:380, damping:32 }}
                            className="absolute inset-0 rounded-[16px] pointer-events-none"
                            style={{ background:`radial-gradient(ellipse at 18% 50%, ${item.color}18, transparent 70%)` }} />
                        )}

                        {/* Icon */}
                        <div className="relative w-8 h-8 rounded-[12px] flex items-center justify-center shrink-0 transition-all duration-250"
                          style={{
                            background: ia ? item.grad : 'rgba(255,255,255,0.06)',
                            boxShadow:  ia ? item.shadow : 'none',
                          }}>
                          <Icon className="w-[15px] h-[15px]"
                            style={{ color: ia ? 'white' : 'rgba(255,255,255,0.35)' }} />
                        </div>

                        <span className="text-[13px] font-semibold transition-colors duration-200 relative z-10"
                          style={{ color: ia ? 'white' : 'rgba(255,255,255,0.38)',
                            fontFamily:"'Space Grotesk',sans-serif" }}>
                          {item.label}
                        </span>

                        {/* Right dot */}
                        {ia && (
                          <motion.div initial={{ scale:0 }} animate={{ scale:1 }}
                            transition={{ type:'spring', stiffness:300 }}
                            className="ml-auto w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ background: item.color, boxShadow:`0 0 8px ${item.color}` }} />
                        )}

                        {/* Journey badge */}
                        {item.primary && !ia && (
                          <span className="ml-auto px-1.5 py-0.5 rounded-md text-[9px] font-black tracking-wide relative z-10"
                            style={{ background:'rgba(255,170,0,0.15)', color:'#FFAA00',
                              fontFamily:"'Space Grotesk',sans-serif" }}>NEW</span>
                        )}
                      </motion.div>
                    )}
                  </NavLink>
                </Mag>
              );
            })}
          </nav>

          {/* ── Maturity score card ── */}
          <div className="relative z-10 mx-4 mb-4">
            <Link to="/score">
              <motion.div whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
                className="relative overflow-hidden rounded-[18px] p-4 cursor-pointer"
                style={{ background:'rgba(255,255,255,0.04)', border:`1px solid ${T.borderStrong}` }}>
                {/* Gradient corner */}
                <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none"
                  style={{ background:'radial-gradient(circle at 90% 10%, rgba(108,71,255,0.2), transparent 65%)' }} />

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <motion.div animate={{ rotate:360 }} transition={{ duration:8, repeat:Infinity, ease:'linear' }}>
                      <Activity className="w-3.5 h-3.5" style={{ color:T.purple }} />
                    </motion.div>
                    <span className="text-[10px] font-bold tracking-widest uppercase text-white/40"
                      style={{ fontFamily:"'Space Grotesk',sans-serif" }}>Maturity</span>
                  </div>
                  <span className="text-2xl font-black text-white" style={{ fontFamily:"'Space Grotesk',sans-serif" }}>
                    {score}<span className="text-sm text-white/25">%</span>
                  </span>
                </div>

                {/* Animated progress bar */}
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background:'rgba(255,255,255,0.07)' }}>
                  <motion.div className="h-full rounded-full relative overflow-hidden"
                    style={{ background:'linear-gradient(90deg,#6C47FF,#F40076,#00C2FF)', backgroundSize:'200%' }}
                    initial={{ width:0 }}
                    animate={{ width:`${score}%` }}
                    transition={{ duration:1.8, ease:[0.16,1,0.3,1], delay:0.6 }}>
                    {/* Shimmer sweep */}
                    <motion.div className="absolute inset-y-0 w-10"
                      style={{ background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.5),transparent)' }}
                      animate={{ left:['-40px','200px'] }}
                      transition={{ duration:2, repeat:Infinity, ease:'linear', delay:2 }} />
                  </motion.div>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <p className="text-[10px] text-white/25 font-medium">Tap for breakdown</p>
                  <ChevronRight className="w-3 h-3 text-white/20" />
                </div>
              </motion.div>
            </Link>
          </div>

          {/* ── User chip ── */}
          <div className="relative z-10 mx-4 mb-6">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-[16px]"
              style={{ background:'rgba(255,255,255,0.04)', border:`1px solid ${T.border}` }}>
              <div className="w-8 h-8 rounded-[11px] flex items-center justify-center font-black text-white text-[11px] shrink-0"
                style={{ background:'linear-gradient(135deg,#6C47FF,#F40076)', fontFamily:"'Space Grotesk',sans-serif" }}>
                {user?.email ? user.email.slice(0, 2).toUpperCase() : 'AJ'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-bold text-white/80 leading-none truncate"
                  style={{ fontFamily:"'Space Grotesk',sans-serif" }}>
                  {user?.displayName || (user?.email ? user.email.split('@')[0] : 'Founder')}
                </p>
                <p className="text-[10px] font-medium mt-0.5" style={{ color:T.teal }}>● Online</p>
              </div>
              <button 
                onClick={() => logout()} 
                className="text-white/45 hover:text-red-400 transition-colors text-sm ml-1" 
                title="Sign Out"
              >
                🚪
              </button>
              <Link to="/settings" className="text-white/20 hover:text-white/50 transition-colors text-sm">⚙</Link>
            </div>
          </div>
        </div>
      </aside>

      {/* ════════════════════════════════════════
          MAIN CONTENT AREA
      ════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-[264px]">

        {/* ── Top bar ── */}
        <header className="sticky top-0 z-20 flex items-center justify-between h-[60px] px-5 md:px-8"
          style={{
            background:'rgba(244,243,255,0.92)',
            backdropFilter:'blur(20px)',
            borderBottom:'1px solid rgba(108,71,255,0.1)',
            boxShadow:'0 1px 0 rgba(108,71,255,0.06)',
          }}>

          {/* Mobile brand */}
          <div className="flex items-center gap-3 md:hidden">
            <div className="w-8 h-8 rounded-[11px] flex items-center justify-center font-black text-white text-[11px]"
              style={{ background:'linear-gradient(135deg,#6C47FF,#F40076)', fontFamily:"'Space Grotesk',sans-serif",
                boxShadow:'0 4px 12px rgba(108,71,255,0.4)' }}>
              IE
            </div>
            <span className="font-bold text-sm text-gray-800 truncate max-w-[150px]"
              style={{ fontFamily:"'Space Grotesk',sans-serif" }}>{startupName}</span>
          </div>

          {/* Desktop page info */}
          <div className="hidden md:flex items-center gap-4">
            <div>
              <h2 className="font-bold text-[15px] text-gray-900 leading-none"
                style={{ fontFamily:"'Space Grotesk',sans-serif" }}>{active.label}</h2>
              <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                {new Date().toLocaleDateString('en-US',{weekday:'long',month:'short',day:'numeric'})}
              </p>
            </div>

            {/* Live badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
              style={{ background:'rgba(0,212,170,0.08)', border:'1px solid rgba(0,212,170,0.2)' }}>
              <div className="flex items-end gap-[2px] h-4">
                {[0,0.12,0.24,0.06,0.18].map((d,i) => <Bar key={i} d={d} />)}
              </div>
              <span className="text-[9px] font-black tracking-[0.2em] uppercase" style={{ color:T.teal }}>Live</span>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <motion.button whileTap={{ scale:0.88 }} onClick={() => setShowNotif(!showNotif)}
              className="relative w-9 h-9 rounded-[12px] flex items-center justify-center cursor-pointer transition-colors"
              style={{ color:'#6B7280' }}
              onMouseEnter={e => (e.currentTarget.style.background='rgba(108,71,255,0.08)')}
              onMouseLeave={e => (e.currentTarget.style.background='transparent')}>
              <Bell className="w-4.5 h-4.5" />
              {/* Notification ring */}
              <span className="absolute top-1.5 right-1.5 flex">
                <motion.span animate={{ scale:[1,2.2], opacity:[0.7,0] }}
                  transition={{ duration:2, repeat:Infinity }}
                  className="absolute rounded-full w-2.5 h-2.5"
                  style={{ background:T.pink }} />
                <span className="relative block w-2.5 h-2.5 rounded-full" style={{ background:T.pink }} />
              </span>
            </motion.button>

            <motion.div whileHover={{ scale:1.08 }} whileTap={{ scale:0.92 }}>
              <Link to="/profile">
                <div className="w-9 h-9 rounded-[12px] flex items-center justify-center font-black text-white text-[11px]"
                  style={{ background:'linear-gradient(135deg,#6C47FF,#F40076)', fontFamily:"'Space Grotesk',sans-serif",
                    boxShadow:`0 0 0 2.5px rgba(108,71,255,0.2), 0 4px 14px rgba(108,71,255,0.35)` }}>
                  {user?.email ? user.email.slice(0, 2).toUpperCase() : 'AJ'}
                </div>
              </Link>
            </motion.div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8 pb-32 md:pb-8">
          {children}
        </main>
      </div>

      {/* ════════════════════════════════════════
          MOBILE BOTTOM NAV — Dark floating pill
      ════════════════════════════════════════ */}
      <div className="md:hidden fixed bottom-6 inset-x-5 z-50">
        <motion.nav
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type:'spring', stiffness:260, damping:26, delay:0.4 }}
          className="relative flex items-center justify-around px-2 py-2 rounded-[36px]"
          style={{
            background: '#111118',
            boxShadow: '0 24px 64px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.09)',
          }}>

          {NAV.map(item => {
            const Icon = item.icon;
            const isActive = item.to==='/' ? location.pathname==='/' : location.pathname.startsWith(item.to);

            /* ── Elevated centre FAB ── */
            if (item.primary) {
              return (
                <NavLink key={item.to} to={item.to} className="relative flex flex-col items-center -mt-9">
                  <motion.div whileTap={{ scale:0.86 }} className="relative flex flex-col items-center">
                    {/* Pulsing glow ring */}
                    {isActive && (
                      <motion.div
                        animate={{ scale:[1,1.8], opacity:[0.5,0] }}
                        transition={{ duration:1.6, repeat:Infinity }}
                        className="absolute inset-0 rounded-[24px]"
                        style={{ background:item.color, borderRadius:24 }} />
                    )}

                    {/* FAB */}
                    <div className="w-[58px] h-[58px] rounded-[22px] flex items-center justify-center relative"
                      style={{
                        background: item.grad,
                        boxShadow: `0 10px 32px ${item.color}55, 0 4px 10px ${item.color}30`,
                        border: '3px solid #111118',
                      }}>
                      <Icon className="w-6 h-6 text-white" />

                      {/* Orbit ring */}
                      <motion.div
                        animate={{ rotate:360 }}
                        transition={{ duration:5, repeat:Infinity, ease:'linear' }}
                        className="absolute -inset-2 rounded-[28px] border-2 border-dashed pointer-events-none"
                        style={{ borderColor:`${item.color}55` }} />
                    </div>

                    <span className="text-[9px] font-bold mt-1.5"
                      style={{ color: isActive ? item.color : 'rgba(255,255,255,0.3)',
                        fontFamily:"'Space Grotesk',sans-serif" }}>
                      {item.label}
                    </span>
                  </motion.div>
                </NavLink>
              );
            }

            /* ── Regular tab ── */
            return (
              <NavLink key={item.to} to={item.to} end={item.to==='/'}>
                {({ isActive: ia }) => (
                  <motion.div whileTap={{ scale:0.84 }}
                    className="relative flex flex-col items-center px-3 py-1.5 cursor-pointer">

                    {/* Icon container */}
                    <div className="relative w-10 h-9 flex items-center justify-center rounded-[13px] transition-all duration-250"
                      style={{
                        background: ia ? item.bg : 'transparent',
                        border:     ia ? `1px solid ${item.color}30` : '1px solid transparent',
                      }}>
                      {ia && (
                        <motion.div layoutId="pill-blob" initial={false}
                          transition={{ type:'spring', stiffness:400, damping:36 }}
                          className="absolute inset-0 rounded-[13px]"
                          style={{ background:`radial-gradient(circle, ${item.color}25, transparent 70%)` }} />
                      )}
                      <Icon className="w-[17px] h-[17px] relative z-10 transition-colors duration-200"
                        style={{ color: ia ? item.color : 'rgba(255,255,255,0.28)' }} />
                    </div>

                    {/* Label */}
                    <span className="text-[9px] font-bold mt-1 transition-colors duration-200"
                      style={{ color: ia ? item.color : 'rgba(255,255,255,0.28)',
                        fontFamily:"'Space Grotesk',sans-serif" }}>
                      {item.label}
                    </span>

                    {/* Active indicator dot */}
                    {ia && (
                      <motion.div initial={{ scale:0 }} animate={{ scale:1 }}
                        transition={{ type:'spring', stiffness:320 }}
                        className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                        style={{ background: item.color }} />
                    )}
                  </motion.div>
                )}
              </NavLink>
            );
          })}
        </motion.nav>
      </div>

      {/* ── Notification panel ── */}
      <AnimatePresence>
        {showNotif && <NotificationPanel onClose={() => setShowNotif(false)} />}
      </AnimatePresence>

      {/* ── AI Chat FAB ── */}
      <AnimatePresence>
        {location.pathname !== '/mentor' && !isAuth && (
          <motion.div
            initial={{ scale:0, opacity:0, y:20 }}
            animate={{ scale:1, opacity:1, y:0 }}
            exit={{ scale:0, opacity:0, y:20 }}
            transition={{ type:'spring', stiffness:250, damping:22, delay:0.7 }}
            className="fixed z-40 flex flex-col items-end gap-3"
            style={{ bottom: '104px', right: '20px' }}
          >
            {/* Chat card */}
            <AnimatePresence>
              {showChat && (
                <motion.div
                  initial={{ opacity:0, scale:0.88, y:16, originX:1, originY:1 }}
                  animate={{ opacity:1, scale:1, y:0 }}
                  exit={{ opacity:0, scale:0.88, y:16 }}
                  transition={{ type:'spring', stiffness:300, damping:24 }}
                  className="w-72 rounded-3xl p-5 relative overflow-hidden"
                  style={{ background:T.dark2, border:`1px solid ${T.borderStrong}`,
                    boxShadow:'0 28px 70px rgba(0,0,0,0.45)' }}>
                  {/* Ambient glow */}
                  <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full"
                    style={{ background:'radial-gradient(circle, rgba(108,71,255,0.18), transparent 70%)' }} />

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-[14px] flex items-center justify-center"
                        style={{ background:'linear-gradient(135deg,#6C47FF,#F40076)', boxShadow:'0 4px 16px rgba(108,71,255,0.4)' }}>
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-[13px] text-white" style={{ fontFamily:"'Space Grotesk',sans-serif" }}>AI Mentor</p>
                        <div className="flex items-center gap-1.5">
                          <motion.div animate={{ opacity:[0.4,1,0.4] }} transition={{ duration:1.5, repeat:Infinity }}
                            className="w-1.5 h-1.5 rounded-full" style={{ background:T.teal }} />
                          <span className="text-[10px] font-medium" style={{ color:T.teal }}>Online</span>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => setShowChat(false)}
                      className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer"
                      style={{ background:'rgba(255,255,255,0.07)', color:'rgba(255,255,255,0.4)' }}>
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-[12px] leading-relaxed mb-5" style={{ color:'rgba(255,255,255,0.45)', fontFamily:"'DM Sans',sans-serif" }}>
                    Ask me anything about your startup — strategy, investors, product, regulations.
                  </p>

                  <Link to="/mentor" onClick={() => setShowChat(false)}
                    className="btn-brand w-full justify-center text-[12px] py-3 rounded-[14px]">
                    <Sparkles className="w-3.5 h-3.5" />
                    Open Mentor Chat
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>

            {/* FAB */}
            <motion.button
              whileHover={{ scale:1.1, boxShadow:'0 16px 48px rgba(108,71,255,0.55)' }}
              whileTap={{ scale:0.88 }}
              onClick={() => setShowChat(!showChat)}
              className="w-[54px] h-[54px] rounded-2xl flex items-center justify-center text-white relative cursor-pointer"
              style={{ background:'linear-gradient(135deg,#6C47FF,#F40076)', boxShadow:'0 10px 32px rgba(108,71,255,0.45)' }}>
              <motion.div animate={{ rotate: showChat ? 90 : 0 }} transition={{ type:'spring', stiffness:250, damping:20 }}>
                <MessageSquare className="w-5 h-5" />
              </motion.div>
              {/* Pulse ring */}
              <motion.div animate={{ scale:[1,1.8], opacity:[0.5,0] }}
                transition={{ duration:2, repeat:Infinity }}
                className="absolute inset-0 rounded-2xl"
                style={{ background:'rgba(108,71,255,0.4)' }} />
              {/* Count badge */}
              <span className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 rounded-full border-2 border-white flex items-center justify-center"
                style={{ background:T.pink, fontSize:'8px', fontWeight:900, color:'white', padding:'2px', minWidth:'18px', minHeight:'18px' }}>
                1
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AppShell;

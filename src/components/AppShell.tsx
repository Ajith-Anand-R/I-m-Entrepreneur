import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import {
  LayoutDashboard, Briefcase, BookOpen, MessageSquare,
  MoreHorizontal, Bell, Sparkles, X, Activity,
  ChevronRight, LogOut, Settings,
} from 'lucide-react';
import { useStartupStore } from '../store/useStartupStore';
import { NotificationPanel } from './NotificationPanel';
import { useAuth } from '../contexts/AuthContext';

interface AppShellProps { children: React.ReactNode; }

/* ── Design tokens ── */
const ACCENT = '#6C47FF';
const ACCENT_SOFT = '#8B7AFF';
const MINT = '#34D399';
const SG = "'Space Grotesk',sans-serif";

const NAV = [
  {
    to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard,
    color: ACCENT, bg: 'rgba(108,71,255,0.12)',
    grad: 'linear-gradient(135deg,#6C47FF,#8B7AFF)',
  },
  {
    to: '/workspace', label: 'Workspace', icon: Briefcase,
    color: '#38BDF8', bg: 'rgba(56,189,248,0.10)',
    grad: 'linear-gradient(135deg,#38BDF8,#34D399)',
  },
  {
    to: '/journey', label: 'Journey', icon: BookOpen,
    color: '#F59E0B', bg: 'rgba(245,158,11,0.10)',
    grad: 'linear-gradient(135deg,#F59E0B,#F43F5E)',
    primary: true,
  },
  {
    to: '/mentor', label: 'AI Mentor', icon: MessageSquare,
    color: '#F43F5E', bg: 'rgba(244,63,94,0.10)',
    grad: 'linear-gradient(135deg,#F43F5E,#FF6B6B)',
  },
  {
    to: '/more', label: 'More', icon: MoreHorizontal,
    color: '#64648C', bg: 'rgba(100,100,140,0.10)',
    grad: 'linear-gradient(135deg,#64648C,#9CA3C0)',
  },
];

/* ── Magnetic hover wrapper ── */
const Mag: React.FC<{ children: React.ReactNode; s?: number }> = ({ children, s = 0.2 }) => {
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

/* ══════════════════════════════════════════════════════════ */
export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const { startupName, score } = useStartupStore();
  const { user, logout } = useAuth();
  const [showNotif, setShowNotif] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const location = useLocation();

  const isAuth = ['/login','/signup','/onboarding','/splash'].some(p => location.pathname.startsWith(p)) || location.pathname === '/';
  if (isAuth) return <>{children}</>;

  const active = NAV.find(n => n.to==='/dashboard' ? location.pathname==='/dashboard' : location.pathname.startsWith(n.to)) ?? NAV[0];
  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : 'AJ';
  const displayName = user?.displayName || (user?.email ? user.email.split('@')[0] : 'Founder');

  return (
    <div className="min-h-screen md:h-screen w-full flex flex-col md:flex-row md:p-4 gap-4 md:overflow-hidden relative" style={{ background: 'var(--surface-0)', fontFamily: "'DM Sans',sans-serif" }}>

      {/* ════════════════════════════════════════
          DESKTOP SIDEBAR — Floating Dark Glass
      ════════════════════════════════════════ */}
      <aside className="hidden md:flex w-[260px] shrink-0 flex-col h-full rounded-[24px] bg-[#0F0F1A] border border-white/[0.07] overflow-hidden shadow-xl relative z-30">
        <div className="w-full h-full flex flex-col overflow-hidden relative">

          {/* Subtle ambient orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="orb orb-purple absolute w-64 h-64 -top-20 -left-12 opacity-60" />
            <div className="orb orb-sky absolute w-48 h-48 bottom-10 -right-8 opacity-40" />
          </div>

          {/* ── Brand ── */}
          <div className="relative z-10 flex items-center gap-3 px-5 pt-7 pb-5"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="relative w-10 h-10 shrink-0 rounded-xl overflow-hidden border border-white/10 bg-black flex items-center justify-center">
              <img src="/beyond_guidance_logo.jpg" alt="Beyond Guidance" className="w-full h-full object-contain scale-[1.3] -translate-y-[2px]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[13px] text-white truncate" style={{ fontFamily: SG }}>
                {startupName}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <motion.span animate={{ opacity:[0.5,1,0.5] }} transition={{ duration:2,repeat:Infinity }}
                  className="block w-1.5 h-1.5 rounded-full" style={{ background: MINT }} />
                <span className="text-[10px] font-bold tracking-wider uppercase" style={{ color: MINT }}>Active</span>
              </div>
            </div>
          </div>

          {/* ── Navigation ── */}
          <nav className="relative z-10 flex-1 px-3 pt-5 space-y-0.5 overflow-y-auto">
            <p className="px-3 mb-3 text-[9px] font-bold tracking-[0.2em] uppercase"
              style={{ color: 'rgba(255,255,255,0.18)', fontFamily: SG }}>
              Navigation
            </p>

            {NAV.map(item => {
              const Icon = item.icon;
              return (
                <Mag key={item.to}>
                  <NavLink to={item.to} end={item.to==='/'}>
                    {({ isActive: ia }) => (
                      <motion.div
                        whileTap={{ scale: 0.96 }}
                        className="relative flex items-center gap-3 px-3 py-2.5 rounded-2xl cursor-pointer overflow-hidden group"
                      >
                        {/* Hover fill */}
                        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          style={{ background: 'rgba(255,255,255,0.03)' }} />

                        {/* Shared Active Sliding Pill */}
                        {ia && (
                          <motion.div layoutId="active-pill"
                            className="absolute inset-0 rounded-2xl z-0"
                            style={{
                              background: item.bg,
                              border: `1px solid ${item.color}16`,
                            }}
                            transition={{ type: 'spring', stiffness: 380, damping: 30 }} />
                        )}

                        {/* Active glow */}
                        {ia && (
                          <motion.div layoutId="sb-glow" initial={false}
                            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                            className="absolute inset-0 rounded-2xl pointer-events-none"
                            style={{ background: `radial-gradient(ellipse at 18% 50%, ${item.color}12, transparent 70%)` }} />
                        )}

                        {/* Icon */}
                        <div className="relative w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 z-10"
                          style={{
                            background: ia ? item.grad : 'rgba(255,255,255,0.05)',
                            boxShadow: ia ? `0 4px 14px ${item.color}40` : 'none',
                          }}>
                          <Icon className="w-[15px] h-[15px]"
                            style={{ color: ia ? 'white' : 'rgba(255,255,255,0.3)' }} />
                        </div>

                        <span className="text-[13px] font-semibold transition-colors duration-200 relative z-10"
                          style={{ color: ia ? 'white' : 'rgba(255,255,255,0.35)', fontFamily: SG }}>
                          {item.label}
                        </span>

                        {/* Shared Active Sliding Dot */}
                        {ia && (
                          <motion.div layoutId="active-dot"
                            className="ml-auto w-1.5 h-1.5 rounded-full shrink-0 relative z-10"
                            style={{ background: item.color, boxShadow: `0 0 8px ${item.color}` }}
                            transition={{ type: 'spring', stiffness: 350, damping: 26 }} />
                        )}

                        {/* NEW badge */}
                        {item.primary && !ia && (
                          <span className="ml-auto px-1.5 py-0.5 rounded-md text-[9px] font-black tracking-wide relative z-10"
                            style={{ background: 'rgba(245,158,11,0.15)', color: '#F59E0B', fontFamily: SG }}>NEW</span>
                        )}
                      </motion.div>
                    )}
                  </NavLink>
                </Mag>
              );
            })}
          </nav>

          {/* ── Maturity score card ── */}
          <div className="relative z-10 mx-3 mb-3">
            <Link to="/score">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="relative overflow-hidden rounded-2xl p-4 cursor-pointer"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="absolute top-0 right-0 w-20 h-20 pointer-events-none"
                  style={{ background: 'radial-gradient(circle at 90% 10%, rgba(108,71,255,0.15), transparent 65%)' }} />

                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5" style={{ color: ACCENT }} />
                    <span className="text-[10px] font-bold tracking-widest uppercase text-white/35"
                      style={{ fontFamily: SG }}>Maturity</span>
                  </div>
                  <span className="text-2xl font-black text-white" style={{ fontFamily: SG }}>
                    {score}<span className="text-sm text-white/20">%</span>
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <motion.div className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg,#6C47FF,#8B7AFF,#38BDF8)' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    transition={{ duration: 1.5, ease: [0.16,1,0.3,1], delay: 0.5 }} />
                </div>

                <div className="flex items-center justify-between mt-2">
                  <p className="text-[10px] text-white/20 font-medium">Tap for breakdown</p>
                  <ChevronRight className="w-3 h-3 text-white/15" />
                </div>
              </motion.div>
            </Link>
          </div>

          {/* ── User chip ── */}
          <div className="relative z-10 mx-3 mb-5">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-white text-[11px] shrink-0"
                style={{ background: 'linear-gradient(135deg,#6C47FF,#8B7AFF)', fontFamily: SG }}>
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-bold text-white/75 leading-none truncate" style={{ fontFamily: SG }}>
                  {displayName}
                </p>
                <p className="text-[10px] font-medium mt-0.5" style={{ color: MINT }}>● Online</p>
              </div>
              <button onClick={() => logout()}
                className="text-white/30 hover:text-rose transition-colors p-1 rounded-lg hover:bg-white/5"
                title="Sign Out">
                <LogOut className="w-3.5 h-3.5" />
              </button>
              <Link to="/settings" className="text-white/20 hover:text-white/50 transition-colors p-1 rounded-lg hover:bg-white/5">
                <Settings className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </aside>

      {/* ════════════════════════════════════════
          MAIN CONTENT — Floating Light Canvas
      ════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0 md:rounded-[24px] md:border md:border-accent/[0.08] md:shadow-md bg-white overflow-hidden relative z-10">

        {/* ── Top bar — Frosted Glass ── */}
        <header className="sticky top-0 z-20 flex items-center justify-between h-[56px] px-5 md:px-8"
          style={{
            background: 'rgba(250,250,255,0.85)',
            backdropFilter: 'blur(16px) saturate(180%)',
            WebkitBackdropFilter: 'blur(16px) saturate(180%)',
            borderBottom: '1px solid rgba(108,71,255,0.06)',
          }}>

          {/* Mobile brand */}
          <div className="flex items-center gap-3 md:hidden">
            <div className="w-8 h-8 rounded-xl overflow-hidden border border-accent/10 bg-black flex items-center justify-center shrink-0">
              <img src="/beyond_guidance_logo.jpg" alt="Beyond Guidance" className="w-full h-full object-contain scale-[1.3] -translate-y-[2px]" />
            </div>
            <span className="font-bold text-sm text-ink-900 truncate max-w-[150px]" style={{ fontFamily: SG }}>
              {startupName}
            </span>
          </div>

          {/* Desktop page info */}
          <div className="hidden md:flex items-center gap-3">
            <div>
              <h2 className="font-bold text-[15px] text-ink-900 leading-none" style={{ fontFamily: SG }}>
                {active.label}
              </h2>
              <p className="text-[11px] text-ink-300 font-medium mt-0.5">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowNotif(!showNotif)}
              className="relative w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer transition-colors hover:bg-accent-ghost"
              style={{ color: '#64648C' }}>
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: '#F43F5E' }} />
            </motion.button>

            <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}>
              <Link to="/profile">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-[11px]"
                  style={{ background: 'linear-gradient(135deg,#6C47FF,#8B7AFF)', fontFamily: SG,
                    boxShadow: '0 0 0 2.5px rgba(108,71,255,0.15), 0 4px 14px rgba(108,71,255,0.25)' }}>
                  {initials}
                </div>
              </Link>
            </motion.div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8 pb-28 md:pb-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* ════════════════════════════════════════
          MOBILE BOTTOM NAV — Frosted Light Pill
      ════════════════════════════════════════ */}
      <div className="md:hidden fixed bottom-5 inset-x-4 z-50">
        <motion.nav
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 280, damping: 28, delay: 0.3 }}
          className="relative flex items-center justify-around px-2 py-2 rounded-[28px]"
          style={{
            background: 'rgba(255,255,255,0.88)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            boxShadow: '0 8px 32px rgba(108,71,255,0.08), 0 2px 8px rgba(0,0,0,0.06)',
            border: '1px solid rgba(108,71,255,0.08)',
          }}>

          {NAV.map(item => {
            const Icon = item.icon;
            const isAct = item.to==='/' ? location.pathname==='/' : location.pathname.startsWith(item.to);

            return (
              <NavLink key={item.to} to={item.to} end={item.to==='/'}>
                {({ isActive: ia }) => (
                  <motion.div whileTap={{ scale: 0.88 }}
                    className="relative flex flex-col items-center px-3 py-1.5 cursor-pointer">

                    {/* Icon container */}
                    <div className="relative w-10 h-9 flex items-center justify-center rounded-xl transition-all duration-250">
                      {ia && (
                        <motion.div layoutId="mob-pill-bg"
                          className="absolute inset-0 rounded-xl border z-0"
                          style={{
                            background: item.bg,
                            borderColor: `${item.color}18`,
                          }}
                          transition={{ type: 'spring', stiffness: 380, damping: 28 }} />
                      )}
                      <Icon className="w-[17px] h-[17px] relative z-10 transition-colors duration-200"
                        style={{ color: ia ? item.color : '#9CA3C0' }} />
                    </div>

                    {/* Label */}
                    <span className="text-[9px] font-bold mt-1 transition-colors duration-200"
                      style={{ color: ia ? item.color : '#9CA3C0', fontFamily: SG }}>
                      {item.label}
                    </span>

                    {/* Active dot */}
                    {ia && (
                      <motion.div layoutId="mob-dot"
                        transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                        className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full z-10"
                        style={{ background: item.color, boxShadow: `0 0 4px ${item.color}` }} />
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
            initial={{ scale: 0, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 16 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22, delay: 0.6 }}
            className="fixed z-40 flex flex-col items-end gap-3"
            style={{ bottom: '100px', right: '20px' }}
          >
            {/* Chat preview card */}
            <AnimatePresence>
              {showChat && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 12, originX: 1, originY: 1 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 12 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                  className="w-72 rounded-2xl p-5 relative overflow-hidden glass-frost-strong"
                  style={{ boxShadow: '0 20px 60px rgba(108,71,255,0.1), 0 8px 24px rgba(0,0,0,0.08)' }}>

                  {/* Ambient glow */}
                  <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(108,71,255,0.08), transparent 70%)' }} />

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg,#6C47FF,#8B7AFF)', boxShadow: '0 4px 14px rgba(108,71,255,0.3)' }}>
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-[13px] text-ink-900" style={{ fontFamily: SG }}>AI Mentor</p>
                        <div className="flex items-center gap-1.5">
                          <motion.div animate={{ opacity: [0.5,1,0.5] }} transition={{ duration: 1.5, repeat: Infinity }}
                            className="w-1.5 h-1.5 rounded-full" style={{ background: MINT }} />
                          <span className="text-[10px] font-medium" style={{ color: MINT }}>Online</span>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => setShowChat(false)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer hover:bg-accent-ghost transition-colors"
                      style={{ color: '#9CA3C0' }}>
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-[12px] leading-relaxed mb-4 text-ink-300">
                    Ask me anything about your startup — strategy, investors, product, regulations.
                  </p>

                  <Link to="/mentor" onClick={() => setShowChat(false)}
                    className="btn-primary w-full justify-center text-[12px] py-2.5 rounded-xl">
                    <Sparkles className="w-3.5 h-3.5" />
                    Open Mentor Chat
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>

            {/* FAB button */}
            <motion.button
              whileHover={{ scale: 1.08, boxShadow: '0 12px 40px rgba(108,71,255,0.35)' }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowChat(!showChat)}
              className="w-[50px] h-[50px] rounded-2xl flex items-center justify-center text-white relative cursor-pointer"
              style={{ background: 'linear-gradient(135deg,#6C47FF,#8B7AFF)', boxShadow: '0 8px 28px rgba(108,71,255,0.35)' }}>
              <motion.div animate={{ rotate: showChat ? 90 : 0 }} transition={{ type: 'spring', stiffness: 250, damping: 20 }}>
                <MessageSquare className="w-5 h-5" />
              </motion.div>
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center border-2 border-white"
                style={{ background: '#F43F5E', fontSize: '8px', fontWeight: 900, color: 'white' }}>
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

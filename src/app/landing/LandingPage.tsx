import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  Sparkles, Zap, BookOpen, MessageSquare, Award, Download, CheckCircle2,
  ChevronRight, TrendingUp, Wallet, Layers, Star, Users, ArrowRight,
  Brain, Rocket, BarChart3, FileText, Globe, Shield, Play,
  Cpu, Database, Smartphone, Code2, Lock, Share2, Menu, X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ThreeScene } from '../../components/landing/ThreeScene';
import { AnimatedCounter } from '../../components/landing/AnimatedCounter';
import { GradientText } from '../../components/landing/GradientText';
import { useScrollReveal, useMouseTilt } from '../../components/landing/useScrollReveal';

// ─────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────
const C = {
  purple: '#6C47FF',
  pink:   '#F40076',
  cyan:   '#00C2FF',
  teal:   '#00D4AA',
  amber:  '#FFAA00',
  lime:   '#AEFF00',
  dark:   '#0A0A0F',
  dark2:  '#111118',
  dark3:  '#18181F',
};

// ─────────────────────────────────────────────
// ANIMATION VARIANTS
// ─────────────────────────────────────────────
const EASE = [0.16, 1, 0.3, 1] as const;
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: i * 0.12, ease: EASE } }),
};
const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i = 0) => ({ opacity: 1, transition: { duration: 0.6, delay: i * 0.1 } }),
};
const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: (i = 0) => ({ opacity: 1, scale: 1, transition: { duration: 0.6, delay: i * 0.1, ease: EASE } }),
};

// ─────────────────────────────────────────────
// GLASS CARD COMPONENT (inline for landing)
// ─────────────────────────────────────────────
interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  hover3d?: boolean;
  delay?: number;
}
const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', glowColor = C.purple, hover3d = true, delay = 0 }) => {
  const { ref: tiltRef, tilt } = useMouseTilt(hover3d ? 12 : 0);
  const { ref: revealRef, isVisible } = useScrollReveal();

  return (
    <motion.div
      ref={revealRef as React.RefObject<HTMLDivElement>}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      custom={delay}
      variants={scaleIn}
    >
      <motion.div
        // @ts-expect-error tilt ref
        ref={tiltRef}
        className={`relative rounded-2xl border border-white/8 backdrop-blur-xl overflow-hidden group ${className}`}
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
          transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: 'transform 0.15s ease, box-shadow 0.3s ease',
          boxShadow: `0 8px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.07)`,
        }}
        whileHover={{
          boxShadow: `0 20px 60px rgba(0,0,0,0.4), 0 0 40px ${glowColor}30, inset 0 1px 0 rgba(255,255,255,0.1)`,
        }}
      >
        {/* Animated gradient border */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: `linear-gradient(135deg, ${glowColor}40, transparent, ${glowColor}20)`, padding: '1px' }}
        />
        {/* Shine sweep */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden rounded-2xl">
          <div
            className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12"
            style={{ animation: 'shine-sweep 0.8s ease forwards' }}
          />
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────
// SECTION WRAPPER
// ─────────────────────────────────────────────
const Section: React.FC<{ children: React.ReactNode; className?: string; id?: string; style?: React.CSSProperties }> = ({ children, className = '', id, style }) => (
  <section id={id} className={`relative w-full ${className}`} style={style}>{children}</section>
);

// ─────────────────────────────────────────────
// NAV COMPONENT
// ─────────────────────────────────────────────
const Nav: React.FC<{ user: any }> = ({ user }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? 'rgba(10,10,15,0.85)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/10 bg-black flex items-center justify-center shrink-0">
            <img src="/beyond_guidance_logo.jpg" alt="Beyond Guidance" className="w-full h-full object-contain scale-[1.3] -translate-y-[2px]" />
          </div>
          <span className="text-white font-heading font-semibold text-lg tracking-tight">
            I'm <span style={{ background: 'linear-gradient(90deg,#6C47FF,#F40076)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Entrepreneur</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: 'Features', href: '#features' },
            { label: 'Journey', href: '#journey' },
            { label: 'Mentors', href: '#mentors' },
            { label: 'Academy', href: '#academy' },
          ].map((link) => (
            <a key={link.label} href={link.href}
              className="text-white/60 hover:text-white text-sm font-medium transition-colors duration-200 hover:text-white relative group">
              {link.label}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </div>

        {/* CTAs */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <Link to="/dashboard">
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-200"
                style={{ background: 'linear-gradient(135deg, #6C47FF, #F40076)', boxShadow: '0 4px 20px rgba(108,71,255,0.4)' }}>
                Go to Dashboard →
              </motion.button>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <button className="text-white/70 hover:text-white text-sm font-medium transition-colors px-4 py-2 rounded-xl hover:bg-white/5">
                  Sign In
                </button>
              </Link>
              <Link to="/signup">
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-200"
                  style={{ background: 'linear-gradient(135deg, #6C47FF, #F40076)', boxShadow: '0 4px 20px rgba(108,71,255,0.35)' }}>
                  Get Started Free
                </motion.button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden text-white/70 hover:text-white" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden"
            style={{ background: 'rgba(10,10,15,0.97)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="px-6 py-4 flex flex-col gap-4">
              {['Features', 'Journey', 'Mentors', 'Academy'].map(l => (
                <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMobileOpen(false)}
                  className="text-white/70 hover:text-white text-base font-medium py-2 border-b border-white/5">
                  {l}
                </a>
              ))}
              <div className="flex gap-3 pt-2">
                <Link to="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                  <button className="w-full py-2.5 rounded-xl text-sm font-medium text-white/70 border border-white/10 hover:border-white/20 transition-colors">Sign In</button>
                </Link>
                <Link to="/signup" className="flex-1" onClick={() => setMobileOpen(false)}>
                  <button className="w-full py-2.5 rounded-xl text-sm font-semibold text-white"
                    style={{ background: 'linear-gradient(135deg, #6C47FF, #F40076)' }}>Get Started</button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

// ─────────────────────────────────────────────
// HERO SECTION
// ─────────────────────────────────────────────
const HeroSection: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showIOSHint, setShowIOSHint] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0]);
  const heroY = useTransform(scrollY, [0, 600], [0, -120]);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone) setIsInstalled(true);
    const fn = (e: Event) => { e.preventDefault(); setDeferredPrompt(e); };
    window.addEventListener('beforeinstallprompt', fn);
    return () => window.removeEventListener('beforeinstallprompt', fn);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setIsInstalled(true);
      setDeferredPrompt(null);
    } else {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      if (isIOS) setShowIOSHint(true);
    }
  };

  return (
    <Section className="min-h-screen flex flex-col items-center justify-center overflow-hidden" style={{ background: C.dark }}>
      {/* Three.js canvas fills the whole hero */}
      <ThreeScene className="absolute inset-0 w-full h-full z-0" />

      {/* Hero radial glow */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(108,71,255,0.18) 0%, transparent 70%)' }} />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(0,194,255,0.1) 0%, transparent 70%)' }} />
        <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(244,0,118,0.1) 0%, transparent 70%)' }} />
      </div>

      {/* Background image overlay */}
      <div className="absolute inset-0 z-0"
        style={{ backgroundImage: 'url(/landing/hero_bg.png)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.15 }} />

      {/* Hero content */}
      <motion.div
        ref={containerRef}
        style={{ opacity: heroOpacity, y: heroY }}
        className="relative z-10 flex flex-col items-center text-center px-6 pt-24 pb-16 max-w-5xl mx-auto"
      >
        {/* Badge */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 mb-8 backdrop-blur-sm"
            style={{ background: 'rgba(108,71,255,0.12)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-medium text-white/70">AI-Powered Startup OS · Beyond Guidance</span>
          </div>
        </motion.div>

        {/* Main Heading */}
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold font-heading tracking-tight leading-[1.05] mb-6 text-white">
          Build Your Startup.<br />
          <GradientText from={C.purple} via="#C026D3" to={C.pink} animate className="block">
            With AI That Knows You.
          </GradientText>
        </motion.h1>

        {/* Sub */}
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.7 }}
          className="text-lg md:text-xl text-white/50 max-w-2xl leading-relaxed mb-10">
          One workspace. 10 AI mentors. 15 guided levels. Everything a founder needs — from first idea to first funding — in a single beautiful app.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-12">
          <Link to="/signup">
            <motion.button whileHover={{ scale: 1.04, boxShadow: '0 8px 40px rgba(108,71,255,0.6)' }} whileTap={{ scale: 0.97 }}
              className="relative px-8 py-4 rounded-2xl text-base font-semibold text-white overflow-hidden group"
              style={{ background: 'linear-gradient(135deg, #6C47FF, #F40076)', boxShadow: '0 4px 30px rgba(108,71,255,0.4)' }}>
              <span className="relative z-10 flex items-center gap-2">
                <Rocket size={18} />
                Start Building Free
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
              </span>
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>
          </Link>

          {!isInstalled && (
            <motion.button onClick={handleInstall} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="px-8 py-4 rounded-2xl text-base font-semibold text-white flex items-center gap-2 border border-white/10 hover:border-white/20 backdrop-blur-sm transition-all duration-200"
              style={{ background: 'rgba(255,255,255,0.05)' }}>
              <Download size={18} />
              Install as App
            </motion.button>
          )}
          {isInstalled && (
            <Link to="/dashboard">
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="px-8 py-4 rounded-2xl text-base font-semibold text-white flex items-center gap-2 border border-white/10 hover:border-white/20 backdrop-blur-sm transition-all duration-200"
                style={{ background: 'rgba(255,255,255,0.05)' }}>
                <Zap size={18} />
                Open Dashboard →
              </motion.button>
            </Link>
          )}
        </motion.div>

        {/* Stats row */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.6 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-4">
          {[
            { value: 10, label: 'AI Mentors', suffix: '+', color: C.purple },
            { value: 15, label: 'Journey Levels', suffix: '', color: C.cyan },
            { value: 12, label: 'Doc Templates', suffix: '', color: C.pink },
            { value: 100, label: 'Offline Ready', suffix: '%', color: C.teal },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold font-heading text-white">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-xs text-white/40 mt-1 font-medium uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <span className="text-white/30 text-xs uppercase tracking-widest">Scroll to explore</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center pt-1.5">
          <div className="w-1 h-2 rounded-full bg-white/40" />
        </motion.div>
      </motion.div>

      {/* iOS install hint */}
      <AnimatePresence>
        {showIOSHint && (
          <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-4 right-4 z-50 rounded-2xl p-4 border border-white/10"
            style={{ background: 'rgba(18,18,28,0.97)', backdropFilter: 'blur(20px)' }}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-white text-sm font-semibold mb-1">Install I'm Entrepreneur</p>
                <p className="text-white/50 text-xs">Tap <Share2 className="inline w-3.5 h-3.5" /> then "Add to Home Screen"</p>
              </div>
              <button onClick={() => setShowIOSHint(false)} className="text-white/40 hover:text-white"><X size={18} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
};

// ─────────────────────────────────────────────
// APP SHOWCASE SECTION
// ─────────────────────────────────────────────
const ShowcaseSection: React.FC = () => {
  const { ref: revealRef, isVisible } = useScrollReveal({ threshold: 0.15 });

  return (
    <Section className="py-24 md:py-36 overflow-hidden" style={{ background: `linear-gradient(180deg, ${C.dark} 0%, ${C.dark2} 50%, ${C.dark} 100%)` }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Label */}
        <motion.div ref={revealRef as React.RefObject<HTMLDivElement>}
          initial="hidden" animate={isVisible ? 'visible' : 'hidden'} variants={fadeUp}
          className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 mb-4"
            style={{ background: 'rgba(108,71,255,0.1)' }}>
            <Sparkles size={13} className="text-purple-400" />
            <span className="text-xs font-medium text-purple-300">The Complete Startup OS</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-white leading-tight">
            Everything in<br />
            <GradientText from={C.cyan} to={C.purple}>one beautiful workspace.</GradientText>
          </h2>
        </motion.div>

        {/* Main showcase */}
        <div className="relative flex flex-col lg:flex-row items-center gap-12">
          {/* App image with glow */}
          <motion.div initial={{ opacity: 0, x: -60 }} animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -60 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 relative">
            <div className="relative rounded-3xl overflow-hidden" style={{ boxShadow: `0 40px 120px rgba(108,71,255,0.3), 0 0 0 1px rgba(255,255,255,0.08)` }}>
              <img src="/landing/app_showcase.png" alt="App showcase" className="w-full object-cover" style={{ maxHeight: '600px', objectFit: 'cover' }} />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 60%, rgba(10,10,15,0.6) 100%)' }} />
            </div>
            {/* Floating badge cards */}
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-4 -right-4 md:-right-8 rounded-xl p-3 border border-white/10"
              style={{ background: 'rgba(18,18,28,0.9)', backdropFilter: 'blur(16px)' }}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(108,71,255,0.2)' }}>
                  <Brain size={16} className="text-purple-400" />
                </div>
                <div>
                  <div className="text-white text-xs font-semibold">AI Mentor Online</div>
                  <div className="text-white/40 text-[10px]">Ready to help</div>
                </div>
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              </div>
            </motion.div>

            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              className="absolute -bottom-4 -left-4 md:-left-8 rounded-xl p-3 border border-white/10"
              style={{ background: 'rgba(18,18,28,0.9)', backdropFilter: 'blur(16px)' }}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(0,212,170,0.2)' }}>
                  <TrendingUp size={16} className="text-teal-400" />
                </div>
                <div>
                  <div className="text-white text-xs font-semibold">Startup Score</div>
                  <div className="text-teal-400 text-[10px] font-mono">78/100 ↑ 12pts</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Feature list */}
          <motion.div initial={{ opacity: 0, x: 60 }} animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 60 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="flex-1 space-y-5">
            {[
              { icon: <Database size={20} />, color: C.purple, title: 'Startup Workspace', desc: 'Your complete startup database — profile, team, documents, funding readiness, all in one place.' },
              { icon: <Brain size={20} />, color: C.cyan, title: 'AI Mentor Chat', desc: '10 specialist AI mentors that know your specific startup. They read your documents and answer accordingly.' },
              { icon: <BookOpen size={20} />, color: C.amber, title: 'Learning Academy', desc: '22 modules of structured entrepreneurship education. Videos, notes, quizzes, activities.' },
              { icon: <Layers size={20} />, color: C.pink, title: 'Founder Journey', desc: 'A 15-level gated progression from Vision to Scale. Each level unlocks when the AI validates your work.' },
              { icon: <FileText size={20} />, color: C.teal, title: 'Document Generator', desc: '12 AI-powered templates — Pitch Deck, Business Plan, Lean Canvas, SWOT, and more.' },
            ].map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, x: 30 }} animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
                className="flex gap-4 p-4 rounded-xl border border-white/6 hover:border-white/12 transition-colors group"
                style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center"
                  style={{ background: `${item.color}20`, color: item.color }}>
                  {item.icon}
                </div>
                <div>
                  <div className="text-white font-semibold text-sm mb-1">{item.title}</div>
                  <div className="text-white/45 text-xs leading-relaxed">{item.desc}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </Section>
  );
};

// ─────────────────────────────────────────────
// FOUR PILLARS BENTO GRID
// ─────────────────────────────────────────────
const PillarsSection: React.FC = () => {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  const pillars = [
    {
      icon: <Database size={28} />, color: C.purple, title: 'Startup Workspace',
      desc: 'Your startup\'s complete digital headquarters. Profile, team, documents, knowledge base — organized and accessible.',
      size: 'lg', img: '/landing/features_bg.png',
      tags: ['Profile', 'Documents', 'Team', 'Knowledge Base'],
    },
    {
      icon: <Brain size={28} />, color: C.cyan, title: 'AI Mentor',
      desc: 'Not a generic chatbot. 10 specialist mentors that read your actual uploaded documents and give startup-specific advice.',
      size: 'md',
      tags: ['Context-Aware', '10 Specialists', 'Real Answers'],
    },
    {
      icon: <BookOpen size={28} />, color: C.amber, title: 'Learning Academy',
      desc: '22 curriculum modules from idea to scaling, with videos, notes, quizzes, and assignments.',
      size: 'md',
      tags: ['22 Modules', 'Videos', 'Quizzes', 'Certificates'],
    },
    {
      icon: <Rocket size={28} />, color: C.pink, title: 'Founder Journey',
      desc: 'A physical + digital book with a 15-level AI-gated progression. Your startup ritual.',
      size: 'lg', img: '/landing/journey_visual.png',
      tags: ['15 Levels', 'AI Review', 'Physical Book', 'Unlock System'],
    },
  ];

  return (
    <Section id="features" className="py-24 md:py-36" style={{ background: C.dark }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div ref={ref as React.RefObject<HTMLDivElement>}
          initial="hidden" animate={isVisible ? 'visible' : 'hidden'} variants={fadeUp}
          className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-pink-500/30 mb-4"
            style={{ background: 'rgba(244,0,118,0.1)' }}>
            <Layers size={13} className="text-pink-400" />
            <span className="text-xs font-medium text-pink-300">Four Core Pillars</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-heading text-white">
            Built on what founders<br />
            <GradientText from={C.purple} to={C.pink}>actually need.</GradientText>
          </h2>
          <p className="text-white/40 text-lg max-w-xl mx-auto mt-4">
            Not a Notion template. Not a YouTube playlist. A true operating system for your startup, with AI woven through every layer.
          </p>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {pillars.map((pillar, i) => (
            <GlassCard key={pillar.title} className="p-6 flex flex-col gap-4 min-h-[320px]"
              glowColor={pillar.color} delay={i} hover3d>
              {pillar.img && (
                <div className="absolute inset-0 rounded-2xl overflow-hidden opacity-10">
                  <img src={pillar.img} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="relative">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${pillar.color}20`, color: pillar.color }}>
                  {pillar.icon}
                </div>
                <h3 className="text-white font-bold font-heading text-xl mb-2">{pillar.title}</h3>
                <p className="text-white/45 text-sm leading-relaxed flex-1">{pillar.desc}</p>
              </div>
              <div className="flex flex-wrap gap-2 mt-auto relative">
                {pillar.tags.map(tag => (
                  <span key={tag} className="px-2.5 py-1 rounded-lg text-xs font-medium border border-white/8"
                    style={{ background: `${pillar.color}15`, color: `${pillar.color}` }}>
                    {tag}
                  </span>
                ))}
              </div>
              {/* Bottom glow line */}
              <div className="absolute bottom-0 left-6 right-6 h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${pillar.color}60, transparent)` }} />
            </GlassCard>
          ))}
        </div>
      </div>
    </Section>
  );
};

// ─────────────────────────────────────────────
// FOUNDER JOURNEY SECTION
// ─────────────────────────────────────────────
const JourneySection: React.FC = () => {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });
  const [activeLevel, setActiveLevel] = useState(3);

  const levels = [
    { id: 1, title: 'Vision', icon: '🎯', status: 'done' },
    { id: 2, title: 'Mission', icon: '🧭', status: 'done' },
    { id: 3, title: 'Problem Discovery', icon: '🔍', status: 'done' },
    { id: 4, title: 'Idea Discovery', icon: '💡', status: 'current' },
    { id: 5, title: 'Customer Validation', icon: '👥', status: 'locked' },
    { id: 6, title: 'Market Research', icon: '📊', status: 'locked' },
    { id: 7, title: 'Business Model', icon: '🏗️', status: 'locked' },
    { id: 8, title: 'Prototype', icon: '⚡', status: 'locked' },
  ];

  return (
    <Section id="journey" className="py-24 md:py-36 overflow-hidden"
      style={{ background: `linear-gradient(180deg, ${C.dark} 0%, ${C.dark3} 100%)` }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: image + journey path */}
          <motion.div ref={ref as React.RefObject<HTMLDivElement>}
            initial={{ opacity: 0, x: -60 }} animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -60 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative">
            <div className="relative rounded-3xl overflow-hidden"
              style={{ boxShadow: `0 40px 100px rgba(108,71,255,0.25)`, border: '1px solid rgba(255,255,255,0.07)' }}>
              <img src="/landing/journey_visual.png" alt="Founder Journey" className="w-full object-cover" style={{ maxHeight: '480px', objectFit: 'cover' }} />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 40%, rgba(10,10,15,0.85) 100%)' }} />

              {/* Level path overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
                  {levels.map((level, i) => (
                    <motion.button key={level.id}
                      initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3 + i * 0.06 }}
                      onClick={() => setActiveLevel(level.id)}
                      className="flex-shrink-0 relative flex flex-col items-center gap-1.5 group">
                      {/* Connector line */}
                      {i > 0 && (
                        <div className="absolute top-4 -left-3 w-3 h-0.5"
                          style={{ background: level.status === 'locked' ? 'rgba(255,255,255,0.15)' : `linear-gradient(90deg, ${C.purple}, ${C.purple})` }} />
                      )}
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-base transition-all duration-300 ${activeLevel === level.id ? 'scale-110 ring-2 ring-offset-2 ring-purple-500 ring-offset-transparent' : ''}`}
                        style={{
                          background: level.status === 'done' ? `linear-gradient(135deg, ${C.purple}, ${C.pink})` :
                            level.status === 'current' ? `rgba(255,170,0,0.25)` : 'rgba(255,255,255,0.1)',
                          border: level.status === 'current' ? `2px solid ${C.amber}` : '1px solid rgba(255,255,255,0.1)',
                          boxShadow: level.status === 'done' ? `0 4px 16px rgba(108,71,255,0.4)` :
                            level.status === 'current' ? `0 4px 16px rgba(255,170,0,0.3)` : 'none',
                        }}>
                        {level.status === 'done' ? <CheckCircle2 size={16} className="text-white" /> :
                          level.status === 'locked' ? <Lock size={13} className="text-white/30" /> :
                            <span className="animate-pulse">{level.icon}</span>}
                      </div>
                      <span className="text-[9px] text-white/50 text-center whitespace-nowrap hidden sm:block">{level.title}</span>
                    </motion.button>
                  ))}
                  <div className="flex-shrink-0 flex items-center gap-1 pl-1">
                    <div className="text-white/30 text-xs">+7 more</div>
                    <ChevronRight size={12} className="text-white/30" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: text content */}
          <motion.div
            initial={{ opacity: 0, x: 60 }} animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 60 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 mb-6"
              style={{ background: 'rgba(255,170,0,0.1)' }}>
              <BookOpen size={13} className="text-amber-400" />
              <span className="text-xs font-medium text-amber-300">Founder Journey Book</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold font-heading text-white mb-5">
              Your startup journey,<br />
              <GradientText from={C.amber} to={C.pink}>level by level.</GradientText>
            </h2>
            <p className="text-white/45 text-base leading-relaxed mb-8">
              A physical book with 15 guided levels. Write your answers, scan the page, and let the AI review your thinking. Each level unlocks the next — you can't skip ahead.
            </p>
            <div className="space-y-4">
              {[
                { icon: '📖', title: 'Physical + Digital', desc: 'A real book that connects with the app. The ritual makes it meaningful.' },
                { icon: '🤖', title: 'AI Review & Feedback', desc: 'Every submission gets specific, honest AI feedback — not just approval.' },
                { icon: '🔓', title: 'Gated Progression', desc: 'Levels unlock only when AI validates your work. No shortcuts.' },
                { icon: '🏆', title: 'Journey Journal', desc: 'Every completed level is logged. Watch your thinking sharpen over time.' },
              ].map((item) => (
                <div key={item.title} className="flex gap-4 p-4 rounded-xl border border-white/6 hover:border-white/12 transition-colors"
                  style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <div className="text-white font-semibold text-sm mb-0.5">{item.title}</div>
                    <div className="text-white/40 text-xs">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
};

// ─────────────────────────────────────────────
// AI MENTORS SECTION
// ─────────────────────────────────────────────
const MentorsSection: React.FC = () => {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });
  const [activeCard, setActiveCard] = useState(0);

  const mentors = [
    { name: 'Startup Mentor', specialty: 'Business strategy & validation', color: C.purple, icon: '🧠', sample: 'Based on your pitch deck, your USP needs to be sharpened. Let me analyze the positioning...' },
    { name: 'Funding Mentor', specialty: 'Investor relations & funding rounds', color: '#10B981', icon: '💰', sample: 'Your financial model shows strong unit economics. Here\'s how to present that to seed investors...' },
    { name: 'Marketing Mentor', specialty: 'Growth, branding & campaigns', color: C.pink, icon: '📣', sample: 'Your target audience of 18-35 college students responds best to short-form video content...' },
    { name: 'Product Mentor', specialty: 'MVP, roadmap & user research', color: C.cyan, icon: '⚡', sample: 'From your prototype docs, the onboarding flow has 3 friction points. Let me suggest fixes...' },
    { name: 'Legal Mentor', specialty: 'Registration, IP & compliance', color: C.amber, icon: '⚖️', sample: 'For a startup at your stage, a Private Limited structure under MCA gives the most flexibility...' },
    { name: 'Finance Mentor', specialty: 'Runway, burn rate & unit economics', color: C.teal, icon: '📊', sample: 'At your current burn, you have 8 months of runway. Here\'s how to extend it to 14...' },
    { name: 'Sales Mentor', specialty: 'B2B pipeline & closing', color: '#F59E0B', icon: '🎯', sample: 'Your customer interviews reveal price sensitivity. Let\'s restructure your offer...' },
    { name: 'Technical Mentor', specialty: 'Architecture, tech stack & scaling', color: '#8B5CF6', icon: '🔧', sample: 'For your use case, a serverless architecture on AWS will be most cost-effective at MVP stage...' },
    { name: 'Investor Mentor', specialty: 'Pitch preparation & due diligence', color: '#06B6D4', icon: '📈', sample: 'Your pitch deck is missing a clear market size slide. This is the first thing investors check...' },
    { name: 'Gov. Scheme Mentor', specialty: 'DPIIT, Startup India & grants', color: '#22C55E', icon: '🏛️', sample: 'Your startup qualifies for DPIIT recognition. Here are the exact steps and benefits...' },
  ];

  return (
    <Section id="mentors" className="py-24 md:py-36 overflow-hidden"
      style={{ background: `linear-gradient(180deg, ${C.dark3} 0%, ${C.dark} 100%)` }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div ref={ref as React.RefObject<HTMLDivElement>}
          initial="hidden" animate={isVisible ? 'visible' : 'hidden'} variants={fadeUp}
          className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 mb-4"
            style={{ background: 'rgba(0,194,255,0.1)' }}>
            <MessageSquare size={13} className="text-cyan-400" />
            <span className="text-xs font-medium text-cyan-300">AI Mentor Network</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-heading text-white">
            10 expert mentors.<br />
            <GradientText from={C.cyan} to={C.purple}>All trained on your startup.</GradientText>
          </h2>
          <p className="text-white/40 text-lg max-w-xl mx-auto mt-4">
            They don't give generic advice. They read your documents and respond with startup-specific insights.
          </p>
        </motion.div>

        {/* Mentor grid + chat preview */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
          {/* Mentor cards grid */}
          <div className="xl:col-span-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-3 gap-3">
            {mentors.map((mentor, i) => (
              <motion.button key={mentor.name}
                initial={{ opacity: 0, scale: 0.9 }} animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ delay: 0.1 + i * 0.06 }}
                onClick={() => setActiveCard(i)}
                className={`p-4 rounded-xl border text-left transition-all duration-300 ${activeCard === i ? 'border-purple-500/40 bg-purple-500/10' : 'border-white/8 bg-white/3 hover:border-white/15 hover:bg-white/5'}`}>
                <div className="text-2xl mb-2">{mentor.icon}</div>
                <div className="text-white text-xs font-semibold mb-1 leading-tight">{mentor.name}</div>
                <div className="text-white/40 text-[10px] leading-relaxed">{mentor.specialty}</div>
                <div className="mt-2 h-px" style={{ background: `linear-gradient(90deg, ${mentor.color}40, transparent)` }} />
              </motion.button>
            ))}
          </div>

          {/* Live chat preview */}
          <motion.div initial={{ opacity: 0, x: 40 }} animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="rounded-2xl border border-white/8 overflow-hidden"
            style={{ background: 'rgba(18,18,28,0.8)', backdropFilter: 'blur(20px)' }}>
            {/* Chat header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/6">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl"
                style={{ background: `${mentors[activeCard].color}20` }}>
                {mentors[activeCard].icon}
              </div>
              <div>
                <div className="text-white text-sm font-semibold">{mentors[activeCard].name}</div>
                <div className="text-white/40 text-[10px]">{mentors[activeCard].specialty}</div>
              </div>
              <div className="ml-auto flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              </div>
            </div>

            {/* Knowledge base chip */}
            <div className="px-4 py-2 border-b border-white/5">
              <div className="flex items-center gap-2 text-[10px] text-purple-300/60">
                <Sparkles size={10} />
                <span>Knows about: Pitch Deck · Financial Model · Team</span>
              </div>
            </div>

            {/* Chat messages */}
            <div className="p-4 space-y-3 min-h-[240px]">
              <div className="flex justify-end">
                <div className="max-w-[80%] px-3 py-2 rounded-xl rounded-tr-sm text-xs text-white/80"
                  style={{ background: 'rgba(108,71,255,0.3)' }}>
                  What should I focus on this week?
                </div>
              </div>
              <AnimatePresence mode="wait">
                <motion.div key={activeCard} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="flex justify-start">
                  <div className="max-w-[85%] px-3 py-2 rounded-xl rounded-tl-sm text-xs text-white/70 leading-relaxed"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(108,71,255,0.2)' }}>
                    <div className="flex items-center gap-1 mb-1">
                      <Sparkles size={9} className="text-purple-400" />
                      <span className="text-purple-300 text-[9px] font-medium">AI-generated</span>
                    </div>
                    {mentors[activeCard].sample}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Typing indicator */}
              <div className="flex items-center gap-2">
                <div className="flex gap-1 px-3 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  {[0, 1, 2].map(dot => (
                    <motion.div key={dot} animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: dot * 0.15, ease: 'easeInOut' }}
                      className="w-1.5 h-1.5 rounded-full bg-white/30" />
                  ))}
                </div>
              </div>
            </div>

            {/* Input bar */}
            <div className="px-4 pb-4">
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-white/8"
                style={{ background: 'rgba(255,255,255,0.04)' }}>
                <span className="text-white/25 text-xs flex-1">Ask your mentor...</span>
                <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #6C47FF, #F40076)' }}>
                  <ArrowRight size={12} className="text-white" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
};

// ─────────────────────────────────────────────
// INTERACTIVE DEMO SECTION
// ─────────────────────────────────────────────
const DemoSection: React.FC = () => {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });
  const [activeTab, setActiveTab] = useState<'workspace' | 'generator' | 'builder' | 'dashboard'>('dashboard');

  const tabs = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: <BarChart3 size={14} /> },
    { id: 'workspace' as const, label: 'Workspace', icon: <Database size={14} /> },
    { id: 'generator' as const, label: 'Generator', icon: <FileText size={14} /> },
    { id: 'builder' as const, label: 'Builder', icon: <Zap size={14} /> },
  ];

  const demos: Record<string, React.ReactNode> = {
    dashboard: (
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2">
          {[{ label: 'Startup Score', value: '78', unit: '/100', color: C.purple },
            { label: 'Journey Level', value: '4', unit: '/15', color: C.amber },
            { label: 'Docs Uploaded', value: '6', unit: '', color: C.teal }].map(s => (
            <div key={s.label} className="p-3 rounded-xl border border-white/8" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <div className="text-white/40 text-[9px] mb-1 uppercase tracking-wider">{s.label}</div>
              <div className="text-xl font-bold font-heading" style={{ color: s.color }}>
                {s.value}<span className="text-xs text-white/30">{s.unit}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="p-3 rounded-xl border border-purple-500/20" style={{ background: 'rgba(108,71,255,0.08)' }}>
          <div className="flex items-start gap-2">
            <Sparkles size={13} className="text-purple-400 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-purple-300 text-[10px] font-medium mb-0.5">AI Recommendation</div>
              <div className="text-white/60 text-[10px] leading-relaxed">Your funding readiness is at 45%. Upload your financial projections to increase it by 20+ points.</div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {['Market Research ✓', 'Pitch Deck 🔄', 'Legal Setup ○', 'Prototype ✓'].map(t => (
            <div key={t} className="p-2 rounded-lg text-[10px] text-white/50 border border-white/6" style={{ background: 'rgba(255,255,255,0.02)' }}>{t}</div>
          ))}
        </div>
      </div>
    ),
    workspace: (
      <div className="space-y-3">
        <div className="p-3 rounded-xl border border-white/8" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded bg-purple-500/20 flex items-center justify-center"><Database size={12} className="text-purple-400" /></div>
            <span className="text-white text-xs font-semibold">TechStart AI</span>
            <span className="ml-auto text-[9px] text-teal-400 border border-teal-500/30 px-1.5 py-0.5 rounded-md">Building Stage</span>
          </div>
          <div className="text-white/40 text-[10px] leading-relaxed">AI-powered recruitment platform connecting job seekers with companies using intelligent matching algorithms.</div>
        </div>
        <div className="space-y-1.5">
          {['Pitch Deck v3.pdf', 'Financial Model Q2.xlsx', 'Customer Interview Notes.pdf', 'Market Research Report.pdf'].map((doc, i) => (
            <div key={doc} className="flex items-center gap-2.5 p-2 rounded-lg border border-white/6 hover:border-white/12 transition-colors"
              style={{ background: 'rgba(255,255,255,0.02)' }}>
              <FileText size={12} className="text-white/30 flex-shrink-0" />
              <span className="text-white/60 text-[10px] flex-1 truncate">{doc}</span>
              {i < 2 && <span className="text-[9px] text-purple-400 border border-purple-500/30 px-1.5 py-0.5 rounded">AI read</span>}
            </div>
          ))}
        </div>
      </div>
    ),
    generator: (
      <div className="space-y-3">
        <div className="text-white/40 text-[10px] uppercase tracking-wider mb-2">Select Template</div>
        <div className="grid grid-cols-2 gap-2">
          {[{ icon: '📊', name: 'Pitch Deck', fill: true },
            { icon: '📋', name: 'Business Plan', fill: false },
            { icon: '🧩', name: 'Lean Canvas', fill: false },
            { icon: '💰', name: 'Financial Projection', fill: false },
          ].map(t => (
            <div key={t.name} className={`p-3 rounded-xl border cursor-pointer transition-all ${t.fill ? 'border-purple-500/40 bg-purple-500/10' : 'border-white/8 bg-white/3 hover:border-white/15'}`}>
              <div className="text-xl mb-1">{t.icon}</div>
              <div className="text-white text-[10px] font-medium">{t.name}</div>
            </div>
          ))}
        </div>
        <div className="p-3 rounded-xl border border-purple-500/20" style={{ background: 'rgba(108,71,255,0.08)' }}>
          <div className="flex items-center gap-1.5 mb-1.5">
            <Sparkles size={10} className="text-purple-400" />
            <span className="text-purple-300 text-[9px] font-medium">Pre-filled from Knowledge Base</span>
          </div>
          <div className="space-y-1">
            {['Company Name: TechStart AI ✓', 'Problem Statement ✓', 'Target Audience ✓'].map(f => (
              <div key={f} className="text-white/50 text-[9px]">{f}</div>
            ))}
          </div>
        </div>
      </div>
    ),
    builder: (
      <div className="space-y-2">
        <div className="flex items-center gap-2 p-3 rounded-xl border border-purple-500/20 mb-3" style={{ background: 'rgba(108,71,255,0.08)' }}>
          <Zap size={12} className="text-amber-400 flex-shrink-0" />
          <div className="text-[10px] text-white/70"><span className="text-amber-300 font-medium">AI Next Step:</span> Complete your customer interview synthesis — your market research score is below 60%.</div>
        </div>
        {[
          { task: 'Define Problem Statement', status: 'done', color: '#22C55E' },
          { task: 'Customer Interviews (5/10)', status: 'progress', color: C.amber },
          { task: 'MVP Prototype', status: 'progress', color: C.amber },
          { task: 'Business Model Canvas', status: 'notstarted', color: '#F40076' },
          { task: 'Financial Projections', status: 'notstarted', color: '#F40076' },
          { task: 'Funding Deck', status: 'locked', color: 'rgba(255,255,255,0.2)' },
        ].map(item => (
          <div key={item.task} className="flex items-center gap-2.5 p-2.5 rounded-lg border border-white/6"
            style={{ background: 'rgba(255,255,255,0.02)' }}>
            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
            <span className="text-white/60 text-[10px] flex-1">{item.task}</span>
            <span className={`text-[9px] px-1.5 py-0.5 rounded-md border`}
              style={{
                color: item.color, borderColor: `${item.color}40`,
                background: `${item.color}10`,
              }}>
              {item.status === 'done' ? 'Done' : item.status === 'progress' ? 'In Progress' : item.status === 'notstarted' ? 'Not Started' : 'Locked'}
            </span>
          </div>
        ))}
      </div>
    ),
  };

  return (
    <Section className="py-24 md:py-36" style={{ background: C.dark }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div ref={ref as React.RefObject<HTMLDivElement>}
          initial="hidden" animate={isVisible ? 'visible' : 'hidden'} variants={fadeUp}
          className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 mb-4"
            style={{ background: 'rgba(108,71,255,0.1)' }}>
            <Play size={13} className="text-purple-400" />
            <span className="text-xs font-medium text-purple-300">Interactive Preview</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-heading text-white">
            See it in action.<br />
            <GradientText from={C.purple} to={C.pink}>Touch it. Feel it.</GradientText>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Tab selector */}
          <motion.div initial={{ opacity: 0, x: -40 }} animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
            transition={{ duration: 0.8 }} className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === tab.id ? 'text-white' : 'text-white/40 hover:text-white/70'}`}
                  style={activeTab === tab.id ? { background: 'linear-gradient(135deg, #6C47FF, #F40076)', boxShadow: '0 4px 20px rgba(108,71,255,0.35)' } : { background: 'rgba(255,255,255,0.05)' }}>
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold font-heading text-white">
                {activeTab === 'dashboard' && 'Your startup at a glance.'}
                {activeTab === 'workspace' && 'All your startup\'s data, organized.'}
                {activeTab === 'generator' && 'AI drafts your documents.'}
                {activeTab === 'builder' && 'AI tracks what to do next.'}
              </h3>
              <p className="text-white/45 leading-relaxed">
                {activeTab === 'dashboard' && 'Startup Score, funding readiness, AI recommendations, journey progress — everything surfaced on one screen.'}
                {activeTab === 'workspace' && 'Upload your documents and let the AI build a knowledge base of your startup. Every mentor uses it.'}
                {activeTab === 'generator' && 'Pre-filled from your knowledge base. Generate a Pitch Deck in minutes, not hours.'}
                {activeTab === 'builder' && 'The AI Startup Builder scans your progress and tells you exactly what to work on next — and why.'}
              </p>
            </div>
          </motion.div>

          {/* App preview window */}
          <motion.div initial={{ opacity: 0, x: 40 }} animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
            transition={{ duration: 0.8, delay: 0.1 }}>
            <div className="rounded-2xl border border-white/8 overflow-hidden"
              style={{ background: 'rgba(18,18,28,0.9)', backdropFilter: 'blur(20px)', boxShadow: '0 40px 80px rgba(0,0,0,0.5)' }}>
              {/* Window chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/6">
                <div className="flex gap-1.5">
                  {['bg-red-400/60', 'bg-amber-400/60', 'bg-green-400'].map((c, i) => (
                    <div key={i} className={`w-2.5 h-2.5 rounded-full ${c}`} />
                  ))}
                </div>
                <div className="flex-1 mx-3 h-5 rounded-md text-[10px] text-white/25 flex items-center px-2 border border-white/6"
                  style={{ background: 'rgba(255,255,255,0.04)' }}>
                  I'm Entrepreneur · {activeTab}
                </div>
              </div>
              {/* Tab bar */}
              <div className="flex border-b border-white/6 px-4">
                {tabs.map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1 px-3 py-2 text-[10px] border-b-2 transition-colors ${activeTab === tab.id ? 'border-purple-500 text-purple-400' : 'border-transparent text-white/30 hover:text-white/50'}`}>
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </div>
              {/* Content area */}
              <div className="p-4 min-h-[320px]">
                <AnimatePresence mode="wait">
                  <motion.div key={activeTab}
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
                    {demos[activeTab]}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
};

// ─────────────────────────────────────────────
// SOCIAL PROOF SECTION
// ─────────────────────────────────────────────
const SocialProofSection: React.FC = () => {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  const testimonials = [
    { name: 'Priya Sharma', role: 'Founder @ MedSync', rating: 5, text: 'The AI mentor actually knows my startup. When I ask about pricing, it references my financial model I uploaded. This is game-changing.', avatar: '👩‍💼' },
    { name: 'Arjun Mehta', role: 'Co-founder @ AgriFlow', rating: 5, text: 'The Founder Journey forced me to slow down and think deeply. The AI review on my Level 3 submission completely changed how I see my problem statement.', avatar: '👨‍💻' },
    { name: 'Divya Krishnan', role: 'Founder @ EduReach', rating: 5, text: 'I generated my pitch deck in 20 minutes and it was pre-filled with everything I\'d already entered. The AI actually knows my business.', avatar: '👩‍🎓' },
    { name: 'Rahul Gupta', role: 'Founder @ FinEdge', rating: 5, text: 'The Government Scheme mentor found 3 grants I didn\'t know I was eligible for. That alone was worth installing the app.', avatar: '👨‍💼' },
    { name: 'Ananya Pillai', role: 'Founder @ StyleAI', rating: 5, text: 'Having everything in one place — learning, documents, mentors, journey — has made me so much more focused. Less tabs, more action.', avatar: '👩‍🎨' },
    { name: 'Karan Bhatia', role: 'Founder @ SafeRoute', rating: 5, text: 'The AI Startup Builder told me exactly what to do next and explained WHY. It felt like having a real advisor, not just a checklist.', avatar: '👨‍🔬' },
  ];

  return (
    <Section className="py-24 md:py-36 overflow-hidden"
      style={{ background: `linear-gradient(180deg, ${C.dark} 0%, ${C.dark2} 100%)` }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div ref={ref as React.RefObject<HTMLDivElement>}
          initial="hidden" animate={isVisible ? 'visible' : 'hidden'} variants={fadeUp}
          className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 mb-4"
            style={{ background: 'rgba(255,170,0,0.1)' }}>
            <Star size={13} className="text-amber-400" />
            <span className="text-xs font-medium text-amber-300">Founder Stories</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-heading text-white">
            Trusted by founders<br />
            <GradientText from={C.amber} to={C.pink}>building the future.</GradientText>
          </h2>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-8 mb-2">
            {[
              { n: 1000, suffix: '+', label: 'Startups' },
              { n: 98, suffix: '%', label: 'Satisfaction' },
              { n: 50, suffix: 'K+', label: 'Journey Levels Completed' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-bold font-heading" style={{ background: `linear-gradient(135deg, ${C.amber}, ${C.pink})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  <AnimatedCounter target={s.n} suffix={s.suffix} />
                </div>
                <div className="text-white/35 text-xs mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Testimonial grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <GlassCard key={t.name} className="p-5" glowColor={C.amber} delay={i * 0.08}>
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: 'rgba(255,170,0,0.1)' }}>
                  {t.avatar}
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">{t.name}</div>
                  <div className="text-white/40 text-xs">{t.role}</div>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, si) => (
                    <Star key={si} size={11} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
              </div>
              <p className="text-white/55 text-sm leading-relaxed">"{t.text}"</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </Section>
  );
};

// ─────────────────────────────────────────────
// TECH STACK SECTION
// ─────────────────────────────────────────────
const TechSection: React.FC = () => {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.15 });

  const techs = [
    { name: 'React + Vite', icon: <Code2 size={20} />, color: C.cyan, desc: 'Blazing fast frontend' },
    { name: 'Three.js 3D', icon: <Globe size={20} />, color: C.purple, desc: 'Immersive 3D UI' },
    { name: 'AI Mentor Engine', icon: <Brain size={20} />, color: C.pink, desc: 'Context-aware AI' },
    { name: 'Firebase Auth', icon: <Shield size={20} />, color: C.amber, desc: 'Secure authentication' },
    { name: 'IndexedDB', icon: <Database size={20} />, color: C.teal, desc: 'Offline-first storage' },
    { name: 'PWA Ready', icon: <Smartphone size={20} />, color: '#22C55E', desc: 'Installable on any device' },
    { name: 'Framer Motion', icon: <Zap size={20} />, color: '#8B5CF6', desc: 'Premium animations' },
    { name: 'TypeScript', icon: <Cpu size={20} />, color: '#2563EB', desc: 'Type-safe codebase' },
  ];

  return (
    <Section id="academy" className="py-24 md:py-32" style={{ background: C.dark }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div ref={ref as React.RefObject<HTMLDivElement>}
          initial="hidden" animate={isVisible ? 'visible' : 'hidden'} variants={fadeUp}
          className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 mb-4"
            style={{ background: 'rgba(0,194,255,0.1)' }}>
            <Cpu size={13} className="text-cyan-400" />
            <span className="text-xs font-medium text-cyan-300">Built Different</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-heading text-white">
            Premium technology.<br />
            <GradientText from={C.cyan} to={C.teal}>Founder-grade quality.</GradientText>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {techs.map((tech, i) => (
            <GlassCard key={tech.name} className="p-5" glowColor={tech.color} delay={i * 0.07}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ background: `${tech.color}20`, color: tech.color }}>
                {tech.icon}
              </div>
              <div className="text-white font-semibold text-sm mb-1">{tech.name}</div>
              <div className="text-white/35 text-xs">{tech.desc}</div>
            </GlassCard>
          ))}
        </div>
      </div>
    </Section>
  );
};

// ─────────────────────────────────────────────
// PWA CTA SECTION
// ─────────────────────────────────────────────
const CTASection: React.FC<{ user: any }> = ({ user }) => {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.2 });

  return (
    <Section className="py-24 md:py-36 overflow-hidden" style={{ background: C.dark2 }}>
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div ref={ref as React.RefObject<HTMLDivElement>}
          initial="hidden" animate={isVisible ? 'visible' : 'hidden'}>
          {/* Background image */}
          <div className="absolute inset-0" style={{ backgroundImage: 'url(/landing/ai_mentor.png)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.07 }} />
          {/* Radial glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(108,71,255,0.2) 0%, transparent 70%)' }} />
          </div>

          <motion.div variants={fadeUp} className="relative">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 mb-6"
              style={{ background: 'rgba(108,71,255,0.12)' }}>
              <Rocket size={13} className="text-purple-400" />
              <span className="text-xs font-medium text-purple-300">Start Your Journey Today</span>
            </div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold font-heading text-white mb-6 leading-tight">
              Your startup OS<br />awaits.
            </h2>
            <p className="text-white/40 text-xl mb-10 max-w-xl mx-auto">
              Join 1,000+ founders who replaced 6 apps with one. Free forever, works offline, installable anywhere.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {user ? (
                <Link to="/dashboard">
                  <motion.button whileHover={{ scale: 1.05, boxShadow: '0 12px 50px rgba(108,71,255,0.6)' }} whileTap={{ scale: 0.97 }}
                    className="px-10 py-4 rounded-2xl text-lg font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #6C47FF, #F40076)', boxShadow: '0 6px 30px rgba(108,71,255,0.45)' }}>
                    Open My Dashboard <ArrowRight className="inline ml-2" size={20} />
                  </motion.button>
                </Link>
              ) : (
                <Link to="/signup">
                  <motion.button whileHover={{ scale: 1.05, boxShadow: '0 12px 50px rgba(108,71,255,0.6)' }} whileTap={{ scale: 0.97 }}
                    className="px-10 py-4 rounded-2xl text-lg font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #6C47FF, #F40076)', boxShadow: '0 6px 30px rgba(108,71,255,0.45)' }}>
                    Start Building Free <ArrowRight className="inline ml-2" size={20} />
                  </motion.button>
                </Link>
              )}
              <Link to="/login">
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="px-8 py-4 rounded-2xl text-base font-semibold text-white/60 border border-white/10 hover:border-white/20 hover:text-white transition-all">
                  Already have an account?
                </motion.button>
              </Link>
            </div>
            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-white/25 text-xs">
              {['✓ No credit card required', '✓ Works offline (PWA)', '✓ Install on any device', '✓ Free forever'].map(b => (
                <span key={b} className="flex items-center gap-1">{b}</span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </Section>
  );
};

// ─────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────
const Footer: React.FC = () => (
  <footer className="relative py-16 px-6 overflow-hidden" style={{ background: C.dark }}>
    {/* Top gradient line */}
    <div className="absolute top-0 left-0 right-0 h-px"
      style={{ background: 'linear-gradient(90deg, transparent, rgba(108,71,255,0.5), rgba(244,0,118,0.5), transparent)' }} />

    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/10 bg-black flex items-center justify-center shrink-0">
              <img src="/beyond_guidance_logo.jpg" alt="Beyond Guidance" className="w-full h-full object-contain scale-[1.3] -translate-y-[2px]" />
            </div>
            <span className="text-white font-heading font-semibold">I'm Entrepreneur</span>
          </div>
          <p className="text-white/30 text-sm leading-relaxed">
            The AI-powered Startup Operating System by Beyond Guidance.
          </p>
        </div>

        {/* Links */}
        {[
          { title: 'Product', links: ['Dashboard', 'AI Mentors', 'Learning Academy', 'Document Generator'] },
          { title: 'Journey', links: ['Founder Journey', 'Startup Builder', 'Knowledge Base', 'Community'] },
          { title: 'Company', links: ['Beyond Guidance', 'About', 'Contact', 'Privacy Policy'] },
        ].map(col => (
          <div key={col.title}>
            <div className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-4">{col.title}</div>
            <ul className="space-y-3">
              {col.links.map(link => (
                <li key={link}>
                  <a href="#" className="text-white/30 hover:text-white/70 text-sm transition-colors duration-200">{link}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-white/20 text-sm">
          © 2026 Beyond Guidance. All rights reserved.
        </div>
        <div className="flex items-center gap-2 text-white/20 text-sm">
          <span>Made with</span>
          <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}>
            ❤️
          </motion.span>
          <span>for founders everywhere</span>
        </div>
        <div className="flex gap-4 text-white/20">
          {['Twitter', 'LinkedIn', 'Instagram', 'YouTube'].map(s => (
            <a key={s} href="#" className="hover:text-white/60 text-xs transition-colors">{s}</a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

// ─────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────
export const LandingPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="w-full min-h-screen overflow-x-hidden" style={{ background: C.dark }}>
      {/* Inject global CSS for landing-only animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes shine-sweep {
          0% { left: -100%; }
          100% { left: 200%; }
        }
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <Nav user={user} />
      <HeroSection />
      <ShowcaseSection />
      <PillarsSection />
      <JourneySection />
      <MentorsSection />
      <DemoSection />
      <SocialProofSection />
      <TechSection />
      <CTASection user={user} />
      <Footer />
    </div>
  );
};

export default LandingPage;

import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Rocket,
  Target,
  Lightbulb,
  Heart,
  TrendingUp,
  Shield,
  Globe,
} from 'lucide-react';
import { useIdentityStore } from '../../store/useIdentityStore';

const SG = "'Space Grotesk', sans-serif";
const EASE = [0.16, 1, 0.3, 1] as const;

// ──────────────────────────────────────────────────────────
// INSPIRATION CARDS DATA
// ──────────────────────────────────────────────────────────

interface InspirationCard {
  id: string;
  icon: React.ReactNode;
  statistic: string;
  headline: string;
  body: string;
  gradientFrom: string;
  gradientTo: string;
  accentColor: string;
}

const CARDS: InspirationCard[] = [
  {
    id: 'why',
    icon: <Rocket className="w-8 h-8" />,
    statistic: '92%',
    headline: 'of the world\'s biggest problems remain unsolved.',
    body: 'Every breakthrough — from electricity to the internet — started with one person who refused to accept the status quo. The next great solution could come from you.',
    gradientFrom: '#6C47FF',
    gradientTo: '#8B7AFF',
    accentColor: '#6C47FF',
  },
  {
    id: 'vision',
    icon: <Target className="w-8 h-8" />,
    statistic: 'Vision',
    headline: 'is seeing what others can\'t — yet.',
    body: 'Elon Musk saw electric cars when everyone laughed. Steve Jobs saw personal computers in every home. Your vision doesn\'t need to make sense to others. It just needs to burn inside you.',
    gradientFrom: '#F59E0B',
    gradientTo: '#F97316',
    accentColor: '#F59E0B',
  },
  {
    id: 'think',
    icon: <Lightbulb className="w-8 h-8" />,
    statistic: '67%',
    headline: 'of billion-dollar startups solved a personal frustration.',
    body: 'The best ideas don\'t come from MBA programs. They come from someone who said "Why is this so broken?" and had the courage to fix it. What frustrates you?',
    gradientFrom: '#34D399',
    gradientTo: '#2DD4BF',
    accentColor: '#34D399',
  },
  {
    id: 'purpose',
    icon: <Heart className="w-8 h-8" />,
    statistic: 'Purpose',
    headline: 'is the entrepreneur\'s secret weapon.',
    body: 'Companies built on purpose outlast those built on profit. When your startup is aligned with who you are and what you care about, failure becomes just another lesson — not an ending.',
    gradientFrom: '#F43F5E',
    gradientTo: '#EC4899',
    accentColor: '#F43F5E',
  },
  {
    id: 'failure',
    icon: <Shield className="w-8 h-8" />,
    statistic: '11 times',
    headline: '— that\'s how often the average successful founder failed before making it.',
    body: 'Failure is not the opposite of success. It\'s the road to it. James Dyson built 5,127 prototypes before creating the bagless vacuum. Every "no" teaches you something a "yes" never could.',
    gradientFrom: '#8B5CF6',
    gradientTo: '#7C3AED',
    accentColor: '#8B5CF6',
  },
  {
    id: 'impact',
    icon: <Globe className="w-8 h-8" />,
    statistic: '3.8 Billion',
    headline: 'people still lack access to basic healthcare technology.',
    body: 'Entrepreneurship isn\'t just about building companies. It\'s about building a better world. The problems are enormous — but so is the opportunity to create lasting impact.',
    gradientFrom: '#0EA5E9',
    gradientTo: '#38BDF8',
    accentColor: '#0EA5E9',
  },
  {
    id: 'ready',
    icon: <Sparkles className="w-8 h-8" />,
    statistic: 'You',
    headline: 'have everything it takes to begin.',
    body: 'Before building a startup, you need to discover who you are. Your personality, your values, your passions, your skills — they all hold the blueprint for the entrepreneur you\'re meant to become.',
    gradientFrom: '#6C47FF',
    gradientTo: '#38BDF8',
    accentColor: '#6C47FF',
  },
];

// ──────────────────────────────────────────────────────────
// COMPONENT
// ──────────────────────────────────────────────────────────

export const InspirationScreen: React.FC = () => {
  const navigate = useNavigate();
  const setDiscoveryPhase = useIdentityStore((s) => s.setDiscoveryPhase);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  const isLastCard = currentIndex === CARDS.length - 1;
  const card = CARDS[currentIndex]!;
  const progress = ((currentIndex + 1) / CARDS.length) * 100;

  const goNext = useCallback(() => {
    if (currentIndex < CARDS.length - 1) {
      setDirection(1);
      setCurrentIndex((i) => i + 1);
    }
  }, [currentIndex]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((i) => i - 1);
    }
  }, [currentIndex]);

  const handleBeginDiscovery = () => {
    setDiscoveryPhase('personality');
    navigate('/discover/identity');
  };

  // Slide animation variants
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.45, ease: EASE },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.35, ease: EASE },
    }),
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col"
      style={{ background: '#0A0A14' }}>

      {/* ── Ambient Background ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient orbs */}
        <motion.div
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -25, 15, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute w-[500px] h-[500px] -top-40 -left-20 rounded-full"
          style={{
            background: `radial-gradient(circle, ${card.gradientFrom}18 0%, transparent 70%)`,
            transition: 'background 1s ease',
          }}
        />
        <motion.div
          animate={{
            x: [0, -25, 20, 0],
            y: [0, 20, -15, 0],
            scale: [1, 0.95, 1.08, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute w-[400px] h-[400px] bottom-0 -right-20 rounded-full"
          style={{
            background: `radial-gradient(circle, ${card.gradientTo}14 0%, transparent 70%)`,
            transition: 'background 1s ease',
          }}
        />

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Floating particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: card.accentColor,
              left: `${(i * 17 + 5) % 100}%`,
              top: `${(i * 23 + 10) % 100}%`,
              opacity: 0.2,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.1, 0.4, 0.1],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 4 + (i % 3) * 2,
              delay: i * 0.3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* ── Top Bar ── */}
      <div className="relative z-10 flex items-center justify-between px-6 pt-6 pb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl overflow-hidden border border-white/10 bg-black flex items-center justify-center shrink-0">
            <img src="/beyond_guidance_logo.jpg" alt="BG"
              className="w-full h-full object-contain scale-[1.3] -translate-y-[2px]" />
          </div>
          <span className="text-[11px] font-bold text-white/40 uppercase tracking-[0.2em]"
            style={{ fontFamily: SG }}>
            I'm Entrepreneur
          </span>
        </div>
        <button
          onClick={() => {
            setDiscoveryPhase('personality');
            navigate('/discover/identity');
          }}
          className="text-[11px] font-semibold text-white/30 hover:text-white/60 transition-colors uppercase tracking-wider"
          style={{ fontFamily: SG }}
        >
          Skip →
        </button>
      </div>

      {/* ── Progress Bar ── */}
      <div className="relative z-10 px-6 pt-2">
        <div className="h-[3px] rounded-full bg-white/[0.06] overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: `linear-gradient(90deg, ${card.gradientFrom}, ${card.gradientTo})`,
            }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: EASE }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[10px] text-white/25 font-semibold" style={{ fontFamily: SG }}>
            {currentIndex + 1} of {CARDS.length}
          </span>
          <span className="text-[10px] text-white/25 font-semibold" style={{ fontFamily: SG }}>
            Inspiration
          </span>
        </div>
      </div>

      {/* ── Card Content ── */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-8">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={card.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full max-w-md"
          >
            <div className="relative rounded-3xl overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(20px)',
              }}>

              {/* Card top accent */}
              <div className="h-[2px]"
                style={{ background: `linear-gradient(90deg, ${card.gradientFrom}, ${card.gradientTo})` }} />

              <div className="p-8 space-y-6">
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.15, duration: 0.4, ease: EASE }}
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${card.gradientFrom}20, ${card.gradientTo}10)`,
                    border: `1px solid ${card.gradientFrom}25`,
                    color: card.accentColor,
                  }}
                >
                  {card.icon}
                </motion.div>

                {/* Statistic */}
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.4, ease: EASE }}
                >
                  <span className="text-5xl md:text-6xl font-black tracking-tight"
                    style={{
                      fontFamily: SG,
                      background: `linear-gradient(135deg, ${card.gradientFrom}, ${card.gradientTo})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}>
                    {card.statistic}
                  </span>
                </motion.div>

                {/* Headline */}
                <motion.h2
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.28, duration: 0.4, ease: EASE }}
                  className="text-xl md:text-2xl font-bold text-white/90 leading-snug"
                  style={{ fontFamily: SG }}
                >
                  {card.headline}
                </motion.h2>

                {/* Body */}
                <motion.p
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.35, duration: 0.4, ease: EASE }}
                  className="text-[14px] leading-relaxed text-white/50 font-medium"
                >
                  {card.body}
                </motion.p>

                {/* CTA for last card */}
                {isLastCard && (
                  <motion.div
                    initial={{ y: 15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5, ease: EASE }}
                    className="pt-2"
                  >
                    <div className="p-4 rounded-2xl text-center space-y-3"
                      style={{
                        background: `linear-gradient(135deg, ${card.gradientFrom}10, ${card.gradientTo}08)`,
                        border: `1px solid ${card.gradientFrom}18`,
                      }}>
                      <p className="text-[13px] font-semibold text-white/70" style={{ fontFamily: SG }}>
                        Are you ready to discover who you really are?
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Bottom Navigation ── */}
      <div className="relative z-10 px-6 pb-8">
        <div className="flex items-center justify-between max-w-md mx-auto">
          {/* Prev button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={goPrev}
            disabled={currentIndex === 0}
            className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all disabled:opacity-20 disabled:cursor-not-allowed"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'white',
            }}
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>

          {/* Dots */}
          <div className="flex gap-2">
            {CARDS.map((c, i) => (
              <button
                key={c.id}
                onClick={() => {
                  setDirection(i > currentIndex ? 1 : -1);
                  setCurrentIndex(i);
                }}
                className="relative group"
              >
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: i === currentIndex ? 24 : 8,
                    background:
                      i === currentIndex
                        ? `linear-gradient(90deg, ${card.gradientFrom}, ${card.gradientTo})`
                        : i < currentIndex
                          ? 'rgba(255,255,255,0.25)'
                          : 'rgba(255,255,255,0.08)',
                    boxShadow:
                      i === currentIndex ? `0 0 12px ${card.accentColor}40` : 'none',
                  }}
                />
              </button>
            ))}
          </div>

          {/* Next / Begin button */}
          {isLastCard ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBeginDiscovery}
              className="h-12 px-6 rounded-2xl flex items-center gap-2 text-[13px] font-bold text-white transition-all"
              style={{
                fontFamily: SG,
                background: `linear-gradient(135deg, ${card.gradientFrom}, ${card.gradientTo})`,
                boxShadow: `0 8px 32px ${card.accentColor}30`,
              }}
            >
              <span>Discover Myself</span>
              <TrendingUp className="w-4 h-4" />
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={goNext}
              className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all"
              style={{
                background: `linear-gradient(135deg, ${card.gradientFrom}, ${card.gradientTo})`,
                boxShadow: `0 8px 24px ${card.accentColor}25`,
                color: 'white',
              }}
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InspirationScreen;

import React, { useState, useEffect, useMemo } from 'react'; // Trivial refresh comment
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Check, Lock, Sparkles, Search, Lightbulb,
  Target, Wrench, Wallet, Users, Scale, Rocket, TrendingUp, Crown
} from 'lucide-react';
import { useIdentityStore } from '../../store/useIdentityStore';
import { generatePersonalizedRoadmap, type RoadmapStep } from '../../lib/fake-identity';

const SG = "'Space Grotesk', sans-serif";
const EASE = [0.16, 1, 0.3, 1] as const;

const phaseColors: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  discover: { bg: 'rgba(108,71,255,0.08)', border: 'rgba(108,71,255,0.15)', text: '#6C47FF', glow: 'rgba(108,71,255,0.2)' },
  validate: { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.15)', text: '#F59E0B', glow: 'rgba(245,158,11,0.2)' },
  build: { bg: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.15)', text: '#34D399', glow: 'rgba(52,211,153,0.2)' },
  launch: { bg: 'rgba(14,165,233,0.08)', border: 'rgba(14,165,233,0.15)', text: '#0EA5E9', glow: 'rgba(14,165,233,0.2)' },
  scale: { bg: 'rgba(244,63,94,0.08)', border: 'rgba(244,63,94,0.15)', text: '#F43F5E', glow: 'rgba(244,63,94,0.2)' },
};

const phaseIcons: Record<string, React.ReactNode> = {
  discover: <Search className="w-3.5 h-3.5" />,
  validate: <Target className="w-3.5 h-3.5" />,
  build: <Wrench className="w-3.5 h-3.5" />,
  launch: <Rocket className="w-3.5 h-3.5" />,
  scale: <TrendingUp className="w-3.5 h-3.5" />,
};

const levelIcons: Record<number, React.ReactNode> = {
  1: <Lightbulb className="w-4 h-4" />,
  2: <Search className="w-4 h-4" />,
  3: <Users className="w-4 h-4" />,
  4: <Target className="w-4 h-4" />,
  5: <Users className="w-4 h-4" />,
  6: <Lightbulb className="w-4 h-4" />,
  7: <Wallet className="w-4 h-4" />,
  8: <Wrench className="w-4 h-4" />,
  9: <Users className="w-4 h-4" />,
  10: <Wallet className="w-4 h-4" />,
  11: <Users className="w-4 h-4" />,
  12: <Scale className="w-4 h-4" />,
  13: <Wallet className="w-4 h-4" />,
  14: <Rocket className="w-4 h-4" />,
  15: <Crown className="w-4 h-4" />,
};

export const RoadmapPreview: React.FC = () => {
  const navigate = useNavigate();
  const { entrepreneurProfile, setDiscoveryPhase } = useIdentityStore();
  const [steps, setSteps] = useState<RoadmapStep[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [showSteps, setShowSteps] = useState(false);

  useEffect(() => {
    if (entrepreneurProfile) {
      const roadmap = generatePersonalizedRoadmap(entrepreneurProfile);
      setSteps(roadmap);
      setTimeout(() => setShowSteps(true), 600);
    }
  }, [entrepreneurProfile]);

  const phases = useMemo(() => {
    const grouped: Record<string, RoadmapStep[]> = {};
    for (const step of steps) {
      if (!grouped[step.phase]) grouped[step.phase] = [];
      grouped[step.phase]!.push(step);
    }
    return Object.entries(grouped);
  }, [steps]);

  const handleBeginJourney = () => {
    setDiscoveryPhase('completed');
    navigate('/dashboard');
  };

  if (!entrepreneurProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0A0A14' }}>
        <p className="text-white/40">Loading roadmap...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ background: '#0A0A14' }}>

      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[600px] h-[600px] -top-60 left-1/2 -translate-x-1/2 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(108,71,255,0.08) 0%, transparent 70%)' }} />
      </div>

      {/* Header */}
      <div className="relative z-10 px-5 pt-8 pb-4 text-center space-y-3">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, rgba(108,71,255,0.12), rgba(52,211,153,0.08))',
            border: '1px solid rgba(108,71,255,0.12)',
          }}
        >
          <Rocket className="w-8 h-8 text-violet-400" />
        </motion.div>

        <motion.h1
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-black text-white/90"
          style={{ fontFamily: SG }}
        >
          Your Personalized Roadmap
        </motion.h1>
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-[12px] text-white/40 font-medium max-w-xs mx-auto"
        >
          15 levels from idea to IPO — tailored to your identity as a <strong className="text-white/60">{entrepreneurProfile.archetype}</strong>
        </motion.p>

        {/* Phase legend */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap gap-2 justify-center pt-1"
        >
          {Object.entries(phaseColors).map(([phase, colors]) => (
            <div key={phase} className="flex items-center gap-1 px-2.5 py-1 rounded-lg"
              style={{ background: colors.bg, border: `1px solid ${colors.border}` }}>
              <span style={{ color: colors.text }}>{phaseIcons[phase]}</span>
              <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: colors.text, fontFamily: SG }}>
                {phase}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Steps timeline */}
      <div className="relative z-10 flex-1 overflow-y-auto px-5 pb-6">
        <AnimatePresence>
          {showSteps && phases.map(([phase, phaseSteps], pi) => {
            const colors = phaseColors[phase]!;
            return (
              <motion.div
                key={phase}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 + pi * 0.15, duration: 0.4, ease: EASE }}
                className="mb-5"
              >
                {/* Phase header */}
                <div className="flex items-center gap-2 mb-3 px-1">
                  <span style={{ color: colors.text }}>{phaseIcons[phase]}</span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em]"
                    style={{ color: colors.text, fontFamily: SG }}>
                    Phase: {phase}
                  </span>
                  <div className="flex-1 h-px" style={{ background: colors.border }} />
                </div>

                {/* Steps */}
                <div className="space-y-2 relative">
                  {/* Vertical timeline line */}
                  <div className="absolute left-[19px] top-0 bottom-0 w-[2px]"
                    style={{ background: colors.border }} />

                  {phaseSteps.map((step, si) => {
                    const isExpanded = expanded === step.level;
                    const isFirst = step.level === 1;
                    return (
                      <motion.button
                        key={step.level}
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 + pi * 0.15 + si * 0.05, duration: 0.3, ease: EASE }}
                        onClick={() => setExpanded(isExpanded ? null : step.level)}
                        className="w-full text-left flex items-start gap-3 relative"
                      >
                        {/* Node */}
                        <div className="relative z-10 w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                          style={{
                            background: isFirst ? colors.text : colors.bg,
                            border: `1.5px solid ${colors.border}`,
                            boxShadow: isFirst ? `0 0 16px ${colors.glow}` : 'none',
                            color: isFirst ? 'white' : colors.text,
                          }}
                        >
                          {isFirst ? levelIcons[step.level] ?? <Check className="w-4 h-4" /> : (
                            <span className="text-[11px] font-black" style={{ fontFamily: SG }}>{step.level}</span>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 pb-3 min-w-0">
                          <div className="p-3 rounded-xl transition-all"
                            style={{
                              background: isExpanded ? colors.bg : 'rgba(255,255,255,0.02)',
                              border: isExpanded ? `1px solid ${colors.border}` : '1px solid transparent',
                            }}>
                            <p className="text-[12px] font-bold text-white/80" style={{ fontFamily: SG }}>
                              {step.title}
                            </p>
                            {isExpanded && (
                              <motion.p
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                className="text-[11px] text-white/40 mt-1.5 leading-relaxed"
                              >
                                {step.description}
                              </motion.p>
                            )}
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* CTA */}
        {showSteps && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="space-y-4 pt-2"
          >
            {/* AI insight */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500/20 to-violet-500/5 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-violet-500" />
              </div>
              <div className="rounded-2xl rounded-tl-md px-4 py-3 flex-1"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <p className="text-[12px] leading-relaxed font-medium text-white/50">
                  This roadmap is personalized for you based on your identity as a{' '}
                  <strong className="text-white/70">{entrepreneurProfile.archetype}</strong>.
                  Your journey starts with Level 1 — and we'll guide you every step of the way. Ready?
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleBeginJourney}
              className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-[14px] font-bold text-white transition-all"
              style={{
                fontFamily: SG,
                background: 'linear-gradient(135deg, #6C47FF, #34D399)',
                boxShadow: '0 8px 32px rgba(108,71,255,0.25)',
              }}
            >
              <span>Begin My Founder Journey</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default RoadmapPreview;

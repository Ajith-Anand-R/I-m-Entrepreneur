import React, { useState, useEffect } from 'react'; // Trivial refresh comment
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Fingerprint, Target, Zap, TrendingUp, Heart, Shield, Star } from 'lucide-react';
import { useIdentityStore, type EntrepreneurProfile } from '../../store/useIdentityStore';
import { generateEntrepreneurProfile } from '../../lib/fake-identity';

const SG = "'Space Grotesk', sans-serif";
const EASE = [0.16, 1, 0.3, 1] as const;

export const ProfileReveal: React.FC = () => {
  const navigate = useNavigate();
  const { personality, values, passions, skills, lifeStory, problems, setEntrepreneurProfile, setDiscoveryPhase } = useIdentityStore();
  const [profile, setProfile] = useState<EntrepreneurProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [revealPhase, setRevealPhase] = useState(0); // 0=loading, 1=archetype, 2=details, 3=all

  // Generate profile on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      const result = await generateEntrepreneurProfile(personality, values, passions, skills, lifeStory, problems);
      if (mounted) {
        setProfile(result);
        setEntrepreneurProfile(result);
        setLoading(false);
        // Staged reveal
        setTimeout(() => setRevealPhase(1), 400);
        setTimeout(() => setRevealPhase(2), 1200);
        setTimeout(() => setRevealPhase(3), 2200);
      }
    })();
    return () => { mounted = false; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleContinue = () => {
    setDiscoveryPhase('roadmap');
    navigate('/discover/roadmap');
  };

  // Loading state
  if (loading || !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center"
        style={{ background: '#0A0A14' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="w-24 h-24 rounded-3xl border-2 border-violet-500/30 flex items-center justify-center mb-8"
          style={{ background: 'radial-gradient(circle, rgba(108,71,255,0.1), transparent)' }}
        >
          <Fingerprint className="w-12 h-12 text-violet-400" />
        </motion.div>
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <h2 className="text-xl font-bold text-white/80 text-center" style={{ fontFamily: SG }}>
            Analyzing your identity...
          </h2>
          <p className="text-[12px] text-white/40 text-center mt-2">
            Processing personality, values, passions, skills & life story
          </p>
        </motion.div>

        {/* Animated data points */}
        <div className="flex gap-4 mt-8">
          {['Personality', 'Values', 'Passions', 'Skills', 'Story', 'Problems'].map((label, i) => (
            <motion.div
              key={label}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.2, duration: 0.4 }}
              className="text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
                className="w-3 h-3 rounded-full mx-auto mb-1.5"
                style={{ background: i < 3 ? '#6C47FF' : '#34D399' }}
              />
              <span className="text-[8px] font-bold text-white/30 uppercase tracking-wider" style={{ fontFamily: SG }}>
                {label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ background: '#0A0A14' }}>

      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ x: [0, 30, -20, 0], y: [0, -25, 15, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute w-[500px] h-[500px] -top-40 -left-20 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(108,71,255,0.12) 0%, transparent 70%)' }}
        />
        <motion.div
          animate={{ x: [0, -25, 20, 0], y: [0, 20, -15, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute w-[400px] h-[400px] bottom-0 -right-20 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(52,211,153,0.08) 0%, transparent 70%)' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 overflow-y-auto px-5 py-8 space-y-6">

        {/* ── Phase 1: Archetype Reveal ── */}
        <AnimatePresence>
          {revealPhase >= 1 && (
            <motion.div
              initial={{ y: 30, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: EASE }}
              className="text-center space-y-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
                className="w-20 h-20 rounded-3xl mx-auto flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(108,71,255,0.15), rgba(52,211,153,0.1))',
                  border: '1px solid rgba(108,71,255,0.15)',
                  boxShadow: '0 0 40px rgba(108,71,255,0.15)',
                }}
              >
                <Fingerprint className="w-10 h-10 text-violet-400" />
              </motion.div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 mb-2" style={{ fontFamily: SG }}>
                  Your Entrepreneur Archetype
                </p>
                <motion.h1
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="text-3xl md:text-4xl font-black"
                  style={{
                    fontFamily: SG,
                    background: 'linear-gradient(135deg, #6C47FF, #34D399)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                  {profile.archetype}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-[14px] text-white/50 font-medium mt-2"
                >
                  {profile.tagline}
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Phase 2: Identity Cards ── */}
        <AnimatePresence>
          {revealPhase >= 2 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="grid grid-cols-2 gap-3"
            >
              {/* Top Traits */}
              <ProfileCard icon={<Zap className="w-4 h-4" />} title="Key Traits" color="#6C47FF"
                items={profile.topTraits} />

              {/* Top Values */}
              <ProfileCard icon={<Heart className="w-4 h-4" />} title="Core Values" color="#F43F5E"
                items={profile.topValues} />

              {/* Strengths */}
              <ProfileCard icon={<Star className="w-4 h-4" />} title="Strengths" color="#34D399"
                items={profile.strengths} />

              {/* Growth Areas */}
              <ProfileCard icon={<TrendingUp className="w-4 h-4" />} title="Growth Areas" color="#F59E0B"
                items={profile.growthAreas} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Phase 3: Focus Area + CTA ── */}
        <AnimatePresence>
          {revealPhase >= 3 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="space-y-4"
            >
              {/* Primary Passion */}
              <div className="p-4 rounded-2xl"
                style={{
                  background: 'rgba(108,71,255,0.06)',
                  border: '1px solid rgba(108,71,255,0.1)',
                }}>
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-violet-400" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400" style={{ fontFamily: SG }}>
                    Focus Area
                  </span>
                </div>
                <p className="text-[14px] font-bold text-white/80" style={{ fontFamily: SG }}>
                  {profile.primaryPassion} × {profile.problemFocus}
                </p>
                <p className="text-[11px] text-white/40 mt-1">
                  {profile.suggestedRoadmapFocus}
                </p>
              </div>

              {/* AI Insight */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500/20 to-violet-500/5 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4 text-violet-500" />
                </div>
                <div className="rounded-2xl rounded-tl-md px-4 py-3 flex-1"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <p className="text-[12px] leading-relaxed font-medium text-white/50">
                    Your identity analysis reveals a rare combination of {profile.topTraits[0]?.toLowerCase()} mindset and {profile.topValues[0]?.toLowerCase()}-driven values.
                    With your strengths in {profile.strengths[0]?.toLowerCase()} and passion for {profile.primaryPassion}, you're naturally positioned to innovate in this space.
                  </p>
                </div>
              </div>

              {/* CTA */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleContinue}
                className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-[14px] font-bold text-white transition-all"
                style={{
                  fontFamily: SG,
                  background: 'linear-gradient(135deg, #6C47FF, #34D399)',
                  boxShadow: '0 8px 32px rgba(108,71,255,0.25)',
                }}
              >
                <span>See My Personalized Roadmap</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ── Reusable profile card ──
function ProfileCard({ icon, title, color, items }: { icon: React.ReactNode; title: string; color: string; items: string[] }) {
  return (
    <motion.div
      initial={{ y: 15, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="p-3.5 rounded-2xl"
      style={{
        background: `${color}06`,
        border: `1px solid ${color}12`,
      }}>
      <div className="flex items-center gap-1.5 mb-2.5">
        <span style={{ color }}>{icon}</span>
        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color, fontFamily: SG }}>
          {title}
        </span>
      </div>
      <div className="space-y-1.5">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
            <span className="text-[11px] font-semibold text-white/60">{item}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default ProfileReveal;

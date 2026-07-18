import React, { useState, useCallback } from 'react'; // Trivial refresh comment
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Sparkles, Plus, X, Search } from 'lucide-react';
import { useIdentityStore, type ProblemEntry } from '../../store/useIdentityStore';
import { problemDomains, getProblemReflection } from '../../lib/fake-identity';

const SG = "'Space Grotesk', sans-serif";
const EASE = [0.16, 1, 0.3, 1] as const;

export const ProblemDiscovery: React.FC = () => {
  const navigate = useNavigate();
  const { problems, addProblem, removeProblem, setDiscoveryPhase } = useIdentityStore();
  const [activeDomain, setActiveDomain] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [reflection, setReflection] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [passionScore, setPassionScore] = useState(3);

  const domain = activeDomain ? problemDomains.find((d) => d.id === activeDomain) : null;
  const domainProblems = problems.filter((p) => p.domain === activeDomain);

  const handleAddProblem = useCallback(async () => {
    if (!input.trim() || !activeDomain) return;

    const entry: ProblemEntry = {
      id: `prob-${Date.now()}`,
      domain: activeDomain,
      description: input.trim(),
      passionScore,
      createdAt: Date.now(),
    };
    addProblem(entry);

    // Get AI reflection
    setIsThinking(true);
    const text = await getProblemReflection(activeDomain, input);
    setReflection(text);
    setIsThinking(false);
    setInput('');
    setPassionScore(3);
  }, [input, activeDomain, passionScore, addProblem]);

  const handleContinue = () => {
    setDiscoveryPhase('profileReveal');
    navigate('/onboarding/profile');
  };

  // Domain selection view
  if (!activeDomain) {
    return (
      <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: 'var(--surface-0)' }}>
        <div className="absolute inset-0 pointer-events-none gradient-mesh-hero" />

        <div className="relative z-10 px-4 pt-5 pb-3">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => navigate('/onboarding/identity')}
              className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-black/5 transition-colors">
              <ArrowLeft className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
            </button>
            <div className="text-center">
              <h1 className="text-sm font-bold" style={{ fontFamily: SG, color: 'var(--text-primary)' }}>
                Problem Discovery
              </h1>
              <p className="text-[10px] font-semibold mt-0.5" style={{ color: 'var(--text-muted)' }}>
                Entrepreneurs solve problems
              </p>
            </div>
            <div className="w-10" />
          </div>
        </div>

        <div className="relative z-10 flex-1 px-4 pb-6 overflow-y-auto">
          {/* Intro */}
          <div className="flex items-start gap-3 mb-6">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500/20 to-violet-500/5 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4 text-violet-500" />
            </div>
            <div className="glass-frost rounded-2xl rounded-tl-md px-4 py-3 flex-1">
              <p className="text-[12px] leading-relaxed font-medium" style={{ color: 'var(--text-secondary)' }}>
                Great founders notice problems everywhere. Let's explore different areas of life and discover what frustrations you genuinely care about solving.
              </p>
            </div>
          </div>

          {/* Problem counter */}
          <div className="flex items-center justify-between mb-4 px-1">
            <span className="text-[11px] font-bold" style={{ color: 'var(--text-muted)', fontFamily: SG }}>
              Explore at least 3 areas
            </span>
            <span className="px-3 py-1 rounded-xl text-[11px] font-bold"
              style={{ background: problems.length >= 3 ? 'rgba(52,211,153,0.1)' : 'rgba(108,71,255,0.06)', color: problems.length >= 3 ? '#34D399' : '#6C47FF', fontFamily: SG }}>
              {problems.length} problems found
            </span>
          </div>

          {/* Domain grid */}
          <div className="grid grid-cols-2 gap-2.5 mb-6">
            {problemDomains.map((dom, i) => {
              const count = problems.filter((p) => p.domain === dom.id).length;
              return (
                <motion.button
                  key={dom.id}
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.04, duration: 0.3, ease: EASE }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveDomain(dom.id)}
                  className="text-left p-4 rounded-2xl transition-all relative"
                  style={{
                    background: count > 0 ? 'rgba(52,211,153,0.04)' : 'var(--surface-1)',
                    border: count > 0 ? '1px solid rgba(52,211,153,0.15)' : '1px solid var(--border-default)',
                  }}
                >
                  <span className="text-2xl block">{dom.icon}</span>
                  <p className="text-[12px] font-bold mt-2" style={{ color: 'var(--text-primary)' }}>
                    {dom.label}
                  </p>
                  {count > 0 && (
                    <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center">
                      {count}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Continue button */}
          {problems.length >= 3 && (
            <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleContinue}
                className="btn-primary w-full justify-center text-[13px]"
              >
                <span>See My Entrepreneur Profile</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  // Active domain detail view
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: 'var(--surface-0)' }}>
      <div className="absolute inset-0 pointer-events-none gradient-mesh-hero" />

      <div className="relative z-10 px-4 pt-5 pb-3">
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => { setActiveDomain(null); setReflection(null); }}
            className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-black/5 transition-colors">
            <ArrowLeft className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
          </button>
          <div className="text-center">
            <h1 className="text-sm font-bold" style={{ fontFamily: SG, color: 'var(--text-primary)' }}>
              {domain?.icon} {domain?.label}
            </h1>
          </div>
          <div className="w-10" />
        </div>
      </div>

      <div className="relative z-10 flex-1 px-4 pb-6 overflow-y-auto space-y-4">
        {/* AI prompt */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500/20 to-violet-500/5 flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4 text-violet-500" />
          </div>
          <div className="glass-frost rounded-2xl rounded-tl-md px-4 py-3 flex-1"
            style={{ borderLeft: '2px solid rgba(108,71,255,0.15)' }}>
            <p className="text-[13px] leading-relaxed font-medium" style={{ color: 'var(--text-primary)' }}>
              {domain?.prompt}
            </p>
          </div>
        </div>

        {/* Previously added problems */}
        {domainProblems.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wider px-1"
              style={{ color: 'var(--text-muted)', fontFamily: SG }}>
              Problems you've identified
            </p>
            {domainProblems.map((p) => (
              <motion.div key={p.id} layout
                initial={{ y: 5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex items-start gap-2 p-3 rounded-xl"
                style={{ background: 'var(--surface-1)', border: '1px solid var(--border-default)' }}>
                <Search className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'var(--accent)' }} />
                <p className="text-[12px] flex-1 font-medium leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                  {p.description}
                </p>
                <button onClick={() => removeProblem(p.id)}
                  className="p-1 rounded-lg hover:bg-red-50 transition-colors shrink-0">
                  <X className="w-3.5 h-3.5 text-red-400" />
                </button>
              </motion.div>
            ))}
          </div>
        )}

        {/* Input area */}
        <div className="space-y-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe a problem you've noticed..."
            rows={3}
            className="w-full text-[13px] leading-relaxed rounded-2xl px-4 py-3 outline-none resize-none transition-all duration-200"
            style={{
              background: 'var(--surface-1)',
              border: '1px solid var(--border-default)',
              color: 'var(--text-primary)',
            }}
          />

          {/* Passion score */}
          <div className="flex items-center gap-3 px-1">
            <span className="text-[11px] font-semibold" style={{ color: 'var(--text-secondary)' }}>
              How much do you care?
            </span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <motion.button
                  key={level}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setPassionScore(level)}
                  className="w-7 h-7 rounded-lg text-[12px] font-bold transition-all"
                  style={{
                    background: level <= passionScore ? 'rgba(108,71,255,0.1)' : 'var(--surface-2)',
                    color: level <= passionScore ? '#6C47FF' : 'var(--text-muted)',
                    border: level <= passionScore ? '1px solid rgba(108,71,255,0.2)' : '1px solid transparent',
                  }}
                >
                  {level}
                </motion.button>
              ))}
            </div>
            <span className="text-[10px] font-bold ml-auto" style={{ color: 'var(--text-muted)', fontFamily: SG }}>
              {passionScore <= 2 ? 'Noticed' : passionScore === 3 ? 'Cares' : passionScore === 4 ? 'Passionate' : 'Must Solve'}
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleAddProblem}
            disabled={!input.trim()}
            className="btn-secondary w-full justify-center text-[13px] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            <span>Add Problem</span>
          </motion.button>
        </div>

        {/* AI Reflection */}
        <AnimatePresence>
          {isThinking && (
            <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }}
              className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500/20 to-violet-500/5 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-violet-500" />
              </div>
              <div className="glass-frost rounded-2xl rounded-tl-md px-4 py-3 flex-1">
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-violet-400"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.12 }} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
          {reflection && !isThinking && (
            <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }}
              className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500/20 to-violet-500/5 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-violet-500" />
              </div>
              <div className="glass-frost rounded-2xl rounded-tl-md px-4 py-3 flex-1"
                style={{ borderLeft: '2px solid rgba(108,71,255,0.2)' }}>
                <p className="text-[12px] leading-relaxed font-medium" style={{ color: 'var(--text-secondary)' }}>
                  {reflection}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Follow-up prompt */}
        {domain?.followUp && domainProblems.length > 0 && (
          <div className="p-3 rounded-xl" style={{ background: 'rgba(14,165,233,0.05)', border: '1px solid rgba(14,165,233,0.1)' }}>
            <p className="text-[11px] font-medium" style={{ color: '#0EA5E9' }}>
              💬 {domain.followUp}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemDiscovery;

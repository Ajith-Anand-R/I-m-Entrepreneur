import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Brain, Users, Compass, Zap, FlaskConical } from 'lucide-react';
import { useIdentityStore } from '../../../store/useIdentityStore';
import { getPersonalityReflection } from '../../../lib/fake-identity';

const SG = "'Space Grotesk', sans-serif";
const EASE = [0.16, 1, 0.3, 1] as const;

interface Props { onComplete: () => void; }

interface QuestionOption {
  label: string;
  icon: React.ReactNode;
  score: number; // maps to the personality dimension spectrum
}

interface PersonalityQuestion {
  id: string;
  dimension: string;
  question: string;
  aiIntro: string;
  options: QuestionOption[];
}

const QUESTIONS: PersonalityQuestion[] = [
  {
    id: 'problem-solving',
    dimension: 'Problem Solving Approach',
    question: 'How do you usually approach a problem you\'ve never seen before?',
    aiIntro: 'Let\'s start with how your mind works. Everyone has a natural problem-solving style.',
    options: [
      { label: 'I research deeply before acting', icon: <FlaskConical className="w-5 h-5" />, score: 90 },
      { label: 'I start building and learn as I go', icon: <Zap className="w-5 h-5" />, score: 75 },
      { label: 'I find people who\'ve solved it before', icon: <Users className="w-5 h-5" />, score: 60 },
      { label: 'I try to reframe the problem entirely', icon: <Brain className="w-5 h-5" />, score: 85 },
    ],
  },
  {
    id: 'building-vs-leading',
    dimension: 'Builder vs Leader',
    question: 'Do you enjoy building things or leading people?',
    aiIntro: 'Startups need both builders and leaders. Which role energizes you more?',
    options: [
      { label: 'I love building things — products, code, designs', icon: <Zap className="w-5 h-5" />, score: 90 },
      { label: 'I love leading and organizing teams', icon: <Users className="w-5 h-5" />, score: 85 },
      { label: 'I enjoy both equally', icon: <Compass className="w-5 h-5" />, score: 70 },
    ],
  },
  {
    id: 'uncertainty',
    dimension: 'Risk Tolerance',
    question: 'How comfortable are you with uncertainty?',
    aiIntro: 'Entrepreneurship is full of unknowns. Your comfort with ambiguity shapes your startup journey.',
    options: [
      { label: 'I thrive in chaos — it excites me', icon: <Zap className="w-5 h-5" />, score: 95 },
      { label: 'I\'m okay with it but prefer some structure', icon: <Compass className="w-5 h-5" />, score: 65 },
      { label: 'I need clear plans and processes', icon: <FlaskConical className="w-5 h-5" />, score: 40 },
    ],
  },
  {
    id: 'research-vs-execution',
    dimension: 'Research vs Execution',
    question: 'When starting something new, do you prefer research or jumping in?',
    aiIntro: 'This tells us whether you\'re a thinker-first or a doer-first. Both have superpowers.',
    options: [
      { label: 'Research first — understand before I act', icon: <FlaskConical className="w-5 h-5" />, score: 90 },
      { label: 'Jump in — I learn fastest by doing', icon: <Zap className="w-5 h-5" />, score: 85 },
      { label: 'A mix — quick research then action', icon: <Brain className="w-5 h-5" />, score: 70 },
    ],
  },
  {
    id: 'dream-project',
    dimension: 'Creative Vision',
    question: 'If you had $10,000 and one month, what would you build?',
    aiIntro: 'This reveals where your deepest entrepreneurial instincts lie.',
    options: [
      { label: 'A tech product that solves a real problem', icon: <Zap className="w-5 h-5" />, score: 85 },
      { label: 'A social initiative that helps my community', icon: <Users className="w-5 h-5" />, score: 80 },
      { label: 'A creative project — art, content, design', icon: <Sparkles className="w-5 h-5" />, score: 75 },
      { label: 'A research experiment to test a hypothesis', icon: <FlaskConical className="w-5 h-5" />, score: 90 },
    ],
  },
  {
    id: 'work-style',
    dimension: 'Work Style',
    question: 'How do you work best?',
    aiIntro: 'Your ideal working rhythm tells us what kind of startup culture you\'ll naturally create.',
    options: [
      { label: 'Solo deep work — headphones on, world off', icon: <Brain className="w-5 h-5" />, score: 80 },
      { label: 'Collaborative sessions with a team', icon: <Users className="w-5 h-5" />, score: 75 },
      { label: 'A mix of both depending on the task', icon: <Compass className="w-5 h-5" />, score: 70 },
    ],
  },
];

export const PersonalityChapter: React.FC<Props> = ({ onComplete }) => {
  const { addPersonalityAnswer } = useIdentityStore();
  const [qIndex, setQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [reflection, setReflection] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);

  const q = QUESTIONS[qIndex]!;
  const isLast = qIndex === QUESTIONS.length - 1;

  const handleSelect = useCallback(async (optIdx: number) => {
    setSelectedOption(optIdx);
    setIsThinking(true);

    const option = q.options[optIdx]!;

    // Save to store
    addPersonalityAnswer({
      dimension: q.dimension,
      answer: option.label,
      score: option.score,
    });

    // Get AI reflection
    const text = await getPersonalityReflection(q.id, optIdx);
    setReflection(text);
    setIsThinking(false);
  }, [q, addPersonalityAnswer]);

  const handleNext = () => {
    if (isLast) {
      onComplete();
    } else {
      setSelectedOption(null);
      setReflection(null);
      setQIndex((i) => i + 1);
    }
  };

  return (
    <div className="space-y-5 pt-4">
      {/* Question counter */}
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          {QUESTIONS.map((_, i) => (
            <div key={i} className="h-1 rounded-full transition-all duration-300"
              style={{
                width: i === qIndex ? 20 : 8,
                background: i <= qIndex ? '#6C47FF' : 'var(--border-default)',
              }} />
          ))}
        </div>
        <span className="text-[10px] font-bold ml-auto" style={{ color: 'var(--text-muted)', fontFamily: SG }}>
          {qIndex + 1}/{QUESTIONS.length}
        </span>
      </div>

      {/* AI intro message */}
      <AnimatePresence mode="wait">
        <motion.div
          key={q.id + '-intro'}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.35, ease: EASE }}
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500/20 to-violet-500/5 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4 text-violet-500" />
            </div>
            <div className="glass-frost rounded-2xl rounded-tl-md px-4 py-3 flex-1">
              <p className="text-[12px] leading-relaxed font-medium" style={{ color: 'var(--text-secondary)' }}>
                {q.aiIntro}
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Question */}
      <motion.h3
        key={q.id + '-question'}
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.35, ease: EASE }}
        className="text-lg font-bold leading-snug px-1"
        style={{ fontFamily: SG, color: 'var(--text-primary)' }}
      >
        {q.question}
      </motion.h3>

      {/* Options */}
      <div className="space-y-2.5">
        {q.options.map((opt, i) => (
          <motion.button
            key={i}
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 + i * 0.06, duration: 0.35, ease: EASE }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelect(i)}
            className="w-full text-left px-4 py-3.5 rounded-2xl transition-all duration-200 flex items-center gap-3"
            style={{
              background: selectedOption === i
                ? 'linear-gradient(135deg, rgba(108,71,255,0.08), rgba(108,71,255,0.04))'
                : 'var(--surface-1)',
              border: selectedOption === i
                ? '1.5px solid rgba(108,71,255,0.25)'
                : '1px solid var(--border-default)',
              boxShadow: selectedOption === i ? '0 4px 16px rgba(108,71,255,0.08)' : 'var(--sh-xs)',
            }}
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: selectedOption === i ? 'rgba(108,71,255,0.12)' : 'var(--surface-2)',
                color: selectedOption === i ? '#6C47FF' : 'var(--text-secondary)',
              }}>
              {opt.icon}
            </div>
            <span className="text-[13px] font-semibold flex-1"
              style={{ color: selectedOption === i ? '#6C47FF' : 'var(--text-primary)' }}>
              {opt.label}
            </span>
            {selectedOption === i && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-5 h-5 rounded-full bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center"
              >
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>

      {/* AI Reflection */}
      <AnimatePresence>
        {isThinking && (
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-3"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500/20 to-violet-500/5 flex items-center justify-center shrink-0 mt-0.5">
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
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-3"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500/20 to-violet-500/5 flex items-center justify-center shrink-0 mt-0.5">
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

      {/* Continue button */}
      {reflection && !isThinking && (
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="pt-2"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleNext}
            className="btn-primary w-full justify-center text-[13px]"
          >
            <span>{isLast ? 'Continue to Values' : 'Next Question'}</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default PersonalityChapter;

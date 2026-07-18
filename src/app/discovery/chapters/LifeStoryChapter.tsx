import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, BookOpen } from 'lucide-react';
import { useIdentityStore } from '../../../store/useIdentityStore';
import { getLifeStoryReflection } from '../../../lib/fake-identity';

const SG = "'Space Grotesk', sans-serif";
const EASE = [0.16, 1, 0.3, 1] as const;

interface Props { onComplete: () => void; }

interface StoryQuestion {
  id: string;
  question: string;
  placeholder: string;
  icon: string;
}

const QUESTIONS: StoryQuestion[] = [
  {
    id: 'about-yourself',
    question: 'Tell us something about yourself that most people don\'t know.',
    placeholder: 'Share something unique about who you are — a hidden talent, a quirky interest, a defining moment...',
    icon: '🌟',
  },
  {
    id: 'proud-of',
    question: 'What achievement are you most proud of?',
    placeholder: 'It could be big or small — an award, a personal milestone, something you built, a challenge you overcame...',
    icon: '🏆',
  },
  {
    id: 'challenges',
    question: 'What challenge has shaped who you are today?',
    placeholder: 'Describe a difficult experience that taught you something important about yourself...',
    icon: '🔥',
  },
  {
    id: 'dream-future',
    question: 'What kind of future do you dream about?',
    placeholder: 'Paint a picture of your ideal life 5-10 years from now — your work, your impact, your daily life...',
    icon: '✨',
  },
  {
    id: 'inspiration',
    question: 'Who inspires you the most, and why?',
    placeholder: 'A person, a leader, an innovator — someone whose journey or philosophy moves you...',
    icon: '💡',
  },
];

export const LifeStoryChapter: React.FC<Props> = ({ onComplete }) => {
  const { addLifeStoryEntry } = useIdentityStore();
  const [qIndex, setQIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [reflection, setReflection] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);

  const q = QUESTIONS[qIndex]!;
  const isLast = qIndex === QUESTIONS.length - 1;

  const handleSubmitAnswer = useCallback(async () => {
    if (answer.trim().length < 10) return;

    // Save to store
    addLifeStoryEntry({
      questionId: q.id,
      question: q.question,
      answer: answer.trim(),
    });

    // Get AI reflection
    setIsThinking(true);
    const text = await getLifeStoryReflection(q.id);
    setReflection(text);
    setIsThinking(false);
  }, [answer, q, addLifeStoryEntry]);

  const handleNext = () => {
    if (isLast) {
      onComplete();
    } else {
      setAnswer('');
      setReflection(null);
      setQIndex((i) => i + 1);
    }
  };

  return (
    <div className="space-y-5 pt-4">
      {/* Chapter aesthetic — warm, journal-like */}
      <div className="p-4 rounded-2xl relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #FBF6EC, #F5F0E3)',
          border: '1px solid rgba(139,116,74,0.15)',
        }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(139,116,74,0.1)' }}>
            <BookOpen className="w-5 h-5" style={{ color: '#8B744A' }} />
          </div>
          <div>
            <h4 className="text-[13px] font-bold" style={{ fontFamily: "'Georgia', serif", color: '#5C4A28' }}>
              Your Story Matters
            </h4>
            <p className="text-[11px] font-medium" style={{ color: '#8B744A' }}>
              These reflections help us understand your deepest motivations
            </p>
          </div>
        </div>
      </div>

      {/* Question counter */}
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          {QUESTIONS.map((_, i) => (
            <div key={i} className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: i === qIndex ? 20 : 8,
                background: i <= qIndex ? '#0EA5E9' : 'var(--border-default)',
              }} />
          ))}
        </div>
        <span className="text-[10px] font-bold ml-auto" style={{ color: 'var(--text-muted)', fontFamily: SG }}>
          {qIndex + 1}/{QUESTIONS.length}
        </span>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">{q.icon}</span>
            <h3 className="text-[16px] font-bold leading-snug"
              style={{ fontFamily: "'Georgia', serif", color: 'var(--text-primary)' }}>
              {q.question}
            </h3>
          </div>

          {/* Text area */}
          <div className="relative">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder={q.placeholder}
              rows={5}
              disabled={!!reflection}
              className="w-full text-[13px] leading-relaxed rounded-2xl px-4 py-4 outline-none resize-none transition-all duration-200"
              style={{
                fontFamily: "'Georgia', serif",
                background: reflection ? '#FBF6EC' : 'var(--surface-1)',
                border: reflection ? '1px solid rgba(139,116,74,0.15)' : '1px solid var(--border-default)',
                color: 'var(--text-primary)',
              }}
            />
            {!reflection && (
              <div className="absolute bottom-3 right-3 text-[10px] font-semibold"
                style={{ color: answer.length >= 10 ? 'var(--accent)' : 'var(--text-muted)', fontFamily: SG }}>
                {answer.length} characters
              </div>
            )}
          </div>

          {/* Submit answer button */}
          {!reflection && !isThinking && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSubmitAnswer}
              disabled={answer.trim().length < 10}
              className="btn-secondary w-full justify-center text-[13px] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>Share</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          )}
        </motion.div>
      </AnimatePresence>

      {/* AI thinking */}
      {isThinking && (
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-start gap-3"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-500/20 to-sky-500/5 flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4 text-sky-500" />
          </div>
          <div className="glass-frost rounded-2xl rounded-tl-md px-4 py-3 flex-1">
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-sky-400"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.12 }} />
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* AI Reflection */}
      {reflection && !isThinking && (
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="space-y-4"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-500/20 to-sky-500/5 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4 text-sky-500" />
            </div>
            <div className="glass-frost rounded-2xl rounded-tl-md px-4 py-3 flex-1"
              style={{ borderLeft: '2px solid rgba(14,165,233,0.2)' }}>
              <p className="text-[12px] leading-relaxed font-medium" style={{ color: 'var(--text-secondary)', fontFamily: "'Georgia', serif" }}>
                {reflection}
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleNext}
            className="btn-primary w-full justify-center text-[13px]"
          >
            <span>{isLast ? 'Continue to Problem Discovery' : 'Next Reflection'}</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default LifeStoryChapter;

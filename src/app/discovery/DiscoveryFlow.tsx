import React, { useState, useMemo } from 'react'; // Trivial refresh comment
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Heart, Compass, Wrench, BookOpen, ArrowLeft } from 'lucide-react';
import { useIdentityStore } from '../../store/useIdentityStore';
import { PersonalityChapter } from './chapters/PersonalityChapter';
import { ValuesChapter } from './chapters/ValuesChapter';
import { PassionsChapter } from './chapters/PassionsChapter';
import { SkillsChapter } from './chapters/SkillsChapter';
import { LifeStoryChapter } from './chapters/LifeStoryChapter';

const SG = "'Space Grotesk', sans-serif";
const EASE = [0.16, 1, 0.3, 1] as const;

// ──────────────────────────────────────────────────────────
// CHAPTER DEFINITIONS
// ──────────────────────────────────────────────────────────

interface ChapterDef {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

const CHAPTERS: ChapterDef[] = [
  { id: 'personality', label: 'Personality', icon: <User className="w-4 h-4" />, color: '#6C47FF', description: 'How you think and work' },
  { id: 'values', label: 'Values', icon: <Heart className="w-4 h-4" />, color: '#F43F5E', description: 'What matters most to you' },
  { id: 'passions', label: 'Passions', icon: <Compass className="w-4 h-4" />, color: '#F59E0B', description: 'Industries that excite you' },
  { id: 'skills', label: 'Skills', icon: <Wrench className="w-4 h-4" />, color: '#34D399', description: 'Your current strengths' },
  { id: 'lifeStory', label: 'Life Story', icon: <BookOpen className="w-4 h-4" />, color: '#0EA5E9', description: 'Your journey so far' },
];

// ──────────────────────────────────────────────────────────
// COMPONENT
// ──────────────────────────────────────────────────────────

export const DiscoveryFlow: React.FC = () => {
  const navigate = useNavigate();
  const { personality, values, passions, skills, lifeStory, setDiscoveryPhase } = useIdentityStore();
  const [chapterIndex, setChapterIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const chapter = CHAPTERS[chapterIndex]!;
  const progress = ((chapterIndex + 1) / CHAPTERS.length) * 100;
  const isLastChapter = chapterIndex === CHAPTERS.length - 1;

  // Check completion per chapter
  const chapterComplete = useMemo(() => ({
    personality: personality.length >= 5,
    values: values.length >= 3,
    passions: passions.length >= 2,
    skills: skills.length >= 3,
    lifeStory: lifeStory.length >= 3,
  }), [personality, values, passions, skills, lifeStory]);

  const handleChapterDone = () => {
    if (isLastChapter) {
      setDiscoveryPhase('problems');
      navigate('/onboarding/problems');
    } else {
      setDirection(1);
      setChapterIndex((i) => i + 1);
    }
  };

  const handleBack = () => {
    if (chapterIndex > 0) {
      setDirection(-1);
      setChapterIndex((i) => i - 1);
    } else {
      navigate('/onboarding/inspiration');
    }
  };

  // Render the active chapter
  const renderChapter = () => {
    switch (chapter.id) {
      case 'personality':
        return <PersonalityChapter onComplete={handleChapterDone} />;
      case 'values':
        return <ValuesChapter onComplete={handleChapterDone} />;
      case 'passions':
        return <PassionsChapter onComplete={handleChapterDone} />;
      case 'skills':
        return <SkillsChapter onComplete={handleChapterDone} />;
      case 'lifeStory':
        return <LifeStoryChapter onComplete={handleChapterDone} />;
      default:
        return null;
    }
  };

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 200 : -200, opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { duration: 0.4, ease: EASE } },
    exit: (dir: number) => ({ x: dir > 0 ? -200 : 200, opacity: 0, transition: { duration: 0.3, ease: EASE } }),
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ background: 'var(--surface-0)' }}>

      {/* ── Ambient ── */}
      <div className="absolute inset-0 pointer-events-none gradient-mesh-hero" />

      {/* ── Header ── */}
      <div className="relative z-10 px-4 pt-5 pb-3">
        <div className="flex items-center justify-between mb-4">
          <button onClick={handleBack}
            className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-black/5 transition-colors">
            <ArrowLeft className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
          </button>
          <div className="text-center">
            <h1 className="text-sm font-bold" style={{ fontFamily: SG, color: 'var(--text-primary)' }}>
              Discover Yourself
            </h1>
            <p className="text-[10px] font-semibold mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Chapter {chapterIndex + 1} of {CHAPTERS.length}
            </p>
          </div>
          <div className="w-10" /> {/* Spacer for center alignment */}
        </div>

        {/* ── Chapter Progress ── */}
        <div className="flex gap-1.5 mb-3">
          {CHAPTERS.map((ch, i) => (
            <button
              key={ch.id}
              onClick={() => {
                if (i < chapterIndex || (chapterComplete as Record<string, boolean>)[ch.id]) {
                  setDirection(i > chapterIndex ? 1 : -1);
                  setChapterIndex(i);
                }
              }}
              className="flex-1 group"
              disabled={i > chapterIndex && !(chapterComplete as Record<string, boolean>)[ch.id]}
            >
              <div className="h-1.5 rounded-full transition-all duration-500"
                style={{
                  background: i <= chapterIndex
                    ? `linear-gradient(90deg, ${ch.color}, ${ch.color}99)`
                    : 'var(--border-default)',
                  boxShadow: i === chapterIndex ? `0 0 12px ${ch.color}30` : 'none',
                }} />
              <div className="flex items-center gap-1 mt-1.5 justify-center">
                <span style={{ color: i <= chapterIndex ? ch.color : 'var(--text-muted)' }}>
                  {ch.icon}
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider hidden md:block"
                  style={{ color: i <= chapterIndex ? ch.color : 'var(--text-muted)', fontFamily: SG }}>
                  {ch.label}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* ── Chapter title card ── */}
        <motion.div
          key={chapter.id + '-header'}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="px-4 py-3 rounded-2xl"
          style={{
            background: `${chapter.color}08`,
            border: `1px solid ${chapter.color}15`,
          }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: `linear-gradient(135deg, ${chapter.color}20, ${chapter.color}10)`,
                color: chapter.color,
              }}>
              {chapter.icon}
            </div>
            <div>
              <h2 className="text-sm font-bold" style={{ fontFamily: SG, color: 'var(--text-primary)' }}>
                {chapter.label}
              </h2>
              <p className="text-[11px] font-medium" style={{ color: 'var(--text-secondary)' }}>
                {chapter.description}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Chapter Content ── */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 pb-6">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={chapter.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="h-full"
          >
            {renderChapter()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DiscoveryFlow;

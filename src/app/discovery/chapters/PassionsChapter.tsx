import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import { useIdentityStore, type PassionItem } from '../../../store/useIdentityStore';

const SG = "'Space Grotesk', sans-serif";
const EASE = [0.16, 1, 0.3, 1] as const;

interface Props { onComplete: () => void; }

interface IndustryDef {
  id: string;
  label: string;
  icon: string;
  color: string;
  image: string; // gradient fallback
}

const INDUSTRIES: IndustryDef[] = [
  { id: 'AI', label: 'AI & Machine Learning', icon: '🤖', color: '#6C47FF', image: 'from-violet-600/20 to-violet-800/30' },
  { id: 'Healthcare', label: 'Healthcare', icon: '🏥', color: '#F43F5E', image: 'from-rose-600/20 to-rose-800/30' },
  { id: 'Agriculture', label: 'Agriculture', icon: '🌾', color: '#34D399', image: 'from-emerald-600/20 to-emerald-800/30' },
  { id: 'Education', label: 'Education', icon: '📚', color: '#F59E0B', image: 'from-amber-600/20 to-amber-800/30' },
  { id: 'Robotics', label: 'Robotics', icon: '🦾', color: '#0EA5E9', image: 'from-sky-600/20 to-sky-800/30' },
  { id: 'Finance', label: 'Finance & FinTech', icon: '💳', color: '#2DD4BF', image: 'from-teal-600/20 to-teal-800/30' },
  { id: 'Sustainability', label: 'Sustainability', icon: '🌍', color: '#22C55E', image: 'from-green-600/20 to-green-800/30' },
  { id: 'Gaming', label: 'Gaming', icon: '🎮', color: '#8B5CF6', image: 'from-purple-600/20 to-purple-800/30' },
  { id: 'Manufacturing', label: 'Manufacturing', icon: '🏭', color: '#64748B', image: 'from-slate-600/20 to-slate-800/30' },
  { id: 'Space', label: 'Space & Aerospace', icon: '🚀', color: '#3B82F6', image: 'from-blue-600/20 to-blue-800/30' },
  { id: 'Climate', label: 'Climate Tech', icon: '🌱', color: '#10B981', image: 'from-emerald-500/20 to-teal-800/30' },
  { id: 'Social Media', label: 'Social Media', icon: '📱', color: '#EC4899', image: 'from-pink-600/20 to-pink-800/30' },
  { id: 'Retail', label: 'Retail & E-Commerce', icon: '🛍️', color: '#F97316', image: 'from-orange-600/20 to-orange-800/30' },
  { id: 'Logistics', label: 'Logistics & Supply Chain', icon: '📦', color: '#78716C', image: 'from-stone-600/20 to-stone-800/30' },
  { id: 'Entertainment', label: 'Entertainment', icon: '🎬', color: '#E879F9', image: 'from-fuchsia-600/20 to-fuchsia-800/30' },
];

export const PassionsChapter: React.FC<Props> = ({ onComplete }) => {
  const { setPassions } = useIdentityStore();
  const [selected, setSelected] = useState<Record<string, number>>({}); // id -> excitement
  const [phase, setPhase] = useState<'select' | 'rate'>('select');

  const selectedIds = Object.keys(selected);

  const toggleIndustry = useCallback((id: string) => {
    setSelected((prev) => {
      const copy = { ...prev };
      if (copy[id] !== undefined) {
        delete copy[id];
      } else if (Object.keys(copy).length < 5) {
        copy[id] = 3; // default excitement
      }
      return copy;
    });
  }, []);

  const setExcitement = (id: string, level: number) => {
    setSelected((prev) => ({ ...prev, [id]: level }));
  };

  const handleConfirmSelection = () => {
    if (selectedIds.length >= 2) setPhase('rate');
  };

  const handleConfirmRating = () => {
    const passions: PassionItem[] = selectedIds.map((id) => {
      const def = INDUSTRIES.find((i) => i.id === id)!;
      return {
        id: def.id,
        industry: def.label,
        icon: def.icon,
        excitementLevel: selected[id]!,
      };
    });
    setPassions(passions);
    onComplete();
  };

  // Rating phase
  if (phase === 'rate') {
    return (
      <div className="space-y-5 pt-4">
        <div className="text-center space-y-2">
          <h3 className="text-lg font-bold" style={{ fontFamily: SG, color: 'var(--text-primary)' }}>
            How excited are you about each?
          </h3>
          <p className="text-[12px] font-medium" style={{ color: 'var(--text-secondary)' }}>
            Rate your excitement level from 1 to 5 stars
          </p>
        </div>

        <div className="space-y-3">
          {selectedIds.map((id, i) => {
            const def = INDUSTRIES.find((ind) => ind.id === id)!;
            const excitement = selected[id]!;
            return (
              <motion.div
                key={id}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.06, duration: 0.3, ease: EASE }}
                className="p-4 rounded-2xl"
                style={{
                  background: 'var(--surface-1)',
                  border: '1px solid var(--border-default)',
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{def.icon}</span>
                  <span className="text-[14px] font-bold flex-1" style={{ color: 'var(--text-primary)' }}>
                    {def.label}
                  </span>
                </div>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <motion.button
                      key={level}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setExcitement(id, level)}
                      className="p-1.5 rounded-lg transition-colors"
                    >
                      <Star
                        className="w-6 h-6 transition-all"
                        style={{
                          color: level <= excitement ? def.color : 'var(--text-muted)',
                          fill: level <= excitement ? def.color : 'none',
                          filter: level <= excitement ? `drop-shadow(0 0 6px ${def.color}40)` : 'none',
                        }}
                      />
                    </motion.button>
                  ))}
                  <span className="text-[11px] font-bold ml-auto self-center"
                    style={{ color: 'var(--text-muted)', fontFamily: SG }}>
                    {excitement === 1 ? 'Curious' : excitement === 2 ? 'Interested' : excitement === 3 ? 'Excited' : excitement === 4 ? 'Passionate' : 'Obsessed'}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleConfirmRating}
          className="btn-primary w-full justify-center text-[13px]"
        >
          <span>Continue to Skills</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    );
  }

  // Selection phase
  return (
    <div className="space-y-5 pt-4">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-bold" style={{ fontFamily: SG, color: 'var(--text-primary)' }}>
          What industries excite you?
        </h3>
        <p className="text-[12px] font-medium" style={{ color: 'var(--text-secondary)' }}>
          Select 2 to 5 industries you're passionate about
        </p>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
          style={{ background: 'rgba(245,158,11,0.06)' }}>
          <span className="text-[11px] font-bold" style={{ fontFamily: SG, color: '#F59E0B' }}>
            {selectedIds.length}/5 selected
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {INDUSTRIES.map((ind, i) => {
          const isSelected = selected[ind.id] !== undefined;
          const isDisabled = !isSelected && selectedIds.length >= 5;
          return (
            <motion.button
              key={ind.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.025, duration: 0.3, ease: EASE }}
              whileHover={{ scale: isDisabled ? 1 : 1.04 }}
              whileTap={{ scale: isDisabled ? 1 : 0.96 }}
              onClick={() => !isDisabled && toggleIndustry(ind.id)}
              disabled={isDisabled}
              className="relative p-3 rounded-2xl text-center transition-all duration-200"
              style={{
                background: isSelected
                  ? `linear-gradient(135deg, ${ind.color}12, ${ind.color}06)`
                  : 'var(--surface-1)',
                border: isSelected
                  ? `1.5px solid ${ind.color}30`
                  : '1px solid var(--border-default)',
                opacity: isDisabled ? 0.35 : 1,
              }}
            >
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ background: ind.color }}
                >
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              )}
              <span className="text-2xl block">{ind.icon}</span>
              <p className="text-[10px] font-bold mt-1.5 leading-tight"
                style={{ color: isSelected ? ind.color : 'var(--text-primary)' }}>
                {ind.label}
              </p>
            </motion.button>
          );
        })}
      </div>

      {selectedIds.length >= 2 && (
        <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleConfirmSelection}
            className="btn-primary w-full justify-center text-[13px]"
          >
            <span>Rate My Excitement</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default PassionsChapter;

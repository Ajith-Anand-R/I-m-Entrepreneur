import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, GripVertical } from 'lucide-react';
import { useIdentityStore, type ValueItem } from '../../../store/useIdentityStore';

const SG = "'Space Grotesk', sans-serif";
const EASE = [0.16, 1, 0.3, 1] as const;

interface Props { onComplete: () => void; }

// ──────────────────────────────────────────────────────────
// VALUES DATA
// ──────────────────────────────────────────────────────────

interface ValueDef {
  id: string;
  label: string;
  icon: string;
  description: string;
  gradient: string;
}

const ALL_VALUES: ValueDef[] = [
  { id: 'innovation', label: 'Innovation', icon: '💡', description: 'Creating something new that never existed', gradient: 'from-violet-500/15 to-violet-400/5' },
  { id: 'money', label: 'Wealth', icon: '💰', description: 'Building financial abundance and security', gradient: 'from-amber-500/15 to-amber-400/5' },
  { id: 'impact', label: 'Social Impact', icon: '🌍', description: 'Making the world a better place', gradient: 'from-emerald-500/15 to-emerald-400/5' },
  { id: 'freedom', label: 'Freedom', icon: '🕊️', description: 'Independence to work on your terms', gradient: 'from-sky-500/15 to-sky-400/5' },
  { id: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦', description: 'Supporting and being present for loved ones', gradient: 'from-pink-500/15 to-pink-400/5' },
  { id: 'recognition', label: 'Recognition', icon: '🏆', description: 'Being known for excellence and achievement', gradient: 'from-yellow-500/15 to-yellow-400/5' },
  { id: 'research', label: 'Knowledge', icon: '🔬', description: 'Deep understanding and intellectual pursuit', gradient: 'from-indigo-500/15 to-indigo-400/5' },
  { id: 'creativity', label: 'Creativity', icon: '🎨', description: 'Expressing yourself through original work', gradient: 'from-fuchsia-500/15 to-fuchsia-400/5' },
  { id: 'leadership', label: 'Leadership', icon: '🚀', description: 'Inspiring and guiding others to achieve', gradient: 'from-orange-500/15 to-orange-400/5' },
  { id: 'security', label: 'Security', icon: '🛡️', description: 'Stability and predictable outcomes', gradient: 'from-slate-500/15 to-slate-400/5' },
  { id: 'adventure', label: 'Adventure', icon: '⛰️', description: 'Risk-taking and exploring the unknown', gradient: 'from-teal-500/15 to-teal-400/5' },
  { id: 'legacy', label: 'Legacy', icon: '🌟', description: 'Leaving a lasting mark on the world', gradient: 'from-rose-500/15 to-rose-400/5' },
];

export const ValuesChapter: React.FC<Props> = ({ onComplete }) => {
  const { setValues } = useIdentityStore();
  const [selected, setSelected] = useState<string[]>([]);
  const [phase, setPhase] = useState<'select' | 'rank'>('select');

  const toggleValue = useCallback((id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((v) => v !== id);
      if (prev.length >= 5) return prev; // max 5
      return [...prev, id];
    });
  }, []);

  const moveUp = (index: number) => {
    if (index === 0) return;
    setSelected((prev) => {
      const arr = [...prev];
      [arr[index - 1], arr[index]] = [arr[index]!, arr[index - 1]!];
      return arr;
    });
  };

  const moveDown = (index: number) => {
    if (index === selected.length - 1) return;
    setSelected((prev) => {
      const arr = [...prev];
      [arr[index], arr[index + 1]] = [arr[index + 1]!, arr[index]!];
      return arr;
    });
  };

  const handleConfirmSelection = () => {
    if (selected.length >= 3) setPhase('rank');
  };

  const handleConfirmRanking = () => {
    const values: ValueItem[] = selected.map((id, i) => {
      const def = ALL_VALUES.find((v) => v.id === id)!;
      return {
        id: def.id,
        label: def.label,
        icon: def.icon,
        description: def.description,
        rank: i + 1,
      };
    });
    setValues(values);
    onComplete();
  };

  if (phase === 'rank') {
    return (
      <div className="space-y-5 pt-4">
        {/* Rank header */}
        <div className="text-center space-y-2">
          <h3 className="text-lg font-bold" style={{ fontFamily: SG, color: 'var(--text-primary)' }}>
            Rank your values
          </h3>
          <p className="text-[12px] font-medium" style={{ color: 'var(--text-secondary)' }}>
            Drag to reorder. Your #1 value will guide your personalized roadmap.
          </p>
        </div>

        {/* Ranking list */}
        <div className="space-y-2">
          {selected.map((id, i) => {
            const def = ALL_VALUES.find((v) => v.id === id)!;
            return (
              <motion.div
                key={id}
                layout
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.05, duration: 0.3, ease: EASE }}
                className="flex items-center gap-3 p-3.5 rounded-2xl"
                style={{
                  background: 'var(--surface-1)',
                  border: i === 0 ? '1.5px solid rgba(108,71,255,0.2)' : '1px solid var(--border-default)',
                  boxShadow: i === 0 ? '0 4px 16px rgba(108,71,255,0.08)' : 'var(--sh-xs)',
                }}
              >
                <span className="text-[11px] font-black w-6 text-center"
                  style={{
                    fontFamily: SG,
                    color: i === 0 ? '#6C47FF' : 'var(--text-muted)',
                  }}>
                  #{i + 1}
                </span>
                <span className="text-xl">{def.icon}</span>
                <div className="flex-1">
                  <span className="text-[13px] font-bold" style={{ color: 'var(--text-primary)' }}>
                    {def.label}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <button onClick={() => moveUp(i)} disabled={i === 0}
                    className="p-1 rounded hover:bg-black/5 disabled:opacity-20 transition-colors">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                      <path d="M18 15l-6-6-6 6" />
                    </svg>
                  </button>
                  <button onClick={() => moveDown(i)} disabled={i === selected.length - 1}
                    className="p-1 rounded hover:bg-black/5 disabled:opacity-20 transition-colors">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleConfirmRanking}
          className="btn-primary w-full justify-center text-[13px]"
        >
          <span>Continue to Passions</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    );
  }

  return (
    <div className="space-y-5 pt-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <h3 className="text-lg font-bold" style={{ fontFamily: SG, color: 'var(--text-primary)' }}>
          What matters most to you?
        </h3>
        <p className="text-[12px] font-medium" style={{ color: 'var(--text-secondary)' }}>
          Select 3 to 5 values that define who you are. These will shape your entrepreneurial path.
        </p>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
          style={{ background: 'rgba(108,71,255,0.06)' }}>
          <span className="text-[11px] font-bold" style={{ fontFamily: SG, color: '#6C47FF' }}>
            {selected.length}/5 selected
          </span>
        </div>
      </div>

      {/* Values grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {ALL_VALUES.map((val, i) => {
          const isSelected = selected.includes(val.id);
          const isDisabled = !isSelected && selected.length >= 5;
          return (
            <motion.button
              key={val.id}
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.03, duration: 0.3, ease: EASE }}
              whileHover={{ scale: isDisabled ? 1 : 1.02 }}
              whileTap={{ scale: isDisabled ? 1 : 0.97 }}
              onClick={() => !isDisabled && toggleValue(val.id)}
              disabled={isDisabled}
              className="text-left p-3.5 rounded-2xl transition-all duration-200 relative overflow-hidden"
              style={{
                background: isSelected
                  ? 'linear-gradient(135deg, rgba(108,71,255,0.08), rgba(108,71,255,0.03))'
                  : 'var(--surface-1)',
                border: isSelected
                  ? '1.5px solid rgba(108,71,255,0.2)'
                  : '1px solid var(--border-default)',
                opacity: isDisabled ? 0.4 : 1,
                boxShadow: isSelected ? '0 4px 12px rgba(108,71,255,0.06)' : 'none',
              }}
            >
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-5 h-5 rounded-full bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center"
                >
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              )}
              <span className="text-2xl">{val.icon}</span>
              <p className="text-[13px] font-bold mt-2" style={{ color: 'var(--text-primary)' }}>{val.label}</p>
              <p className="text-[10px] font-medium mt-0.5 leading-snug" style={{ color: 'var(--text-muted)' }}>
                {val.description}
              </p>
            </motion.button>
          );
        })}
      </div>

      {/* Continue */}
      {selected.length >= 3 && (
        <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleConfirmSelection}
            className="btn-primary w-full justify-center text-[13px]"
          >
            <span>Rank My Values</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default ValuesChapter;

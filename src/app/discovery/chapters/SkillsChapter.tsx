import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useIdentityStore, type SkillItem, type SkillLevel } from '../../../store/useIdentityStore';

const SG = "'Space Grotesk', sans-serif";
const EASE = [0.16, 1, 0.3, 1] as const;

interface Props { onComplete: () => void; }

interface SkillDef {
  id: string;
  name: string;
  icon: string;
  category: 'technical' | 'business' | 'creative' | 'interpersonal';
}

const ALL_SKILLS: SkillDef[] = [
  { id: 'programming', name: 'Programming', icon: '💻', category: 'technical' },
  { id: 'electronics', name: 'Electronics & Hardware', icon: '🔌', category: 'technical' },
  { id: 'data-analysis', name: 'Data Analysis', icon: '📊', category: 'technical' },
  { id: 'product-thinking', name: 'Product Thinking', icon: '🧩', category: 'technical' },
  { id: 'design', name: 'Design & UI/UX', icon: '🎨', category: 'creative' },
  { id: 'writing', name: 'Writing & Content', icon: '✍️', category: 'creative' },
  { id: 'video', name: 'Video & Media', icon: '🎬', category: 'creative' },
  { id: 'communication', name: 'Communication', icon: '🗣️', category: 'interpersonal' },
  { id: 'leadership', name: 'Leadership', icon: '👑', category: 'interpersonal' },
  { id: 'networking', name: 'Networking', icon: '🤝', category: 'interpersonal' },
  { id: 'sales', name: 'Sales', icon: '💼', category: 'business' },
  { id: 'marketing', name: 'Marketing', icon: '📢', category: 'business' },
  { id: 'finance', name: 'Finance & Accounting', icon: '💰', category: 'business' },
  { id: 'research', name: 'Research', icon: '🔬', category: 'technical' },
];

const LEVELS: { level: SkillLevel; label: string; color: string; width: string }[] = [
  { level: 'beginner', label: 'Beginner', color: '#94A3B8', width: '25%' },
  { level: 'intermediate', label: 'Intermediate', color: '#F59E0B', width: '50%' },
  { level: 'advanced', label: 'Advanced', color: '#34D399', width: '75%' },
  { level: 'expert', label: 'Expert', color: '#6C47FF', width: '100%' },
];

const CATEGORIES = [
  { key: 'technical', label: 'Technical', color: '#6C47FF' },
  { key: 'creative', label: 'Creative', color: '#EC4899' },
  { key: 'interpersonal', label: 'People', color: '#F59E0B' },
  { key: 'business', label: 'Business', color: '#34D399' },
];

export const SkillsChapter: React.FC<Props> = ({ onComplete }) => {
  const { setSkills } = useIdentityStore();
  const [ratings, setRatings] = useState<Record<string, SkillLevel>>({});

  const ratedCount = Object.keys(ratings).length;

  const setLevel = (skillId: string, level: SkillLevel) => {
    setRatings((prev) => ({ ...prev, [skillId]: level }));
  };

  // Radar chart data
  const radarData = useMemo(() => {
    const scores: Record<string, number[]> = { technical: [], creative: [], interpersonal: [], business: [] };
    for (const [id, level] of Object.entries(ratings)) {
      const skill = ALL_SKILLS.find((s) => s.id === id);
      if (skill) {
        const numScore = level === 'beginner' ? 25 : level === 'intermediate' ? 50 : level === 'advanced' ? 75 : 100;
        scores[skill.category]?.push(numScore);
      }
    }
    return CATEGORIES.map((cat) => {
      const arr = scores[cat.key] ?? [];
      const avg = arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
      return { ...cat, score: avg };
    });
  }, [ratings]);

  const handleSubmit = () => {
    const skills: SkillItem[] = Object.entries(ratings).map(([id, level]) => {
      const def = ALL_SKILLS.find((s) => s.id === id)!;
      return { id: def.id, name: def.name, icon: def.icon, level };
    });
    setSkills(skills);
    onComplete();
  };

  return (
    <div className="space-y-5 pt-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <h3 className="text-lg font-bold" style={{ fontFamily: SG, color: 'var(--text-primary)' }}>
          What are your strengths?
        </h3>
        <p className="text-[12px] font-medium" style={{ color: 'var(--text-secondary)' }}>
          Rate your current level in each skill. Be honest — this helps us find your growth areas.
        </p>
      </div>

      {/* Mini radar summary */}
      {ratedCount >= 3 && (
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="card-pro p-4"
        >
          <p className="text-[10px] font-bold uppercase tracking-wider mb-3"
            style={{ color: 'var(--text-muted)', fontFamily: SG }}>
            Skill Distribution
          </p>
          <div className="space-y-2">
            {radarData.map((cat) => (
              <div key={cat.key} className="flex items-center gap-3">
                <span className="text-[11px] font-bold w-20 text-right" style={{ color: cat.color, fontFamily: SG }}>
                  {cat.label}
                </span>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--border-default)' }}>
                  <motion.div
                    className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.score}%` }}
                    transition={{ duration: 0.5, ease: EASE }}
                    style={{ background: cat.color }}
                  />
                </div>
                <span className="text-[10px] font-bold w-8" style={{ color: 'var(--text-muted)', fontFamily: SG }}>
                  {Math.round(cat.score)}%
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Skills list by category */}
      {CATEGORIES.map((cat) => {
        const catSkills = ALL_SKILLS.filter((s) => s.category === cat.key);
        return (
          <div key={cat.key}>
            <h4 className="text-[11px] font-bold uppercase tracking-wider mb-2 px-1"
              style={{ color: cat.color, fontFamily: SG }}>
              {cat.label} Skills
            </h4>
            <div className="space-y-2">
              {catSkills.map((skill, i) => {
                const currentLevel = ratings[skill.id];
                const levelDef = LEVELS.find((l) => l.level === currentLevel);
                return (
                  <motion.div
                    key={skill.id}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: i * 0.03, duration: 0.25, ease: EASE }}
                    className="p-3 rounded-xl"
                    style={{
                      background: currentLevel ? 'var(--surface-1)' : 'var(--surface-1)',
                      border: currentLevel ? `1px solid ${levelDef?.color}25` : '1px solid var(--border-default)',
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{skill.icon}</span>
                      <span className="text-[12px] font-bold flex-1" style={{ color: 'var(--text-primary)' }}>
                        {skill.name}
                      </span>
                      {currentLevel && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg"
                          style={{ background: `${levelDef?.color}15`, color: levelDef?.color, fontFamily: SG }}>
                          {levelDef?.label}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-1.5">
                      {LEVELS.map((lvl) => (
                        <motion.button
                          key={lvl.level}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setLevel(skill.id, lvl.level)}
                          className="flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all"
                          style={{
                            fontFamily: SG,
                            background: currentLevel === lvl.level ? `${lvl.color}15` : 'var(--surface-2)',
                            color: currentLevel === lvl.level ? lvl.color : 'var(--text-muted)',
                            border: currentLevel === lvl.level ? `1px solid ${lvl.color}30` : '1px solid transparent',
                          }}
                        >
                          {lvl.label}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Continue */}
      {ratedCount >= 3 && (
        <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="pb-4">
          <p className="text-center text-[11px] font-medium mb-3" style={{ color: 'var(--text-muted)' }}>
            {ratedCount} of {ALL_SKILLS.length} skills rated
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSubmit}
            className="btn-primary w-full justify-center text-[13px]"
          >
            <span>Continue to Life Story</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default SkillsChapter;

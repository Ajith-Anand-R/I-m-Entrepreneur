import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Plus, Sparkles, Lightbulb, Tag, Search,
  Trash2, BookOpen, TrendingUp, X,
} from 'lucide-react';
import { useIdentityStore, type HunchBookEntry } from '../../store/useIdentityStore';
import { detectIdeaTheme, detectHunchPatterns, type PatternInsight } from '../../lib/fake-identity';

const SG = "'Space Grotesk', sans-serif";
const EASE = [0.16, 1, 0.3, 1] as const;

export const HunchBook: React.FC = () => {
  const navigate = useNavigate();
  const { hunchBook, addHunchEntry, removeHunchEntry } = useIdentityStore();
  const [showComposer, setShowComposer] = useState(false);
  const [content, setContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Pattern detection
  const patterns = useMemo(() => detectHunchPatterns(hunchBook), [hunchBook]);

  // Filtered entries
  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) return hunchBook;
    const q = searchQuery.toLowerCase();
    return hunchBook.filter(
      (e) =>
        e.content.toLowerCase().includes(q) ||
        e.tags.some((t: string) => t.toLowerCase().includes(q)) ||
        e.aiTheme?.toLowerCase().includes(q),
    );
  }, [hunchBook, searchQuery]);

  const handleSubmit = () => {
    if (!content.trim()) return;
    const { tags, theme } = detectIdeaTheme(content);
    const entry: HunchBookEntry = {
      id: `hunch-${Date.now()}`,
      type: 'text',
      content: content.trim(),
      tags,
      aiTheme: theme,
      createdAt: Date.now(),
    };
    addHunchEntry(entry);
    setContent('');
    setShowComposer(false);
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ background: 'var(--surface-0)' }}>
      <div className="absolute inset-0 pointer-events-none gradient-mesh-hero" />

      {/* Header */}
      <div className="relative z-10 px-4 pt-5 pb-3">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-black/5 transition-colors">
            <ArrowLeft className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
          </button>
          <div className="text-center">
            <div className="flex items-center gap-2 justify-center">
              <BookOpen className="w-4 h-4" style={{ color: 'var(--accent)' }} />
              <h1 className="text-sm font-bold" style={{ fontFamily: SG, color: 'var(--text-primary)' }}>
                Hunch Book
              </h1>
            </div>
            <p className="text-[10px] font-semibold mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {hunchBook.length} {hunchBook.length === 1 ? 'idea' : 'ideas'} captured
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowComposer(!showComposer)}
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: showComposer ? 'var(--surface-2)' : 'linear-gradient(135deg, #6C47FF, #8B7AFF)',
              color: showComposer ? 'var(--text-secondary)' : 'white',
            }}
          >
            {showComposer ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          </motion.button>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ideas, themes, tags..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-[12px] font-medium outline-none"
            style={{
              background: 'var(--surface-1)',
              border: '1px solid var(--border-default)',
              color: 'var(--text-primary)',
            }}
          />
        </div>
      </div>

      <div className="relative z-10 flex-1 overflow-y-auto px-4 pb-6 space-y-4">
        {/* Composer */}
        <AnimatePresence>
          {showComposer && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="overflow-hidden"
            >
              <div className="p-4 rounded-2xl space-y-3"
                style={{
                  background: 'var(--surface-1)',
                  border: '1px solid var(--border-default)',
                }}>
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" style={{ color: '#F59E0B' }} />
                  <span className="text-[11px] font-bold uppercase tracking-wider"
                    style={{ color: '#F59E0B', fontFamily: SG }}>
                    New Hunch
                  </span>
                </div>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What if we could... I noticed that... A problem I keep seeing is..."
                  rows={4}
                  autoFocus
                  className="w-full text-[13px] leading-relaxed rounded-xl px-4 py-3 outline-none resize-none"
                  style={{
                    background: 'var(--surface-2)',
                    border: '1px solid var(--border-default)',
                    color: 'var(--text-primary)',
                  }}
                />

                {/* Auto-detected tags preview */}
                {content.length > 10 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Tag className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                    {detectIdeaTheme(content).tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded-lg text-[9px] font-bold"
                        style={{ background: 'rgba(108,71,255,0.08)', color: '#6C47FF' }}>
                        {tag}
                      </span>
                    ))}
                    {detectIdeaTheme(content).theme && (
                      <span className="px-2 py-0.5 rounded-lg text-[9px] font-bold"
                        style={{ background: 'rgba(52,211,153,0.08)', color: '#34D399' }}>
                        {detectIdeaTheme(content).theme}
                      </span>
                    )}
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSubmit}
                  disabled={!content.trim()}
                  className="btn-primary w-full justify-center text-[13px] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Save Idea</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pattern insights */}
        {patterns.length > 0 && (
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="p-4 rounded-2xl space-y-2"
            style={{
              background: 'linear-gradient(135deg, rgba(108,71,255,0.06), rgba(52,211,153,0.04))',
              border: '1px solid rgba(108,71,255,0.1)',
            }}>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-violet-500" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-violet-500" style={{ fontFamily: SG }}>
                AI Pattern Detection
              </span>
            </div>
            {patterns.map((p, i) => (
              <p key={i} className="text-[11px] font-medium leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                💡 {p.message}
              </p>
            ))}
          </motion.div>
        )}

        {/* Empty state */}
        {hunchBook.length === 0 && !showComposer && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center py-16 space-y-4"
          >
            <div className="w-20 h-20 rounded-3xl mx-auto flex items-center justify-center"
              style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.1)' }}>
              <Lightbulb className="w-10 h-10 text-amber-400" />
            </div>
            <h3 className="text-lg font-bold" style={{ fontFamily: SG, color: 'var(--text-primary)' }}>
              Your Idea Vault is Empty
            </h3>
            <p className="text-[12px] font-medium max-w-xs mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Every great startup began as a random thought. Tap + to capture your first hunch — the AI will help you spot patterns.
            </p>
          </motion.div>
        )}

        {/* Entries list */}
        {filteredEntries.map((entry: HunchBookEntry, i: number) => (
          <motion.div
            key={entry.id}
            layout
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.04, duration: 0.3, ease: EASE }}
            className="p-4 rounded-2xl group relative"
            style={{
              background: 'var(--surface-1)',
              border: '1px solid var(--border-default)',
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                  {entry.content}
                </p>

                {/* Tags */}
                <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                  {entry.aiTheme && (
                    <span className="px-2 py-0.5 rounded-lg text-[9px] font-bold"
                      style={{ background: 'rgba(52,211,153,0.08)', color: '#34D399' }}>
                      {entry.aiTheme}
                    </span>
                  )}
                  {entry.tags.map((tag: string) => (
                    <span key={tag} className="px-2 py-0.5 rounded-lg text-[9px] font-bold"
                      style={{ background: 'rgba(108,71,255,0.06)', color: 'var(--text-muted)' }}>
                      #{tag}
                    </span>
                  ))}
                  <span className="text-[9px] font-medium ml-auto" style={{ color: 'var(--text-muted)' }}>
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Delete */}
              <button
                onClick={() => removeHunchEntry(entry.id)}
                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 transition-all shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-400" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HunchBook;

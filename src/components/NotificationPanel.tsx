import React from 'react';
import { motion } from 'framer-motion';
import { X, Bell, Sparkles, FileText, BookOpen, Users } from 'lucide-react';

interface NotificationPanelProps {
  onClose: () => void;
}

const NOTIFICATIONS = [
  { id: 1, icon: Sparkles, color: '#6C47FF', bg: 'rgba(108,71,255,0.08)', title: 'AI Mentor check-in', desc: 'Your mentor reviewed your pitch deck changes.', time: '2m ago' },
  { id: 2, icon: FileText, color: '#38BDF8', bg: 'rgba(56,189,248,0.08)', title: 'Document analysed', desc: 'SWOT Analysis has been processed.', time: '15m ago' },
  { id: 3, icon: BookOpen, color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', title: 'Journey milestone', desc: 'You unlocked Level 4: Market validation.', time: '1h ago' },
  { id: 4, icon: Users, color: '#34D399', bg: 'rgba(52,211,153,0.08)', title: 'Community update', desc: 'Rohan Sharma commented on your post.', time: '3h ago' },
];

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ onClose }) => (
  <>
    {/* Backdrop */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 bg-black/10"
      onClick={onClose}
    />

    {/* Panel */}
    <motion.div
      initial={{ opacity: 0, x: 20, scale: 0.97 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
      className="fixed top-[60px] right-4 z-50 w-80 max-h-[70vh] overflow-y-auto rounded-2xl glass-frost-strong"
      style={{ boxShadow: '0 20px 60px rgba(108,71,255,0.08), 0 8px 20px rgba(0,0,0,0.06)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-accent/[0.06]">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-accent" />
          <h3 className="text-sm font-bold text-ink-900 font-heading">Notifications</h3>
        </div>
        <button onClick={onClose}
          className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-accent-ghost transition-colors text-ink-300">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Items */}
      <div className="px-3 py-2 space-y-1">
        {NOTIFICATIONS.map((n, i) => {
          const Icon = n.icon;
          return (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-start gap-3 p-3 rounded-xl hover:bg-accent-ghost/50 transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: n.bg }}>
                <Icon className="w-4 h-4" style={{ color: n.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold text-ink-900 leading-snug">{n.title}</p>
                <p className="text-[11px] text-ink-300 mt-0.5 leading-relaxed">{n.desc}</p>
              </div>
              <span className="text-[10px] text-ink-300 font-medium shrink-0 mt-0.5">{n.time}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-accent/[0.06]">
        <button className="text-[11px] font-bold text-accent hover:text-accent-deep transition-colors">
          Mark all as read
        </button>
      </div>
    </motion.div>
  </>
);

export default NotificationPanel;

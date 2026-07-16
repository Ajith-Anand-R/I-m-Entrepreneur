import React from 'react';
import { X, Sparkles, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

interface NotificationPanelProps {
  onClose: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ onClose }) => {
  const notifications = [
    {
      id: 'n-1',
      type: 'review',
      title: 'Level 2 Review Passed!',
      message: 'Sunita Sharma validated your Mission statement. Level 3 is now unlocked.',
      time: '2 hours ago',
      isNew: true,
      icon: CheckCircle2,
      color: 'text-emerald-500 bg-emerald-50'
    },
    {
      id: 'n-2',
      type: 'ai',
      title: 'DPR Ingestion Complete',
      message: 'AI analyzed your uploaded DPR and added 4 new keys to your Knowledge Base.',
      time: '5 hours ago',
      isNew: true,
      icon: Sparkles,
      color: 'text-purple-500 bg-purple-50'
    },
    {
      id: 'n-3',
      type: 'warning',
      title: 'Runway Warning',
      message: 'Clara Dupont flagged that your high kiosk unit cost shrinks operating runway.',
      time: '1 day ago',
      isNew: false,
      icon: AlertCircle,
      color: 'text-rose-500 bg-rose-50'
    },
    {
      id: 'n-4',
      type: 'meeting',
      title: 'Upcoming Pitch Session',
      message: 'Angel pitch mock with Vikram Mehta scheduled for Friday, July 17 at 11:00 AM.',
      time: '2 days ago',
      isNew: false,
      icon: Calendar,
      color: 'text-amber-500 bg-amber-50'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/10 backdrop-blur-sm"
      ></motion.div>

      {/* Drawer */}
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 26, stiffness: 220 }}
        className="relative w-full max-w-sm bg-white/95 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.05)] flex flex-col h-full z-10 border-l border-zinc-100"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-100 bg-[#F9F9FB]">
          <div>
            <h2 className="text-sm font-bold text-slate-800 tracking-tight">Notifications</h2>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">Updates & Recommendations</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 tracking-wider">LATEST</span>
            <button className="text-[10px] text-indigo-600 hover:underline font-semibold">Mark all read</button>
          </div>

          <div className="space-y-3">
            {notifications.map((n) => {
              const Icon = n.icon;
              return (
                <div 
                  key={n.id}
                  className={`p-4 rounded-2xl border transition-all duration-300 hover:shadow-[0_4px_20px_rgba(0,0,0,0.02)] relative flex space-x-3.5
                    ${n.isNew ? 'bg-white border-zinc-200/60 shadow-[0_2px_12px_rgba(0,0,0,0.01)]' : 'bg-transparent border-transparent'}
                  `}
                >
                  {n.isNew && (
                    <span className="absolute top-4 right-4 w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                  )}
                  
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border border-black/5 ${n.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0 pr-2">
                    <h4 className="text-xs font-bold text-slate-800 leading-snug tracking-tight">{n.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-1 leading-normal font-medium">{n.message}</p>
                    <span className="text-[9px] text-slate-400 mt-2 block font-mono font-medium">{n.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-100 bg-[#F9F9FB] text-center">
          <span className="text-[10px] text-slate-400 font-medium">End of Notifications Feed</span>
        </div>
      </motion.div>
    </div>
  );
};

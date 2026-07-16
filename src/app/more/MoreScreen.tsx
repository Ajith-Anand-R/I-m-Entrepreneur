import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Sparkles, 
  FileCheck, 
  Users, 
  Calendar, 
  Settings, 
  Share2, 
  HelpCircle,
  TrendingUp
} from 'lucide-react';
import { useStartupStore } from '../../store/useStartupStore';

export const MoreScreen: React.FC = () => {
  const navigate = useNavigate();
  const { startupName, stage } = useStartupStore();

  const links = [
    { to: '/builder', label: 'AI Startup Builder', desc: 'Auto-recommended task roadmap checklist.', icon: Sparkles, color: 'text-accent-violet bg-accent-violet/10' },
    { to: '/academy', label: 'Learning Academy', desc: 'Structured entrepreneurship curriculum and video lectures.', icon: BookOpen, color: 'text-accent-amber bg-accent-amber/10' },
    { to: '/generator', label: 'AI Document Generator', desc: 'Pre-filled wizards drafting SWOT, NDAs, and business canvases.', icon: FileCheck, color: 'text-accent-teal bg-accent-teal/10' },
    { to: '/community', label: 'Founder Community', desc: 'Connect with local co-founders, advisors, and mentors.', icon: Users, color: 'text-ink-700 bg-ink-50' },
    { to: '/meetings', label: 'Consultation Sessions', desc: 'Schedule appointments and check notes from previous sessions.', icon: Calendar, color: 'text-accent-green bg-accent-green/10' },
    { to: '/settings', label: 'Account & Settings', desc: 'Control interface theme variables, profiles details, and resets.', icon: Settings, color: 'text-slate-500 bg-slate-100' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-bold text-ink-900">Explore Modules</h2>
        <p className="text-xs text-slate-500 font-mono mt-0.5">
          Startup operating tools for {startupName} ({stage} Stage)
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <div 
              key={link.to}
              onClick={() => navigate(link.to)}
              className="bg-white rounded-xl border border-slate-250 p-5 flex space-x-4 cursor-pointer hover:border-slate-400 hover:shadow-sm transition"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${link.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="space-y-1 min-w-0">
                <h3 className="font-bold text-sm text-ink-900 flex items-center space-x-1 hover:text-ink-700 transition">
                  <span>{link.label}</span>
                  <TrendingUp className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed pr-2">{link.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default MoreScreen;

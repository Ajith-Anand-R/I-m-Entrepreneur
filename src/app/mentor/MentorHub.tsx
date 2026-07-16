import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Compass, Cpu, DollarSign, Megaphone, Shield, Award, Users, AlertCircle } from 'lucide-react';
import { MENTORS } from '../../mockData/fixtures';

const iconMap: Record<string, any> = {
  Compass,
  DollarSign,
  Megaphone,
  TrendingUp: Compass, // Fallback
  Layers: Compass,
  Cpu,
  Shield,
  Percent: DollarSign,
  Award,
  FileText: Compass
};

export const MentorHub: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-zinc-100 pb-5">
        <h2 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center space-x-2.5 tracking-tight">
          <MessageSquare className="w-5.5 h-5.5 text-indigo-500 animate-pulse" />
          <span>AI Mentor Hub</span>
        </h2>
        <p className="text-xs text-slate-450 mt-1.5 font-medium">
          Select a vertical coach to receive custom advice referencing your uploaded workspace files.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MENTORS.map((m) => {
          const Icon = iconMap[m.iconName] || MessageSquare;
          return (
            <div 
              key={m.id}
              className="bg-white rounded-3xl border border-zinc-150 p-6 flex flex-col justify-between hover:shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:border-indigo-100/50 transition-all duration-300 group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div 
                    style={{ backgroundColor: `${m.color}15`, color: m.color }}
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold border border-black/5"
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[9px] text-slate-400 font-mono font-bold uppercase tracking-wider">SPECIALIST</span>
                </div>

                <h3 className="font-bold text-base text-slate-800 group-hover:text-indigo-650 transition-colors tracking-tight">
                  {m.name}
                </h3>
                <span className="text-xs text-slate-400 font-semibold block mt-1">{m.role}</span>
                <p className="text-xs text-slate-500 mt-3 leading-relaxed font-medium">{m.specialty}</p>

                {/* Knows about tags */}
                <div className="mt-5 pt-4 border-t border-zinc-50 space-y-2">
                  <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase block font-mono">Focus Scope</span>
                  <div className="flex flex-wrap gap-1">
                    {m.knowsAbout.map((docType) => (
                      <span 
                        key={docType}
                        className="text-[9px] px-2 py-0.5 rounded-full bg-slate-50 text-slate-500 font-semibold border border-zinc-200/30"
                      >
                        {docType}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate(`/mentor/chat/${m.id}`)}
                className="mt-6 w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors flex items-center justify-center space-x-2 shadow-sm"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Consult Coach</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default MentorHub;

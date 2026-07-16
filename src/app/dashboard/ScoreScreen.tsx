import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { useStartupStore } from '../../store/useStartupStore';

export const ScoreScreen: React.FC = () => {
  const { score, currentJourneyLevel, builderTasks } = useStartupStore();

  const categories = [
    {
      name: 'Workspace Completeness',
      score: 75,
      description: 'Startup metadata, co-founder structure, and product description defined.',
      tip: 'Add missing problem statements to reach 90%',
      cta: '/workspace',
      ctaText: 'Open Profile'
    },
    {
      name: 'Validation & Concept',
      score: Math.round((currentJourneyLevel / 15) * 100),
      description: 'Winding journey milestones cleared. Levels 1 & 2 completed, Level 3 validation active.',
      tip: 'Clear Level 3 scanning to unlock Level 4',
      cta: '/journey',
      ctaText: 'Continue Level 3'
    },
    {
      name: 'Task Planning Completion',
      score: Math.round((builderTasks.filter(t => t.status === 'completed').length / (builderTasks.length || 1)) * 100),
      description: 'Completed operations tasks mapped within the AI Builder planner.',
      tip: 'Update your customer interviews status',
      cta: '/builder',
      ctaText: 'Check Planner'
    },
    {
      name: 'Document Readiness',
      score: 30,
      description: 'Feasibility reports, pitch outline scripts, and legal NDAs generated.',
      tip: 'Generate standard Co-founder agreements',
      cta: '/generator',
      ctaText: 'View Generator'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
        <Link to="/" className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-50 transition border border-slate-100">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h2 className="text-lg font-bold text-slate-800">Startup Maturity Rating</h2>
          <p className="text-xs text-slate-400 font-semibold font-mono uppercase tracking-wider">Detailed Evaluation Indices</p>
        </div>
      </div>

      {/* Main Score Badge - Light Mode Accent */}
      <div className="bg-white text-slate-850 rounded-2xl p-6 border border-slate-100/80 flex flex-col md:flex-row items-center justify-between shadow-[0_10px_35px_rgba(0,0,0,0.015)] relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-gradient-to-tr from-accent-teal/5 to-accent-violet/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="text-center md:text-left space-y-2 relative z-10">
          <h3 className="text-xs font-bold text-accent-teal uppercase tracking-wider font-mono">Current Index Level</h3>
          <p className="text-xs md:text-sm text-slate-500 max-w-md font-medium leading-relaxed mt-1">
            Maturity score is calculated dynamically based on document profiles, milestone validation scans, and plan checkmarks.
          </p>
        </div>

        <div className="mt-6 md:mt-0 relative z-10 flex items-center justify-center shrink-0 w-24 h-24 rounded-full bg-slate-50 border-4 border-slate-100 shadow-sm">
          <div className="text-center">
            <span className="text-3xl font-bold font-mono text-slate-800 block">{score}</span>
            <span className="text-[9px] text-slate-400 uppercase tracking-widest block font-bold">Points</span>
          </div>
        </div>
      </div>

      {/* Categories breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-slate-100 p-5 flex flex-col justify-between hover:border-slate-200 transition shadow-[0_4px_15px_rgba(0,0,0,0.01)]">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-xs text-slate-700">{cat.name}</h4>
                <span className="font-mono text-xs font-bold text-slate-450">{cat.score}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-3">
                <div 
                  className="bg-gradient-to-r from-accent-teal to-accent-violet h-full rounded-full" 
                  style={{ width: `${cat.score}%` }}
                ></div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-4 font-medium">{cat.description}</p>
            </div>
            
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
              <span className="text-[9px] text-accent-amber font-bold flex items-center space-x-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{cat.tip}</span>
              </span>
              <Link 
                to={cat.cta}
                className="text-xs text-accent-teal hover:underline font-bold"
              >
                {cat.ctaText}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ScoreScreen;

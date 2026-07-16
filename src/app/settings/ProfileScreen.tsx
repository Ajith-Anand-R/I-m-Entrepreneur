import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, User, Sparkles, Briefcase, Award, CheckCircle } from 'lucide-react';
import { useStartupStore } from '../../store/useStartupStore';
import { db } from '../../lib/db';

export const ProfileScreen: React.FC = () => {
  const { founderName, startupName, mentorOrg, currentJourneyLevel, score } = useStartupStore();
  const [docCount, setDocCount] = useState(0);

  useEffect(() => {
    const fetchDocCount = async () => {
      const allDocs = await db.documents.toArray();
      setDocCount(allDocs.length);
    };
    fetchDocCount();
  }, []);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3 border-b border-slate-200 pb-4">
        <Link to="/dashboard" className="p-2 text-slate-500 hover:text-ink-900 rounded-full hover:bg-slate-100 transition">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-xl font-bold text-ink-900">Founder Account</h2>
          <p className="text-xs text-slate-500 font-mono">Overview & Credentials</p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col items-center text-center space-y-4 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-ink-900 text-white flex items-center justify-center font-bold text-2xl shadow">
          {founderName.substring(0, 2).toUpperCase()}
        </div>
        
        <div>
          <h3 className="text-lg font-bold text-ink-900">{founderName}</h3>
          <span className="text-xs text-slate-400 font-semibold uppercase font-mono">{startupName}</span>
        </div>

        {mentorOrg && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-accent-violet/10 text-accent-violet border border-accent-violet/10">
            <Sparkles className="w-3.5 h-3.5 mr-1" />
            <span>Accelerator: {mentorOrg}</span>
          </span>
        )}

        <div className="grid grid-cols-3 gap-6 w-full max-w-md pt-4 border-t border-slate-100 text-center">
          <div>
            <span className="text-[10px] font-mono text-slate-450 block uppercase">Maturity Score</span>
            <span className="text-xl font-bold text-accent-teal font-mono">{score}</span>
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-450 block uppercase">Journey Level</span>
            <span className="text-xl font-bold text-accent-amber font-mono">{currentJourneyLevel}</span>
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-450 block uppercase">Workspace files</span>
            <span className="text-xl font-bold text-ink-700 font-mono">{docCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfileScreen;

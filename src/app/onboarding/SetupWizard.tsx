import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStartupStore } from '../../store/useStartupStore';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export const SetupWizard: React.FC = () => {
  const navigate = useNavigate();
  const store = useStartupStore();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    startupName: store.startupName || '',
    founderName: store.founderName || '',
    stage: store.stage || 'Idea',
    vision: store.vision || '',
    problemStatement: store.problemStatement || '',
    solution: store.solution || '',
    inviteCode: '',
    physicalBookCode: ''
  });

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else {
      // Save all seed parameters to Zustand store
      store.updateProfile({
        startupName: form.startupName,
        founderName: form.founderName,
        stage: form.stage as any,
        vision: form.vision,
        problemStatement: form.problemStatement,
        solution: form.solution,
        inviteCode: form.inviteCode || null,
        mentorOrg: form.inviteCode ? 'Beyond Guidance Accelerator Partner' : null
      });

      if (form.physicalBookCode) {
        store.setBookLinked(true);
      }

      store.recalculateScore();
      navigate('/');
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 text-slate-800 font-sans relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-accent-teal/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-accent-violet/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-lg bg-white border border-slate-100/70 p-6 md:p-8 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.02)] space-y-6 relative z-10">
        
        {/* Step indicator */}
        <div className="flex justify-between items-center border-b border-slate-100 pb-3.5">
          <div>
            <h2 className="font-bold text-sm text-slate-800">Startup Configuration</h2>
            <p className="text-xs text-slate-400 font-semibold font-mono uppercase tracking-wide">Setup your digital workspace</p>
          </div>
          <span className="text-xs font-mono font-bold text-accent-teal bg-accent-teal/10 px-2.5 py-1 rounded-full">
            Step {step} / 3
          </span>
        </div>

        {/* Step Content */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">Startup Name</label>
              <input 
                type="text" 
                placeholder="e.g. EcoSphere Solutions"
                value={form.startupName}
                onChange={(e) => setForm({...form, startupName: e.target.value})}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 outline-none focus:border-accent-teal transition text-slate-800"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">Founder Full Name</label>
              <input 
                type="text" 
                placeholder="e.g. Ajith Kumar"
                value={form.founderName}
                onChange={(e) => setForm({...form, founderName: e.target.value})}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 outline-none focus:border-accent-teal transition text-slate-800"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">Development Stage</label>
              <select
                value={form.stage}
                onChange={(e) => setForm({...form, stage: e.target.value as any})}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 outline-none focus:border-accent-teal transition text-slate-800 cursor-pointer"
              >
                <option value="Idea">Idea concept stage</option>
                <option value="Validating">Validation & Customer interviews</option>
                <option value="Building">Prototype & MVP scaling</option>
                <option value="Launched">Market active</option>
                <option value="Scaling">Regional licensing active</option>
              </select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">One-Sentence Vision</label>
              <textarea 
                rows={2}
                placeholder="e.g. Empowering local communities to eliminate single-use packaging waste..."
                value={form.vision}
                onChange={(e) => setForm({...form, vision: e.target.value})}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-accent-teal transition text-slate-800 resize-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">Primary Problem Statement</label>
              <textarea 
                rows={3}
                placeholder="e.g. Traditional recycling recovers less than 9% of consumer plastics, creating landfills..."
                value={form.problemStatement}
                onChange={(e) => setForm({...form, problemStatement: e.target.value})}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-accent-teal transition text-slate-800 resize-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">Primary Product Solution</label>
              <textarea 
                rows={3}
                placeholder="e.g. A network of automated retail fluid dispensing kiosks dispenser kiosks..."
                value={form.solution}
                onChange={(e) => setForm({...form, solution: e.target.value})}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-accent-teal transition text-slate-800 resize-none"
                required
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-1.5 text-center">
              <span className="text-xs text-accent-violet font-bold font-mono uppercase">Cohort Program Integration</span>
              <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                If you joined through a partner incubator program (e.g. Beyond Guidance, Sarmang, Startup Uttarakhand), enter your invite key below.
              </p>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">Partner Program Invite Code (Optional)</label>
              <input 
                type="text" 
                placeholder="e.g. BG-ACCEL-2026"
                value={form.inviteCode}
                onChange={(e) => setForm({...form, inviteCode: e.target.value})}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 outline-none focus:border-accent-teal transition text-slate-800 font-mono uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">Founder Journey Book Activation Key (Optional)</label>
              <input 
                type="text" 
                placeholder="Scan QR or enter key from book cover"
                value={form.physicalBookCode}
                onChange={(e) => setForm({...form, physicalBookCode: e.target.value})}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 outline-none focus:border-accent-teal transition text-slate-800 font-mono uppercase"
              />
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          
          <button
            onClick={handleNext}
            disabled={(step === 1 && (!form.startupName || !form.founderName)) || (step === 2 && (!form.vision || !form.problemStatement || !form.solution))}
            className="px-5 py-2.5 bg-gradient-to-tr from-accent-teal to-accent-violet hover:opacity-90 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_12px_rgba(124,92,242,0.2)]"
          >
            <span>{step === 3 ? 'Launch Workspace' : 'Continue'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
export default SetupWizard;

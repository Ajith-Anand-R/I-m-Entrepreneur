import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Sparkles, User, Lightbulb, BookOpen, Key, Rocket } from 'lucide-react';
import { useStartupStore } from '../../store/useStartupStore';

const SG = "'Space Grotesk',sans-serif";
const EASE = [0.16, 1, 0.3, 1] as const;

const STEPS = [
  { num: 1, icon: User, label: 'Founder Profile', color: '#6C47FF' },
  { num: 2, icon: Lightbulb, label: 'Startup Vision', color: '#F59E0B' },
  { num: 3, icon: Key, label: 'Program Integration', color: '#34D399' },
];

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
    physicalBookCode: '',
  });

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else {
      store.updateProfile({
        startupName: form.startupName,
        founderName: form.founderName,
        stage: form.stage as any,
        vision: form.vision,
        problemStatement: form.problemStatement,
        solution: form.solution,
        inviteCode: form.inviteCode || null,
        mentorOrg: form.inviteCode ? 'Beyond Guidance Accelerator Partner' : null,
      });
      if (form.physicalBookCode) store.setBookLinked(true);
      store.recalculateScore();
      navigate('/dashboard');
    }
  };

  const handleBack = () => { if (step > 1) setStep(step - 1); };

  const inputCls = "w-full text-[13px] bg-white border border-accent/[0.1] rounded-2xl px-4 py-3.5 outline-none text-ink-900 placeholder-ink-300 transition-all duration-200 focus:border-accent focus:shadow-[0_0_0_3px_rgba(108,71,255,0.08)]";
  const textareaCls = `${inputCls} resize-none`;
  const labelCls = "block text-[10px] font-bold tracking-widest uppercase text-ink-300 mb-1.5";

  const isValid = step === 1
    ? !!(form.startupName && form.founderName)
    : step === 2
      ? !!(form.vision && form.problemStatement && form.solution)
      : true;

  return (
    <div className="min-h-screen gradient-mesh-hero flex items-center justify-center p-6 relative overflow-hidden">
      {/* Ambient orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="orb orb-purple absolute w-80 h-80 -top-16 left-1/4" />
        <div className="orb orb-mint absolute w-64 h-64 bottom-10 right-1/4" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="card-pro p-7 md:p-9 space-y-6 overflow-hidden relative">
          {/* Top accent */}
          <div className="absolute top-0 left-0 right-0 h-[2px]"
            style={{ background: 'linear-gradient(90deg, #6C47FF, #8B7AFF, #38BDF8)' }} />

          {/* Step header */}
          <div className="flex items-center justify-between pb-4 border-b border-accent/[0.06]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl overflow-hidden border border-accent/10 bg-black flex items-center justify-center shrink-0">
                <img src="/beyond_guidance_logo.jpg" alt="Beyond Guidance" className="w-full h-full object-contain scale-[1.3] -translate-y-[2px]" />
              </div>
              <div>
                <h2 className="text-base font-bold text-ink-900" style={{ fontFamily: SG }}>Startup Configuration</h2>
                <p className="text-[10px] text-ink-300 font-semibold uppercase tracking-wider mt-0.5">Setup your digital workspace</p>
              </div>
            </div>
            <span className="text-[11px] font-bold px-3 py-1.5 rounded-xl"
              style={{ background: 'rgba(108,71,255,0.08)', color: '#6C47FF', fontFamily: SG }}>
              {step} / 3
            </span>
          </div>

          {/* Step indicators */}
          <div className="flex gap-2">
            {STEPS.map(s => (
              <div key={s.num} className="flex-1">
                <div className={`h-1 rounded-full transition-all duration-500 ${step >= s.num ? '' : ''}`}
                  style={{
                    background: step >= s.num
                      ? `linear-gradient(90deg, ${s.color}, ${s.color}88)`
                      : 'rgba(108,71,255,0.06)',
                    boxShadow: step >= s.num ? `0 0 8px ${s.color}30` : 'none',
                  }}
                />
                <p className="text-[9px] font-bold mt-1.5 tracking-wider uppercase"
                  style={{ color: step >= s.num ? s.color : 'var(--text-muted)', fontFamily: SG }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          {/* Step content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className={labelCls}>Startup Name</label>
                    <input type="text" placeholder="e.g. EcoSphere Solutions" value={form.startupName}
                      onChange={e => setForm({ ...form, startupName: e.target.value })} className={inputCls} required />
                  </div>
                  <div>
                    <label className={labelCls}>Founder Full Name</label>
                    <input type="text" placeholder="e.g. Ajith Kumar" value={form.founderName}
                      onChange={e => setForm({ ...form, founderName: e.target.value })} className={inputCls} required />
                  </div>
                  <div>
                    <label className={labelCls}>Development Stage</label>
                    <select value={form.stage} onChange={e => setForm({ ...form, stage: e.target.value as any })}
                      className={`${inputCls} cursor-pointer`}>
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
                    <label className={labelCls}>One-Sentence Vision</label>
                    <textarea rows={2} placeholder="e.g. Empowering local communities to eliminate single-use packaging waste..."
                      value={form.vision} onChange={e => setForm({ ...form, vision: e.target.value })} className={textareaCls} required />
                  </div>
                  <div>
                    <label className={labelCls}>Primary Problem Statement</label>
                    <textarea rows={3} placeholder="e.g. Traditional recycling recovers less than 9% of consumer plastics..."
                      value={form.problemStatement} onChange={e => setForm({ ...form, problemStatement: e.target.value })} className={textareaCls} required />
                  </div>
                  <div>
                    <label className={labelCls}>Primary Product Solution</label>
                    <textarea rows={3} placeholder="e.g. A network of automated retail fluid dispensing kiosks..."
                      value={form.solution} onChange={e => setForm({ ...form, solution: e.target.value })} className={textareaCls} required />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl space-y-1.5 text-center"
                    style={{ background: 'rgba(108,71,255,0.04)', border: '1px solid rgba(108,71,255,0.08)' }}>
                    <div className="flex items-center justify-center gap-2">
                      <BookOpen className="w-4 h-4 text-accent" />
                      <span className="text-[11px] text-accent font-bold uppercase tracking-wider" style={{ fontFamily: SG }}>
                        Cohort Program Integration
                      </span>
                    </div>
                    <p className="text-[11px] text-ink-300 leading-relaxed">
                      If you joined through a partner incubator program (e.g. Beyond Guidance, Sarmang), enter your invite key below.
                    </p>
                  </div>
                  <div>
                    <label className={labelCls}>Partner Program Invite Code (Optional)</label>
                    <input type="text" placeholder="e.g. BG-ACCEL-2026" value={form.inviteCode}
                      onChange={e => setForm({ ...form, inviteCode: e.target.value })}
                      className={`${inputCls} font-mono uppercase`} />
                  </div>
                  <div>
                    <label className={labelCls}>Founder Journey Book Activation Key (Optional)</label>
                    <input type="text" placeholder="Scan QR or enter key from book cover" value={form.physicalBookCode}
                      onChange={e => setForm({ ...form, physicalBookCode: e.target.value })}
                      className={`${inputCls} font-mono uppercase`} />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Actions */}
          <div className="flex justify-between items-center pt-5 border-t border-accent/[0.06]">
            <button onClick={handleBack} disabled={step === 1}
              className="btn-ghost text-[12px] disabled:opacity-30 disabled:cursor-not-allowed">
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleNext}
              disabled={!isValid}
              className="btn-primary text-[12px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{step === 3 ? 'Launch Workspace' : 'Continue'}</span>
              {step === 3 ? <Rocket className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SetupWizard;

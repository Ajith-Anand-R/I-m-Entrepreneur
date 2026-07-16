import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Download, 
  Save, 
  FileText,
  FileCheck,
  Grid,
  AlertTriangle
} from 'lucide-react';
import { DOCUMENT_TEMPLATES } from '../../mockData/fixtures';
import { useStartupStore } from '../../store/useStartupStore';
import { db } from '../../lib/db';

export const GeneratorHome: React.FC = () => {
  const store = useStartupStore();
  const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);
  
  // Wizard state
  const [wizardStep, setWizardStep] = useState<'catalog' | 'form' | 'generating' | 'preview'>('catalog');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [draftResult, setDraftResult] = useState<any | null>(null);

  const handleSelectTemplate = (tpl: any) => {
    setSelectedTemplate(tpl);
    
    // Seed initial values from Knowledge Base / Zustand
    const initialForm: Record<string, string> = {};
    tpl.prefillFields.forEach((field: string) => {
      initialForm[field] = (store as any)[field] || '';
    });
    
    setFormData(initialForm);
    setWizardStep('form');
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setWizardStep('generating');
    
    // Latency
    await new Promise((r) => setTimeout(r, 2000));
    
    // Produce mock document data layout
    let content: any = null;
    if (selectedTemplate.id === 'swot-analysis') {
      content = {
        strengths: 'Decentralized refill locations, touchless weight tracking, B2B retail placement partnerships.',
        weaknesses: 'High initial kiosk manufacturing unit costs ($1,500/unit), dependence on third-party fluid supplier pipelines.',
        opportunities: 'Local environmental tax exemptions, exclusive licensing deals with major organic soap brands.',
        threats: 'Low initial user container return rates, fast-follower hardware clones.'
      };
    } else if (selectedTemplate.id === 'business-model-canvas' || selectedTemplate.id === 'lean-canvas') {
      content = {
        problem: formData.problemStatement || store.problemStatement,
        solution: formData.solution || store.solution,
        channels: 'Direct retail store kiosks, organic product community events, local carbon-offset partner portals.',
        valueProp: 'Zero-waste detergent refill network saving B2C buyers 15% and retail partners space.',
        revenue: 'B2B subscription lease + DTC dispensing margin.',
        costs: 'Kiosk assembly costs, logistics supply lines, local customer acquisition marketing.'
      };
    } else {
      content = `This is a generated draft of the ${selectedTemplate.title} for ${store.startupName}. Created by AI Mentor compiler referencing founder profile data.\n\nProblem Definition:\n${formData.problemStatement || store.problemStatement || 'Not Defined'}\n\nStrategic Solution:\n${formData.solution || store.solution || 'Not Defined'}\n\nIncorporation Profile:\nFounder: ${store.founderName}\nStage: ${store.stage}\nEntity: ${store.mentorOrg || 'Independent'}`;
    }

    setDraftResult(content);
    setWizardStep('preview');
  };

  const handleSaveToWorkspace = async () => {
    if (!selectedTemplate) return;
    
    const size = `${(Math.random() * 2 + 0.5).toFixed(1)} MB`;
    const docRecord = {
      id: `generated-${Date.now()}`,
      category: selectedTemplate.id === 'nda' ? 'NDA' : selectedTemplate.id === 'founder-agreement' ? 'Founder Agreement' : 'Reports',
      title: `${store.startupName} - Generated ${selectedTemplate.title}`,
      tags: ['generated-draft', 'ai-document'],
      fileSize: size,
      analyzedAt: new Date().toISOString(),
      extractedSummary: {
        problemStatement: formData.problemStatement || store.problemStatement,
        targetAudience: 'Identified via document builder algorithms',
        revenueModel: formData.businessModel || store.businessModel
      }
    };

    await db.documents.put(docRecord);
    alert('Document successfully saved to your Startup Workspace!');
    setWizardStep('catalog');
    setSelectedTemplate(null);
    store.recalculateScore();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-zinc-100 pb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center space-x-2.5 tracking-tight">
            <FileCheck className="w-5.5 h-5.5 text-indigo-550 animate-pulse" />
            <span>AI Document Generator</span>
          </h2>
          <p className="text-xs text-slate-450 mt-1.5 font-medium">
            Generate feasibility reports, pitch decks, and legal drafts mapped directly to your profile.
          </p>
        </div>
        
        {wizardStep !== 'catalog' && (
          <button
            onClick={() => {
              setWizardStep('catalog');
              setSelectedTemplate(null);
            }}
            className="text-xs px-4 py-2 border border-zinc-200 hover:bg-slate-50 rounded-xl font-bold text-slate-650 flex items-center space-x-1.5 transition-colors shadow-sm bg-white"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Catalog</span>
          </button>
        )}
      </div>

      {/* RENDER CATALOG */}
      {wizardStep === 'catalog' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DOCUMENT_TEMPLATES.map((tpl) => (
            <div 
              key={tpl.id}
              className="bg-white rounded-3xl border border-zinc-150 p-6 flex flex-col justify-between hover:shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:border-indigo-100/50 transition-all duration-300 group shadow-sm"
            >
              <div>
                <div className="w-11 h-11 rounded-xl bg-slate-50 border border-zinc-100 flex items-center justify-center text-indigo-550 mb-4 group-hover:scale-105 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-slate-800 tracking-tight">{tpl.title}</h3>
                <p className="text-xs text-slate-500 mt-2.5 leading-relaxed font-medium">{tpl.description}</p>
                
                {/* Pre-fill checklist preview */}
                <div className="mt-5 pt-4 border-t border-zinc-50 flex items-center justify-between">
                  <span className="text-[9px] text-slate-400 font-mono uppercase font-bold">Auto-fills:</span>
                  <span className="text-[10px] text-purple-650 font-bold flex items-center space-x-0.5">
                    <Sparkles className="w-3 h-3 animate-pulse text-purple-500" />
                    <span>{tpl.prefillFields.length} variables</span>
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleSelectTemplate(tpl)}
                className="mt-6 w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition duration-300 flex items-center justify-center space-x-1.5 shadow-sm"
              >
                <span>Initialize Wizard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* RENDER FORM WIZARD */}
      {wizardStep === 'form' && selectedTemplate && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-zinc-150 p-8 shadow-sm space-y-6">
          <div className="border-b border-zinc-100 pb-4">
            <h3 className="font-bold text-base text-slate-800 tracking-tight">Compile {selectedTemplate.title}</h3>
            <p className="text-xs text-slate-450 mt-1 font-medium">Review prefilled variables and fill missing values</p>
          </div>

          <form onSubmit={handleGenerate} className="space-y-5">
            {selectedTemplate.prefillFields.map((field: string) => {
              const label = field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
              const isPrefilled = !!(store as any)[field];
              
              return (
                <div key={field} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-550">{label}</label>
                    {isPrefilled && (
                      <span className="text-[8.5px] font-bold text-purple-650 flex items-center space-x-0.5 bg-purple-50 border border-purple-100/30 px-2.5 py-0.5 rounded-full font-mono">
                        <Sparkles className="w-2.5 h-2.5 animate-pulse text-purple-500" />
                        <span>Pre-filled from profile</span>
                      </span>
                    )}
                  </div>
                  
                  <textarea
                    rows={field.includes('Statement') || field.includes('Solution') || field.includes('Model') ? 3 : 1}
                    value={formData[field]}
                    onChange={(e) => setFormData({...formData, [field]: e.target.value})}
                    className="w-full text-xs border border-zinc-200 rounded-xl p-3 focus:ring-1 focus:ring-slate-900 outline-none resize-none bg-[#F9F9FB] font-medium"
                    required
                  />
                </div>
              );
            })}

            <button
              type="submit"
              className="w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition duration-300 shadow-md flex items-center justify-center space-x-1.5"
            >
              <Sparkles className="w-4 h-4 animate-pulse text-purple-300" />
              <span>Compile Draft</span>
            </button>
          </form>
        </div>
      )}

      {/* COMPILING LOADING PAGE */}
      {wizardStep === 'generating' && selectedTemplate && (
        <div className="max-w-md mx-auto py-12 text-center space-y-4 bg-white rounded-3xl border border-zinc-150 shadow-sm p-8">
          <div className="w-12 h-12 border-2 border-slate-100 border-t-purple-550 rounded-full animate-spin mx-auto"></div>
          <div>
            <h3 className="font-bold text-sm text-slate-800 animate-pulse tracking-tight">Compiling Document Layout...</h3>
            <p className="text-xs text-slate-450 mt-2 leading-relaxed font-medium">
              Structuring cost tables, sorting matrix elements, and populating templates for {store.startupName}.
            </p>
          </div>
        </div>
      )}

      {/* RENDER DOCUMENT LAYOUT PREVIEW */}
      {wizardStep === 'preview' && selectedTemplate && (
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Controls */}
          <div className="bg-white border border-zinc-150 rounded-2xl p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 shadow-sm">
            <span className="text-xs text-slate-500 font-semibold tracking-wide">
              PREVIEW: {selectedTemplate.title} Draft
            </span>
            <div className="flex space-x-2.5">
              <button
                onClick={handleSaveToWorkspace}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition flex items-center space-x-1.5 shadow-sm"
              >
                <Save className="w-4 h-4" />
                <span>Save to Workspace</span>
              </button>
              <button
                onClick={() => alert('PDF mock download initiated. In production, this generates a formatted vector PDF document.')}
                className="px-4 py-2 border border-zinc-200 text-slate-650 bg-white rounded-xl text-xs font-bold hover:bg-slate-50 transition flex items-center space-x-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>

          {/* RENDER SWOT GRID */}
          {selectedTemplate.id === 'swot-analysis' && draftResult && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-sans">
              <div className="bg-emerald-50/40 border border-emerald-100/60 rounded-2xl p-5 space-y-2.5">
                <span className="text-xs font-bold text-emerald-600 uppercase font-mono tracking-wide">Strengths (S)</span>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">{draftResult.strengths}</p>
              </div>
              <div className="bg-rose-50/40 border border-rose-100/60 rounded-2xl p-5 space-y-2.5">
                <span className="text-xs font-bold text-rose-500 uppercase font-mono tracking-wide">Weaknesses (W)</span>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">{draftResult.weaknesses}</p>
              </div>
              <div className="bg-indigo-50/40 border border-indigo-100/60 rounded-2xl p-5 space-y-2.5">
                <span className="text-xs font-bold text-indigo-600 uppercase font-mono tracking-wide">Opportunities (O)</span>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">{draftResult.opportunities}</p>
              </div>
              <div className="bg-amber-50/40 border border-amber-100/60 rounded-2xl p-5 space-y-2.5">
                <span className="text-xs font-bold text-amber-550 uppercase font-mono tracking-wide">Threats (T)</span>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">{draftResult.threats}</p>
              </div>
            </div>
          )}

          {/* RENDER CANVAS GRID */}
          {(selectedTemplate.id === 'business-model-canvas' || selectedTemplate.id === 'lean-canvas') && draftResult && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 font-sans">
              <div className="bg-white rounded-2xl border border-zinc-150 p-5 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Problem Scope</span>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">{draftResult.problem}</p>
              </div>
              <div className="bg-white rounded-2xl border border-zinc-150 p-5 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Solution Scope</span>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">{draftResult.solution}</p>
              </div>
              <div className="bg-white rounded-2xl border border-zinc-150 p-5 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Channels Map</span>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">{draftResult.channels}</p>
              </div>
              <div className="md:col-span-3 bg-[#FAF7F0] rounded-2xl border border-[#E9E1D2]/80 p-6 space-y-2 text-center">
                <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block font-mono">Primary Value Proposition</span>
                <p className="text-sm font-semibold text-slate-800 leading-relaxed max-w-2xl mx-auto">{draftResult.valueProp}</p>
              </div>
              <div className="bg-indigo-50/20 rounded-2xl border border-indigo-100/40 p-5 space-y-2">
                <span className="text-[10px] font-bold text-indigo-650 uppercase tracking-wider font-mono">Revenues streams</span>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">{draftResult.revenue}</p>
              </div>
              <div className="bg-rose-50/20 rounded-2xl border border-rose-100/40 p-5 space-y-2 md:col-span-2">
                <span className="text-[10px] font-bold text-rose-550 uppercase tracking-wider font-mono">Cost quadrants</span>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">{draftResult.costs}</p>
              </div>
            </div>
          )}

          {/* RENDER DEFAULT DRAFT TEXT */}
          {selectedTemplate.id !== 'swot-analysis' && selectedTemplate.id !== 'business-model-canvas' && selectedTemplate.id !== 'lean-canvas' && draftResult && (
            <div className="bg-white rounded-3xl border border-zinc-150 p-8 md:p-10 font-serif text-sm md:text-base leading-loose shadow-sm relative overflow-hidden">
              {/* Paper line visual effect overlay */}
              <div className="absolute inset-y-0 left-8 w-px bg-rose-150 pointer-events-none"></div>

              <div className="absolute right-8 top-8 w-14 h-14 bg-slate-50 border border-zinc-200/50 rounded-full flex items-center justify-center text-slate-450 font-bold font-mono text-[10px] uppercase shadow-sm">
                Draft
              </div>
              <div className="pl-6">
                <p className="whitespace-pre-wrap text-slate-700 font-serif">{draftResult}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default GeneratorHome;

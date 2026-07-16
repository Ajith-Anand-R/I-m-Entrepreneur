import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Sparkles, 
  Camera, 
  UploadCloud, 
  FileText, 
  AlertCircle, 
  CheckCircle,
  Award,
  ChevronRight
} from 'lucide-react';
import { useStartupStore } from '../../store/useStartupStore';
import { JOURNEY_LEVELS } from '../../mockData/fixtures';

export const LevelDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const levelId = parseInt(id || '1');
  const level = JOURNEY_LEVELS.find((l) => l.id === levelId);

  const { currentJourneyLevel, unlockNextLevel, recalculateScore } = useStartupStore();

  const [inputMode, setInputMode] = useState<'text' | 'scan'>('text');
  const [textInput, setTextInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [resultState, setResultState] = useState<'idle' | 'success' | 'revision'>('idle');
  const [aiVerdict, setAiVerdict] = useState('');

  // Page turns
  const isCompleted = levelId < currentJourneyLevel;
  const isCurrent = levelId === currentJourneyLevel;

  useEffect(() => {
    if (!level) navigate('/journey');
  }, [level, navigate]);

  if (!level) return null;

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim() && inputMode === 'text') return;

    setIsAnalyzing(true);
    await new Promise((r) => setTimeout(r, 2000));
    setIsAnalyzing(false);

    // Mock pass/fail conditions
    if (textInput.length < 25 && inputMode === 'text') {
      setResultState('revision');
      setAiVerdict('Your submission is too brief. To satisfy the validation checkpoint, please expand your problem scope and name at least one competitor or direct user workaround.');
    } else {
      setResultState('success');
      setAiVerdict('Validation Passed! Your statement cleanly delineates the difference between environmental impact and operational footprint. The next milestone has been unlocked.');
      unlockNextLevel();
      recalculateScore();
    }
  };

  const handleScanMock = async () => {
    setIsScanning(true);
    await new Promise((r) => setTimeout(r, 1200)); // Simulate camera snap
    setIsScanning(false);
    setIsAnalyzing(true);
    await new Promise((r) => setTimeout(r, 1800)); // Simulate OCR reading
    setIsAnalyzing(false);

    setResultState('success');
    setAiVerdict('Handwriting OCR analysis successful! Your scanned text matches validation patterns. Level unlocked successfully.');
    unlockNextLevel();
    recalculateScore();
  };

  return (
    <div className="min-h-screen paper-texture text-slate-800 -m-6 md:-m-8 p-8 md:p-12 font-serif relative overflow-hidden">
      {/* Subtle paper-like grain overlay details */}
      <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-multiply bg-[#FAF7F0] bg-[radial-gradient(#000_0.2px,transparent_0.2px)] bg-[size:10px_10px]"></div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Top controls */}
        <div className="flex items-center justify-between border-b border-[#EBE3D5] pb-5 mb-10">
          <Link to="/journey" className="inline-flex items-center space-x-2 text-xs text-slate-600 hover:text-slate-900 font-sans font-semibold transition-colors duration-250">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Exit Book</span>
          </Link>
          <span className="text-[9px] font-mono font-bold tracking-wider text-slate-500 uppercase bg-[#EFECE6]/80 border border-[#E1DCD3] px-3.5 py-1 rounded-full shadow-sm">
            Level {level.id} • {isCompleted ? 'Completed' : isCurrent ? 'Active Activity' : 'Locked'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Textbook column */}
          <div className="md:col-span-2 space-y-8">
            <h1 className="text-3xl md:text-4.5xl font-serif font-semibold leading-tight text-slate-900 tracking-tight">
              {level.title}
            </h1>

            <div className="space-y-5 text-sm md:text-base leading-relaxed text-slate-700 font-serif">
              <h4 className="font-sans font-bold text-[10px] uppercase tracking-wider text-slate-400">Concept Overview</h4>
              <p className="italic text-base border-l-2 border-amber-400/60 pl-5 py-1.5 text-slate-900 bg-amber-50/20 font-medium">
                "{level.conceptExplanation}"
              </p>
              <p className="leading-loose font-serif font-normal">{level.learnContent}</p>
            </div>

            <div className="bg-white/40 rounded-2xl border border-[#E9E1D2]/80 p-6 space-y-3 font-sans shadow-[0_4px_20px_rgba(0,0,0,0.01)] backdrop-blur-sm">
              <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase block">Check-in Milestone Prompt</span>
              <p className="text-xs font-semibold text-slate-750 leading-relaxed">
                {level.activityPrompt}
              </p>
            </div>
          </div>

          {/* Form/Submit column */}
          <div className="bg-white/95 rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.03)] border border-zinc-150/70 p-6 font-sans h-fit space-y-5 relative z-20">
            <h3 className="font-bold text-xs text-slate-800 border-b border-zinc-100 pb-3 uppercase tracking-wider">
              Check-in Activity
            </h3>

            {isCompleted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto border border-emerald-100/50 shadow-sm animate-pulse">
                  <Award className="w-7 h-7" />
                </div>
                <h4 className="font-bold text-sm text-slate-800">Milestone Validated</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  You successfully submitted and cleared this level.
                </p>
                <Link 
                  to="/journey"
                  className="w-full inline-flex items-center justify-center space-x-1.5 py-3 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition shadow-sm mt-2"
                >
                  <span>Back to Path</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : resultState === 'idle' ? (
              <div className="space-y-4">
                <div className="flex bg-[#F4F4F5] p-1 rounded-xl border border-zinc-200/40 shadow-sm">
                  <button
                    onClick={() => setInputMode('text')}
                    className={`flex-1 text-center py-2 rounded-lg text-xs font-semibold transition-all duration-300 ${inputMode === 'text' ? 'bg-white text-indigo-650 shadow-[0_2px_8px_rgba(0,0,0,0.02)]' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    Type response
                  </button>
                  <button
                    onClick={() => setInputMode('scan')}
                    className={`flex-1 text-center py-2 rounded-lg text-xs font-semibold transition-all duration-300 ${inputMode === 'scan' ? 'bg-white text-indigo-650 shadow-[0_2px_8px_rgba(0,0,0,0.02)]' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    Scan Notebook
                  </button>
                </div>

                {inputMode === 'text' ? (
                  <form onSubmit={handleTextSubmit} className="space-y-4">
                    <textarea
                      rows={5}
                      placeholder="Enter your verification details..."
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      className="w-full text-xs border border-zinc-200 rounded-xl p-3 focus:ring-1 focus:ring-indigo-500 outline-none resize-none bg-[#F9F9FB] font-medium"
                      required
                    />
                    <button
                      type="submit"
                      disabled={isAnalyzing}
                      className="w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition duration-300 shadow-md"
                    >
                      Submit Response
                    </button>
                  </form>
                ) : (
                  <div className="space-y-4 text-center">
                    {isScanning ? (
                      <div className="border border-dashed border-zinc-300 rounded-2xl p-8 bg-[#F9F9FB] space-y-3.5">
                        <div className="w-9 h-9 rounded-full border-2 border-zinc-200 border-t-slate-800 animate-spin mx-auto"></div>
                        <p className="text-xs text-slate-500 font-medium">Capturing notebook image...</p>
                      </div>
                    ) : (
                      <div className="border border-dashed border-zinc-200 hover:border-indigo-200/50 rounded-2xl p-8 cursor-pointer bg-[#F9F9FB] space-y-3 transition-colors duration-300 relative overflow-hidden group">
                        <Camera className="w-8 h-8 text-slate-400 mx-auto group-hover:scale-105 transition-transform" />
                        <span className="text-xs font-bold text-slate-800 block">Align Physical Page</span>
                        <span className="text-[10px] text-slate-400 block font-medium">Or drag paper scan image</span>
                        <button 
                          onClick={handleScanMock}
                          className="mt-5 w-full py-2.5 bg-slate-950 text-white text-[10px] font-bold rounded-xl hover:opacity-95 transition-opacity"
                        >
                          Start Scanner Mock
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {isAnalyzing && (
                  <div className="text-center py-4 space-y-3">
                    <div className="w-8 h-8 border-2 border-slate-100 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
                    <p className="text-xs text-purple-600 font-semibold font-mono animate-pulse">
                      AI Ingesting Handwriting OCR...
                    </p>
                  </div>
                )}
              </div>
            ) : resultState === 'success' ? (
              <div className="space-y-5">
                <div className="w-11 h-11 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto border border-emerald-100/50 shadow-sm">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <h4 className="font-bold text-sm text-slate-800">Checkpoint Approved!</h4>
                  <p className="text-xs text-slate-550 mt-2 leading-relaxed font-medium">
                    {aiVerdict}
                  </p>
                </div>
                
                <div className="bg-purple-50 border border-purple-100/40 rounded-2xl p-4 space-y-2 text-left shadow-sm">
                  <span className="text-[9px] font-bold text-purple-600 uppercase tracking-wider flex items-center space-x-1 font-mono">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                    <span>Level-Unlock Celebration</span>
                  </span>
                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                    New milestone unlocked on the path. Dashboard maturity score has increased.
                  </p>
                </div>

                <Link
                  to="/journey"
                  className="w-full inline-flex items-center justify-center space-x-1.5 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition duration-300 shadow-md"
                >
                  <span>Continue on Path</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="w-11 h-11 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto border border-rose-100/50 shadow-sm">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <h4 className="font-bold text-sm text-slate-800">Needs Revision</h4>
                  <p className="text-xs text-slate-550 mt-2 leading-relaxed font-medium">
                    {aiVerdict}
                  </p>
                </div>
                <button
                  onClick={() => setResultState('idle')}
                  className="w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-850 transition duration-300 shadow-md"
                >
                  Revise & Resubmit
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default LevelDetail;


import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Users, 
  Database, 
  Plus, 
  Sparkles, 
  Search, 
  UploadCloud, 
  Trash2,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  FileCheck,
  Briefcase
} from 'lucide-react';
import { useStartupStore } from '../../store/useStartupStore';
import { db, type DocumentRecord } from '../../lib/db';
import { analyzeDocument } from '../../lib/fake-analysis';

export const WorkspaceHome: React.FC = () => {
  const { 
    founderName, startupName, vision, mission, stage, problemStatement, solution, businessModel,
    updateProfile, recalculateScore
  } = useStartupStore();

  const [activeTab, setActiveTab] = useState<'profile' | 'documents' | 'kb' | 'team'>('profile');
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [kbUpdates, setKbUpdates] = useState<number>(0);
  
  // Tab-specific states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    founderName, startupName, vision, mission, stage, problemStatement, solution, businessModel
  });
  
  // Document Upload states
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState('Pitch deck');
  const [uploadProgress, setUploadProgress] = useState<'idle' | 'uploading' | 'analyzing' | 'done'>('idle');
  const [extractedData, setExtractedData] = useState<DocumentRecord['extractedSummary'] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');

  // Team states
  const [teamMembers, setTeamMembers] = useState<{ id: string; name: string; role: string; bio: string }[]>([
    { id: '1', name: 'Ajith', role: 'Founder & CEO', bio: 'Passionate about smart city kiosks and sustainability engineering.' },
    { id: '2', name: 'Rohan Sharma', role: 'Tech Consultant', bio: 'IoT telemetry dev and mechanical hardware specialist.' }
  ]);
  const [newMember, setNewMember] = useState({ name: '', role: '', bio: '' });
  const [showAddMember, setShowAddMember] = useState(false);

  // Load documents on mount and whenever KB updates
  useEffect(() => {
    const fetchDocs = async () => {
      const allDocs = await db.documents.toArray();
      setDocuments(allDocs);
    };
    fetchDocs();
  }, [kbUpdates]);

  const handleSaveProfile = () => {
    updateProfile(profileForm);
    setIsEditingProfile(false);
  };

  const handleUploadSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim()) return;

    setUploadProgress('uploading');
    await new Promise((r) => setTimeout(r, 800));
    setUploadProgress('analyzing');

    try {
      const size = `${(Math.random() * 5 + 1).toFixed(1)} MB`;
      const analyzedDoc = await analyzeDocument(uploadTitle, uploadCategory, size);
      
      // Save to Dexie IndexedDB
      await db.documents.put(analyzedDoc);
      
      setExtractedData(analyzedDoc.extractedSummary || null);
      setDocuments(prev => [...prev, analyzedDoc]);
      setKbUpdates(prev => prev + 1);
      setUploadProgress('done');
      setUploadTitle('');
      recalculateScore();
    } catch (err) {
      setUploadProgress('idle');
      console.error(err);
    }
  };

  const handleDeleteDoc = async (id: string) => {
    await db.documents.delete(id);
    setDocuments(prev => prev.filter(d => d.id !== id));
    setKbUpdates(prev => prev + 1);
    recalculateScore();
  };

  const handleAddTeamMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name || !newMember.role) return;

    setTeamMembers(prev => [...prev, { ...newMember, id: `team-${Date.now()}` }]);
    setNewMember({ name: '', role: '', bio: '' });
    setShowAddMember(false);
    recalculateScore();
  };

  // Filter logic
  const documentCategories = [
    'All', 'Financial', 'Pitch deck', 'Research papers', 'Customer interviews', 'Meeting notes', 'NDA', 'Founder Agreement', 'Reports'
  ];

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategoryFilter === 'All' || doc.category === selectedCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-zinc-100 pb-5">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center space-x-2.5 tracking-tight">
            <Briefcase className="w-5.5 h-5.5 text-slate-455" />
            <span>Startup Workspace</span>
          </h2>
          <p className="text-xs text-slate-450 mt-1.5 font-medium">Manage Profile, Upload Documents, and Review AI Knowledge Base</p>
        </div>
        
        {/* Navigation Tabs - Modern Pill Bar */}
        <div className="flex bg-[#F4F4F5] p-1 rounded-2xl border border-zinc-200/40 mt-5 md:mt-0 shadow-sm">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all duration-300 ${activeTab === 'profile' ? 'bg-white text-indigo-650 shadow-[0_4px_12px_rgba(0,0,0,0.03)]' : 'text-slate-500 hover:text-slate-850'}`}
          >
            Profile
          </button>
          <button 
            onClick={() => setActiveTab('documents')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all duration-300 ${activeTab === 'documents' ? 'bg-white text-indigo-650 shadow-[0_4px_12px_rgba(0,0,0,0.03)]' : 'text-slate-500 hover:text-slate-850'}`}
          >
            Documents ({documents.length})
          </button>
          <button 
            onClick={() => setActiveTab('kb')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all duration-300 flex items-center space-x-1.5 ${activeTab === 'kb' ? 'bg-white text-indigo-650 shadow-[0_4px_12px_rgba(0,0,0,0.03)]' : 'text-slate-500 hover:text-slate-850'}`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-500 animate-pulse" />
            <span>Knowledge Base</span>
          </button>
          <button 
            onClick={() => setActiveTab('team')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all duration-300 ${activeTab === 'team' ? 'bg-white text-indigo-650 shadow-[0_4px_12px_rgba(0,0,0,0.03)]' : 'text-slate-500 hover:text-slate-850'}`}
          >
            Team
          </button>
        </div>
      </div>

      {/* Tab Panel Renders */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl border border-zinc-150/80 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.015)]">
              <div className="flex items-center justify-between border-b border-zinc-50 pb-4 mb-5">
                <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider">Startup Core Profile</h3>
                <button 
                  onClick={() => {
                    if (isEditingProfile) handleSaveProfile();
                    else setIsEditingProfile(true);
                  }}
                  className="text-xs px-4 py-2 bg-gradient-to-tr from-indigo-500 to-purple-500 text-white rounded-xl hover:opacity-95 transition-opacity font-semibold shadow-sm"
                >
                  {isEditingProfile ? 'Save Changes' : 'Edit Profile'}
                </button>
              </div>

              {isEditingProfile ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Startup Name</label>
                      <input 
                        type="text" 
                        value={profileForm.startupName}
                        onChange={(e) => setProfileForm({...profileForm, startupName: e.target.value})}
                        className="w-full text-xs border border-zinc-200 rounded-xl p-3 focus:ring-1 focus:ring-indigo-500 outline-none bg-[#F9F9FB]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Founder Name</label>
                      <input 
                        type="text" 
                        value={profileForm.founderName}
                        onChange={(e) => setProfileForm({...profileForm, founderName: e.target.value})}
                        className="w-full text-xs border border-zinc-200 rounded-xl p-3 focus:ring-1 focus:ring-indigo-500 outline-none bg-[#F9F9FB]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Company Stage</label>
                    <select
                      value={profileForm.stage}
                      onChange={(e) => setProfileForm({...profileForm, stage: e.target.value as any})}
                      className="w-full text-xs border border-zinc-200 rounded-xl p-3 focus:ring-1 focus:ring-indigo-500 outline-none bg-[#F9F9FB] cursor-pointer"
                    >
                      <option value="Idea">Idea</option>
                      <option value="Validating">Validating</option>
                      <option value="Building">Building</option>
                      <option value="Launched">Launched</option>
                      <option value="Scaling">Scaling</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">One-Sentence Vision</label>
                    <textarea 
                      rows={2}
                      value={profileForm.vision}
                      onChange={(e) => setProfileForm({...profileForm, vision: e.target.value})}
                      className="w-full text-xs border border-zinc-200 rounded-xl p-3 focus:ring-1 focus:ring-indigo-500 outline-none bg-[#F9F9FB] resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">One-Sentence Mission</label>
                    <textarea 
                      rows={2}
                      value={profileForm.mission}
                      onChange={(e) => setProfileForm({...profileForm, mission: e.target.value})}
                      className="w-full text-xs border border-zinc-200 rounded-xl p-3 focus:ring-1 focus:ring-indigo-500 outline-none bg-[#F9F9FB] resize-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4 bg-[#F9F9FB] p-5 rounded-2xl border border-zinc-150/40">
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 block tracking-wider uppercase">STARTUP NAME</span>
                      <span className="text-sm font-bold text-slate-800 mt-0.5 block tracking-tight">{startupName}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 block tracking-wider uppercase">CURRENT STAGE</span>
                      <span className="inline-flex items-center px-2.5 py-0.5 mt-1.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-600 border border-amber-100/40">
                        {stage}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 block tracking-wider uppercase mb-1">CORE VISION</span>
                    <p className="text-xs text-slate-700 leading-relaxed font-semibold">{vision || 'No vision defined yet.'}</p>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 block tracking-wider uppercase mb-1">MISSION STATEMENT</span>
                    <p className="text-xs text-slate-655 leading-relaxed font-medium">{mission || 'No mission statement defined yet.'}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-3xl border border-zinc-150/80 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.015)]">
              <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider border-b border-zinc-50 pb-4 mb-5">Value Prop & Business Plan Context</h3>
              
              {isEditingProfile ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">The Problem Statement</label>
                    <textarea 
                      rows={3}
                      value={profileForm.problemStatement}
                      onChange={(e) => setProfileForm({...profileForm, problemStatement: e.target.value})}
                      className="w-full text-xs border border-zinc-200 rounded-xl p-3 focus:ring-1 focus:ring-indigo-500 outline-none bg-[#F9F9FB]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Our Solution</label>
                    <textarea 
                      rows={3}
                      value={profileForm.solution}
                      onChange={(e) => setProfileForm({...profileForm, solution: e.target.value})}
                      className="w-full text-xs border border-zinc-200 rounded-xl p-3 focus:ring-1 focus:ring-indigo-500 outline-none bg-[#F9F9FB]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Revenue/Business Model Summary</label>
                    <textarea 
                      rows={2}
                      value={profileForm.businessModel}
                      onChange={(e) => setProfileForm({...profileForm, businessModel: e.target.value})}
                      className="w-full text-xs border border-zinc-200 rounded-xl p-3 focus:ring-1 focus:ring-indigo-500 outline-none bg-[#F9F9FB]"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 block tracking-wider uppercase mb-1">THE PROBLEM WE ADDRESS</span>
                    <p className="text-xs text-slate-655 leading-relaxed font-medium">{problemStatement || 'Not defined.'}</p>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 block tracking-wider uppercase mb-1">OUR SOLUTION DESIGN</span>
                    <p className="text-xs text-slate-655 leading-relaxed font-medium">{solution || 'Not defined.'}</p>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 block tracking-wider uppercase mb-1">REVENUE MODEL</span>
                    <p className="text-xs text-slate-700 leading-relaxed font-semibold">{businessModel || 'Not defined.'}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {/* Quick Stats sidebar widget - Clean light-mode bento design (No dark block) */}
            <div className="bg-[#FAF7F0] rounded-3xl p-6 border border-zinc-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.01)] relative overflow-hidden">
              <div className="absolute right-0 bottom-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl translate-x-4 translate-y-4"></div>
              <h4 className="text-[10px] text-slate-400 font-bold tracking-wider uppercase mb-4">Workspace Index</h4>
              <div className="space-y-3 relative z-10 font-mono">
                <div className="flex items-center justify-between border-b border-zinc-200/50 pb-2.5">
                  <span className="text-xs text-slate-500 font-semibold font-sans">Analyzed Files</span>
                  <span className="text-xs font-bold text-slate-800">{documents.length}</span>
                </div>
                <div className="flex items-center justify-between border-b border-zinc-200/50 pb-2.5">
                  <span className="text-xs text-slate-500 font-sans font-semibold">Known Keywords</span>
                  <span className="text-xs font-bold text-purple-600">
                    {documents.filter(d => d.extractedSummary).length * 4 || 8}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-zinc-200/50 pb-2.5">
                  <span className="text-xs text-slate-500 font-sans font-semibold">Team Roster</span>
                  <span className="text-xs font-bold text-slate-800">{teamMembers.length} members</span>
                </div>
              </div>
            </div>
            
            {/* Quick reminder card */}
            <div className="bg-white rounded-3xl border border-zinc-150/80 p-6 space-y-3 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
              <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">Mentor Guidance</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                "The AI Mentor reads files loaded in this workspace. Upload research, interview sheets, or financial sheets to unlock personalized mentor actions."
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main list */}
          <div className="lg:col-span-2 space-y-4">
            {/* Search and filters */}
            <div className="bg-white p-3.5 rounded-2xl border border-zinc-150/80 flex flex-col md:flex-row gap-3 items-center justify-between shadow-sm">
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input 
                  type="text" 
                  placeholder="Search workspace files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs pl-10 pr-3 py-2.5 border border-zinc-250/70 rounded-xl outline-none focus:ring-1 focus:ring-indigo-500 bg-[#F9F9FB]"
                />
              </div>

              {/* Category chip selectors */}
              <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="text-xs border border-zinc-200 rounded-xl px-3.5 py-2.5 bg-slate-50 outline-none cursor-pointer font-semibold text-slate-600"
                >
                  {documentCategories.map(cat => (
                    <option key={cat} value={cat}>{cat === 'All' ? 'All Files' : cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Documents List */}
            <div className="bg-white rounded-3xl border border-zinc-150/80 divide-y divide-zinc-50 overflow-hidden shadow-sm">
              {filteredDocs.length === 0 ? (
                <div className="p-12 text-center">
                  <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h4 className="font-bold text-sm text-slate-800">No documents found</h4>
                  <p className="text-xs text-slate-400 mt-1.5 max-w-xs mx-auto font-medium">
                    Try uploading a mock file on the right side panel to populate your database and trigger OCR logic.
                  </p>
                </div>
              ) : (
                filteredDocs.map((doc) => (
                  <div key={doc.id} className="p-5 flex items-start justify-between hover:bg-slate-50/30 transition-colors">
                    <div className="flex space-x-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50/70 flex items-center justify-center text-indigo-650 shrink-0 border border-indigo-100/20">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-slate-800 truncate pr-4">{doc.title}</h4>
                        <div className="flex items-center space-x-2 mt-1.5">
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-150/60 text-slate-600 font-bold uppercase tracking-wide">
                            {doc.category}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono font-medium">{doc.fileSize}</span>
                          <span className="text-[10px] text-slate-350 font-mono">•</span>
                          <span className="text-[10px] text-slate-400 font-mono font-medium">Analyzed {new Date(doc.analyzedAt!).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleDeleteDoc(doc.id)}
                      className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-rose-50/50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Upload Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-3xl border border-zinc-150/80 p-6 shadow-sm">
              <h3 className="font-bold text-xs text-slate-800 border-b border-zinc-50 pb-3 mb-5 flex items-center space-x-2 uppercase tracking-wider">
                <UploadCloud className="w-4.5 h-4.5 text-slate-500" />
                <span>Simulate Upload</span>
              </h3>

              {uploadProgress === 'idle' ? (
                <form onSubmit={handleUploadSimulate} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wide">Document Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g. EcoSphere Pitch Deck v2"
                      value={uploadTitle}
                      onChange={(e) => setUploadTitle(e.target.value)}
                      className="w-full text-xs border border-zinc-200 rounded-xl p-3 outline-none focus:ring-1 focus:ring-indigo-500 bg-[#F9F9FB]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wide">Document Category</label>
                    <select
                      value={uploadCategory}
                      onChange={(e) => setUploadCategory(e.target.value)}
                      className="w-full text-xs border border-zinc-200 rounded-xl p-3 outline-none bg-white cursor-pointer font-semibold text-slate-600 bg-[#F9F9FB]"
                    >
                      {documentCategories.filter(c => c !== 'All').map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3 bg-gradient-to-tr from-indigo-500 to-purple-500 text-white rounded-xl text-xs font-bold hover:opacity-95 transition-opacity shadow-[0_4px_12px_rgba(99,102,241,0.2)]"
                  >
                    Ingest & Analyze File
                  </button>
                </form>
              ) : uploadProgress === 'uploading' ? (
                <div className="py-10 text-center space-y-4">
                  <div className="w-10 h-10 border-2 border-slate-100 border-t-indigo-500 rounded-full animate-spin mx-auto"></div>
                  <p className="text-xs text-slate-550 font-semibold font-mono animate-pulse">Uploading local binary assets...</p>
                </div>
              ) : uploadProgress === 'analyzing' ? (
                <div className="py-10 text-center space-y-4">
                  <div className="w-10 h-10 border-2 border-slate-100 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
                  <p className="text-xs text-purple-600 font-semibold font-mono animate-pulse">AI is reading document OCR...</p>
                </div>
              ) : (
                <div className="py-4 text-center space-y-5">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto border border-emerald-100/50">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Analysis Successful</h4>
                    <p className="text-xs text-slate-400 mt-1 font-medium">Extracted data mapped directly to Knowledge Base.</p>
                  </div>
                  {extractedData && (
                    <div className="bg-purple-50/50 border border-purple-100/50 p-4 rounded-2xl text-left">
                      <span className="text-[9px] font-bold text-purple-600 flex items-center space-x-1 uppercase tracking-wider mb-2 font-mono">
                        <Sparkles className="w-3 h-3" />
                        <span>AI Extracted Sample</span>
                      </span>
                      <p className="text-[11px] text-slate-655 italic leading-relaxed font-medium">
                        "{extractedData.problemStatement || extractedData.revenueModel}"
                      </p>
                    </div>
                  )}
                  <button 
                    onClick={() => {
                      setUploadProgress('idle');
                      setExtractedData(null);
                    }}
                    className="w-full py-2.5 border border-zinc-200 text-slate-700 text-xs rounded-xl hover:bg-slate-50 font-bold bg-white shadow-sm"
                  >
                    Upload Another File
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'kb' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-zinc-150/80 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-zinc-50 mb-5 gap-3">
              <div>
                <h3 className="font-bold text-sm text-slate-800 flex items-center space-x-2.5 uppercase tracking-wider">
                  <Database className="w-4.5 h-4.5 text-purple-500" />
                  <span>AI Startup Knowledge Base</span>
                </h3>
                <p className="text-xs text-slate-450 mt-1 font-medium">The structured details extracted from your documents, used to power customized mentor dialogues.</p>
              </div>
              <span className="inline-flex items-center space-x-1.5 text-xs text-purple-600 font-semibold bg-purple-50 border border-purple-100/40 px-3 py-1 rounded-full shrink-0">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span>Auto Sync Active</span>
              </span>
            </div>

            {documents.length === 0 ? (
              <div className="p-12 text-center">
                <Database className="w-12 h-12 text-slate-350 mx-auto mb-3" />
                <h4 className="font-bold text-sm text-slate-800">Knowledge Base is Empty</h4>
                <p className="text-xs text-slate-450 mt-1.5 max-w-sm mx-auto font-medium">
                  Upload pitch decks, financial sheets, or interviews in the **Documents** tab to populate your AI Knowledge Base.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {documents.map((doc) => {
                  if (!doc.extractedSummary) return null;
                  return (
                    <div 
                      key={doc.id}
                      className="border border-zinc-150 bg-white rounded-3xl p-5 space-y-4 relative hover:shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:border-indigo-100/50 transition-all duration-300 group"
                    >
                      <span className="absolute top-4 right-5 text-[8px] font-mono text-slate-400 uppercase tracking-wide font-bold">
                        SRC: {doc.title.substring(0, 10)}...
                      </span>

                      <div>
                        <span className="text-[9px] font-bold text-purple-600 tracking-wider uppercase flex items-center space-x-1 font-mono">
                          <Sparkles className="w-3 h-3 animate-pulse" />
                          <span>{doc.category} Extract</span>
                        </span>
                        <h4 className="text-xs font-bold text-slate-800 mt-2.5 uppercase tracking-wide">Problem Context</h4>
                        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed font-medium">{doc.extractedSummary.problemStatement}</p>
                      </div>

                      <div className="pt-3 border-t border-zinc-50">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Target Audience</span>
                        <p className="text-xs text-slate-655 mt-1 font-semibold">{doc.extractedSummary.targetAudience}</p>
                      </div>

                      <div className="pt-3 border-t border-zinc-50">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Revenue & Model Strategy</span>
                        <p className="text-xs text-slate-655 mt-1 font-semibold">{doc.extractedSummary.revenueModel}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'team' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-3xl border border-zinc-150/80 p-6 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-50 mb-5">
                <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider">Founders & Members Roster</h3>
                <button
                  onClick={() => setShowAddMember(!showAddMember)}
                  className="inline-flex items-center space-x-1.5 text-xs px-3.5 py-2 bg-gradient-to-tr from-indigo-500 to-purple-500 text-white rounded-xl font-semibold hover:opacity-95 transition-opacity shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Member</span>
                </button>
              </div>

              {showAddMember && (
                <form onSubmit={handleAddTeamMember} className="bg-slate-50/50 p-5 rounded-2xl border border-zinc-200/50 mb-5 space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 mb-1.5 uppercase tracking-wide">Full Name</label>
                      <input 
                        type="text"
                        value={newMember.name}
                        onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                        className="w-full text-xs border border-zinc-200 rounded-xl p-3 bg-white outline-none focus:ring-1 focus:ring-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 mb-1.5 uppercase tracking-wide">Company Role</label>
                      <input 
                        type="text"
                        value={newMember.role}
                        onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                        className="w-full text-xs border border-zinc-200 rounded-xl p-3 bg-white outline-none focus:ring-1 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 mb-1.5 uppercase tracking-wide">Short Bio</label>
                    <textarea 
                      rows={2}
                      value={newMember.bio}
                      onChange={(e) => setNewMember({...newMember, bio: e.target.value})}
                      className="w-full text-xs border border-zinc-200 rounded-xl p-3 bg-white outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                    />
                  </div>
                  <div className="flex justify-end space-x-2 pt-2">
                    <button 
                      type="button"
                      onClick={() => setShowAddMember(false)}
                      className="text-xs px-3.5 py-2 border border-zinc-200 rounded-xl text-slate-700 hover:bg-slate-50 font-bold bg-white"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="text-xs px-3.5 py-2 bg-indigo-650 hover:bg-indigo-755 text-white rounded-xl font-bold shadow-sm"
                    >
                      Save Member
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-4">
                {teamMembers.map((member) => (
                  <div key={member.id} className="p-4 rounded-2xl border border-zinc-150 flex items-start space-x-4 bg-[#F9F9FB] hover:border-zinc-250 transition duration-300">
                    <div className="w-10 h-10 bg-gradient-to-tr from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center font-bold text-indigo-600 shrink-0 text-xs uppercase shadow-sm border border-indigo-200/20">
                      {member.name.substring(0, 2)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{member.name}</h4>
                      <span className="text-[9px] font-bold text-slate-400 block tracking-wider uppercase mt-0.5">{member.role}</span>
                      <p className="text-xs text-slate-500 mt-2.5 leading-relaxed font-medium">{member.bio}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-zinc-150/80 p-6 space-y-4 h-fit shadow-sm">
            <h3 className="font-bold text-xs text-slate-800 border-b border-zinc-50 pb-2.5 uppercase tracking-wide">Structure & Equity Notes</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Establishing a clear vesting schedule is vital for early-stage teams. Ensure you draft a **Co-Founder Agreement** to allocate initial roles.
            </p>
            <div className="bg-[#FAF7F0] p-4 rounded-2xl border border-zinc-200/50">
              <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider font-mono">Key Recommendation</span>
              <p className="text-[11px] text-slate-655 mt-1.5 font-medium leading-relaxed">
                Use the Document Generator wizard to write your co-founder equity splits.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Send, 
  Sparkles, 
  Download, 
  Paperclip,
  CheckCircle,
  HelpCircle,
  FileCheck,
  Zap
} from 'lucide-react';
import { MENTORS } from '../../mockData/fixtures';
import { db, type ChatMessage } from '../../lib/db';
import { useStartupStore } from '../../store/useStartupStore';
import { generateMentorResponse } from '../../lib/fake-ai';

export const ChatContainer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const mentor = MENTORS.find((m) => m.id === id);

  const store = useStartupStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState<any | null>(null);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mentor) navigate('/mentor');
    
    // Load historical messages from IndexedDB
    const loadHistory = async () => {
      if (!mentor) return;
      const history = await db.chats.where('mentorId').equals(mentor.id).sortBy('timestamp');
      
      if (history.length === 0) {
        // Seed initial greeting message
        const welcome: ChatMessage = {
          id: `welcome-${Date.now()}`,
          mentorId: mentor.id,
          sender: 'mentor',
          text: `Hello ${store.founderName}! I am ${mentor.name}, your ${mentor.role}. I've synchronized with your workspace records. How can I help you build today?`,
          timestamp: Date.now()
        };
        await db.chats.put(welcome);
        setMessages([welcome]);
      } else {
        setMessages(history);
      }
    };
    loadHistory();
  }, [mentor, navigate, store.founderName]);

  useEffect(() => {
    // Scroll to bottom
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!mentor) return null;

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `founder-${Date.now()}`,
      mentorId: mentor.id,
      sender: 'founder',
      text: textToSend,
      timestamp: Date.now()
    };

    // Save user message
    await db.chats.put(userMsg);
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);
    setActiveSuggestion(null);

    try {
      const allDocs = await db.documents.toArray();
      const aiReply = await generateMentorResponse(mentor.id, textToSend, store, allDocs);
      
      const mentorMsg: ChatMessage = {
        id: `mentor-${Date.now()}`,
        mentorId: mentor.id,
        sender: 'mentor',
        text: aiReply.text,
        timestamp: Date.now()
      };

      // Save mentor message
      await db.chats.put(mentorMsg);
      setMessages(prev => [...prev, mentorMsg]);
      
      if (aiReply.suggestedAction) {
        setActiveSuggestion(aiReply.suggestedAction);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleExportChat = () => {
    const textContent = messages
      .map(m => `[${m.sender === 'founder' ? 'Founder' : mentor.name}] (${new Date(m.timestamp).toLocaleTimeString()}):\n${m.text}\n`)
      .join('\n');
    
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${mentor.id}_chat_transcript.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto h-[80vh] flex flex-col bg-white rounded-3xl border border-zinc-150 shadow-[0_12px_45px_rgba(0,0,0,0.02)] overflow-hidden">
      {/* Chat Header */}
      <div 
        className="border-b border-zinc-100 p-5 bg-white flex items-center justify-between shrink-0 relative"
      >
        {/* Subtle top indicator bar representing mentor color */}
        <div style={{ backgroundColor: mentor.color }} className="absolute top-0 left-0 right-0 h-1" />

        <div className="flex items-center space-x-3.5">
          <Link to="/mentor" className="p-2 text-slate-450 hover:text-slate-800 rounded-xl hover:bg-slate-50 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h3 className="font-bold text-sm text-slate-800 tracking-tight">{mentor.name}</h3>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-mono">{mentor.role}</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Active referenced documents count info */}
          <span className="hidden md:inline-flex items-center text-[9px] font-bold text-slate-500 bg-slate-50 border border-zinc-200/50 px-3 py-1 rounded-full font-mono">
            SYNCED: {mentor.knowsAbout.join(', ')}
          </span>
          <button 
            onClick={handleExportChat}
            className="p-2 text-slate-450 hover:text-slate-800 rounded-xl hover:bg-slate-50 transition-colors"
            title="Export Transcript"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Viewport */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#FAF9F6]">
        {messages.map((m) => {
          const isUser = m.sender === 'founder';
          return (
            <div 
              key={m.id}
              className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[78%] p-4 rounded-2xl text-xs leading-relaxed shadow-[0_2px_8px_rgba(0,0,0,0.015)] border
                  ${isUser 
                    ? 'bg-slate-900 text-white rounded-tr-none border-slate-900 shadow-sm' 
                    : 'bg-white text-slate-700 rounded-tl-none border-zinc-150/80 border-l-4 border-l-purple-500'}
                `}
              >
                {/* AI generated star indicator */}
                {!isUser && (
                  <span className="inline-flex items-center space-x-1 text-[8.5px] font-bold text-purple-600 bg-purple-50 border border-purple-100/40 px-2 py-0.5 rounded-full uppercase tracking-wider mb-2.5 font-mono">
                    <Sparkles className="w-2.5 h-2.5 animate-pulse" />
                    <span>AI Consultation</span>
                  </span>
                )}
                <p className="whitespace-pre-wrap font-medium">{m.text}</p>
                <span className={`text-[8px] mt-2 block text-right font-mono font-bold
                  ${isUser ? 'text-indigo-100/60' : 'text-slate-400'}
                `}>
                  {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}

        {/* Suggestion actions block */}
        {activeSuggestion && (
          <div className="flex justify-start">
            <div className="max-w-[78%] border-l-4 border-amber-500 bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] p-5 border border-zinc-150/80 space-y-3.5">
              <span className="text-[9px] font-bold text-amber-600 uppercase tracking-wider font-mono flex items-center space-x-1.5 bg-amber-50 px-2.5 py-0.5 rounded-full w-fit border border-amber-100/30">
                <Zap className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                <span>Mentor Action Request</span>
              </span>
              <p className="text-xs text-slate-650 leading-relaxed font-medium">
                Based on our chat, I recommend invoking this operational step in your dashboard:
              </p>
              
              {activeSuggestion.type === 'generate_doc' ? (
                <Link
                  to={`/generator`}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition duration-300 shadow-sm"
                >
                  <span>{activeSuggestion.label}</span>
                </Link>
              ) : activeSuggestion.type === 'journey_level' ? (
                <Link
                  to={`/journey/level/${activeSuggestion.id}`}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 bg-amber-500 text-white text-xs font-bold rounded-xl hover:bg-amber-600 transition duration-300 shadow-sm"
                >
                  <span>{activeSuggestion.label}</span>
                </Link>
              ) : (
                <Link
                  to={`/builder`}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-500 text-white text-xs font-bold rounded-xl hover:bg-emerald-600 transition duration-300 shadow-sm"
                >
                  <span>{activeSuggestion.label}</span>
                </Link>
              )}
            </div>
          </div>
        )}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.015)] border border-zinc-150/60 p-3.5 flex items-center space-x-1.5">
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggested Quick Starters */}
      {messages.length <= 1 && (
        <div className="p-3.5 bg-white border-t border-zinc-100 flex flex-wrap gap-2 shrink-0">
          {mentor.starterPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSendMessage(prompt)}
              className="text-xs bg-slate-50 border border-zinc-200/50 rounded-full px-4 py-2 hover:border-zinc-300 hover:bg-slate-100 transition-all duration-300 text-slate-600 font-semibold"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input panel */}
      <div className="p-4 border-t border-zinc-100 bg-white shrink-0 flex items-center space-x-3">
        <button className="p-2.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-50 transition-colors">
          <Paperclip className="w-4 h-4" />
        </button>
        
        <input 
          type="text" 
          placeholder={`Type message to ${mentor.name}...`}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
          className="flex-1 text-xs border border-zinc-200 rounded-xl p-3 outline-none focus:ring-1 focus:ring-slate-900 bg-[#F9F9FB] font-medium"
        />

        <button 
          onClick={() => handleSendMessage(inputText)}
          className="p-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition duration-300 shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
export default ChatContainer;

import React, { useState } from 'react';
import { Play, CheckCircle, BookOpen, Clock, FileText, HelpCircle } from 'lucide-react';
import { ACADEMY_CURRICULUM } from '../../mockData/fixtures';

export const AcademyHome: React.FC = () => {
  const [curriculum, setCurriculum] = useState(ACADEMY_CURRICULUM);
  const [selectedLesson, setSelectedLesson] = useState(ACADEMY_CURRICULUM[0].lessons[2]); // Default problem definition lesson

  const toggleLessonComplete = (moduleId: string, lessonId: string) => {
    setCurriculum(prev => prev.map(mod => {
      if (mod.id !== moduleId) return mod;
      return {
        ...mod,
        lessons: mod.lessons.map(les => 
          les.id === lessonId ? { ...les, completed: !les.completed } : les
        )
      };
    }));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-bold text-ink-900 flex items-center space-x-2">
          <BookOpen className="w-6 h-6 text-ink-700" />
          <span>Startup Learning Academy</span>
        </h2>
        <p className="text-xs text-slate-500 font-mono mt-0.5">
          Structured startup business school, video lectures, and validation assignments.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lesson Video Viewport */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900 aspect-video rounded-2xl border border-slate-800 flex items-center justify-center relative overflow-hidden group shadow-lg">
            {/* Mock Player Screen */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent flex flex-col justify-end p-5 text-white">
              <span className="text-[10px] text-accent-amber font-mono font-bold uppercase tracking-wider">
                ACTIVE LECTURE: {selectedLesson.duration}
              </span>
              <h3 className="text-lg font-bold mt-1 font-sans">{selectedLesson.title}</h3>
            </div>
            
            <button 
              onClick={() => alert('Lectures are pre-recorded mock videos for demonstration. In production, this plays a responsive streaming video.')}
              className="w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-md transition group-hover:scale-105"
            >
              <Play className="w-8 h-8 fill-current ml-1" />
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-400 font-mono uppercase">Lecture Details</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              This session covers the target concepts of the startup operating cycle. Review files, write checklists, and take the review assignment test inside your workspace milestones sheet.
            </p>
          </div>
        </div>

        {/* Modules Index list */}
        <div className="space-y-4">
          {curriculum.map((mod) => (
            <div key={mod.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
              <h3 className="font-bold text-xs text-ink-900 border-b border-slate-100 pb-2">{mod.title}</h3>
              <div className="space-y-2">
                {mod.lessons.map((les) => {
                  const isCurrent = les.id === selectedLesson.id;
                  return (
                    <div 
                      key={les.id}
                      className={`p-2.5 rounded-lg border text-xs flex items-center justify-between transition cursor-pointer
                        ${isCurrent ? 'bg-slate-50 border-slate-350' : 'bg-white border-slate-100 hover:border-slate-200'}
                      `}
                      onClick={() => setSelectedLesson(les)}
                    >
                      <div className="flex items-center space-x-2.5 shrink min-w-0 pr-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLessonComplete(mod.id, les.id);
                          }}
                          className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center transition shrink-0
                            ${les.completed ? 'bg-accent-green border-accent-green text-white' : 'border-slate-300 text-transparent hover:border-slate-400'}
                          `}
                        >
                          <CheckCircle className="w-3.5 h-3.5 fill-current" />
                        </button>
                        <span className={`truncate font-medium ${les.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                          {les.title}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-1 shrink-0 text-slate-400 font-mono text-[10px]">
                        <Clock className="w-3 h-3" />
                        <span>{les.duration}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default AcademyHome;

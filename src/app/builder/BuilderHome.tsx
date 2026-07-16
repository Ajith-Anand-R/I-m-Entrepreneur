import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Play, 
  CheckCircle, 
  Clock, 
  Plus, 
  Sparkles, 
  HelpCircle,
  Briefcase,
  BookOpen,
  FileCheck
} from 'lucide-react';
import { useStartupStore, type BuilderTask } from '../../store/useStartupStore';

export const BuilderHome: React.FC = () => {
  const { builderTasks, updateTaskStatus, addTask, recalculateScore } = useStartupStore();
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const task: BuilderTask = {
      id: `task-${Date.now()}`,
      title: newTaskTitle,
      status: 'not_started',
      aiRecommendationReason: 'Manually added by founder.'
    };

    addTask(task);
    setNewTaskTitle('');
    setShowAddTask(false);
    recalculateScore();
  };

  // Grouping
  const notStarted = builderTasks.filter((t) => t.status === 'not_started');
  const inProgress = builderTasks.filter((t) => t.status === 'in_progress');
  const completed = builderTasks.filter((t) => t.status === 'completed');

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-zinc-100 pb-5">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center space-x-2.5 tracking-tight">
            <Sparkles className="w-5.5 h-5.5 text-purple-500 animate-pulse" />
            <span>AI Startup Builder</span>
          </h2>
          <p className="text-xs text-slate-450 mt-1.5 font-medium">
            Task checklist automatically recommended based on gaps in your workspace documentation.
          </p>
        </div>

        <button
          onClick={() => setShowAddTask(!showAddTask)}
          className="mt-4 md:mt-0 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition duration-300 flex items-center space-x-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* AI Recommendation Banner */}
      <div className="bg-indigo-50/40 rounded-3xl border border-indigo-100/70 p-6 space-y-3.5 relative overflow-hidden shadow-sm">
        <div className="absolute right-0 top-0 p-6 opacity-[0.03] pointer-events-none">
          <Sparkles className="w-24 h-24 text-indigo-500" />
        </div>
        
        <div className="flex items-center space-x-1.5">
          <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
          <span className="text-[9px] font-bold text-indigo-650 uppercase tracking-wider font-mono">
            AI Operations Recommendation
          </span>
        </div>

        <h3 className="text-sm md:text-base font-bold text-slate-800 tracking-tight">
          Conduct Customer Interviews & Validate Refill Kiosk Location Demographics
        </h3>
        
        <p className="text-xs text-slate-500 leading-relaxed max-w-4xl font-medium">
          "I noticed you haven't uploaded customer interview logs or customer notes in your Documents folder. To unlock Level 5: Customer Validation on your Milestone map, you should interview 10 local retail outlet managers to secure operational permissions."
        </p>

        <div className="flex space-x-3 pt-1">
          <Link 
            to="/journey/level/5"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-850 flex items-center space-x-1 transition-colors"
          >
            <span>Proceed to Level 5 Activity</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Add Task Modal overlay */}
      {showAddTask && (
        <form onSubmit={handleAddTask} className="bg-white p-5 rounded-2xl border border-zinc-150 max-w-md space-y-4 shadow-sm">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Task Title</label>
            <input 
              type="text" 
              placeholder="e.g. Structure distribution licensing terms"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="w-full text-xs border border-zinc-200 rounded-xl p-3 bg-[#F9F9FB] outline-none focus:ring-1 focus:ring-slate-900 font-medium"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button 
              type="button" 
              onClick={() => setShowAddTask(false)}
              className="text-xs px-3.5 py-2 border border-zinc-200 text-slate-500 hover:bg-slate-50 rounded-xl font-bold transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="text-xs px-3.5 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-xl font-bold transition-all shadow-sm"
            >
              Add Task
            </button>
          </div>
        </form>
      )}

      {/* Kanban Column Boards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Column 1: Not Started */}
        <div className="space-y-5">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <h3 className="font-bold text-sm text-slate-850 flex items-center space-x-2.5">
              <span className="w-2 h-2 rounded-full bg-rose-400"></span>
              <span>Not Started</span>
            </h3>
            <span className="text-[10px] font-mono font-bold text-rose-500 bg-rose-50 border border-rose-100/30 px-2 py-0.5 rounded-full">
              {notStarted.length}
            </span>
          </div>

          <div className="space-y-4">
            {notStarted.length === 0 ? (
              <p className="text-xs text-slate-400 py-8 text-center italic font-medium">No tasks pending</p>
            ) : (
              notStarted.map(task => (
                <div key={task.id} className="bg-white p-5 rounded-2xl border border-zinc-150/80 hover:border-zinc-250 hover:shadow-[0_8px_30px_rgba(0,0,0,0.015)] transition-all duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.005)] space-y-3.5">
                  <h4 className="font-bold text-xs text-slate-800 leading-relaxed tracking-tight">{task.title}</h4>
                  
                  {task.aiRecommendationReason && (
                    <p className="text-[10px] text-slate-450 leading-relaxed italic font-medium">
                      "{task.aiRecommendationReason}"
                    </p>
                  )}

                  <div className="pt-3 border-t border-zinc-50 flex justify-between items-center">
                    <span className="text-[8.5px] text-slate-400 font-mono">ID: {task.id.slice(0, 10)}</span>
                    <button
                      onClick={() => updateTaskStatus(task.id, 'in_progress')}
                      className="inline-flex items-center space-x-1 text-[10px] text-amber-500 hover:text-amber-600 font-bold transition-colors"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Start Task</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 2: In Progress */}
        <div className="space-y-5">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <h3 className="font-bold text-sm text-slate-850 flex items-center space-x-2.5">
              <span className="w-2 h-2 rounded-full bg-amber-450 animate-pulse"></span>
              <span>In Progress</span>
            </h3>
            <span className="text-[10px] font-mono font-bold text-amber-500 bg-amber-50 border border-amber-100/30 px-2 py-0.5 rounded-full">
              {inProgress.length}
            </span>
          </div>

          <div className="space-y-4">
            {inProgress.length === 0 ? (
              <p className="text-xs text-slate-400 py-8 text-center italic font-medium">No tasks in progress</p>
            ) : (
              inProgress.map(task => (
                <div key={task.id} className="bg-white p-5 rounded-2xl border border-zinc-200/80 hover:shadow-[0_8px_30px_rgba(0,0,0,0.015)] transition-all duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.005)] space-y-3.5">
                  <h4 className="font-bold text-xs text-slate-800 leading-relaxed tracking-tight">{task.title}</h4>
                  
                  {task.linkedTo && (
                    <div className="flex items-center space-x-1.5 text-[9px] text-slate-500 font-bold bg-slate-50 border border-zinc-200/40 px-2 py-0.5 rounded-full w-fit">
                      {task.linkedTo.type === 'level' ? <BookOpen className="w-3 h-3 text-amber-500" /> : <Briefcase className="w-3 h-3 text-indigo-500" />}
                      <span>Linked to {task.linkedTo.type === 'level' ? `Level ${task.linkedTo.id}` : `doc:${task.linkedTo.id}`}</span>
                    </div>
                  )}

                  <div className="pt-3 border-t border-zinc-50 flex justify-between items-center">
                    <span className="text-[8.5px] text-slate-400 font-mono flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
                      <span>Working...</span>
                    </span>
                    <button
                      onClick={() => updateTaskStatus(task.id, 'completed')}
                      className="inline-flex items-center space-x-1 text-[10px] text-emerald-500 hover:text-emerald-600 font-bold transition-colors"
                    >
                      <CheckCircle className="w-3 h-3" />
                      <span>Complete</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 3: Completed */}
        <div className="space-y-5">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <h3 className="font-bold text-sm text-slate-850 flex items-center space-x-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-450"></span>
              <span>Completed</span>
            </h3>
            <span className="text-[10px] font-mono font-bold text-emerald-500 bg-emerald-50 border border-emerald-100/30 px-2 py-0.5 rounded-full">
              {completed.length}
            </span>
          </div>

          <div className="space-y-4">
            {completed.length === 0 ? (
              <p className="text-xs text-slate-400 py-8 text-center italic font-medium">No tasks completed yet</p>
            ) : (
              completed.map(task => (
                <div key={task.id} className="bg-slate-50/50 p-5 rounded-2xl border border-zinc-150 shadow-[0_1px_4px_rgba(0,0,0,0.002)] opacity-75 space-y-3">
                  <h4 className="font-bold text-xs text-slate-500 line-through leading-relaxed tracking-tight">{task.title}</h4>
                  
                  <div className="flex justify-between items-center pt-2.5 border-t border-zinc-100/50">
                    <span className="inline-flex items-center space-x-1 text-[9px] text-emerald-600 font-bold bg-emerald-50 border border-emerald-100/40 px-2 py-0.5 rounded-full font-mono">
                      <CheckCircle className="w-3 h-3" />
                      <span>COMPLETED</span>
                    </span>
                    <span className="text-[8.5px] text-slate-400 font-mono">Approved</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
export default BuilderHome;

// Helper to make planning redirect work
const ArrowRight: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
);

import React, { useState } from 'react';
import { Calendar, Clock, Video, Plus, CheckCircle, HelpCircle, FileText } from 'lucide-react';
import { MENTORS } from '../../mockData/fixtures';

export const MeetingsList: React.FC = () => {
  const [meetings, setMeetings] = useState([
    {
      id: 'm-1',
      mentorName: 'Sarah Jenkins',
      role: 'Startup Coach',
      date: 'Friday, July 17',
      time: '11:00 AM - 11:30 AM',
      type: 'Mock Pitch Review',
      completed: false,
      notes: 'Prepare slide 3 market calculations TAM/SAM/SOM.'
    },
    {
      id: 'm-2',
      mentorName: 'Clara Dupont',
      role: 'Financial Analyst',
      date: 'Tuesday, July 14',
      time: '04:00 PM - 04:45 PM',
      type: 'Runway Forecast Audit',
      completed: true,
      notes: 'Analyzed kiosk amortization schedule. Approved unit margins formulas.'
    }
  ]);

  const [showSchedule, setShowSchedule] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(MENTORS[0].id);
  const [meetingType, setMeetingType] = useState('Workspace Feasibility Check');
  const [meetingDate, setMeetingDate] = useState('Monday, July 20');
  const [meetingTime, setMeetingTime] = useState('02:00 PM');

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const mentorObj = MENTORS.find(m => m.id === selectedMentor);
    if (!mentorObj) return;

    setMeetings(prev => [
      {
        id: `m-${Date.now()}`,
        mentorName: mentorObj.name,
        role: mentorObj.role,
        date: meetingDate,
        time: `${meetingTime} - ${meetingTime.replace(/PM|AM/, '')}:30 PM`,
        type: meetingType,
        completed: false,
        notes: 'Initial strategy consult session.'
      },
      ...prev
    ]);
    setShowSchedule(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-ink-900 flex items-center space-x-2">
            <Calendar className="w-6 h-6 text-ink-700" />
            <span>Consultation Sessions</span>
          </h2>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Book mock pitches, financial audits, or compliance reviews with your mentors.
          </p>
        </div>

        <button
          onClick={() => setShowSchedule(!showSchedule)}
          className="mt-4 md:mt-0 px-4 py-2 bg-ink-900 text-white rounded-lg text-xs font-bold hover:bg-ink-700 transition flex items-center space-x-1.5 shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Book Session</span>
        </button>
      </div>

      {showSchedule && (
        <form onSubmit={handleSchedule} className="bg-white rounded-xl border border-slate-200 p-5 max-w-lg space-y-4 shadow-sm">
          <h3 className="font-bold text-sm text-ink-900 border-b border-slate-100 pb-2">Schedule Appointment</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Select Mentor</label>
              <select 
                value={selectedMentor}
                onChange={(e) => setSelectedMentor(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded p-2 outline-none bg-white cursor-pointer"
              >
                {MENTORS.map(m => (
                  <option key={m.id} value={m.id}>{m.name} ({m.role})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Session Type</label>
              <input 
                type="text" 
                value={meetingType}
                onChange={(e) => setMeetingType(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded p-2 outline-none focus:ring-1 focus:ring-ink-700"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Date</label>
              <input 
                type="text" 
                placeholder="e.g. Monday, July 20"
                value={meetingDate}
                onChange={(e) => setMeetingDate(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded p-2 outline-none focus:ring-1 focus:ring-ink-700"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Preferred Time</label>
              <input 
                type="text" 
                placeholder="e.g. 02:00 PM"
                value={meetingTime}
                onChange={(e) => setMeetingTime(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded p-2 outline-none focus:ring-1 focus:ring-ink-700"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button 
              type="button" 
              onClick={() => setShowSchedule(false)}
              className="text-xs px-3 py-1.5 border border-slate-200 rounded text-slate-700 hover:bg-slate-50 font-bold"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="text-xs px-3 py-1.5 bg-ink-900 text-white rounded hover:bg-ink-700 font-bold shadow"
            >
              Confirm Appointment
            </button>
          </div>
        </form>
      )}

      {/* Appointment lists */}
      <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-sm">
        {meetings.map((m) => (
          <div 
            key={m.id} 
            className={`p-5 flex flex-col md:flex-row md:items-start justify-between hover:bg-slate-50/50 transition
              ${m.completed ? 'bg-slate-50/20' : 'bg-white'}
            `}
          >
            <div className="flex items-start space-x-3.5">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0
                ${m.completed ? 'bg-slate-150 text-slate-400' : 'bg-accent-teal/15 text-accent-teal'}
              `}>
                <Video className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-bold text-sm text-ink-900 leading-snug">{m.mentorName}</h4>
                  <span className="text-[9px] px-2 py-0.5 rounded bg-slate-100 text-slate-500 font-mono font-bold uppercase">{m.role}</span>
                </div>
                <span className="text-xs font-semibold text-ink-700 block">{m.type}</span>
                
                {m.notes && (
                  <p className="text-xs text-slate-500 mt-2 italic leading-relaxed">
                    "Notes: {m.notes}"
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 md:mt-0 flex flex-col items-end shrink-0 space-y-1.5 text-right">
              <span className="text-xs font-bold text-ink-900 flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-slate-450" />
                <span>{m.date}</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{m.time}</span>
              </span>
              {m.completed ? (
                <span className="inline-flex items-center space-x-0.5 text-[10px] text-accent-green font-bold bg-accent-green/10 px-2 py-0.5 rounded-full mt-2">
                  <CheckCircle className="w-3.5 h-3.5 fill-current" />
                  <span>Completed</span>
                </span>
              ) : (
                <button
                  onClick={() => alert('Launching video session window mock...')}
                  className="px-3 py-1 bg-ink-900 text-white rounded text-[10px] font-bold hover:bg-ink-700 transition shadow"
                >
                  Join Call
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default MeetingsList;

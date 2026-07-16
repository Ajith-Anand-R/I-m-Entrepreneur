import React from 'react';
import { useStartupStore } from '../../store/useStartupStore';
import { Settings, Shield, RefreshCw, LogOut, Bell, Sparkles } from 'lucide-react';

export const SettingsScreen: React.FC = () => {
  const { founderName, startupName, resetState } = useStartupStore();

  const handleReset = () => {
    if (confirm('Are you sure you want to reset the app? This will clear all custom workspace uploads and reset the journey to default level 3.')) {
      resetState();
      alert('Application reset successfully.');
      window.location.reload();
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-bold text-ink-900 flex items-center space-x-2">
          <Settings className="w-6 h-6 text-ink-700" />
          <span>Account Settings</span>
        </h2>
        <p className="text-xs text-slate-500 font-mono mt-0.5">
          Control interface variables, notification settings, and mock databases.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 divide-y divide-slate-100 space-y-4">
        {/* Profile Card Summary */}
        <div className="pb-4 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-ink-900">Active Profile</h3>
            <p className="text-xs text-slate-500 mt-1">{founderName} @ {startupName}</p>
          </div>
          <span className="text-[10px] bg-accent-teal/10 text-accent-teal px-2 py-0.5 rounded font-mono font-bold">FOUNDER</span>
        </div>

        {/* Notifications Checkboxes */}
        <div className="py-4 space-y-3">
          <h3 className="font-bold text-sm text-ink-900 flex items-center space-x-1.5">
            <Bell className="w-4 h-4 text-slate-500" />
            <span>Preferences</span>
          </h3>
          <div className="space-y-2">
            <label className="flex items-center space-x-3 text-xs text-slate-600 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded border-slate-350 text-ink-900 focus:ring-ink-700" />
              <span>Receive live AI mentor check-in notifications</span>
            </label>
            <label className="flex items-center space-x-3 text-xs text-slate-600 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded border-slate-350 text-ink-900 focus:ring-ink-700" />
              <span>Allow physical book scan sync events</span>
            </label>
          </div>
        </div>

        {/* System Reset actions */}
        <div className="pt-4 space-y-3">
          <h3 className="font-bold text-sm text-ink-900 flex items-center space-x-1.5">
            <Shield className="w-4 h-4 text-slate-500" />
            <span>Developer Sandbox Controls</span>
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Since this app runs fully on local state (`localStorage` / IndexedDB), you can reset the entire database below to reload default demo variables.
          </p>
          <button 
            onClick={handleReset}
            className="inline-flex items-center space-x-1.5 px-4 py-2 border border-accent-coral text-accent-coral hover:bg-accent-coral/5 rounded-lg text-xs font-bold transition shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset Demo Sandbox</span>
          </button>
        </div>
      </div>
    </div>
  );
};
export default SettingsScreen;

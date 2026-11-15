import React from 'react';
import { 
  Heart, 
  ShieldCheck, 
  KeyRound, 
  AlertTriangle, 
  Bell, 
  FileText, 
  Sparkles,
  Volume2
} from 'lucide-react';

export default function Header({ 
  currentProfile, 
  onOpenPasscodeModal, 
  onTriggerSos, 
  onOpenDoctorReport,
  onOpenNotifications,
  unreadNotificationsCount = 0,
  mode,
  setMode
}) {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
            <Heart className="w-7 h-7 fill-white/20 stroke-white stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-2xl text-slate-900 tracking-tight">CareBridge</span>
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-teal-100 text-teal-800 border border-teal-200">
                Connected Care
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium hidden sm:block">
              Smart Elderly Care &amp; Medication Ecosystem
            </p>
          </div>
        </div>

        {/* Center Mode Switcher (Senior View vs Care Circle Hub) */}
        <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
          <button
            onClick={() => setMode('senior')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
              mode === 'senior'
                ? 'bg-white text-sky-700 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>👵</span> Senior Mode
          </button>
          <button
            onClick={() => setMode('caretaker')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
              mode === 'caretaker'
                ? 'bg-white text-teal-700 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🧑‍⚕️</span> Care Circle Hub
          </button>
        </div>

        {/* Action Controls & Passcode Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Notification Center Trigger */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
            title="Email Notifications & Dispatch Log"
          >
            <Bell className="w-5 h-5 text-slate-600" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white rounded-full text-xs font-bold flex items-center justify-center animate-pulse">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Doctor Report Modal Trigger */}
          <button
            onClick={onOpenDoctorReport}
            className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:border-sky-300 bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-700 text-sm font-semibold transition-colors shadow-xs"
            title="Generate Printable Health Summary for Doctor Visit"
          >
            <FileText className="w-4 h-4 text-sky-600" />
            <span>Doctor Report</span>
          </button>

          {/* Passcode / Active Role Profile Button */}
          <button
            onClick={onOpenPasscodeModal}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors"
          >
            <img 
              src={currentProfile?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250'} 
              alt={currentProfile?.name}
              className="w-8 h-8 rounded-full object-cover border border-slate-300" 
            />
            <div className="text-left hidden lg:block">
              <p className="text-xs font-bold text-slate-800 leading-none">{currentProfile?.name}</p>
              <p className="text-[10px] font-semibold text-slate-500 leading-none mt-1 capitalize flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-teal-600" />
                {currentProfile?.role === 'elder' ? 'Senior' : currentProfile?.role}
              </p>
            </div>
            <KeyRound className="w-4 h-4 text-slate-400" />
          </button>

          {/* SOS Emergency Button */}
          <button
            onClick={onTriggerSos}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-extrabold text-sm shadow-md shadow-rose-500/25 transition-all hover:scale-105 active:scale-95"
          >
            <AlertTriangle className="w-4 h-4 animate-bounce" />
            <span>SOS</span>
          </button>

        </div>

      </div>
    </header>
  );
}

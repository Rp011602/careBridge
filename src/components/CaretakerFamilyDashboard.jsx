import React, { useState } from 'react';
import { 
  Pill, 
  Calendar, 
  TrendingUp, 
  Activity, 
  MessageSquare, 
  Bell, 
  Clock, 
  ShieldCheck, 
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Smile,
  Mail,
  Zap,
  Users
} from 'lucide-react';

import MedicationManager from './MedicationManager';
import AppointmentManager from './AppointmentManager';
import AdherenceAnalytics from './AdherenceAnalytics';
import VitalsTracker from './VitalsTracker';
import CaregiverNotes from './CaregiverNotes';

export default function CaretakerFamilyDashboard({
  currentProfile,
  elderProfile,
  medications,
  adherenceLogs,
  appointments,
  vitals,
  caregiverNotes,
  notifications,
  onAddMedication,
  onUpdateMedication,
  onDeleteMedication,
  onRefillMedication,
  onAddAppointment,
  onUpdateAppointment,
  onDeleteAppointment,
  onAddVitals,
  onAddNote,
  onRecordAdherence,
  onOpenNotifications,
}) {
  const [activeTab, setActiveTab] = useState('overview');

  const todayStr = new Date().toISOString().split('T')[0];
  const totalMedsToday = medications.filter((m) => m.timing !== 'As Needed').length;
  const takenMedsToday = adherenceLogs.filter((l) => l.date === todayStr && l.status === 'taken').length;
  const adherenceTodayPct = totalMedsToday ? Math.round((takenMedsToday / totalMedsToday) * 100) : 100;

  const lowStockMeds = medications.filter((m) => m.remainingPills <= (m.refillThreshold || 7));
  const nextAppointment = appointments[0];
  const latestVitals = vitals[0] || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fade-in">
      
      {/* Top Profile & Role Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={elderProfile?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250'}
              alt={elderProfile?.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-200 shadow-xs"
            />
            <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full" title="Monitored Patient" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-extrabold font-heading text-slate-900">
                {elderProfile?.name || 'Eleanor Vance'}
              </h1>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
                Age {elderProfile?.age || 78} &bull; Blood {elderProfile?.bloodGroup || 'O+'}
              </span>
            </div>

            <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
              <span>Conditions: <strong>{(elderProfile?.conditions || []).join(', ')}</strong></span>
            </p>
          </div>
        </div>

        {/* Current Active Persona Badge & Proactive AI Mailer Trigger */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-2.5">
            <img
              src={currentProfile?.avatar}
              alt={currentProfile?.name}
              className="w-9 h-9 rounded-xl object-cover"
            />
            <div className="text-left text-xs">
              <p className="font-bold text-slate-900">{currentProfile?.name}</p>
              <p className="text-[11px] font-semibold text-teal-700 capitalize">
                {currentProfile?.title || currentProfile?.role}
              </p>
            </div>
          </div>

          <button
            onClick={onOpenNotifications}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-sky-500/20 transition-all hover:scale-105"
          >
            <Mail className="w-4 h-4" />
            <span>Email Engine ({notifications.length} Logs)</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200">
        {[
          { id: 'overview', label: 'Overview Hub', icon: ShieldCheck },
          { id: 'medications', label: `Medications (${medications.length})`, icon: Pill },
          { id: 'appointments', label: `Appointments (${appointments.length})`, icon: Calendar },
          { id: 'adherence', label: 'Adherence Analytics', icon: TrendingUp },
          { id: 'vitals', label: 'Vitals & Biometrics', icon: Activity },
          { id: 'notes', label: `Care Circle Wall (${caregiverNotes.length})`, icon: MessageSquare },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-white text-slate-600 border-transparent hover:border-slate-200 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: Overview Hub */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Key Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Today's Adherence */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Today's Adherence</p>
                <h3 className="text-3xl font-extrabold font-heading text-slate-900 mt-1">
                  {takenMedsToday} / {totalMedsToday}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {adherenceTodayPct}% doses completed
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-sm shadow-xs">
                {adherenceTodayPct}%
              </div>
            </div>

            {/* Senior Wellbeing */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Latest Check-In</p>
                <h3 className="text-xl font-extrabold font-heading text-slate-900 mt-1">
                  {elderProfile?.lastCheckIn?.status || 'Feeling Good'}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {elderProfile?.lastCheckIn?.timestamp ? new Date(elderProfile.lastCheckIn.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '9:30 AM'}
                </p>
              </div>
              <div className="text-3xl">
                {elderProfile?.lastCheckIn?.emoji || '😊'}
              </div>
            </div>

            {/* Blood Pressure */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Latest Blood Pressure</p>
                <h3 className="text-2xl font-extrabold font-heading text-slate-900 mt-1">
                  {latestVitals.bloodPressure || '124/80'}
                </h3>
                <p className="text-xs text-emerald-600 font-semibold mt-1">
                  Pulse: {latestVitals.heartRate || 72} BPM
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shadow-xs">
                <Activity className="w-6 h-6" />
              </div>
            </div>

            {/* Next Doctor Visit */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Next Consultation</p>
                <h3 className="text-lg font-extrabold font-heading text-slate-900 mt-1 truncate max-w-[140px]">
                  {nextAppointment?.doctorName || 'Dr. Chen'}
                </h3>
                <p className="text-xs text-teal-700 font-bold mt-1">
                  {nextAppointment?.appointmentDate} ({nextAppointment?.appointmentTime})
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shadow-xs">
                <Calendar className="w-6 h-6" />
              </div>
            </div>

          </div>

          {/* Low Stock Warning Banner if any */}
          {lowStockMeds.length > 0 && (
            <div className="p-5 rounded-3xl bg-amber-50 border-2 border-amber-300 text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-200 text-amber-800 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-base">Prescription Refill Required</h4>
                  <p className="text-xs text-amber-800">
                    {lowStockMeds.map((m) => `${m.name} (${m.remainingPills} doses left)`).join(', ')} is under safety threshold.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('medications')}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors shrink-0"
              >
                Manage Stock &amp; Refill
              </button>
            </div>
          )}

          {/* Today's Schedule Overview & Quick Confirm */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Today's Dose Timetable */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-heading font-extrabold text-lg text-slate-900">
                  Today's Medication Doses
                </h3>
                <span className="text-xs font-semibold text-slate-500">
                  {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>

              <div className="space-y-3">
                {medications.map((med) => {
                  const log = adherenceLogs.find((l) => l.medId === med.id && l.date === todayStr);
                  const isTaken = log?.status === 'taken';

                  return (
                    <div
                      key={med.id}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center border font-bold text-xs shrink-0"
                          style={{
                            backgroundColor: med.pillColorHex || '#fff',
                            borderColor: med.pillBorderHex || '#cbd5e1',
                          }}
                        >
                          💊
                        </div>

                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 text-sm truncate">{med.name} {med.dosage}</p>
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {med.timing} ({med.timeStr})
                          </p>
                        </div>
                      </div>

                      {isTaken ? (
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 px-3 py-1.5 rounded-xl flex items-center gap-1 shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Taken
                        </span>
                      ) : (
                        <button
                          onClick={() => onRecordAdherence(med.id, 'taken', `Verified by ${currentProfile?.name}`)}
                          className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition-colors shrink-0 shadow-2xs"
                        >
                          Confirm Dose
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Handoff Snippet & Upcoming Visits */}
            <div className="space-y-6">
              
              {/* Next Appointment Card */}
              {nextAppointment && (
                <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-3xl p-6 border border-teal-200 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-teal-800">
                      Upcoming Consultation
                    </span>
                    <button
                      onClick={() => setActiveTab('appointments')}
                      className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-0.5"
                    >
                      View All <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4 className="font-heading font-extrabold text-xl text-slate-900">
                    {nextAppointment.doctorName}
                  </h4>
                  <p className="text-xs text-teal-800 font-bold mt-0.5">
                    {nextAppointment.specialty} &bull; {nextAppointment.appointmentDate} at {nextAppointment.appointmentTime}
                  </p>
                  <p className="text-xs text-slate-600 mt-2">
                    <strong>Ride:</strong> {nextAppointment.transportation}
                  </p>
                </div>
              )}

              {/* Latest Caregiver Note */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="font-heading font-bold text-base text-slate-900">
                    Latest Shift Handoff
                  </h3>
                  <button
                    onClick={() => setActiveTab('notes')}
                    className="text-xs font-bold text-sky-700 hover:underline flex items-center gap-0.5"
                  >
                    Open Wall <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {caregiverNotes[0] && (
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-bold text-xs text-slate-800">{caregiverNotes[0].author}</span>
                      <span className="text-[10px] text-slate-400">&bull; {caregiverNotes[0].category}</span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-3 italic">
                      "{caregiverNotes[0].text}"
                    </p>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>
      )}

      {/* TAB CONTENT: Medications */}
      {activeTab === 'medications' && (
        <MedicationManager
          medications={medications}
          onAddMedication={onAddMedication}
          onUpdateMedication={onUpdateMedication}
          onDeleteMedication={onDeleteMedication}
          onRefillMedication={onRefillMedication}
        />
      )}

      {/* TAB CONTENT: Appointments */}
      {activeTab === 'appointments' && (
        <AppointmentManager
          appointments={appointments}
          onAddAppointment={onAddAppointment}
          onUpdateAppointment={onUpdateAppointment}
          onDeleteAppointment={onDeleteAppointment}
        />
      )}

      {/* TAB CONTENT: Adherence */}
      {activeTab === 'adherence' && (
        <AdherenceAnalytics
          adherenceLogs={adherenceLogs}
          medications={medications}
        />
      )}

      {/* TAB CONTENT: Vitals */}
      {activeTab === 'vitals' && (
        <VitalsTracker
          vitals={vitals}
          onAddVitals={onAddVitals}
          currentProfile={currentProfile}
        />
      )}

      {/* TAB CONTENT: Notes */}
      {activeTab === 'notes' && (
        <CaregiverNotes
          notes={caregiverNotes}
          onAddNote={onAddNote}
          currentProfile={currentProfile}
        />
      )}

    </div>
  );
}

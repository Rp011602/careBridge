import React, { useState } from 'react';
import { 
  Check, 
  Volume2, 
  Clock, 
  Heart, 
  AlertCircle, 
  Smile, 
  Calendar, 
  Sparkles, 
  Info,
  PhoneCall,
  Utensils,
  Droplet
} from 'lucide-react';
import { speechService, playAlertTone } from '../utils/speech';

export default function SeniorModeView({
  elderProfile,
  medications,
  adherenceLogs,
  appointments,
  onRecordAdherence,
  onCheckIn,
  onTriggerSos,
}) {
  const [speakingMedId, setSpeakingMedId] = useState(null);
  const [isSpeakingGeneral, setIsSpeakingGeneral] = useState(false);
  const [justTakenId, setJustTakenId] = useState(null);

  // Group medications into time slots
  const morningMeds = medications.filter((m) => m.timing === 'Morning');
  const afternoonMeds = medications.filter((m) => m.timing === 'Afternoon');
  const eveningMeds = medications.filter((m) => m.timing === 'Evening' || m.timing === 'Bedtime');
  const asNeededMeds = medications.filter((m) => m.timing === 'As Needed');

  const todayStr = new Date().toISOString().split('T')[0];

  const getLogStatus = (medId) => {
    const log = adherenceLogs.find((l) => l.medId === medId && l.date === todayStr);
    return log ? log.status : 'pending';
  };

  const handleTakeMed = (med) => {
    playAlertTone('chime');
    setJustTakenId(med.id);
    onRecordAdherence(med.id, 'taken', 'Self-confirmed via Senior Mode');
    speechService.speak(`Wonderful job, ${elderProfile?.name?.split(' ')[0] || 'Eleanor'}! You have marked your ${med.name} as taken.`);
    setTimeout(() => setJustTakenId(null), 3000);
  };

  const handleSpeakMed = (med) => {
    setSpeakingMedId(med.id);
    const speechText = `Your ${med.name}, ${med.dosage}. Scheduled for ${med.timeStr}. ${med.withFood ? 'Please take with food or after a meal.' : 'Can be taken without food.'} Directions: ${med.instructions || 'Take with a glass of water.'}`;
    speechService.speak(speechText, () => setSpeakingMedId(null));
  };

  const handleSpeakDailyOverview = () => {
    setIsSpeakingGeneral(true);
    const pendingCount = medications.filter((m) => getLogStatus(m.id) !== 'taken' && m.timing !== 'As Needed').length;
    const nextApt = appointments[0];
    const text = `Good day ${elderProfile?.name?.split(' ')[0] || 'Eleanor'}! You have ${pendingCount} scheduled medication doses remaining for today. Your next doctor visit is with ${nextApt?.doctorName || 'Dr. Chen'} on ${nextApt?.appointmentDate || 'Wednesday'}. You are doing wonderful.`;
    speechService.speak(text, () => setIsSpeakingGeneral(false));
  };

  const handleMoodSelect = (status, emoji) => {
    onCheckIn(status, emoji);
    playAlertTone('chime');
    speechService.speak(`Thank you for checking in. We have notified your family and caregiver that you are feeling ${status}.`);
  };

  // Next doctor visit
  const nextAppointment = appointments[0];

  return (
    <div className="max-w-5xl mx-auto pb-16 pt-4 px-4 sm:px-6 space-y-8 animate-fade-in">
      
      {/* Warm Elderly-Centric Greeting Hero Card */}
      <div className="bg-gradient-to-r from-sky-600 via-sky-700 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 rounded-l-full pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img 
              src={elderProfile?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250'} 
              alt={elderProfile?.name} 
              className="w-20 h-20 rounded-3xl object-cover border-3 border-white/80 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold bg-white/20 text-sky-100 px-3 py-0.5 rounded-full backdrop-blur-xs">
                  Senior Ease Portal
                </span>
                <span className="text-xs text-sky-200">High Accessibility</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold font-heading tracking-tight mt-1">
                Hello, {elderProfile?.name || 'Eleanor'}! 🌸
              </h1>
              <p className="text-sky-100 text-base sm:text-lg mt-1 font-medium">
                Today is {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Voice Assistant Button for Senior */}
          <button
            onClick={handleSpeakDailyOverview}
            disabled={isSpeakingGeneral}
            className="flex items-center justify-center gap-3 bg-white hover:bg-sky-50 text-sky-800 font-extrabold px-6 py-4 rounded-2xl shadow-lg transition-transform hover:scale-105 active:scale-95 text-base sm:text-lg shrink-0"
          >
            <Volume2 className={`w-7 h-7 text-sky-600 ${isSpeakingGeneral ? 'animate-bounce' : ''}`} />
            <span>{isSpeakingGeneral ? 'Speaking...' : 'Listen to My Schedule'}</span>
          </button>
        </div>
      </div>

      {/* Daily Wellbeing & Mood Check-In Widget */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <Smile className="w-7 h-7 text-amber-500" />
            <h2 className="text-2xl font-bold font-heading text-slate-800">
              How are you feeling right now?
            </h2>
          </div>
          {elderProfile?.lastCheckIn && (
            <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-600 rounded-full">
              Last check: {elderProfile.lastCheckIn.status} {elderProfile.lastCheckIn.emoji}
            </span>
          )}
        </div>

        <p className="text-slate-500 text-base mb-5">
          Tap a face to let Marcus (caregiver) and Sarah (daughter) know how you feel:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: 'Feeling Great', emoji: '😊', color: 'hover:border-emerald-500 hover:bg-emerald-50' },
            { label: 'Doing Okay', emoji: '😌', color: 'hover:border-sky-500 hover:bg-sky-50' },
            { label: 'A Bit Dizzy', emoji: '😵', color: 'hover:border-amber-500 hover:bg-amber-50' },
            { label: 'In Pain', emoji: '🤕', color: 'hover:border-rose-500 hover:bg-rose-50' },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => handleMoodSelect(item.label, item.emoji)}
              className={`p-4 rounded-2xl border-2 border-slate-200 bg-slate-50 transition-all flex flex-col items-center justify-center gap-2 text-center group active:scale-95 ${item.color}`}
            >
              <span className="text-4xl group-hover:scale-125 transition-transform">{item.emoji}</span>
              <span className="text-base font-bold text-slate-800">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Visual Pill Box Sections */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 flex items-center gap-3">
            <span>💊</span> Today's Medication Box
          </h2>
          <span className="text-sm font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            Tap pill to hear directions
          </span>
        </div>

        {/* Morning Dose Section */}
        {morningMeds.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-amber-700 bg-amber-50/80 px-4 py-2 rounded-2xl border border-amber-200">
              <span className="text-xl">☀️</span>
              <h3 className="text-lg font-bold">Morning Medications</h3>
              <span className="text-xs bg-amber-200 text-amber-900 px-2 py-0.5 rounded-md font-semibold ml-auto">
                Breakfast Time
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {morningMeds.map((med) => (
                <SeniorPillCard
                  key={med.id}
                  med={med}
                  status={getLogStatus(med.id)}
                  isJustTaken={justTakenId === med.id}
                  isSpeaking={speakingMedId === med.id}
                  onTake={() => handleTakeMed(med)}
                  onSpeak={() => handleSpeakMed(med)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Afternoon Dose Section */}
        {afternoonMeds.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sky-800 bg-sky-50/80 px-4 py-2 rounded-2xl border border-sky-200">
              <span className="text-xl">🌤️</span>
              <h3 className="text-lg font-bold">Afternoon Medications</h3>
              <span className="text-xs bg-sky-200 text-sky-900 px-2 py-0.5 rounded-md font-semibold ml-auto">
                Lunch Time
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {afternoonMeds.map((med) => (
                <SeniorPillCard
                  key={med.id}
                  med={med}
                  status={getLogStatus(med.id)}
                  isJustTaken={justTakenId === med.id}
                  isSpeaking={speakingMedId === med.id}
                  onTake={() => handleTakeMed(med)}
                  onSpeak={() => handleSpeakMed(med)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Evening & Bedtime Section */}
        {eveningMeds.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-indigo-900 bg-indigo-50/80 px-4 py-2 rounded-2xl border border-indigo-200">
              <span className="text-xl">🌙</span>
              <h3 className="text-lg font-bold">Evening &amp; Bedtime Medications</h3>
              <span className="text-xs bg-indigo-200 text-indigo-900 px-2 py-0.5 rounded-md font-semibold ml-auto">
                Before Bed
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {eveningMeds.map((med) => (
                <SeniorPillCard
                  key={med.id}
                  med={med}
                  status={getLogStatus(med.id)}
                  isJustTaken={justTakenId === med.id}
                  isSpeaking={speakingMedId === med.id}
                  onTake={() => handleTakeMed(med)}
                  onSpeak={() => handleSpeakMed(med)}
                />
              ))}
            </div>
          </div>
        )}

        {/* As Needed Section */}
        {asNeededMeds.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-teal-800 bg-teal-50/80 px-4 py-2 rounded-2xl border border-teal-200">
              <span className="text-xl">🩺</span>
              <h3 className="text-lg font-bold">As Needed (PRN)</h3>
              <span className="text-xs bg-teal-200 text-teal-900 px-2 py-0.5 rounded-md font-semibold ml-auto">
                Take when experiencing symptoms
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {asNeededMeds.map((med) => (
                <SeniorPillCard
                  key={med.id}
                  med={med}
                  status={getLogStatus(med.id)}
                  isJustTaken={justTakenId === med.id}
                  isSpeaking={speakingMedId === med.id}
                  onTake={() => handleTakeMed(med)}
                  onSpeak={() => handleSpeakMed(med)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Simplified Upcoming Appointment Card */}
      {nextAppointment && (
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-3xl p-6 sm:p-7 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-200/70 px-2.5 py-0.5 rounded-md">
                Next Doctor Appointment
              </span>
              <h3 className="text-2xl font-bold font-heading text-slate-900 mt-0.5">
                {nextAppointment.doctorName}
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-emerald-200/60 text-slate-700">
            <div>
              <p className="text-xs font-semibold text-emerald-800 uppercase">When</p>
              <p className="text-lg font-bold text-slate-900">
                {nextAppointment.appointmentDate} at {nextAppointment.appointmentTime}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-emerald-800 uppercase">Where</p>
              <p className="text-sm font-medium text-slate-800">{nextAppointment.clinicName}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-emerald-800 uppercase">Companion &amp; Ride</p>
              <p className="text-sm font-bold text-teal-900">{nextAppointment.transportation}</p>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Help Contact Card */}
      <div className="bg-rose-50 border-2 border-rose-200 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-rose-500/20">
            <PhoneCall className="w-7 h-7" />
          </div>
          <div>
            <h4 className="text-xl font-bold text-rose-950 font-heading">Need Help Right Now?</h4>
            <p className="text-sm text-rose-800">
              Caretaker Marcus ({elderProfile?.emergencyPhone || '555-891-2345'}) is on call for you.
            </p>
          </div>
        </div>

        <button
          onClick={onTriggerSos}
          className="w-full sm:w-auto px-6 py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-extrabold text-base shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <span>Tap for Emergency SOS</span>
        </button>
      </div>

    </div>
  );
}

// Senior Pill Card Component with High-Legibility Visual Details
function SeniorPillCard({ med, status, isJustTaken, isSpeaking, onTake, onSpeak }) {
  const isTaken = status === 'taken';

  return (
    <div
      className={`rounded-3xl p-5 border-3 transition-all relative overflow-hidden ${
        isTaken
          ? 'bg-slate-50/90 border-slate-300 opacity-90'
          : 'bg-white border-slate-200 hover:border-sky-400 shadow-md hover:shadow-lg'
      }`}
    >
      {/* Visual Pill Indicator Badge */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          {/* Pill Graphic */}
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner border-2 shrink-0"
            style={{
              backgroundColor: med.pillColorHex || '#f1f5f9',
              borderColor: med.pillBorderHex || '#cbd5e1',
            }}
            title={`${med.pillColor} ${med.pillShape}`}
          >
            <span className="text-xs font-extrabold text-slate-800 font-mono">
              {med.pillShape?.includes('Inhaler') ? '💨' : '💊'}
            </span>
          </div>

          <div>
            <h4 className="text-xl font-extrabold text-slate-900 font-heading">
              {med.name}
            </h4>
            <p className="text-base font-bold text-sky-700">
              {med.dosage}
            </p>
          </div>
        </div>

        {/* Time of dose */}
        <div className="text-right">
          <span className="inline-flex items-center gap-1 font-bold text-sm text-slate-700 bg-slate-100 px-3 py-1 rounded-xl">
            <Clock className="w-3.5 h-3.5" />
            {med.timeStr}
          </span>
        </div>
      </div>

      {/* Pill Visual Label & Instructions */}
      <div className="space-y-1.5 mb-4 text-slate-600 text-sm">
        <p className="flex items-center gap-1.5 font-semibold text-slate-700">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: med.pillBorderHex || '#0284c7' }} />
          <span>Look for: <strong>{med.pillColor} {med.pillShape}</strong></span>
        </p>
        <p className="text-slate-600 line-clamp-2">
          {med.instructions || 'Take with water.'}
        </p>
        {med.withFood && (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
            <Utensils className="w-3 h-3" /> Take with food
          </span>
        )}
      </div>

      {/* Action Buttons: Voice read & 1-tap "I Took This" */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
        <button
          onClick={onSpeak}
          className={`p-3 rounded-2xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors ${
            isSpeaking ? 'bg-sky-100 text-sky-700' : ''
          }`}
          title="Read instructions aloud"
        >
          <Volume2 className="w-6 h-6" />
        </button>

        {isTaken ? (
          <div className="flex-1 py-3.5 px-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold text-base flex items-center justify-center gap-2">
            <Check className="w-6 h-6 stroke-[3]" />
            <span>Taken Today!</span>
          </div>
        ) : (
          <button
            onClick={onTake}
            className="flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-lg shadow-md shadow-emerald-600/25 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
          >
            <Check className="w-6 h-6 stroke-[3]" />
            <span>I Took This!</span>
          </button>
        )}
      </div>

      {isJustTaken && (
        <div className="absolute inset-0 bg-emerald-500/95 backdrop-blur-xs flex flex-col items-center justify-center text-white p-4 animate-fade-in z-20">
          <Sparkles className="w-12 h-12 mb-2 animate-bounce" />
          <p className="text-2xl font-extrabold font-heading">Great Job!</p>
          <p className="text-emerald-100 font-medium">Logged &amp; synced to Care Circle</p>
        </div>
      )}
    </div>
  );
}

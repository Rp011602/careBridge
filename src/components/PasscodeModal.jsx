import React, { useState } from 'react';
import { KeyRound, Shield, X, CheckCircle2, AlertCircle, User, Users, Stethoscope, HeartHandshake } from 'lucide-react';

export default function PasscodeModal({ 
  profiles, 
  currentProfile, 
  isOpen, 
  onClose, 
  onSelectProfile 
}) {
  const [selectedTargetProfile, setSelectedTargetProfile] = useState(currentProfile || profiles[0]);
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleKeyPress = (num) => {
    if (passcode.length < 6) {
      setPasscode((prev) => prev + num);
      setErrorMsg('');
    }
  };

  const handleDelete = () => {
    setPasscode((prev) => prev.slice(0, -1));
    setErrorMsg('');
  };

  const handleClear = () => {
    setPasscode('');
    setErrorMsg('');
  };

  const handleUnlock = async () => {
    if (!passcode) {
      setErrorMsg('Please enter the access passcode');
      return;
    }

    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileId: selectedTargetProfile.id,
          passcode: passcode.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg(`Welcome, ${data.profile.name}! Access granted.`);
        setTimeout(() => {
          onSelectProfile(data.profile);
          setPasscode('');
          setSuccessMsg('');
          onClose();
        }, 600);
      } else {
        setErrorMsg(data.message || 'Incorrect passcode. Try again.');
      }
    } catch (e) {
      setErrorMsg('Network error verifying passcode');
    }
  };

  // Quick fill for demo testing convenience
  const handleQuickSelect = (prof) => {
    setSelectedTargetProfile(prof);
    setPasscode(prof.passcode);
    setErrorMsg('');
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'elder':
        return <User className="w-5 h-5 text-sky-600" />;
      case 'caretaker':
        return <HeartHandshake className="w-5 h-5 text-teal-600" />;
      case 'family':
        return <Users className="w-5 h-5 text-purple-600" />;
      case 'doctor':
        return <Stethoscope className="w-5 h-5 text-emerald-600" />;
      default:
        return <Shield className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-teal-950 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
              <KeyRound className="w-6 h-6 text-sky-300" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-xl">CareBridge Secure Access</h3>
              <p className="text-xs text-sky-200">Passcode-Protected Ecosystem Login</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Role Profile Selection */}
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Select Member Profile:
          </label>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {profiles.map((prof) => {
              const isSelected = selectedTargetProfile?.id === prof.id;
              return (
                <button
                  key={prof.id}
                  type="button"
                  onClick={() => handleQuickSelect(prof)}
                  className={`p-2.5 rounded-xl text-left border transition-all flex items-center gap-2.5 ${
                    isSelected
                      ? 'border-sky-500 bg-sky-50 ring-2 ring-sky-500/20'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <img
                    src={prof.avatar}
                    alt={prof.name}
                    className="w-9 h-9 rounded-full object-cover border border-white shadow-xs"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900 truncate">{prof.name}</p>
                    <p className="text-[10px] text-slate-500 font-medium capitalize truncate flex items-center gap-1">
                      {prof.role} &bull; PIN: <span className="font-mono font-bold text-sky-700">{prof.passcode}</span>
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Passcode Display Box */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 mb-4 text-center">
            <p className="text-xs font-semibold text-slate-500 mb-2">
              Enter Passcode for {selectedTargetProfile?.name}
            </p>
            <div className="flex items-center justify-center gap-3 h-10">
              {[0, 1, 2, 3].map((idx) => {
                const filled = passcode.length > idx;
                return (
                  <div
                    key={idx}
                    className={`w-4 h-4 rounded-full transition-all ${
                      filled
                        ? 'bg-sky-600 scale-125 shadow-xs shadow-sky-500/50'
                        : 'border-2 border-slate-300 bg-white'
                    }`}
                  />
                );
              })}
            </div>
            {passcode && (
              <p className="text-xs font-mono text-slate-400 mt-1 tracking-widest">
                {passcode.replace(/./g, '•')}
              </p>
            )}
          </div>

          {/* Error & Success Messages */}
          {errorMsg && (
            <div className="mb-4 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="mb-4 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Numeric Keypad */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleKeyPress(num.toString())}
                className="h-12 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 text-lg font-bold font-heading transition-colors"
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              onClick={handleClear}
              className="h-12 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 text-xs font-bold transition-colors"
            >
              CLEAR
            </button>
            <button
              type="button"
              onClick={() => handleKeyPress('0')}
              className="h-12 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-lg font-bold font-heading transition-colors"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="h-12 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-colors"
            >
              ⌫ DEL
            </button>
          </div>

          {/* Unlock Submit Button */}
          <button
            type="button"
            onClick={handleUnlock}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-bold text-sm shadow-md shadow-sky-500/25 transition-all flex items-center justify-center gap-2"
          >
            <Shield className="w-4 h-4" />
            <span>Authenticate &amp; Open Profile</span>
          </button>
        </div>

      </div>
    </div>
  );
}

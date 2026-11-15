import React, { useState, useEffect } from 'react';
import { AlertTriangle, PhoneCall, X, ShieldAlert, CheckCircle2, Siren } from 'lucide-react';
import { playAlertTone } from '../utils/speech';

export default function SosModal({ isOpen, onClose, onConfirmSos, elderProfile }) {
  const [countdown, setCountdown] = useState(3);
  const [isTriggered, setIsTriggered] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(3);
      setIsTriggered(false);
      setIsCancelled(false);
      return;
    }

    playAlertTone('sos');

    let timer = null;
    if (countdown > 0 && !isCancelled && !isTriggered) {
      timer = setTimeout(() => {
        setCountdown((c) => c - 1);
      }, 1000);
    } else if (countdown === 0 && !isTriggered && !isCancelled) {
      setIsTriggered(true);
      onConfirmSos();
    }

    return () => clearTimeout(timer);
  }, [isOpen, countdown, isTriggered, isCancelled]);

  if (!isOpen) return null;

  const handleManualTriggerNow = () => {
    setIsTriggered(true);
    onConfirmSos();
  };

  const handleCancel = () => {
    setIsCancelled(true);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-red-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border-4 border-rose-600 overflow-hidden text-center p-6 sm:p-8">
        
        {/* Siren Graphic */}
        <div className="w-20 h-20 rounded-3xl bg-rose-600 text-white flex items-center justify-center mx-auto mb-4 shadow-xl shadow-rose-600/40 animate-gentle-pulse">
          <Siren className="w-10 h-10 animate-bounce" />
        </div>

        {!isTriggered ? (
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-rose-600 bg-rose-100 px-3 py-1 rounded-full">
              Emergency Broadcast
            </span>
            <h2 className="text-3xl font-extrabold font-heading text-slate-900 mt-2">
              Sending SOS in {countdown}...
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Contacting Marcus Reed (Caregiver) and Sarah Vance (Daughter) with Eleanor's location and vitals.
            </p>

            <div className="my-6">
              <div className="w-24 h-24 rounded-full border-4 border-rose-200 border-t-rose-600 flex items-center justify-center mx-auto font-heading font-extrabold text-4xl text-rose-600">
                {countdown}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-base transition-colors"
              >
                Cancel (False Alarm)
              </button>
              <button
                onClick={handleManualTriggerNow}
                className="flex-1 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-base shadow-lg shadow-rose-600/30 transition-all"
              >
                Send Now!
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-3 bg-emerald-100 text-emerald-800 rounded-2xl font-bold text-sm flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>SOS Alert Broadcast Sent to Care Circle!</span>
            </div>

            <h2 className="text-2xl font-extrabold font-heading text-rose-950">
              Assistance is on the way
            </h2>
            <p className="text-slate-600 text-sm">
              Urgent high-priority emails, SMS, and app notifications have been dispatched to all emergency contacts.
            </p>

            <div className="bg-rose-50 rounded-2xl p-4 text-left border border-rose-200 text-xs space-y-1.5 text-rose-950">
              <p><strong>Patient:</strong> {elderProfile?.name} (Age {elderProfile?.age})</p>
              <p><strong>Address:</strong> {elderProfile?.address}</p>
              <p><strong>Primary Caregiver:</strong> Marcus Reed (+1 555-891-2345)</p>
              <p><strong>Family Contact:</strong> Sarah Vance (+1 555-345-6789)</p>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-colors"
            >
              Close Alert Window
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { 
  Bell, 
  Mail, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  ExternalLink, 
  Eye, 
  X, 
  Clock, 
  Sparkles,
  Zap
} from 'lucide-react';

export default function EmailNotificationCenter({
  isOpen,
  onClose,
  notifications,
  onTriggerTestEmail,
  elderProfile,
}) {
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [sendingType, setSendingType] = useState(null);
  const [successNotice, setSuccessNotice] = useState('');

  if (!isOpen) return null;

  const handleSendTest = async (type) => {
    setSendingType(type);
    try {
      const result = await onTriggerTestEmail(type);
      setSuccessNotice(`Proactive email successfully dispatched!`);
      setTimeout(() => setSuccessNotice(''), 4000);
    } catch (e) {
      console.error(e);
    } finally {
      setSendingType(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-teal-950 text-white p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-extrabold text-xl">
                  Proactive Email Notification Engine
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Active 24/7 Ticker
                </span>
              </div>
              <p className="text-xs text-sky-200">
                Automated email dispatcher for missed doses, scheduled medications, and appointment reminders.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Action Controls & Dispatch Simulator */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 shrink-0">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              Test Automated Proactive Email Dispatches:
            </span>
            {successNotice && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-full animate-fade-in">
                {successNotice}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            <button
              onClick={() => handleSendTest('dose_reminder')}
              disabled={sendingType !== null}
              className="p-3 rounded-2xl bg-white hover:bg-sky-50 border border-slate-200 hover:border-sky-300 text-left transition-all shadow-2xs group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-base">💊</span>
                <Send className="w-3.5 h-3.5 text-sky-600 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Dose Reminder</p>
                <p className="text-[10px] text-slate-500">Upcoming medication dose</p>
              </div>
            </button>

            <button
              onClick={() => handleSendTest('missed_dose')}
              disabled={sendingType !== null}
              className="p-3 rounded-2xl bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-300 text-left transition-all shadow-2xs group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-base">⚠️</span>
                <Send className="w-3.5 h-3.5 text-rose-600 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Missed Dose Alert</p>
                <p className="text-[10px] text-slate-500">Caregiver urgent notice (&gt;30m)</p>
              </div>
            </button>

            <button
              onClick={() => handleSendTest('appointment_reminder')}
              disabled={sendingType !== null}
              className="p-3 rounded-2xl bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-left transition-all shadow-2xs group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-base">🗓️</span>
                <Send className="w-3.5 h-3.5 text-teal-600 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Doctor Appointment</p>
                <p className="text-[10px] text-slate-500">Calendar &amp; transport sync</p>
              </div>
            </button>

            <button
              onClick={() => handleSendTest('refill_warning')}
              disabled={sendingType !== null}
              className="p-3 rounded-2xl bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-left transition-all shadow-2xs group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-base">📦</span>
                <Send className="w-3.5 h-3.5 text-amber-600 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Refill Warning</p>
                <p className="text-[10px] text-slate-500">Stock below safety threshold</p>
              </div>
            </button>
          </div>
        </div>

        {/* Dispatched Notification History Logs */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Dispatched Emails &amp; Notification History ({notifications.length} Logs)
            </h4>
            <span className="text-[11px] text-slate-400">
              Auto-syncs with backend mailer
            </span>
          </div>

          {notifications.map((notif) => {
            const isAlert = notif.type.includes('missed') || notif.type.includes('emergency') || notif.type.includes('wellbeing');

            return (
              <div
                key={notif.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isAlert
                    ? 'bg-rose-50/60 border-rose-200'
                    : 'bg-white border-slate-200 hover:border-sky-300'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      isAlert ? 'bg-rose-100 text-rose-700' : 'bg-sky-100 text-sky-700'
                    }`}
                  >
                    <Mail className="w-5 h-5" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {notif.subject}
                      </span>
                      <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Sent
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                      To: <span className="font-medium text-slate-700">{notif.recipient}</span>
                    </p>

                    <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(notif.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {notif.html && (
                    <button
                      onClick={() => setSelectedEmail(notif)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-sky-300 bg-white text-xs font-bold text-slate-700 hover:text-sky-700 transition-colors flex items-center gap-1.5 shadow-2xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview HTML</span>
                    </button>
                  )}

                  {notif.previewUrl && (
                    <a
                      href={notif.previewUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                      <span>Ethereal Mailbox</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* HTML Email Live Preview Modal */}
      {selectedEmail && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="min-w-0 pr-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">
                  Rendered HTML Email Preview
                </span>
                <h4 className="font-heading font-bold text-base truncate">{selectedEmail.subject}</h4>
              </div>
              <button
                onClick={() => setSelectedEmail(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-slate-100">
              <div
                className="bg-white rounded-2xl shadow-sm p-4 overflow-x-auto"
                dangerouslySetInnerHTML={{ __html: selectedEmail.html }}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

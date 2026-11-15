import React, { useState } from 'react';
import { MessageSquare, Plus, User, Clock, Tag, Send } from 'lucide-react';

export default function CaregiverNotes({ notes, onAddNote, currentProfile }) {
  const [newText, setNewText] = useState('');
  const [category, setCategory] = useState('Daily Routine');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newText.trim()) return;

    onAddNote({
      author: currentProfile?.name || 'Care Circle Member',
      authorRole: currentProfile?.title || currentProfile?.role || 'Caregiver',
      category,
      text: newText.trim(),
    });
    setNewText('');
  };

  const getCategoryBadgeClass = (cat) => {
    switch (cat) {
      case 'EMERGENCY SOS':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'Prescription Refill':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Family Update':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Shift Handoff':
        return 'bg-teal-100 text-teal-800 border-teal-300';
      default:
        return 'bg-sky-100 text-sky-800 border-sky-300';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <h2 className="text-2xl font-extrabold font-heading text-slate-900">
          Care Circle Handoff &amp; Communication Wall
        </h2>
        <p className="text-slate-500 text-sm mt-0.5">
          Shared communication stream between caretakers, family members, and clinicians to ensure seamless care continuity.
        </p>
      </div>

      {/* New Note Composer */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Posting as: <strong className="text-sky-700">{currentProfile?.name} ({currentProfile?.role})</strong>
            </span>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Category:</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden"
              >
                <option value="Daily Routine">Daily Routine</option>
                <option value="Shift Handoff">Shift Handoff</option>
                <option value="Family Update">Family Update</option>
                <option value="Doctor Follow-up">Doctor Follow-up</option>
                <option value="Prescription Refill">Prescription Refill</option>
              </select>
            </div>
          </div>

          <textarea
            rows={3}
            required
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Write a shift note, observation, dietary note, or family greeting for Eleanor..."
            className="w-full p-4 rounded-2xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500 text-sm font-medium"
          />

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Post to Care Circle</span>
            </button>
          </div>
        </form>
      </div>

      {/* Stream of Notes */}
      <div className="space-y-4">
        {notes.map((note) => (
          <div
            key={note.id}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-sm">
                  {note.author?.[0] || 'U'}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm leading-tight">{note.author}</h4>
                  <p className="text-[11px] text-slate-500">{note.authorRole}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md border ${getCategoryBadgeClass(note.category)}`}>
                  {note.category}
                </span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                  <Clock className="w-3 h-3" />
                  {new Date(note.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })} at {new Date(note.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
              {note.text}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}

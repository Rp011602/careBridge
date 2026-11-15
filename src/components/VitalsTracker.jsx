import React, { useState } from 'react';
import { Activity, Plus, Heart, Droplets, Zap, X, Check, ArrowUpRight } from 'lucide-react';

export default function VitalsTracker({ vitals, onAddVitals, currentProfile }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    bloodPressure: '124/80',
    heartRate: 72,
    bloodGlucose: 108,
    hydrationGlasses: 6,
    notes: 'Resting morning vitals.',
  });

  const latest = vitals[0] || {
    bloodPressure: '124/80',
    heartRate: 72,
    bloodGlucose: 108,
    hydrationGlasses: 6,
    timestamp: new Date().toISOString(),
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddVitals({
      ...formData,
      heartRate: Number(formData.heartRate),
      bloodGlucose: Number(formData.bloodGlucose),
      hydrationGlasses: Number(formData.hydrationGlasses),
      recordedBy: currentProfile?.name ? `${currentProfile.name} (${currentProfile.role})` : 'Care Circle',
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-2xl font-extrabold font-heading text-slate-900">
            Vital Signs &amp; Wellness Biometrics
          </h2>
          <p className="text-slate-500 text-sm mt-0.5">
            Monitor blood pressure stability, glucose curves, heart rate, and daily hydration.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-sky-500/25 transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          <span>Record New Vitals</span>
        </button>
      </div>

      {/* Latest Vitals Snapshot Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Blood Pressure */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Blood Pressure</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold font-heading text-slate-900">
            {latest.bloodPressure} <span className="text-sm font-semibold text-slate-400">mmHg</span>
          </h3>
          <p className="text-xs font-semibold text-emerald-600 mt-2">
            Normal &amp; Optimal Range
          </p>
        </div>

        {/* Heart Rate */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Heart Rate</span>
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold font-heading text-slate-900">
            {latest.heartRate} <span className="text-sm font-semibold text-slate-400">BPM</span>
          </h3>
          <p className="text-xs font-semibold text-emerald-600 mt-2">
            Resting Sinus Rhythm
          </p>
        </div>

        {/* Blood Glucose */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Blood Glucose</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold font-heading text-slate-900">
            {latest.bloodGlucose} <span className="text-sm font-semibold text-slate-400">mg/dL</span>
          </h3>
          <p className="text-xs font-semibold text-emerald-600 mt-2">
            Well-managed fasting glucose
          </p>
        </div>

        {/* Hydration */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hydration</span>
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Droplets className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold font-heading text-slate-900">
            {latest.hydrationGlasses} <span className="text-sm font-semibold text-slate-400">/ 8 Glasses</span>
          </h3>
          <p className="text-xs font-semibold text-sky-600 mt-2">
            Good daily intake
          </p>
        </div>

      </div>

      {/* Historical Vitals Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <h3 className="font-heading font-extrabold text-xl text-slate-900 mb-4">
          Recorded Vitals History
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-bold">
                <th className="py-3 px-3">Date &amp; Time</th>
                <th className="py-3 px-3">Blood Pressure</th>
                <th className="py-3 px-3">Heart Rate</th>
                <th className="py-3 px-3">Blood Sugar</th>
                <th className="py-3 px-3">Hydration</th>
                <th className="py-3 px-3">Recorded By</th>
                <th className="py-3 px-3">Clinical Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {vitals.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-3 text-slate-600 font-medium">
                    {new Date(v.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-900">{v.bloodPressure} mmHg</td>
                  <td className="py-3 px-3 text-slate-700">{v.heartRate} bpm</td>
                  <td className="py-3 px-3 text-slate-700">{v.bloodGlucose} mg/dL</td>
                  <td className="py-3 px-3 text-sky-700 font-semibold">{v.hydrationGlasses} glasses</td>
                  <td className="py-3 px-3 text-slate-700 font-medium">{v.recordedBy}</td>
                  <td className="py-3 px-3 text-slate-500 italic max-w-xs truncate">{v.notes || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Vitals Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 p-6 sm:p-7">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <h3 className="font-heading font-extrabold text-xl text-slate-900">
                  Record Vital Signs
                </h3>
                <p className="text-xs text-slate-500">Track Eleanor's daily health readings</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Blood Pressure (mmHg) *</label>
                  <input
                    type="text"
                    required
                    value={formData.bloodPressure}
                    onChange={(e) => setFormData({ ...formData, bloodPressure: e.target.value })}
                    placeholder="120/80"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Heart Rate (BPM)</label>
                  <input
                    type="number"
                    value={formData.heartRate}
                    onChange={(e) => setFormData({ ...formData, heartRate: e.target.value })}
                    placeholder="72"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Blood Sugar (mg/dL)</label>
                  <input
                    type="number"
                    value={formData.bloodGlucose}
                    onChange={(e) => setFormData({ ...formData, bloodGlucose: e.target.value })}
                    placeholder="108"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hydration (Glasses)</label>
                  <input
                    type="number"
                    min={0}
                    max={15}
                    value={formData.hydrationGlasses}
                    onChange={(e) => setFormData({ ...formData, hydrationGlasses: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Clinical Observation Notes</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Resting vitals taken before breakfast."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all"
                >
                  Save Vitals Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { FileText, Printer, X, Shield, Activity, Heart, Calendar } from 'lucide-react';

export default function DoctorReportModal({ isOpen, onClose }) {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch('/api/summary/report')
        .then((res) => res.json())
        .then((data) => {
          setReportData(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const elder = reportData?.elder || {};
  const medications = reportData?.medications || [];
  const vitals = reportData?.recentVitals || [];
  const nextApt = reportData?.nextAppointment;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Modal Top Bar */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg">Doctor Health Summary Report</h3>
              <p className="text-xs text-slate-400">Clinical-ready summary for medical consultations</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Export PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-slate-50">
          <div id="printable-doctor-report" className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-6 text-slate-800">
            
            {/* Document Header */}
            <div className="border-b-2 border-slate-900 pb-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-sky-700">
                  CareBridge Clinical Summary
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 mt-1">
                  {elder.name || 'Eleanor Vance'}
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Age: {elder.age || 78} &bull; Blood Group: {elder.bloodGroup || 'O+'} &bull; Primary Doctor: {elder.primaryDoctor || 'Dr. Robert Chen'}
                </p>
                <p className="text-xs text-slate-500">
                  Address: {elder.address} &bull; Emergency Contact: {elder.emergencyPhone}
                </p>
              </div>

              <div className="text-right sm:self-start">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Report Date</span>
                <p className="text-xs font-bold text-slate-700">
                  {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>

            {/* Medical Conditions & Allergies Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Diagnosed Chronic Conditions
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(elder.conditions || []).map((c) => (
                    <span key={c} className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-white border border-slate-300 text-slate-800">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200">
                <span className="text-xs font-bold text-rose-700 uppercase tracking-wider block mb-1">
                  Known Drug &amp; Food Allergies
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(elder.allergies || []).map((a) => (
                    <span key={a} className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-white border border-rose-300 text-rose-800">
                      ⚠️ {a}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 30-Day Medication Adherence Metric */}
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  30-Day Medication Compliance Score
                </span>
                <h4 className="text-xl font-extrabold text-emerald-900 mt-0.5">
                  {reportData?.adherenceRate || 95}% Regimen Adherence
                </h4>
                <p className="text-xs text-emerald-700 mt-0.5">
                  {reportData?.adherenceCount?.taken || 4} of {reportData?.adherenceCount?.total || 4} doses verified on time.
                </p>
              </div>
              <div className="text-3xl font-extrabold text-emerald-700">
                ✓
              </div>
            </div>

            {/* Current Active Prescriptions */}
            <div>
              <h3 className="font-heading font-extrabold text-lg text-slate-900 mb-2 border-b border-slate-200 pb-1">
                Active Prescription Regimen
              </h3>
              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-100 text-slate-600 font-bold uppercase">
                  <tr>
                    <th className="p-2.5">Medication</th>
                    <th className="p-2.5">Dosage</th>
                    <th className="p-2.5">Schedule</th>
                    <th className="p-2.5">Clinical Purpose</th>
                    <th className="p-2.5">Instructions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {medications.map((m) => (
                    <tr key={m.id}>
                      <td className="p-2.5 font-bold text-slate-900">{m.name}</td>
                      <td className="p-2.5 font-semibold text-sky-700">{m.dosage}</td>
                      <td className="p-2.5">{m.timing} ({m.timeStr})</td>
                      <td className="p-2.5 text-slate-600">{m.purpose || '—'}</td>
                      <td className="p-2.5 text-slate-500 italic">{m.instructions || 'Standard'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Recent Vitals Readings */}
            <div>
              <h3 className="font-heading font-extrabold text-lg text-slate-900 mb-2 border-b border-slate-200 pb-1">
                Recent Vital Signs Log
              </h3>
              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-100 text-slate-600 font-bold uppercase">
                  <tr>
                    <th className="p-2.5">Timestamp</th>
                    <th className="p-2.5">Blood Pressure</th>
                    <th className="p-2.5">Heart Rate</th>
                    <th className="p-2.5">Blood Glucose</th>
                    <th className="p-2.5">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {vitals.map((v) => (
                    <tr key={v.id}>
                      <td className="p-2.5">{new Date(v.timestamp).toLocaleDateString()}</td>
                      <td className="p-2.5 font-bold">{v.bloodPressure} mmHg</td>
                      <td className="p-2.5">{v.heartRate} bpm</td>
                      <td className="p-2.5">{v.bloodGlucose} mg/dL</td>
                      <td className="p-2.5 text-slate-500 italic">{v.notes || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Questions for Today's Visit */}
            {nextApt?.questions && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block mb-1">
                  Questions Prepared by Family / Patient for Today's Consultation
                </span>
                <p className="text-xs text-amber-950 font-medium italic">
                  "{nextApt.questions}"
                </p>
              </div>
            )}

            {/* Sign-off footer */}
            <div className="pt-6 border-t border-slate-200 flex justify-between items-center text-[11px] text-slate-400">
              <p>Generated by CareBridge Platform for Eleanor Vance &bull; Confidential Medical Document</p>
              <p>Attending Clinician Signature: _________________________</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

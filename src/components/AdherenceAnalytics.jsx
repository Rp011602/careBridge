import React from 'react';
import { CheckCircle2, AlertTriangle, Clock, XCircle, Award, TrendingUp, Calendar } from 'lucide-react';

export default function AdherenceAnalytics({ adherenceLogs, medications }) {
  const totalLogs = adherenceLogs.length || 1;
  const takenLogs = adherenceLogs.filter((l) => l.status === 'taken').length;
  const missedLogs = adherenceLogs.filter((l) => l.status === 'missed').length;
  const pendingLogs = adherenceLogs.filter((l) => l.status === 'pending').length;

  const adherencePercentage = Math.round((takenLogs / totalLogs) * 100);

  // Mock past 7 days for the weekly compliance bar chart
  const days = [
    { day: 'Mon', rate: 100 },
    { day: 'Tue', rate: 100 },
    { day: 'Wed', rate: 75 },
    { day: 'Thu', rate: 100 },
    { day: 'Fri', rate: 100 },
    { day: 'Sat', rate: 100 },
    { day: 'Sun (Today)', rate: adherencePercentage },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Analytics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Compliance Gauge */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Overall Adherence</p>
            <h3 className="text-3xl font-extrabold font-heading text-slate-900 mt-1">
              {adherencePercentage}%
            </h3>
            <p className="text-xs font-semibold text-emerald-600 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> High Clinical Compliance
            </p>
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-emerald-500/30 border-t-emerald-600 flex items-center justify-center font-bold text-emerald-700 text-sm">
            {adherencePercentage}%
          </div>
        </div>

        {/* Streak */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Adherence Streak</p>
            <h3 className="text-3xl font-extrabold font-heading text-slate-900 mt-1">
              14 Days
            </h3>
            <p className="text-xs font-semibold text-amber-600 mt-1 flex items-center gap-1">
              <Award className="w-3.5 h-3.5" /> Perfect morning record
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl shadow-xs">
            🏆
          </div>
        </div>

        {/* Doses Taken */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Doses Confirmed</p>
            <h3 className="text-3xl font-extrabold font-heading text-emerald-700 mt-1">
              {takenLogs}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Logged &amp; verified
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Pending / Overdue */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Doses Due Today</p>
            <h3 className="text-3xl font-extrabold font-heading text-sky-700 mt-1">
              {pendingLogs}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Scheduled later today
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shadow-xs">
            <Clock className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Weekly Compliance Bar Chart */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-heading font-extrabold text-xl text-slate-900">
              7-Day Adherence Trend
            </h3>
            <p className="text-slate-500 text-xs">Consistent daily medication adherence helps prevent hospital readmission</p>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-slate-100 text-slate-700 rounded-full">
            Target: ≥ 90%
          </span>
        </div>

        <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-44 pt-6 pb-2 border-b border-slate-100">
          {days.map((item) => {
            const barHeight = `${Math.max(item.rate, 15)}%`;
            const isHigh = item.rate >= 90;
            return (
              <div key={item.day} className="flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-xs font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.rate}%
                </span>
                <div className="w-full max-w-[48px] bg-slate-100 rounded-xl overflow-hidden flex flex-col justify-end h-32">
                  <div
                    style={{ height: barHeight }}
                    className={`w-full rounded-xl transition-all duration-500 ${
                      isHigh
                        ? 'bg-gradient-to-t from-emerald-600 to-teal-400 group-hover:from-emerald-700 group-hover:to-teal-500'
                        : 'bg-gradient-to-t from-amber-500 to-yellow-400'
                    }`}
                  />
                </div>
                <span className="text-[11px] font-semibold text-slate-600 text-center truncate w-full">
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chronological Adherence Log */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-heading font-extrabold text-xl text-slate-900">
              Recent Adherence Event Log
            </h3>
            <p className="text-slate-500 text-xs">Real-time trace of doses taken, skipped, and confirmed</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-bold">
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Medication</th>
                <th className="py-3 px-3">Scheduled</th>
                <th className="py-3 px-3">Action Time</th>
                <th className="py-3 px-3">Recorded By</th>
                <th className="py-3 px-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {adherenceLogs.map((log) => {
                const isTaken = log.status === 'taken';
                const isPending = log.status === 'pending';
                const isMissed = log.status === 'missed';

                return (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold uppercase text-[10px] ${
                          isTaken
                            ? 'bg-emerald-100 text-emerald-800'
                            : isPending
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {isTaken && <CheckCircle2 className="w-3 h-3" />}
                        {isPending && <Clock className="w-3 h-3" />}
                        {isMissed && <XCircle className="w-3 h-3" />}
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900">{log.medName}</td>
                    <td className="py-3 px-3 text-slate-600 font-medium">{log.scheduledTime}</td>
                    <td className="py-3 px-3 text-slate-500">
                      {log.actionTime ? new Date(log.actionTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                    </td>
                    <td className="py-3 px-3 text-slate-700 font-medium">{log.recordedBy || 'System'}</td>
                    <td className="py-3 px-3 text-slate-500 italic max-w-xs truncate">{log.notes || '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, AlertTriangle, RefreshCw, Check, X, Pill, Clock } from 'lucide-react';

const PILL_COLORS = [
  { name: 'White', hex: '#f8fafc', border: '#94a3b8' },
  { name: 'Pink', hex: '#f472b6', border: '#db2777' },
  { name: 'Sky Blue', hex: '#38bdf8', border: '#0284c7' },
  { name: 'Golden Amber', hex: '#f59e0b', border: '#d97706' },
  { name: 'Teal Green', hex: '#14b8a6', border: '#0f766e' },
  { name: 'Lavender', hex: '#c084fc', border: '#9333ea' },
];

const PILL_SHAPES = [
  'Round Tablet',
  'Oval Tablet',
  'Oblong Capsule',
  'Softgel Capsule',
  'Aerosol Inhaler',
];

export default function MedicationManager({
  medications,
  onAddMedication,
  onUpdateMedication,
  onDeleteMedication,
  onRefillMedication,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMed, setEditingMed] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    purpose: '',
    timing: 'Morning',
    timeStr: '08:00',
    frequency: 'Daily',
    withFood: true,
    instructions: '',
    pillColor: 'White',
    pillShape: 'Round Tablet',
    pillColorHex: '#f8fafc',
    pillBorderHex: '#94a3b8',
    remainingPills: 30,
    refillThreshold: 7,
    prescribedBy: 'Dr. Robert Chen',
    pharmacy: 'Oakridge Community Pharmacy',
  });

  const openAddModal = () => {
    setEditingMed(null);
    setFormData({
      name: '',
      dosage: '',
      purpose: '',
      timing: 'Morning',
      timeStr: '08:00',
      frequency: 'Daily',
      withFood: true,
      instructions: '',
      pillColor: 'White',
      pillShape: 'Round Tablet',
      pillColorHex: '#f8fafc',
      pillBorderHex: '#94a3b8',
      remainingPills: 30,
      refillThreshold: 7,
      prescribedBy: 'Dr. Robert Chen',
      pharmacy: 'Oakridge Community Pharmacy',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (med) => {
    setEditingMed(med);
    setFormData({ ...med });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.dosage) return;

    if (editingMed) {
      onUpdateMedication(editingMed.id, formData);
    } else {
      onAddMedication(formData);
    }
    setIsModalOpen(false);
  };

  const handleColorSelect = (c) => {
    setFormData({
      ...formData,
      pillColor: c.name,
      pillColorHex: c.hex,
      pillBorderHex: c.border,
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header with Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-2xl font-extrabold font-heading text-slate-900">
            Medication Regimen &amp; Refill Manager
          </h2>
          <p className="text-slate-500 text-sm mt-0.5">
            Manage prescriptions, dosage timings, visual pill profiles, and safety inventory.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-bold text-sm shadow-md shadow-sky-500/25 transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Medication</span>
        </button>
      </div>

      {/* Medication List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {medications.map((med) => {
          const isLowStock = med.remainingPills <= (med.refillThreshold || 7);
          return (
            <div
              key={med.id}
              className={`rounded-3xl p-6 border transition-all flex flex-col justify-between ${
                isLowStock
                  ? 'bg-amber-50/70 border-amber-300 shadow-sm'
                  : 'bg-white border-slate-200 shadow-xs hover:shadow-md'
              }`}
            >
              <div>
                {/* Top Row: Pill Graphic & Actions */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner border-2 shrink-0"
                      style={{
                        backgroundColor: med.pillColorHex || '#f1f5f9',
                        borderColor: med.pillBorderHex || '#cbd5e1',
                      }}
                    >
                      <span className="text-xs font-bold text-slate-800">
                        {med.pillShape?.includes('Inhaler') ? '💨' : '💊'}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-heading font-extrabold text-lg text-slate-900 leading-tight">
                        {med.name}
                      </h3>
                      <p className="text-sm font-bold text-sky-700">{med.dosage}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(med)}
                      className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteMedication(med.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 text-xs text-slate-600 mb-5">
                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span className="font-semibold text-slate-500">Scheduled:</span>
                    <span className="font-bold text-slate-800 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {med.timing} ({med.timeStr})
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span className="font-semibold text-slate-500">Pill Visual:</span>
                    <span className="font-medium text-slate-800">
                      {med.pillColor} {med.pillShape}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span className="font-semibold text-slate-500">Directions:</span>
                    <span className="font-medium text-slate-800">
                      {med.withFood ? 'With food' : 'Before/without food'}
                    </span>
                  </div>

                  {med.purpose && (
                    <p className="text-slate-500 italic mt-1 line-clamp-1">
                      For: {med.purpose}
                    </p>
                  )}
                </div>
              </div>

              {/* Bottom Stock & Refill Area */}
              <div className="pt-3 border-t border-slate-200/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-500">Supply Left:</span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      isLowStock
                        ? 'bg-amber-200 text-amber-900 font-extrabold'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {med.remainingPills} doses left
                  </span>
                </div>

                {isLowStock && (
                  <div className="mb-3 p-2 rounded-xl bg-amber-100/70 border border-amber-300 text-amber-900 text-xs font-semibold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                    <span>Low Stock! Below {med.refillThreshold} dose threshold.</span>
                  </div>
                )}

                <button
                  onClick={() => onRefillMedication(med.id, 30)}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Log Refill (+30 Pills)</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Add / Edit Medication Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 p-6 sm:p-7">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <h3 className="font-heading font-extrabold text-xl text-slate-900">
                  {editingMed ? 'Edit Medication Schedule' : 'Add New Medication'}
                </h3>
                <p className="text-xs text-slate-500">Configure prescription dosage and visual identifiers</p>
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
                  <label className="block text-xs font-bold text-slate-700 mb-1">Medication Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Metformin"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500 text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Dosage *</label>
                  <input
                    type="text"
                    required
                    value={formData.dosage}
                    onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                    placeholder="e.g. 500 mg"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500 text-sm font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Purpose / Condition</label>
                <input
                  type="text"
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  placeholder="e.g. Blood sugar control"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500 text-sm font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Time Slot</label>
                  <select
                    value={formData.timing}
                    onChange={(e) => setFormData({ ...formData, timing: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500 text-sm font-medium bg-white"
                  >
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Evening">Evening</option>
                    <option value="Bedtime">Bedtime</option>
                    <option value="As Needed">As Needed (PRN)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Scheduled Time (24h)</label>
                  <input
                    type="time"
                    value={formData.timeStr}
                    onChange={(e) => setFormData({ ...formData, timeStr: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500 text-sm font-medium"
                  />
                </div>
              </div>

              {/* Visual Pill Color Chooser */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Visual Pill Color (for Senior Recognition)
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {PILL_COLORS.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => handleColorSelect(c)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                        formData.pillColor === c.name
                          ? 'ring-2 ring-sky-500 border-sky-500'
                          : 'border-slate-200 bg-white'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border"
                        style={{ backgroundColor: c.hex, borderColor: c.border }}
                      />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Pill Shape Chooser */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pill Shape</label>
                <select
                  value={formData.pillShape}
                  onChange={(e) => setFormData({ ...formData, pillShape: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500 text-sm font-medium bg-white"
                >
                  {PILL_SHAPES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Instructions & Food check */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Directions &amp; Warnings</label>
                <textarea
                  rows={2}
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  placeholder="e.g. Take with a full glass of water. Do not crush."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500 text-sm font-medium"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="withFood"
                  checked={formData.withFood}
                  onChange={(e) => setFormData({ ...formData, withFood: e.target.checked })}
                  className="w-4 h-4 text-sky-600 rounded-sm"
                />
                <label htmlFor="withFood" className="text-xs font-semibold text-slate-700">
                  Must be taken with food / after meal
                </label>
              </div>

              {/* Stock Inventory */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Current Pill Stock</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.remainingPills}
                    onChange={(e) => setFormData({ ...formData, remainingPills: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Refill Alert Threshold</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.refillThreshold}
                    onChange={(e) => setFormData({ ...formData, refillThreshold: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
                  />
                </div>
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
                  className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md transition-all"
                >
                  {editingMed ? 'Save Changes' : 'Create Medication'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

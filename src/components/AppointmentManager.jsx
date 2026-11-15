import React, { useState } from 'react';
import { Plus, Calendar, Clock, MapPin, Phone, Car, HelpCircle, Trash2, Edit2, X, CheckCircle2 } from 'lucide-react';

export default function AppointmentManager({
  appointments,
  onAddAppointment,
  onUpdateAppointment,
  onDeleteAppointment,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApt, setEditingApt] = useState(null);

  const [formData, setFormData] = useState({
    doctorName: '',
    specialty: '',
    clinicName: '',
    address: '',
    phone: '',
    appointmentDate: '',
    appointmentTime: '10:00',
    companion: 'Sarah Vance (Daughter)',
    transportation: 'Sarah will pick up Mom',
    prepInstructions: '',
    questions: '',
  });

  const openAddModal = () => {
    setEditingApt(null);
    setFormData({
      doctorName: '',
      specialty: '',
      clinicName: '',
      address: '',
      phone: '',
      appointmentDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      appointmentTime: '10:00',
      companion: 'Sarah Vance (Daughter)',
      transportation: 'Sarah will pick up Mom 45 mins prior',
      prepInstructions: 'Bring current medication list and insurance card.',
      questions: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (apt) => {
    setEditingApt(apt);
    setFormData({ ...apt });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.doctorName || !formData.appointmentDate) return;

    if (editingApt) {
      onUpdateAppointment(editingApt.id, formData);
    } else {
      onAddAppointment(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-2xl font-extrabold font-heading text-slate-900">
            Healthcare Calendar &amp; Consultations
          </h2>
          <p className="text-slate-500 text-sm mt-0.5">
            Coordinate clinic visits, transportation rides, prep checklists, and doctor questions.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-sm shadow-md shadow-teal-500/25 transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          <span>Schedule Doctor Visit</span>
        </button>
      </div>

      {/* Appointment Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {appointments.map((apt) => (
          <div
            key={apt.id}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Doctor & Specialty */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center shadow-xs shrink-0">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-heading font-extrabold text-xl text-slate-900">
                      {apt.doctorName}
                    </h3>
                    <p className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                      {apt.specialty}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(apt)}
                    className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteAppointment(apt.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Date & Location Details */}
              <div className="space-y-2.5 text-xs text-slate-600 mb-5">
                <div className="flex items-center gap-2 text-slate-900 font-semibold bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <Clock className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>
                    <strong>Date &amp; Time:</strong> {apt.appointmentDate} at {apt.appointmentTime}
                  </span>
                </div>

                <div className="flex items-start gap-2 p-1">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-800">{apt.clinicName}</p>
                    <p className="text-slate-500">{apt.address}</p>
                  </div>
                </div>

                {apt.phone && (
                  <div className="flex items-center gap-2 p-1">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-slate-700">{apt.phone}</span>
                  </div>
                )}

                {/* Ride / Companion Assignment */}
                <div className="flex items-start gap-2 p-2.5 rounded-xl bg-teal-50/70 border border-teal-100 text-teal-900">
                  <Car className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Transportation &amp; Companion: </span>
                    <span>{apt.transportation || apt.companion || 'Pending coordination'}</span>
                  </div>
                </div>

                {/* Doctor Questions Prep */}
                {apt.questions && (
                  <div className="flex items-start gap-2 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900">
                    <HelpCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Questions to Ask: </span>
                      <p className="italic mt-0.5">{apt.questions}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Prep Note */}
            {apt.prepInstructions && (
              <div className="pt-3 border-t border-slate-100 text-xs text-slate-500">
                <strong>Prep Checklist:</strong> {apt.prepInstructions}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add / Edit Appointment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 p-6 sm:p-7">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <h3 className="font-heading font-extrabold text-xl text-slate-900">
                  {editingApt ? 'Edit Medical Appointment' : 'Schedule Medical Appointment'}
                </h3>
                <p className="text-xs text-slate-500">Proactive email reminders will be sent to the Care Circle</p>
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
                  <label className="block text-xs font-bold text-slate-700 mb-1">Doctor / Provider Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.doctorName}
                    onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                    placeholder="e.g. Dr. Robert Chen"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Medical Specialty</label>
                  <input
                    type="text"
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    placeholder="e.g. Cardiology"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Clinic / Hospital *</label>
                  <input
                    type="text"
                    required
                    value={formData.clinicName}
                    onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                    placeholder="e.g. Oakridge Heart Center"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Clinic Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. (555) 789-0123"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. 740 Medical Parkway, Suite 300"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Appointment Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.appointmentDate}
                    onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Time</label>
                  <input
                    type="time"
                    value={formData.appointmentTime}
                    onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Transportation &amp; Ride Logistics
                </label>
                <input
                  type="text"
                  value={formData.transportation}
                  onChange={(e) => setFormData({ ...formData, transportation: e.target.value })}
                  placeholder="e.g. Sarah Vance driving Mom at 1:45 PM"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Questions to Ask Doctor
                </label>
                <textarea
                  rows={2}
                  value={formData.questions}
                  onChange={(e) => setFormData({ ...formData, questions: e.target.value })}
                  placeholder="e.g. Ask about mild ankle swelling; review if blood pressure med needs adjusting."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Preparation Instructions (Fasting, Dilations, etc.)
                </label>
                <input
                  type="text"
                  value={formData.prepInstructions}
                  onChange={(e) => setFormData({ ...formData, prepInstructions: e.target.value })}
                  placeholder="e.g. Fasting 10 hours prior; take morning Lisinopril with small sip of water."
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
                  className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition-all"
                >
                  {editingApt ? 'Save Changes' : 'Schedule & Send Email Alert'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

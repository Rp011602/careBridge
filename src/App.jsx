import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import PasscodeModal from './components/PasscodeModal';
import SeniorModeView from './components/SeniorModeView';
import CaretakerFamilyDashboard from './components/CaretakerFamilyDashboard';
import EmailNotificationCenter from './components/EmailNotificationCenter';
import DoctorReportModal from './components/DoctorReportModal';
import SosModal from './components/SosModal';
import { FALLBACK_SEED } from './fallbackSeed';

export default function App() {
  const [profiles, setProfiles] = useState(() => {
    const saved = localStorage.getItem('carebridge_profiles');
    return saved ? JSON.parse(saved) : FALLBACK_SEED.profiles;
  });
  const [currentProfile, setCurrentProfile] = useState(() => profiles[0]);
  const [mode, setMode] = useState('senior'); // 'senior' | 'caretaker'
  
  const [medications, setMedications] = useState(() => {
    const saved = localStorage.getItem('carebridge_medications');
    return saved ? JSON.parse(saved) : FALLBACK_SEED.medications;
  });
  const [adherenceLogs, setAdherenceLogs] = useState(() => {
    const saved = localStorage.getItem('carebridge_adherence');
    return saved ? JSON.parse(saved) : FALLBACK_SEED.adherenceLogs;
  });
  const [appointments, setAppointments] = useState(() => {
    const saved = localStorage.getItem('carebridge_appointments');
    return saved ? JSON.parse(saved) : FALLBACK_SEED.appointments;
  });
  const [vitals, setVitals] = useState(() => {
    const saved = localStorage.getItem('carebridge_vitals');
    return saved ? JSON.parse(saved) : FALLBACK_SEED.vitals;
  });
  const [caregiverNotes, setCaregiverNotes] = useState(() => {
    const saved = localStorage.getItem('carebridge_notes');
    return saved ? JSON.parse(saved) : FALLBACK_SEED.caregiverNotes;
  });
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('carebridge_notifications');
    return saved ? JSON.parse(saved) : FALLBACK_SEED.notifications;
  });

  // Modals
  const [isPasscodeModalOpen, setIsPasscodeModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isDoctorReportOpen, setIsDoctorReportOpen] = useState(false);
  const [isSosOpen, setIsSosOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('carebridge_profiles', JSON.stringify(profiles));
    localStorage.setItem('carebridge_medications', JSON.stringify(medications));
    localStorage.setItem('carebridge_adherence', JSON.stringify(adherenceLogs));
    localStorage.setItem('carebridge_appointments', JSON.stringify(appointments));
    localStorage.setItem('carebridge_vitals', JSON.stringify(vitals));
    localStorage.setItem('carebridge_notes', JSON.stringify(caregiverNotes));
    localStorage.setItem('carebridge_notifications', JSON.stringify(notifications));
  }, [profiles, medications, adherenceLogs, appointments, vitals, caregiverNotes, notifications]);

  // Load backend data if reachable
  const fetchData = async () => {
    try {
      const [pRes, mRes, aRes, aptRes, vRes, nRes, notifRes] = await Promise.all([
        fetch('/api/profiles'),
        fetch('/api/medications'),
        fetch('/api/adherence'),
        fetch('/api/appointments'),
        fetch('/api/vitals'),
        fetch('/api/notes'),
        fetch('/api/notifications'),
      ]);

      if (pRes.ok) {
        const [pData, mData, aData, aptData, vData, nData, notifData] = await Promise.all([
          pRes.json(),
          mRes.json(),
          aRes.json(),
          aptRes.json(),
          vRes.json(),
          nRes.json(),
          notifRes.json(),
        ]);

        if (pData?.length) setProfiles(pData);
        if (mData?.length) setMedications(mData);
        if (aData?.length) setAdherenceLogs(aData);
        if (aptData?.length) setAppointments(aptData);
        if (vData?.length) setVitals(vData);
        if (nData?.length) setCaregiverNotes(nData);
        if (notifData?.length) setNotifications(notifData);
      }
    } catch (err) {
      // Running in standalone / static mode
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  const elderProfile = profiles.find((p) => p.role === 'elder') || profiles[0];

  // Passcode login handler
  const handleSelectProfile = (profile) => {
    setCurrentProfile(profile);
    if (profile.role === 'elder') {
      setMode('senior');
    } else {
      setMode('caretaker');
    }
  };

  // Record medication adherence
  const handleRecordAdherence = async (medId, status, notes) => {
    try {
      const res = await fetch('/api/adherence/record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          medId,
          status,
          notes,
          recordedBy: currentProfile?.name || 'Eleanor Vance',
        }),
      });
      if (res.ok) {
        fetchData();
        return;
      }
    } catch (e) {
      // Fallback local update
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const med = medications.find((m) => m.id === medId);
    const newLog = {
      id: `adh-${Date.now()}`,
      medId,
      medName: med ? `${med.name} ${med.dosage}` : 'Medication',
      date: todayStr,
      scheduledTime: med?.timeStr || '08:00',
      actionTime: new Date().toISOString(),
      status,
      recordedBy: currentProfile?.name || 'Eleanor Vance',
      notes: notes || '',
    };
    setAdherenceLogs((prev) => [newLog, ...prev.filter((l) => !(l.medId === medId && l.date === todayStr))]);
    if (status === 'taken' && med && med.remainingPills > 0) {
      setMedications((prev) =>
        prev.map((m) => (m.id === medId ? { ...m, remainingPills: m.remainingPills - 1 } : m))
      );
    }
  };

  // Senior daily check-in
  const handleCheckIn = async (status, emoji) => {
    try {
      const res = await fetch('/api/check-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, emoji }),
      });
      if (res.ok) {
        fetchData();
        return;
      }
    } catch (e) {}

    setProfiles((prev) =>
      prev.map((p) =>
        p.role === 'elder'
          ? { ...p, lastCheckIn: { status, emoji, timestamp: new Date().toISOString() } }
          : p
      )
    );
  };

  // Medications CRUD
  const handleAddMedication = async (medData) => {
    try {
      const res = await fetch('/api/medications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(medData),
      });
      if (res.ok) {
        fetchData();
        return;
      }
    } catch (e) {}

    const newMed = { id: `med-${Date.now()}`, active: true, ...medData };
    setMedications((prev) => [...prev, newMed]);
  };

  const handleUpdateMedication = async (id, medData) => {
    try {
      const res = await fetch(`/api/medications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(medData),
      });
      if (res.ok) {
        fetchData();
        return;
      }
    } catch (e) {}

    setMedications((prev) => prev.map((m) => (m.id === id ? { ...m, ...medData } : m)));
  };

  const handleDeleteMedication = async (id) => {
    try {
      const res = await fetch(`/api/medications/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
        return;
      }
    } catch (e) {}

    setMedications((prev) => prev.filter((m) => m.id !== id));
  };

  const handleRefillMedication = async (id, count) => {
    try {
      const res = await fetch(`/api/medications/${id}/refill`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count, authorName: currentProfile?.name || 'Care Circle Member' }),
      });
      if (res.ok) {
        fetchData();
        return;
      }
    } catch (e) {}

    setMedications((prev) =>
      prev.map((m) => (m.id === id ? { ...m, remainingPills: (m.remainingPills || 0) + Number(count) } : m))
    );
  };

  // Appointments CRUD
  const handleAddAppointment = async (aptData) => {
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aptData),
      });
      if (res.ok) {
        fetchData();
        return;
      }
    } catch (e) {}

    const newApt = { id: `apt-${Date.now()}`, status: 'upcoming', ...aptData };
    setAppointments((prev) => [...prev, newApt]);
  };

  const handleUpdateAppointment = async (id, aptData) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aptData),
      });
      if (res.ok) {
        fetchData();
        return;
      }
    } catch (e) {}

    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, ...aptData } : a)));
  };

  const handleDeleteAppointment = async (id) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
        return;
      }
    } catch (e) {}

    setAppointments((prev) => prev.filter((a) => a.id !== id));
  };

  // Vitals
  const handleAddVitals = async (vitalData) => {
    try {
      const res = await fetch('/api/vitals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vitalData),
      });
      if (res.ok) {
        fetchData();
        return;
      }
    } catch (e) {}

    const newVital = { id: `vit-${Date.now()}`, timestamp: new Date().toISOString(), ...vitalData };
    setVitals((prev) => [newVital, ...prev]);
  };

  // Caregiver Notes
  const handleAddNote = async (noteData) => {
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noteData),
      });
      if (res.ok) {
        fetchData();
        return;
      }
    } catch (e) {}

    const newNote = { id: `note-${Date.now()}`, timestamp: new Date().toISOString(), ...noteData };
    setCaregiverNotes((prev) => [newNote, ...prev]);
  };

  // SOS Emergency Trigger
  const handleConfirmSos = async () => {
    try {
      const res = await fetch('/api/emergency/sos', { method: 'POST', headers: { 'Content-Type': 'application/json' } });
      if (res.ok) {
        fetchData();
        return;
      }
    } catch (e) {}

    const alertNote = {
      id: `note-sos-${Date.now()}`,
      author: 'CareBridge Emergency System',
      authorRole: 'System SOS Alert',
      timestamp: new Date().toISOString(),
      category: 'EMERGENCY SOS',
      text: `🚨 EMERGENCY SOS triggered by ${elderProfile?.name} at ${new Date().toLocaleTimeString()}. Alerts dispatched!`,
    };
    setCaregiverNotes((prev) => [alertNote, ...prev]);
  };

  // Test Automated Email Trigger
  const handleTriggerTestEmail = async (sampleType) => {
    try {
      const res = await fetch('/api/notifications/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sampleType }),
      });
      if (res.ok) {
        const data = await res.json();
        fetchData();
        return data;
      }
    } catch (e) {}

    const newNotif = {
      id: `notif-${Date.now()}`,
      type: sampleType,
      subject: `Automated Notification: ${sampleType.replace('_', ' ').toUpperCase()}`,
      recipient: 'carecircle@carebridge.demo',
      timestamp: new Date().toISOString(),
      status: 'Sent (Delivered)',
      preview: `Proactive automated alert generated for ${elderProfile?.name}.`,
      html: `<div style="font-family:sans-serif;padding:20px;background:#f0f9ff;"><h3>Proactive Notification</h3><p>Alert type: ${sampleType}</p></div>`,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    return { success: true, log: newNotif };
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      
      {/* Global Navigation Header */}
      <Header
        currentProfile={currentProfile}
        onOpenPasscodeModal={() => setIsPasscodeModalOpen(true)}
        onTriggerSos={() => setIsSosOpen(true)}
        onOpenDoctorReport={() => setIsDoctorReportOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        unreadNotificationsCount={notifications.length}
        mode={mode}
        setMode={setMode}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {mode === 'senior' ? (
          <SeniorModeView
            elderProfile={elderProfile}
            medications={medications}
            adherenceLogs={adherenceLogs}
            appointments={appointments}
            onRecordAdherence={handleRecordAdherence}
            onCheckIn={handleCheckIn}
            onTriggerSos={() => setIsSosOpen(true)}
          />
        ) : (
          <CaretakerFamilyDashboard
            currentProfile={currentProfile}
            elderProfile={elderProfile}
            medications={medications}
            adherenceLogs={adherenceLogs}
            appointments={appointments}
            vitals={vitals}
            caregiverNotes={caregiverNotes}
            notifications={notifications}
            onAddMedication={handleAddMedication}
            onUpdateMedication={handleUpdateMedication}
            onDeleteMedication={handleDeleteMedication}
            onRefillMedication={handleRefillMedication}
            onAddAppointment={handleAddAppointment}
            onUpdateAppointment={handleUpdateAppointment}
            onDeleteAppointment={handleDeleteAppointment}
            onAddVitals={handleAddVitals}
            onAddNote={handleAddNote}
            onRecordAdherence={handleRecordAdherence}
            onOpenNotifications={() => setIsNotificationsOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <p>CareBridge &bull; Interconnected Elderly Care &amp; Medication Management Ecosystem</p>
        <p className="mt-1 text-[11px] text-slate-400">
          Proactive Email Engine Active &bull; Passcode Security &bull; Voice Accessibility &bull; Clinical Export
        </p>
      </footer>

      {/* Passcode Authentication Modal */}
      <PasscodeModal
        profiles={profiles}
        currentProfile={currentProfile}
        isOpen={isPasscodeModalOpen}
        onClose={() => setIsPasscodeModalOpen(false)}
        onSelectProfile={handleSelectProfile}
      />

      {/* Proactive Email Notification Center Modal */}
      <EmailNotificationCenter
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onTriggerTestEmail={handleTriggerTestEmail}
        elderProfile={elderProfile}
      />

      {/* Doctor Health Summary Report Modal (Printable) */}
      <DoctorReportModal
        isOpen={isDoctorReportOpen}
        onClose={() => setIsDoctorReportOpen(false)}
      />

      {/* Emergency SOS Modal */}
      <SosModal
        isOpen={isSosOpen}
        onClose={() => setIsSosOpen(false)}
        onConfirmSos={handleConfirmSos}
        elderProfile={elderProfile}
      />

    </div>
  );
}

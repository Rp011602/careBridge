import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import {
  getDoseReminderEmail,
  getMissedDoseAlertEmail,
  getAppointmentReminderEmail,
  getRefillAlertEmail,
  getSosEmergencyAlertEmail,
} from './emailTemplates.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'db.json');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Helper to read and write database
function getDb() {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading db.json:', err);
    return {};
  }
}

function saveDb(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing db.json:', err);
  }
}

// Mailer Setup (with fallback Ethereal test account or simulated dispatcher)
let transporter = null;
async function initMailer() {
  try {
    // Attempt creating test ethereal account for real nodemailer preview URLs
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log('Nodemailer initialized with Ethereal test mailbox:', testAccount.user);
  } catch (err) {
    console.log('Using simulated in-app email dispatcher');
  }
}
initMailer();

async function sendNotificationEmail({ type, to, subject, html, text }) {
  const db = getDb();
  let previewUrl = null;

  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: '"CareBridge Smart Healthcare" <carebridge.alerts@carebridge.demo>',
        to: to || 'carecircle@carebridge.demo',
        subject,
        text: text || subject,
        html,
      });
      previewUrl = nodemailer.getTestMessageUrl(info);
      console.log(`[EMAIL DISPATCHED] To: ${to} | Subject: ${subject} | Preview: ${previewUrl}`);
    } catch (e) {
      console.warn('Real mail dispatch error (falling back to in-app log):', e.message);
    }
  }

  const logEntry = {
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    type,
    subject,
    recipient: to || 'carecircle@carebridge.demo',
    timestamp: new Date().toISOString(),
    status: 'Sent (Delivered)',
    preview: text || subject,
    html,
    previewUrl,
  };

  db.notificationLogs = db.notificationLogs || [];
  db.notificationLogs.unshift(logEntry);
  // Keep last 40 logs
  if (db.notificationLogs.length > 40) db.notificationLogs.pop();
  saveDb(db);

  return logEntry;
}

// -------------------------------------------------------------
// PROACTIVE BACKGROUND CHECKER TICKER
// Checks for overdue medications and upcoming appointments
// -------------------------------------------------------------
function runProactiveHealthcareChecks() {
  const db = getDb();
  const elder = (db.profiles || []).find((p) => p.role === 'elder') || { name: 'Eleanor Vance' };
  const caregivers = (db.profiles || []).filter((p) => p.role === 'caretaker' || p.role === 'family');
  const caregiverEmails = caregivers.map((c) => c.email).filter(Boolean).join(', ');

  const now = new Date();
  const currentHours = now.getHours();
  const currentMins = now.getMinutes();
  const currentTimeTotal = currentHours * 60 + currentMins;

  // Check for medications that were scheduled today and are overdue by > 30 minutes
  (db.medications || []).forEach((med) => {
    if (!med.active || !med.timeStr || med.timeStr === 'PRN') return;

    const [hh, mm] = med.timeStr.split(':').map(Number);
    if (isNaN(hh) || isNaN(mm)) return;
    const medTimeTotal = hh * 60 + mm;
    const minutesDiff = currentTimeTotal - medTimeTotal;

    // If dose is > 30 mins overdue and not taken today
    if (minutesDiff >= 30 && minutesDiff <= 240) {
      const todayStr = now.toISOString().split('T')[0];
      const todayLog = (db.adherenceLogs || []).find(
        (log) => log.medId === med.id && log.date === todayStr && log.status === 'taken'
      );

      // Check if we already sent an overdue alert in the last 2 hours
      const recentAlert = (db.notificationLogs || []).find(
        (notif) =>
          notif.type === 'missed_dose_alert' &&
          notif.subject.includes(med.name) &&
          new Date(notif.timestamp) > new Date(Date.now() - 2 * 60 * 60 * 1000)
      );

      if (!todayLog && !recentAlert) {
        console.log(`[PROACTIVE ALERT TRIGGERED] Overdue medication detected: ${med.name}`);
        const html = getMissedDoseAlertEmail({
          patientName: elder.name,
          medicationName: med.name,
          dosage: med.dosage,
          scheduledTime: med.timeStr,
          minutesOverdue: minutesDiff,
          caregiverName: 'Care Circle',
          contacts: caregivers,
        });

        sendNotificationEmail({
          type: 'missed_dose_alert',
          to: caregiverEmails || 'caregiver@carebridge.demo',
          subject: `⚠️ PROACTIVE ALERT: ${elder.name} missed ${med.name} dose (${minutesDiff}m overdue)`,
          text: `Proactive Alert: ${elder.name} has not confirmed taking ${med.name} (${med.dosage}) scheduled for ${med.timeStr}. Please follow up.`,
          html,
        });
      }
    }
  });
}

// Run proactive check every 45 seconds
setInterval(runProactiveHealthcareChecks, 45000);

// -------------------------------------------------------------
// API ROUTES
// -------------------------------------------------------------

// Profiles & Auth
app.get('/api/profiles', (req, res) => {
  const db = getDb();
  // Provide safe profile details with passcode hint for convenience
  res.json(db.profiles || []);
});

app.post('/api/auth/verify', (req, res) => {
  const { profileId, passcode } = req.body;
  const db = getDb();
  const profile = (db.profiles || []).find((p) => p.id === profileId);

  if (!profile) {
    return res.status(404).json({ success: false, message: 'Profile not found' });
  }

  if (profile.passcode === passcode) {
    return res.json({ success: true, profile });
  } else {
    return res.status(401).json({ success: false, message: 'Incorrect passcode. Please try again.' });
  }
});

// Medications
app.get('/api/medications', (req, res) => {
  const db = getDb();
  res.json(db.medications || []);
});

app.post('/api/medications', (req, res) => {
  const db = getDb();
  const newMed = {
    id: `med-${Date.now()}`,
    active: true,
    ...req.body,
  };
  db.medications = db.medications || [];
  db.medications.push(newMed);
  saveDb(db);
  res.status(201).json(newMed);
});

app.put('/api/medications/:id', (req, res) => {
  const { id } = req.params;
  const db = getDb();
  const index = (db.medications || []).findIndex((m) => m.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Medication not found' });
  }
  db.medications[index] = { ...db.medications[index], ...req.body };
  saveDb(db);
  res.json(db.medications[index]);
});

app.delete('/api/medications/:id', (req, res) => {
  const { id } = req.params;
  const db = getDb();
  db.medications = (db.medications || []).filter((m) => m.id !== id);
  saveDb(db);
  res.json({ success: true });
});

app.post('/api/medications/:id/refill', (req, res) => {
  const { id } = req.params;
  const { count = 30 } = req.body;
  const db = getDb();
  const med = (db.medications || []).find((m) => m.id === id);
  if (!med) return res.status(404).json({ message: 'Medication not found' });

  med.remainingPills = (med.remainingPills || 0) + Number(count);
  saveDb(db);

  // Log note
  const newNote = {
    id: `note-${Date.now()}`,
    author: req.body.authorName || 'Care Circle Member',
    authorRole: 'Caretaker',
    timestamp: new Date().toISOString(),
    category: 'Prescription Refill',
    text: `Refilled prescription for ${med.name} (+${count} doses). Total stock now at ${med.remainingPills} doses.`,
  };
  db.caregiverNotes = db.caregiverNotes || [];
  db.caregiverNotes.unshift(newNote);
  saveDb(db);

  res.json({ success: true, medication: med });
});

// Adherence Logs
app.get('/api/adherence', (req, res) => {
  const db = getDb();
  res.json(db.adherenceLogs || []);
});

app.post('/api/adherence/record', async (req, res) => {
  const { medId, status, notes, recordedBy } = req.body;
  const db = getDb();
  const med = (db.medications || []).find((m) => m.id === medId);
  if (!med) return res.status(404).json({ message: 'Medication not found' });

  const todayStr = new Date().toISOString().split('T')[0];
  const existingIndex = (db.adherenceLogs || []).findIndex(
    (log) => log.medId === medId && log.date === todayStr
  );

  const entry = {
    id: `adh-${Date.now()}`,
    medId,
    medName: `${med.name} ${med.dosage}`,
    date: todayStr,
    scheduledTime: med.timeStr,
    actionTime: new Date().toISOString(),
    status, // 'taken' | 'snoozed' | 'skipped'
    recordedBy: recordedBy || 'Eleanor Vance',
    notes: notes || '',
  };

  if (existingIndex >= 0) {
    db.adherenceLogs[existingIndex] = entry;
  } else {
    db.adherenceLogs = db.adherenceLogs || [];
    db.adherenceLogs.unshift(entry);
  }

  // Deduct pill if taken
  if (status === 'taken' && med.remainingPills > 0) {
    med.remainingPills -= 1;
    // Check if below threshold -> trigger refill notification
    if (med.remainingPills <= (med.refillThreshold || 7)) {
      const elder = (db.profiles || []).find((p) => p.role === 'elder') || { name: 'Eleanor Vance' };
      const html = getRefillAlertEmail({
        patientName: elder.name,
        medicationName: med.name,
        remainingPills: med.remainingPills,
        threshold: med.refillThreshold || 7,
        pharmacyName: med.pharmacy,
      });
      sendNotificationEmail({
        type: 'refill_warning',
        to: 'caregivers@carebridge.demo',
        subject: `⚠️ Low Supply: ${med.name} has only ${med.remainingPills} doses left`,
        text: `Refill warning: ${med.name} is running low for ${elder.name}. Only ${med.remainingPills} doses left.`,
        html,
      });
    }
  }

  saveDb(db);
  res.json({ success: true, log: entry, medication: med });
});

// Appointments
app.get('/api/appointments', (req, res) => {
  const db = getDb();
  res.json(db.appointments || []);
});

app.post('/api/appointments', async (req, res) => {
  const db = getDb();
  const newApt = {
    id: `apt-${Date.now()}`,
    status: 'upcoming',
    ...req.body,
  };
  db.appointments = db.appointments || [];
  db.appointments.push(newApt);
  saveDb(db);

  // Proactively send appointment confirmation reminder email
  const elder = (db.profiles || []).find((p) => p.role === 'elder') || { name: 'Eleanor Vance' };
  const caregivers = (db.profiles || []).filter((p) => p.role === 'caretaker' || p.role === 'family');
  const caregiverEmails = caregivers.map((c) => c.email).filter(Boolean).join(', ');

  const html = getAppointmentReminderEmail({
    patientName: elder.name,
    doctorName: newApt.doctorName,
    specialty: newApt.specialty,
    clinicName: newApt.clinicName,
    address: newApt.address,
    appointmentDate: newApt.appointmentDate,
    appointmentTime: newApt.appointmentTime,
    transportation: newApt.transportation,
    questions: newApt.questions,
  });

  await sendNotificationEmail({
    type: 'appointment_reminder',
    to: caregiverEmails || 'carecircle@carebridge.demo',
    subject: `🗓️ CareBridge Appointment Scheduled: ${newApt.doctorName} on ${newApt.appointmentDate}`,
    text: `Upcoming Doctor Appointment for ${elder.name}: ${newApt.doctorName} (${newApt.specialty}) on ${newApt.appointmentDate} at ${newApt.appointmentTime}.`,
    html,
  });

  res.status(201).json(newApt);
});

app.put('/api/appointments/:id', (req, res) => {
  const { id } = req.params;
  const db = getDb();
  const index = (db.appointments || []).findIndex((a) => a.id === id);
  if (index === -1) return res.status(404).json({ message: 'Appointment not found' });
  db.appointments[index] = { ...db.appointments[index], ...req.body };
  saveDb(db);
  res.json(db.appointments[index]);
});

app.delete('/api/appointments/:id', (req, res) => {
  const { id } = req.params;
  const db = getDb();
  db.appointments = (db.appointments || []).filter((a) => a.id !== id);
  saveDb(db);
  res.json({ success: true });
});

// Vitals
app.get('/api/vitals', (req, res) => {
  const db = getDb();
  res.json(db.vitals || []);
});

app.post('/api/vitals', (req, res) => {
  const db = getDb();
  const newVital = {
    id: `vit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    ...req.body,
  };
  db.vitals = db.vitals || [];
  db.vitals.unshift(newVital);
  saveDb(db);
  res.status(201).json(newVital);
});

// Caregiver & Family Notes
app.get('/api/notes', (req, res) => {
  const db = getDb();
  res.json(db.caregiverNotes || []);
});

app.post('/api/notes', (req, res) => {
  const db = getDb();
  const newNote = {
    id: `note-${Date.now()}`,
    timestamp: new Date().toISOString(),
    ...req.body,
  };
  db.caregiverNotes = db.caregiverNotes || [];
  db.caregiverNotes.unshift(newNote);
  saveDb(db);
  res.status(201).json(newNote);
});

// Senior Wellbeing Check-in
app.post('/api/check-in', async (req, res) => {
  const { status, emoji, note } = req.body;
  const db = getDb();
  const elder = (db.profiles || []).find((p) => p.role === 'elder');
  if (elder) {
    elder.lastCheckIn = {
      status,
      emoji,
      note,
      timestamp: new Date().toISOString(),
    };
  }

  // If senior feels dizzy, unwell, or in pain, immediately alert caregivers!
  if (status.toLowerCase().includes('dizzy') || status.toLowerCase().includes('pain') || status.toLowerCase().includes('unwell')) {
    const caregivers = (db.profiles || []).filter((p) => p.role === 'caretaker' || p.role === 'family');
    const caregiverEmails = caregivers.map((c) => c.email).filter(Boolean).join(', ');

    await sendNotificationEmail({
      type: 'wellbeing_alert',
      to: caregiverEmails,
      subject: `⚠️ Urgent Check-in Alert: Eleanor reported feeling "${status}" ${emoji || ''}`,
      text: `Eleanor Vance completed her daily check-in and reported feeling "${status}". Note: ${note || 'No additional note'}. Please reach out to verify how she is feeling.`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; background: #fff1f2; border: 2px solid #f87171; border-radius: 12px; max-width: 500px; margin: auto;">
          <h2 style="color: #991b1b; margin-top: 0;">⚠️ Patient Wellbeing Alert</h2>
          <p><strong>Eleanor Vance</strong> reported feeling <strong>${status}</strong> (${emoji}) at ${new Date().toLocaleTimeString()}.</p>
          ${note ? `<p style="background: white; padding: 10px; border-radius: 8px;"><em>"${note}"</em></p>` : ''}
          <p style="color: #7f1d1d;"><strong>Action recommended:</strong> Please give Eleanor a call or visit to check on her comfort.</p>
        </div>
      `,
    });
  }

  saveDb(db);
  res.json({ success: true, checkIn: elder ? elder.lastCheckIn : null });
});

// SOS Emergency Trigger
app.post('/api/emergency/sos', async (req, res) => {
  const db = getDb();
  const elder = (db.profiles || []).find((p) => p.role === 'elder') || { name: 'Eleanor Vance' };
  const latestVitals = (db.vitals || [])[0];
  const caregivers = (db.profiles || []).filter((p) => p.role === 'caretaker' || p.role === 'family');
  const caregiverEmails = caregivers.map((c) => c.email).filter(Boolean).join(', ');

  const html = getSosEmergencyAlertEmail({
    patientName: elder.name,
    triggeredAt: new Date().toLocaleString(),
    location: elder.address || 'Home Residence',
    emergencyContacts: caregivers,
    currentVitals: latestVitals,
  });

  const log = await sendNotificationEmail({
    type: 'emergency_sos',
    to: caregiverEmails || 'emergency@carebridge.demo',
    subject: `🚨 EMERGENCY SOS ACTIVATED BY ${elder.name.toUpperCase()}!`,
    text: `EMERGENCY ALERT: ${elder.name} activated the Emergency SOS button at ${new Date().toLocaleString()}. Immediate assistance required! Location: ${elder.address}`,
    html,
  });

  // Log in caregiver notes
  const emergencyNote = {
    id: `note-sos-${Date.now()}`,
    author: 'CareBridge Emergency System',
    authorRole: 'System SOS Alert',
    timestamp: new Date().toISOString(),
    category: 'EMERGENCY SOS',
    text: `🚨 EMERGENCY SOS button triggered by ${elder.name} at ${new Date().toLocaleTimeString()}. High priority emails and audio alerts broadcast to all care circle members.`,
  };
  db.caregiverNotes = db.caregiverNotes || [];
  db.caregiverNotes.unshift(emergencyNote);
  saveDb(db);

  res.json({ success: true, message: 'Emergency SOS broadcast sent', log });
});

// Notification Logs & Test Triggers
app.get('/api/notifications', (req, res) => {
  const db = getDb();
  res.json(db.notificationLogs || []);
});

app.post('/api/notifications/test-email', async (req, res) => {
  const { sampleType } = req.body;
  const db = getDb();
  const elder = (db.profiles || []).find((p) => p.role === 'elder') || { name: 'Eleanor Vance' };
  const caregivers = (db.profiles || []).filter((p) => p.role === 'caretaker' || p.role === 'family');
  const caregiverEmails = caregivers.map((c) => c.email).filter(Boolean).join(', ');

  let log = null;

  if (sampleType === 'dose_reminder') {
    const med = (db.medications || [])[0] || { name: 'Metformin', dosage: '500 mg', timeStr: '08:30' };
    const html = getDoseReminderEmail({
      patientName: elder.name,
      medicationName: med.name,
      dosage: med.dosage,
      scheduledTime: med.timeStr,
      instructions: med.instructions,
      pillColor: med.pillColor,
      pillShape: med.pillShape,
    });
    log = await sendNotificationEmail({
      type: 'dose_reminder',
      to: 'eleanor.vance@carebridge.demo',
      subject: `💊 Reminder: Time for your ${med.name} (${med.dosage})`,
      text: `Hi ${elder.name}, it is time for your ${med.name} (${med.dosage}) scheduled for ${med.timeStr}.`,
      html,
    });
  } else if (sampleType === 'missed_dose') {
    const med = (db.medications || [])[1] || { name: 'Lisinopril', dosage: '10 mg', timeStr: '09:00' };
    const html = getMissedDoseAlertEmail({
      patientName: elder.name,
      medicationName: med.name,
      dosage: med.dosage,
      scheduledTime: med.timeStr,
      minutesOverdue: 45,
      caregiverName: 'Care Circle',
      contacts: caregivers,
    });
    log = await sendNotificationEmail({
      type: 'missed_dose_alert',
      to: caregiverEmails,
      subject: `⚠️ PROACTIVE ALERT: ${elder.name} missed ${med.name} dose (45m overdue)`,
      text: `Alert: ${elder.name} has not confirmed taking ${med.name} (${med.dosage}). Overdue by 45 minutes.`,
      html,
    });
  } else if (sampleType === 'appointment_reminder') {
    const apt = (db.appointments || [])[0] || {
      doctorName: 'Dr. Robert Chen',
      specialty: 'Cardiology',
      clinicName: 'Oakridge Heart Center',
      address: '740 Medical Parkway',
      appointmentDate: '2026-11-18',
      appointmentTime: '14:30',
      transportation: 'Sarah driving',
    };
    const html = getAppointmentReminderEmail({
      patientName: elder.name,
      doctorName: apt.doctorName,
      specialty: apt.specialty,
      clinicName: apt.clinicName,
      address: apt.address,
      appointmentDate: apt.appointmentDate,
      appointmentTime: apt.appointmentTime,
      transportation: apt.transportation,
      questions: apt.questions,
    });
    log = await sendNotificationEmail({
      type: 'appointment_reminder',
      to: caregiverEmails,
      subject: `🗓️ Reminder: ${elder.name}'s appointment with ${apt.doctorName} on ${apt.appointmentDate}`,
      text: `Reminder: Appointment with ${apt.doctorName} on ${apt.appointmentDate} at ${apt.appointmentTime}.`,
      html,
    });
  } else if (sampleType === 'refill_warning') {
    const med = (db.medications || []).find((m) => m.remainingPills <= 7) || (db.medications || [])[0];
    const html = getRefillAlertEmail({
      patientName: elder.name,
      medicationName: med.name,
      remainingPills: med.remainingPills || 4,
      threshold: med.refillThreshold || 7,
      pharmacyName: med.pharmacy,
    });
    log = await sendNotificationEmail({
      type: 'refill_warning',
      to: caregiverEmails,
      subject: `⚠️ Prescription Refill Warning: ${med.name} running low`,
      text: `Refill warning: ${med.name} has only ${med.remainingPills} doses remaining.`,
      html,
    });
  }

  res.json({ success: true, log });
});

// Consolidate Doctor Visit Summary Report Data
app.get('/api/summary/report', (req, res) => {
  const db = getDb();
  const elder = (db.profiles || []).find((p) => p.role === 'elder') || {};
  const medications = db.medications || [];
  const adherence = db.adherenceLogs || [];
  const vitals = db.vitals || [];
  const nextAppointment = (db.appointments || [])[0] || null;

  // Compute adherence rate
  const takenCount = adherence.filter((l) => l.status === 'taken').length;
  const totalCount = adherence.length || 1;
  const adherenceRate = Math.round((takenCount / totalCount) * 100);

  res.json({
    elder,
    medications,
    adherenceRate,
    adherenceCount: { taken: takenCount, total: totalCount },
    recentVitals: vitals.slice(0, 5),
    nextAppointment,
    generatedAt: new Date().toISOString(),
  });
});

// Serve frontend static build if available
const DIST_PATH = path.join(__dirname, '..', 'dist');
if (fs.existsSync(DIST_PATH)) {
  app.use(express.static(DIST_PATH));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(DIST_PATH, 'index.html'));
    }
  });
}

app.listen(PORT, () => {
  console.log(`CareBridge backend server running on http://localhost:${PORT}`);
});

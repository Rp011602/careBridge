// Beautiful, clean, responsive HTML email templates for CareBridge

export function getDoseReminderEmail({ patientName, medicationName, dosage, scheduledTime, instructions, pillColor, pillShape }) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }
    .card { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
    .header { background: linear-gradient(135deg, #0284c7, #0ea5e9); color: white; padding: 28px 24px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 700; }
    .content { padding: 28px 24px; }
    .badge { display: inline-block; background: #e0f2fe; color: #0369a1; padding: 6px 14px; border-radius: 9999px; font-weight: 600; font-size: 14px; margin-bottom: 16px; }
    .med-box { background: #f0f9ff; border: 2px solid #bae6fd; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center; }
    .med-title { font-size: 22px; font-weight: 800; color: #0369a1; margin: 0 0 8px 0; }
    .med-details { font-size: 16px; color: #334155; margin: 4px 0; }
    .instructions { background: #fffbeb; border-left: 4px solid #f59e0b; padding: 12px 16px; border-radius: 4px; margin: 16px 0; font-size: 14px; color: #92400e; text-align: left; }
    .cta-button { display: inline-block; background: #0284c7; color: #ffffff !important; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 16px; margin: 16px 0; }
    .footer { text-align: center; padding: 20px; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>CareBridge Medication Reminder</h1>
      <p style="margin: 8px 0 0 0; opacity: 0.9;">Keeping you healthy and on schedule</p>
    </div>
    <div class="content">
      <div class="badge">Scheduled Time: ${scheduledTime}</div>
      <p style="font-size: 16px; line-height: 1.6;">Hello <strong>${patientName}</strong>,</p>
      <p style="font-size: 15px; color: #475569;">It is time for your scheduled medication. Taking your doses on time helps you maintain your health and avoid complications.</p>
      
      <div class="med-box">
        <div class="med-title">💊 ${medicationName}</div>
        <div class="med-details"><strong>Dosage:</strong> ${dosage}</div>
        <div class="med-details"><strong>Pill Appearance:</strong> ${pillColor} ${pillShape}</div>
        <div class="instructions">
          <strong>Instructions:</strong> ${instructions || 'Take with a full glass of water.'}
        </div>
      </div>

      <div style="text-align: center;">
        <p style="color: #64748b; font-size: 14px;">Once taken, open your CareBridge Senior Portal to tap <em>"I Took This"</em>.</p>
      </div>
    </div>
    <div class="footer">
      <p>CareBridge Smart Elderly Care Platform &bull; Automated Proactive Healthcare Notification</p>
    </div>
  </div>
</body>
</html>
  `;
}

export function getMissedDoseAlertEmail({ patientName, medicationName, dosage, scheduledTime, minutesOverdue, caregiverName, contacts }) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #fef2f2; margin: 0; padding: 20px; color: #1e293b; }
    .card { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 16px rgba(239, 68, 68, 0.15); border: 2px solid #fecaca; }
    .header { background: linear-gradient(135deg, #dc2626, #ef4444); color: white; padding: 28px 24px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 700; }
    .content { padding: 28px 24px; }
    .alert-pill { display: inline-block; background: #fee2e2; color: #991b1b; padding: 6px 14px; border-radius: 9999px; font-weight: 700; font-size: 13px; margin-bottom: 16px; }
    .alert-box { background: #fff1f2; border: 2px solid #fca5a5; border-radius: 12px; padding: 20px; margin: 20px 0; }
    .alert-title { font-size: 20px; font-weight: 800; color: #b91c1c; margin: 0 0 10px 0; }
    .action-steps { background: #f8fafc; border-radius: 10px; padding: 16px; margin: 20px 0; border: 1px solid #e2e8f0; }
    .action-steps li { margin-bottom: 8px; font-size: 14px; color: #334155; }
    .footer { text-align: center; padding: 20px; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>⚠️ Proactive Missed Dose Alert</h1>
      <p style="margin: 8px 0 0 0; opacity: 0.95;">Action Requested for Care Circle</p>
    </div>
    <div class="content">
      <div class="alert-pill">OVERDUE BY ${minutesOverdue} MINUTES</div>
      <p style="font-size: 16px; line-height: 1.6;">Hello <strong>${caregiverName || 'Care Circle Member'}</strong>,</p>
      <p style="font-size: 15px; color: #475569;">
        Our automated adherence system detected that <strong>${patientName}</strong> has not logged their scheduled medication.
      </p>

      <div class="alert-box">
        <div class="alert-title">💊 ${medicationName} (${dosage})</div>
        <p style="margin: 4px 0; color: #4b5563;"><strong>Scheduled Time:</strong> ${scheduledTime}</p>
        <p style="margin: 4px 0; color: #dc2626; font-weight: 600;"><strong>Status:</strong> Not marked as taken (${minutesOverdue} minutes late)</p>
      </div>

      <div class="action-steps">
        <strong style="color: #0f172a; font-size: 15px;">Recommended Next Steps:</strong>
        <ol style="padding-left: 20px; margin-top: 10px;">
          <li>Contact <strong>${patientName}</strong> to verify if they have taken their dose.</li>
          <li>Check if they are experiencing any dizziness, nausea, or confusion.</li>
          <li>Once verified, record the dose or note in the CareBridge Caretaker Portal.</li>
        </ol>
      </div>
    </div>
    <div class="footer">
      <p>CareBridge Smart Healthcare Monitoring System &bull; Keeping Loved Ones Connected & Safe</p>
    </div>
  </div>
</body>
</html>
  `;
}

export function getAppointmentReminderEmail({ patientName, doctorName, specialty, clinicName, address, appointmentDate, appointmentTime, transportation, questions }) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }
    .card { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
    .header { background: linear-gradient(135deg, #0d9488, #14b8a6); color: white; padding: 28px 24px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 700; }
    .content { padding: 28px 24px; }
    .badge { display: inline-block; background: #ccfbf1; color: #0f766e; padding: 6px 14px; border-radius: 9999px; font-weight: 700; font-size: 13px; margin-bottom: 16px; }
    .apt-card { background: #f0fdfa; border: 2px solid #99f6e4; border-radius: 12px; padding: 20px; margin: 18px 0; }
    .apt-title { font-size: 20px; font-weight: 800; color: #0f766e; margin: 0 0 8px 0; }
    .checklist { background: #f8fafc; border-radius: 10px; padding: 16px; margin: 18px 0; border: 1px solid #e2e8f0; }
    .footer { text-align: center; padding: 20px; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>🗓️ Upcoming Doctor Appointment</h1>
      <p style="margin: 8px 0 0 0; opacity: 0.95;">CareBridge Healthcare Calendar</p>
    </div>
    <div class="content">
      <div class="badge">Appointment Date: ${appointmentDate} at ${appointmentTime}</div>
      <p style="font-size: 16px; line-height: 1.6;">Hello <strong>${patientName} and Care Circle</strong>,</p>
      <p style="font-size: 15px; color: #475569;">This is a proactive reminder for your upcoming medical consultation.</p>

      <div class="apt-card">
        <div class="apt-title">🩺 ${doctorName} &mdash; ${specialty}</div>
        <p style="margin: 4px 0; color: #334155;"><strong>Clinic / Hospital:</strong> ${clinicName}</p>
        <p style="margin: 4px 0; color: #334155;"><strong>Location:</strong> ${address}</p>
        <p style="margin: 4px 0; color: #0f766e; font-weight: 600;"><strong>Companion / Transportation:</strong> ${transportation || 'Family arrangement'}</p>
      </div>

      ${questions ? `
      <div class="checklist">
        <strong style="color: #0f172a; font-size: 14px;">Questions Prepared for Doctor:</strong>
        <p style="margin: 8px 0 0 0; color: #475569; font-style: italic;">"${questions}"</p>
      </div>
      ` : ''}

      <div style="background: #fffbeb; border: 1px solid #fef3c7; border-radius: 10px; padding: 14px; font-size: 13px; color: #92400e;">
        💡 <strong>Tip:</strong> Don't forget to generate and print your <em>Doctor Health Summary Report</em> from the CareBridge portal before your visit.
      </div>
    </div>
    <div class="footer">
      <p>CareBridge Interconnected Healthcare Platform</p>
    </div>
  </div>
</body>
</html>
  `;
}

export function getRefillAlertEmail({ patientName, medicationName, remainingPills, threshold, pharmacyName }) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }
    .card { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
    .header { background: linear-gradient(135deg, #d97706, #f59e0b); color: white; padding: 28px 24px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 700; }
    .content { padding: 28px 24px; }
    .box { background: #fffbeb; border: 2px solid #fde68a; border-radius: 12px; padding: 20px; margin: 18px 0; }
    .footer { text-align: center; padding: 20px; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>📦 Prescription Refill Warning</h1>
      <p style="margin: 8px 0 0 0; opacity: 0.95;">Medication Supply Running Low</p>
    </div>
    <div class="content">
      <p style="font-size: 16px; line-height: 1.6;">Hello Care Circle,</p>
      <p style="font-size: 15px; color: #475569;">
        The inventory for <strong>${patientName}</strong>'s medication is below the safety threshold.
      </p>

      <div class="box">
        <h3 style="margin: 0 0 8px 0; color: #b45309; font-size: 20px;">💊 ${medicationName}</h3>
        <p style="margin: 4px 0; font-size: 16px; color: #92400e;"><strong>Only ${remainingPills} doses remaining!</strong> (Threshold: ${threshold} doses)</p>
        <p style="margin: 4px 0; color: #451a03; font-size: 14px;">Please re-order or contact ${pharmacyName || 'the local pharmacy'} to ensure unbroken continuity of care.</p>
      </div>
    </div>
    <div class="footer">
      <p>CareBridge Smart Refill Intelligence</p>
    </div>
  </div>
</body>
</html>
  `;
}

export function getSosEmergencyAlertEmail({ patientName, triggeredAt, location, emergencyContacts, currentVitals }) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #450a0a; margin: 0; padding: 20px; color: #1e293b; }
    .card { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.3); border: 4px solid #ef4444; }
    .header { background: #b91c1c; color: white; padding: 32px 24px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; font-weight: 800; letter-spacing: 0.5px; }
    .content { padding: 28px 24px; }
    .sos-box { background: #fee2e2; border: 2px solid #ef4444; border-radius: 12px; padding: 20px; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>🚨 EMERGENCY SOS ACTIVATED</h1>
      <p style="margin: 8px 0 0 0; font-size: 16px; font-weight: 600;">Immediate Attention Required</p>
    </div>
    <div class="content">
      <div class="sos-box">
        <h2 style="margin: 0 0 10px 0; color: #991b1b;">Patient: ${patientName}</h2>
        <p style="margin: 6px 0; font-size: 15px; color: #7f1d1d;"><strong>Triggered At:</strong> ${triggeredAt}</p>
        <p style="margin: 6px 0; font-size: 15px; color: #7f1d1d;"><strong>Location:</strong> ${location || 'Home Residence - Living Area'}</p>
        ${currentVitals ? `<p style="margin: 6px 0; font-size: 14px; color: #7f1d1d;"><strong>Last Recorded BP:</strong> ${currentVitals.bloodPressure || 'N/A'} | <strong>Heart Rate:</strong> ${currentVitals.heartRate || 'N/A'} bpm</p>` : ''}
      </div>

      <p style="font-size: 16px; font-weight: 700; color: #991b1b; text-align: center;">
        Please call ${patientName} or emergency responders immediately!
      </p>
    </div>
    <div class="footer">
      <p>CareBridge High-Priority Emergency Broadcast Service</p>
    </div>
  </div>
</body>
</html>
  `;
}

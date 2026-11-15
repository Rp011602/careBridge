// Fallback seed data for standalone/static deployments
export const FALLBACK_SEED = {
  profiles: [
    {
      id: "elder-1",
      name: "Eleanor Vance",
      role: "elder",
      title: "Senior / Patient",
      passcode: "1234",
      age: 78,
      conditions: ["Hypertension", "Type 2 Diabetes", "Mild Osteoarthritis"],
      allergies: ["Penicillin", "Sulfa drugs"],
      bloodGroup: "O+",
      primaryDoctor: "Dr. Robert Chen",
      emergencyPhone: "+1 (555) 234-8900",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250",
      address: "422 Rosewood Lane, Apt 3B, Oakridge",
      lastCheckIn: {
        status: "Feeling Good",
        timestamp: new Date().toISOString(),
        emoji: "😊"
      }
    },
    {
      id: "care-1",
      name: "Marcus Reed",
      role: "caretaker",
      title: "Primary Caregiver (CNA)",
      passcode: "5678",
      phone: "+1 (555) 891-2345",
      email: "marcus.caregiver@carebridge.demo",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250",
      agency: "ComfortLiving Home Care"
    },
    {
      id: "fam-1",
      name: "Sarah Vance",
      role: "family",
      title: "Daughter & Healthcare Proxy",
      passcode: "9999",
      phone: "+1 (555) 345-6789",
      email: "sarah.vance@carebridge.demo",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250",
      relationship: "Daughter"
    },
    {
      id: "doc-1",
      name: "Dr. Robert Chen",
      role: "doctor",
      title: "Cardiologist & PCP",
      passcode: "4321",
      phone: "+1 (555) 789-0123",
      email: "dr.chen@oakridgehealth.demo",
      avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=250",
      clinic: "Oakridge Heart & Vascular Center"
    }
  ],
  medications: [
    {
      id: "med-1",
      name: "Metformin",
      dosage: "500 mg",
      purpose: "Blood sugar regulation (Diabetes)",
      timing: "Morning",
      timeStr: "08:30",
      frequency: "Daily",
      withFood: true,
      instructions: "Take with breakfast and a full glass of water. Do not crush.",
      pillColor: "White",
      pillShape: "Round Tablet",
      pillColorHex: "#f8fafc",
      pillBorderHex: "#94a3b8",
      remainingPills: 42,
      refillThreshold: 14,
      prescribedBy: "Dr. Robert Chen",
      pharmacy: "Oakridge Community Pharmacy (Rx #492819)",
      active: true
    },
    {
      id: "med-2",
      name: "Lisinopril",
      dosage: "10 mg",
      purpose: "Blood pressure management",
      timing: "Morning",
      timeStr: "09:00",
      frequency: "Daily",
      withFood: false,
      instructions: "Take each morning. Avoid salt substitutes containing potassium.",
      pillColor: "Pink",
      pillShape: "Oval Tablet",
      pillColorHex: "#f472b6",
      pillBorderHex: "#db2777",
      remainingPills: 4,
      refillThreshold: 7,
      prescribedBy: "Dr. Robert Chen",
      pharmacy: "Oakridge Community Pharmacy (Rx #782910)",
      active: true
    },
    {
      id: "med-3",
      name: "Vitamin D3",
      dosage: "1,000 IU",
      purpose: "Bone density & immune support",
      timing: "Afternoon",
      timeStr: "13:00",
      frequency: "Daily",
      withFood: true,
      instructions: "Take with lunch or healthy fats for optimal absorption.",
      pillColor: "Golden Amber",
      pillShape: "Softgel Capsule",
      pillColorHex: "#f59e0b",
      pillBorderHex: "#d97706",
      remainingPills: 54,
      refillThreshold: 10,
      prescribedBy: "Dr. Robert Chen",
      pharmacy: "Over-the-counter",
      active: true
    },
    {
      id: "med-4",
      name: "Atorvastatin",
      dosage: "20 mg",
      purpose: "Cholesterol reduction",
      timing: "Bedtime",
      timeStr: "21:00",
      frequency: "Daily",
      withFood: false,
      instructions: "Take before bed. Avoid drinking grapefruit juice.",
      pillColor: "Sky Blue",
      pillShape: "Oblong Capsule",
      pillColorHex: "#38bdf8",
      pillBorderHex: "#0284c7",
      remainingPills: 22,
      refillThreshold: 7,
      prescribedBy: "Dr. Robert Chen",
      pharmacy: "Oakridge Community Pharmacy (Rx #610283)",
      active: true
    },
    {
      id: "med-5",
      name: "Albuterol Sulfate Inhaler",
      dosage: "90 mcg (2 puffs)",
      purpose: "Bronchospasm / breathing relief",
      timing: "As Needed",
      timeStr: "PRN",
      frequency: "As Needed",
      withFood: false,
      instructions: "Rinse mouth after inhalation. Keep accessible at bedside.",
      pillColor: "Teal Blue",
      pillShape: "Aerosol Inhaler",
      pillColorHex: "#14b8a6",
      pillBorderHex: "#0f766e",
      remainingPills: 120,
      refillThreshold: 20,
      prescribedBy: "Dr. Robert Chen",
      pharmacy: "Oakridge Community Pharmacy (Rx #901238)",
      active: true
    }
  ],
  adherenceLogs: [
    {
      id: "adh-1",
      medId: "med-1",
      medName: "Metformin 500mg",
      date: new Date().toISOString().split('T')[0],
      scheduledTime: "08:30",
      actionTime: new Date().toISOString(),
      status: "taken",
      recordedBy: "Eleanor Vance (Self via Senior Portal)",
      notes: "Taken with oatmeal breakfast and water."
    },
    {
      id: "adh-2",
      medId: "med-2",
      medName: "Lisinopril 10mg",
      date: new Date().toISOString().split('T')[0],
      scheduledTime: "09:00",
      actionTime: null,
      status: "pending",
      recordedBy: null,
      notes: null
    },
    {
      id: "adh-3",
      medId: "med-3",
      medName: "Vitamin D3 1000 IU",
      date: new Date().toISOString().split('T')[0],
      scheduledTime: "13:00",
      actionTime: null,
      status: "pending",
      recordedBy: null,
      notes: null
    },
    {
      id: "adh-4",
      medId: "med-4",
      medName: "Atorvastatin 20mg",
      date: new Date().toISOString().split('T')[0],
      scheduledTime: "21:00",
      actionTime: null,
      status: "pending",
      recordedBy: null,
      notes: null
    }
  ],
  appointments: [
    {
      id: "apt-1",
      doctorName: "Dr. Robert Chen",
      specialty: "Cardiology & Vascular",
      clinicName: "Oakridge Heart & Vascular Center",
      address: "740 Medical Parkway, Suite 300, Oakridge",
      phone: "+1 (555) 789-0123",
      appointmentDate: "2026-11-18",
      appointmentTime: "14:30",
      companion: "Sarah Vance (Daughter)",
      transportation: "Sarah will pick up Mom at 1:45 PM",
      prepInstructions: "Bring updated blood pressure log & current medication bottles.",
      questions: "Discuss mild ankle swelling in evenings; review if Lisinopril dosage needs fine-tuning.",
      status: "upcoming"
    },
    {
      id: "apt-2",
      doctorName: "Dr. Laura Patel",
      specialty: "Ophthalmology / Diabetic Eye Exam",
      clinicName: "Oakridge Vision Institute",
      address: "120 Elmwood Blvd, Suite 105",
      phone: "+1 (555) 456-7890",
      appointmentDate: "2026-11-25",
      appointmentTime: "10:15",
      companion: "Marcus Reed (Caregiver)",
      transportation: "ComfortLiving Medical Van requested",
      prepInstructions: "Eyes will be dilated; bring dark sunglasses.",
      questions: "Annual diabetic retinopathy screening; check current reading glasses prescription.",
      status: "upcoming"
    }
  ],
  vitals: [
    {
      id: "vit-1",
      timestamp: new Date().toISOString(),
      bloodPressure: "124/80",
      heartRate: 72,
      bloodGlucose: 108,
      hydrationGlasses: 6,
      recordedBy: "Marcus Reed (Caregiver)",
      notes: "Resting morning vitals. Blood sugar is well controlled."
    }
  ],
  caregiverNotes: [
    {
      id: "note-1",
      author: "Marcus Reed",
      authorRole: "Primary Caregiver",
      timestamp: new Date().toISOString(),
      category: "Daily Routine",
      text: "Morning visit complete. Eleanor enjoyed oatmeal and tea. Took morning Metformin on time. We did 10 minutes of gentle leg stretching on the porch."
    },
    {
      id: "note-2",
      author: "Sarah Vance",
      authorRole: "Daughter",
      timestamp: new Date().toISOString(),
      category: "Family Update",
      text: "Spent the evening with Mom looking through family photo albums. Her spirits were wonderful! Refilled her water carafe by the bedside."
    }
  ],
  notifications: [
    {
      id: "notif-1",
      type: "dose_reminder",
      subject: "CareBridge Reminder: Time for Metformin 500mg",
      recipient: "eleanor.vance@carebridge.demo",
      timestamp: new Date().toISOString(),
      status: "Sent",
      preview: "Scheduled dosage 500mg morning with breakfast.",
      html: ""
    },
    {
      id: "notif-2",
      type: "refill_warning",
      subject: "⚠️ Refill Warning: Lisinopril 10mg running low (4 pills left)",
      recipient: "marcus.caregiver@carebridge.demo, sarah.vance@carebridge.demo",
      timestamp: new Date().toISOString(),
      status: "Sent",
      preview: "Medication is under 7 day safety threshold.",
      html: ""
    }
  ]
};

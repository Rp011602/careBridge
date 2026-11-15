# 🌸 CareBridge | Smart Elderly Care & Medication Management Ecosystem

> **Connected Healthcare Platform for Seniors, Caretakers, and Family Members**  
> *Empowering elderly independence while keeping care circles synchronized, proactive, and informed.*

---

## 🌟 Executive Overview & Challenge Solution

**CareBridge** is an intelligent, interconnected healthcare management ecosystem engineered to bridge the gap between elderly autonomy and proactive caregiver oversight. Rather than acting as a simple reminder alarm, CareBridge operates as a **collaborative care network**:

1. **Passcode-Protected Ecosystem**: Secure, role-differentiated access allowing the Senior (Eleanor Vance), the Primary Caregiver (Marcus Reed), the Family Healthcare Proxy (Sarah Vance), and the Attending Doctor (Dr. Robert Chen) to interact through dedicated interfaces tuned to their cognitive and operational needs.
2. **Proactive Email Reminders & Automated Alerts**: An active 24/7 background healthcare ticker that detects overdue medications (>30 mins), approaching doses, upcoming clinical consultations, and low prescription supply—automatically dispatching responsive HTML email alerts to the care circle.
3. **Senior-Centric Accessibility ("Senior Mode")**: Large high-contrast typography, Web Speech API voice assistant (reads dose schedules and instructions aloud), realistic visual pill box (color and shape matching), 1-tap celebratory "I Took This" logging, daily emotional wellbeing check-ins, and a safeguarded 3-second countdown SOS emergency broadcast.
4. **Caregiver & Family Operations Hub**: Multi-tab control center for medication management, stock refill tracking, appointment logistics (rides, prep instructions, doctor questions), 30-day adherence analytics with 7-day trend graphs, biometric vitals monitoring (BP, glucose, heart rate, hydration), and a shared care-shift handoff wall.
5. **Clinical Health Summary Export**: 1-click printable / PDF-exportable clinical report summarizing active prescriptions, 30-day compliance percentages, and vitals history for doctor visits.

---

## 👥 Demo Profiles & Passcode Credentials

Each member can authenticate through the secure PIN keypad:

| Role | Name | Passcode | Key Capabilities |
| :--- | :--- | :--- | :--- |
| **👵 Senior / Patient** | **Eleanor Vance** (78 yrs) | `1234` | Voice assistant readouts, 1-tap "I Took This", visual pill box, daily mood check-in, 1-tap SOS |
| **🧑‍⚕️ Primary Caregiver** | **Marcus Reed (CNA)** | `5678` | Prescription scheduling, dose confirmations, shift handoffs, vitals logging, refill alerts |
| **👨‍👩‍👧 Family Member** | **Sarah Vance (Daughter)** | `9999` | Adherence compliance metrics, appointment ride logistics, family message wall, peace-of-mind alerts |
| **🩺 Attending Doctor** | **Dr. Robert Chen** | `4321` | Clinical health summary report, prescription review, doctor visit notes & questions |

---

## 🚀 Innovative Features Beyond Basic Reminders

### 1. 🔊 Web Speech API Senior Voice Assistant
- Seniors can tap **"Listen to My Schedule"** or individual pill buttons to hear spoken instructions:
  > *"Good morning Eleanor! Please take 1 tablet of Metformin 500mg with your breakfast and a full glass of water."*
- Spoken confirmation and positive reinforcement upon logging doses.

### 2. 💊 Visual Pill Box & Pill Appearance Identifier
- Seniors frequently struggle to match drug names like *Lisinopril* or *Atorvastatin* with physical pill bottles.
- CareBridge renders visual pill models matching their real-world appearance:
  - **White Round Tablet** (Metformin 500mg)
  - **Pink Oval Tablet** (Lisinopril 10mg)
  - **Golden Amber Softgel** (Vitamin D3)
  - **Sky Blue Oblong Capsule** (Atorvastatin 20mg)
  - **Teal Aerosol Inhaler** (Albuterol)

### 3. 💌 24/7 Proactive Automated Email Engine
- Real background ticker that monitors schedules:
  - **Doses Due**: Sends timely reminder emails with dosage and food directions.
  - **Missed Doses (>30 mins late)**: Automatically escalates an urgent alert email to Marcus and Sarah with suggested next steps.
  - **Refill Safety Warning**: Detects when pills fall below threshold (e.g. 4 pills left for Lisinopril) and triggers refill notices.
  - **Upcoming Appointments**: Sends calendar reminders with ride coordination and doctor questions.
- Built-in **Email Notification Center**:
  - Live dispatch log with recipient, timestamp, and status.
  - 1-click test dispatch buttons for all alert scenarios.
  - Modal with rendered HTML email template inspection + Ethereal Mailbox links.

### 4. 💖 Daily Wellbeing & Mood Escalation
- 1-tap feeling check-in: *Feeling Great 😊, Doing Okay 😌, A Bit Dizzy 😵, In Pain 🤕*.
- If the senior logs **Dizzy** or **Pain**, CareBridge immediately dispatches an urgent wellbeing alert to caregivers.

### 5. 🚨 Emergency SOS with Accidental Click Safeguard
- 3-second hold countdown allows the senior to cancel accidental taps.
- Upon activation: emits an audio alert siren (Web Audio API), sets emergency state, and broadcasts patient location and vitals to all emergency contacts via high-priority email.

### 6. 📄 Printable Doctor Health Summary Report
- Cleanly formatted clinical document ready for printing (`window.print()`) or PDF export for Eleanor's next visit with Dr. Chen.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 19, Vite, Tailwind CSS v4, Lucide Icons, Web Speech API, Web Audio API.
- **Backend**: Node.js, Express, Nodemailer (Ethereal test transporter + simulated dispatcher).
- **Storage**: Persistent JSON database (`server/db.json`).
- **Scheduling**: Proactive background ticker running automated health rule checks.

---

## 🏃 Running the Application

### 1. Start Fullstack Server
To run both the backend API and serve the built client:
```bash
npm start
```
The application will be live at:
👉 **`http://localhost:5000`**

### 2. Development Mode (with Vite HMR)
To run frontend and backend in hot-reloading development mode:
```bash
npm run dev
```
- Client runs on `http://localhost:5173`
- Backend API runs on `http://localhost:5000`

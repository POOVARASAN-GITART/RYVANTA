# RYVANTA '26 — National Level Technical Symposium & Hackathon

An ultra-luxurious, production-ready full-stack web application for managing technical symposium event registrations, dynamic department-to-domain mapping, automated sequential Participation ID generation (`TICH1001`, `TID1001`, `TIC1001`), payment validation, and organizer administration.

- 🌐 **Production Website:** [https://6dd5cafe-980d-4af8-9cb3-99d81028495.vercel.app](https://6dd5cafe-980d-4af8-9cb3-99d81028495.vercel.app)
- 🐙 **GitHub Repository:** [https://github.com/POOVARASAN-GITART/RYVANTA](https://github.com/POOVARASAN-GITART/RYVANTA)

---

## 🏛️ 1. Architecture & Design System

### Regal Gold & White Aesthetic
- **Base Background:** Pure Alabaster / Pearl (`#FAFAFA`)
- **Card Surfaces:** Frosted White (`#FFFFFF`) with metallic borders (`#EAE6DF`)
- **Typography:** Deep charcoal (`#1C1C1C`) for razor-sharp heading contrast and slate charcoal (`#383838`) for body copy.
  - **Headings:** *Playfair Display* (Regal Serif)
  - **Body Text:** *Inter* (Modern Sans-Serif)
  - **Identifiers & Codes:** *JetBrains Mono* (Monospace)
- **Accents:** Metallic Gold Gradients (`#D4AF37` to `#FFD700`) and Dark Gold (`#AA820A`).
- **Interactive Cursor:** Metallic gold dual-ring with ambient spotlight tracking.
- **Dual Live Countdowns:**
  - **Registration Deadline:** **10 September 2026, 11:59 PM IST** (`10-09-2026`)
  - **Symposium Event Day:** **19 September 2026, 08:30 AM IST** (`19-09-2026`)
- **Persistent Floating Helpline Widget:**
  - 📞 **+91 95665 2006**
  - 📞 **+91 90030 18088**

---

## 🏆 2. Technical Event Modules & Rules

### Event 1: Hackathon '26 (Multi-Department Flagship)
- **Participation ID Prefix:** `TICH1001`, `TICH1002`, `TICH1003`...
- **Venue:** Auditorium | **Team Size:** 3 to 4 members | **Fee:** ₹300 per team
- **Dynamic Department-to-Domain Selector:**
  1. **CSE:** Artificial Intelligence & Machine Learning, Computer Vision & Intelligent Inspection, Cybersecurity & Digital Innovation, Advanced Software & Emerging Technologies.
  2. **IT:** Artificial Intelligence & Machine Learning, Computer Vision & Intelligent Inspection, Cybersecurity & Digital Innovation, Cloud Computing & Smart Applications.
  3. **ECE:** IoT, Embedded Systems & Smart Automation, Robotics & Autonomous Systems, Computer Vision & Intelligent Inspection, Smart Communication & Connected Systems.
  4. **EEE:** Smart Energy & Sustainable Engineering, IoT, Embedded Systems & Smart Automation, Robotics & Autonomous Systems, Smart Grid & Energy Management.
  5. **Mechanical Engineering:** Robotics & Autonomous Systems, Smart Manufacturing & Industrial Automation, Computer Vision & Intelligent Inspection, Advanced Engineering & Digital Innovation.
  6. **Aeronautical Engineering:** Smart Mobility, Transportation & Aerospace Technology, Robotics & Autonomous Systems, Drone & Autonomous Flight Technology, Computer Vision & Intelligent Inspection.
  7. **Interdisciplinary / Open Domain:** Advanced Engineering & Digital Innovation, AI-Based Engineering Solutions, Smart Systems & Automation, Emerging Technologies & Innovation.

### Event 2: 2D Games (SOZO '26)
- **Participation ID Prefix:** `TID1001`, `TID1002`, `TID1003`...
- **Venue:** IT Lab | **Team Size:** 2 to 3 members | **Fee:** ₹300 per team
- **10 Thematic Domains:** Cyber Detective, Disaster Resources, Puzzle, Endless Runner, Farming, Space Adventure, Logic, Racing, 2D-Comebacks, Eco City.
- **100-Mark Scoring Matrix:**
  - Gameplay (25 marks)
  - Creativity (25 marks)
  - Visual/UI (15 marks)
  - Technical Implementation (15 marks)
  - Output (10 marks)
  - Presentation (10 marks)

### Event 3: Capture The Flag (NEXVORA '26)
- **Participation ID Prefix:** `TIC1001`, `TIC1002`, `TIC1003`...
- **Venue:** FOSS Lab | **Team Size:** 2 to 3 members | **Fee:** ₹300 per team
- **Format / Rules:** 2 Competitive Rounds, 2 Flags to capture (Web Exploitation, Cryptography, Reverse Engineering, Network Forensics).

---

## 🛠️ 3. Full-Stack Setup Instructions (VS Code on macOS)

### Prerequisites
- **Node.js** (v18 or higher)
- **Python** (v3.9 or higher)
- **Git**

---

### Step 1: Clone Repository
```bash
git clone https://github.com/POOVARASAN-GITART/RYVANTA.git
cd RYVANTA
```

---

### Step 2: Run the React (Vite) Frontend
```bash
# 1. Install dependencies
npm install

# 2. Start Vite development server (runs on http://localhost:5173)
npm run dev

# 3. Build for production
npm run build
```

---

### Step 3: Run the Django Backend
```bash
# 1. Navigate to backend directory
cd ryvanta_backend

# 2. Create and activate Python virtual environment
python3 -m venv venv
source venv/bin/activate

# 3. Install backend dependencies
pip install -r requirements.txt

# 4. Apply database migrations
python manage.py migrate

# 5. Create superuser for Django Admin
python manage.py createsuperuser

# 6. Start Django development server (runs on http://localhost:8000)
python manage.py runserver
```

---

## 📡 4. Backend REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/registrations/` | List all registrations (supports `?search=` and `?event_code=`) |
| `POST` | `/api/registrations/` | Register new team & generate sequential `participation_id` |
| `GET` | `/api/registrations/stats/` | Analytics summary: total teams, verified payments, total fee collection |
| `GET` | `/api/registrations/export/` | Export all registrations as CSV file |
| `GET/POST` | `/admin/` | Django Admin Command Center |

---

## 🔐 5. Organizer Admin Console (`/admin`)
- Frontend Admin modal & `/admin` view is protected by password: **`admin123`**
- Provides live analytics, master registration table with search & filtering, payment status toggle, and one-click **Export to CSV / Excel** button.

---

© 2026 RYVANTA Organizing Committee. All rights reserved.

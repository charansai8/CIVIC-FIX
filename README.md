# CivicFix — Civic Infrastructure Reporting and Resolution Platform

> **"Your Voice. Our Responsibility. A Better Community."**  
> *Report It. Track It. Fix It.*

CivicFix is a full-stack civic infrastructure reporting and resolution platform connecting citizens with municipal authorities for transparent tracking of public issues (potholes, streetlights, water supply, sewage, garbage, public infrastructure).

---

## 🏛️ Key Features

1. **Shared-Letter Vector Logo Design**
   - Typographic geometry where the first letter **I** in `CIVIC` is unified and vertically shared with `FIX` directly beneath it.
   - Scalable Vector Graphics (SVG) maintaining fidelity across all zoom levels.

2. **Distinct Role-Based Access Control (RBAC)**
   - **Citizen (USER)**: Register account, submit issues with vector photo evidence, track lifecycle transitions, review official responses, add citizen follow-up notes, update personal profile.
   - **Municipal Administrator (ADMIN)**: Accessible via authorized officer portal (`admin` / `admin123`). Update complaint statuses, post official administrative responses, edit already published messages, update civic inventory depots, review security audit logs, toggle citizen access.
   - Separate login and signup interfaces for ordinary citizens versus authorized municipal personnel (admin details never displayed on public login forms).

3. **Two-Factor Authentication (2FA)**
   - Built-in 6-digit OTP verification across both Citizen and Administrator accounts for hardened account protection.

4. **Response Notifications & Next-Login Popup**
   - In-app notification bell with real-time audio chime upon status updates and administrative replies.
   - **Mandatory Popup on Next Login**: Whenever a citizen logs in with unread administrative responses, an official notice modal immediately appears with direct links to the relevant complaint.

5. **Wall of Verified Resolutions**
   - Displays solved civic issues, reporter attribution, verified completion dates, and interactive Before/After photographic evidence.

6. **Interactive City GIS Map**
   - High-contrast vector ward boundaries (Madhapur, Gachibowli, Begumpet, Banjara Hills, Old City) with interactive pins, live status filters, zoom controls, and inspection drawer.

7. **Multilingual Regional Support**
   - Native support for **Telugu (తెలుగు)**, **English**, **Hindi (हिन्दी)**, **Marathi (मराठी)**, **Tamil (தமிழ்)**, and **Bengali (বাংলা)**.

8. **Civic AI Assistant (Chatbot)**
   - 24/7 AI-guided assistant providing municipal rules, complaint submission steps, and real-time troubleshooting in regional languages.

---

## 💻 Tech Stack & Architecture

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Motion, Vector SVG graphics, High-Contrast Black & White with accessible accent CTA buttons.
- **Backend (Spring Boot & Express)**:
  - Spring Boot 3.3.x, Spring MVC REST APIs, Spring Security (Role-based access).
  - Spring Data JPA & Hibernate ORM.
  - Express.js integration for instant cloud preview serving.
- **Database**:
  - MySQL relational schema (`backend/src/main/resources/schema.sql`).
  - Foreign key constraints between `users`, `complaints`, `complaint_responses`, `complaint_status_history`, `notifications`, and `civic_inventory`.

---

## 🚀 Local Setup & Execution Instructions

### 1. Frontend (React + Vite)
```bash
# Install dependencies
npm install

# Start development server on port 3000
npm run dev

# Build production bundle
npm run build
```

### 2. Backend (Java Spring Boot + MySQL)
```bash
# Prerequisites: JDK 17+ and MySQL Server running
# Create database
mysql -u root -p < backend/src/main/resources/schema.sql

# Navigate to backend directory and build
cd backend
mvn clean package

# Run Spring Boot service
mvn spring-boot:run
```

---

## 🔑 Default Demonstration Credentials

- **Administrator**:
  - Username: `admin`
  - Passcode: `admin123`
  - Role: `ADMIN`
  - 2FA Code: `123456`
- **Citizen Account (Demo)**:
  - Username: `charan` or email `charansai949090@gmail.com`
  - Password: `password123`
  - Role: `USER`
  - 2FA Code: `123456`

---

## 📦 Source Code Structure

```
├── backend/
│   ├── pom.xml                                  # Maven dependencies
│   └── src/main/
│       ├── java/com/civicfix/
│       │   ├── CivicFixApplication.java         # Spring Boot entry point
│       │   ├── controller/                      # REST API Controllers
│       │   ├── dto/                             # Data Transfer Objects
│       │   ├── entity/                          # JPA Entities
│       │   ├── repository/                      # JPA Repositories
│       │   └── security/                        # Spring Security & RBAC
│       └── resources/
│           ├── application.properties           # Spring Boot configuration
│           └── schema.sql                       # MySQL relational schema & seed
├── src/
│   ├── App.tsx                                  # Central React application
│   ├── components/                              # Modular UI components
│   │   ├── AdminDashboardView.tsx               # Admin inventory, responses & logs
│   │   ├── AuthModal.tsx                        # Separate citizen / admin login
│   │   ├── CitizenDashboardView.tsx             # Citizen tracking & notes
│   │   ├── CivicBotChat.tsx                     # 24/7 AI municipal assistant
│   │   ├── CivicFixLogo.tsx                     # Scalable SVG shared-I wordmark
│   │   ├── ComplaintDetailModal.tsx             # Case file inspection
│   │   ├── HomeView.tsx                         # Landing page with live stats
│   │   ├── InteractiveMapView.tsx               # GIS vector ward map
│   │   ├── Navbar.tsx                           # Multilingual navigation
│   │   ├── ReportIssueModal.tsx                 # Photo evidence submission
│   │   ├── ResponseLoginPopup.tsx               # Login response alert modal
│   │   ├── SolvedIssuesShowcase.tsx             # Wall of resolved complaints
│   │   ├── TwoFactorAuthModal.tsx               # 2FA 6-digit OTP verification
│   │   └── VectorEvidencePhoto.tsx              # Vector SVG proof renderer
│   ├── i18n/
│   │   └── translations.ts                      # Telugu, Hindi, Marathi, Tamil, Bengali
│   ├── services/
│   │   └── store.ts                             # Persistent state & audio alerts
│   ├── types/
│   │   └── index.ts                             # Core TypeScript definitions
│   └── utils/
│       ├── pureLogic.ts                         # Reference generator & RBAC matrix
│       └── pureLogic.test.ts                    # Unit test suite
├── index.html                                   # Entry HTML
├── package.json                                 # Frontend package configuration
├── tsconfig.json                                # TypeScript configuration
└── vite.config.ts                               # Vite build configuration
```

---
*© 2026 CivicFix Platform. High-contrast civic infrastructure reporting & resolution system.*

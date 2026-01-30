# 🎓 CollegeEvents: The Ultimate Campus Ecosystem

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**CollegeEvents** is a comprehensive, all-in-one platform designed to transform the university experience. It bridges the gap between event management, academic excellence, and community engagement through a modern, gamified interface.

---

## 🚀 Getting Started

Follow these steps to get the project running locally:

### 1. Prerequisites
- Node.js 18+ 
- PostgreSQL Database (Local or Cloud like Supabase/Neon)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/elitexsolutions-xyz/Campus-event.git

# Install dependencies
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory and add your credentials:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/college_events"
NEXTAUTH_SECRET="your_secret_here"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Database Initialization
```bash
# Push schema to database
npx prisma db push

# Generate Prisma client
npx prisma generate
```

### 5. Run the Engine
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000) to start your campus journey!

---

## ✨ Features Implemented (Phase 1)

### 🎫 Event Evolution
- **Swipe Discovery**: A Tinder-style swipeable feed for discovering events (`/events/discover`).
- **Smart Tickets**: Digital ticket generation with offline-ready QR codes.
- **Organizer Dashboard**: Real-time attendance analytics and QR check-in engine.
- **Automation**: Bulk invite tools and 24h event reminders.

### 📚 Academic Excellence
- **Academics Hub**: Centralized view for Attendance, SGPA progress, and PT/Sessional alerts.
- **Assignment Portal**: Secure file upload system with deadline tracking and submission history.
- **Smart Seating Engine**: Randomized exam seating algorithm (Fisher-Yates) with hall distribution.

### 👥 Community & Engagement
- **Community Hub**: Three-tier announcement system (College, Club, and Peer levels).
- **Club Management**: Discover and join technical/cultural societies with live member stats.
- **Mentor Network**: Algorithmic matching of Seniors & Alumni based on department and expertise.
- **Safe Space**: Fully anonymous grievance and feedback routing system.

### 🏆 Gamified Participation (USP)
- **Activity Hub**: Automated credit calculation engine (1pt for attending, 3pts for organizing).
- **Badge System**: Unlock achievements like "Alpha Organizer" or "Consistent Peer".
- **Verified Transcript**: UI for generating a placement-ready dossier of all extra-curricular activities.

---

## 🛠️ Technology Stack
- **Frontend**: Next.js 14 (App Router), React, Framer Motion (Animations).
- **Styling**: Tailwind CSS, Shadcn/UI (Modern Component System).
- **Backend**: Next.js API Routes (Serverless).
- **Database**: PostgreSQL with Prisma ORM.
- **Auth**: NextAuth.js (Secure Session Management).

---

## 🗺️ Future Roadmap: Phase 2

### **PHASE 2: Pre-Seed Features (3 Months)**
*Goal: Refine product based on pilot feedback, prepare for funding pitch.*

#### **Additional Features:**
**Enhanced Event Management:**
- ✅ Custom registration forms (dynamic fields)
- ✅ Event categories & filters
- ✅ Calendar view (club-wise, date-wise)
- ✅ Event volunteers recruitment
- ✅ Post-event feedback forms
- ✅ Event photo gallery

**Academic Expansion:**
- ✅ Submission portal (file uploads)
- ✅ PT/Sessional alerts
- ✅ Attendance tracking display
- ✅ Notes repository

**Community Growth:**
- ✅ Club admin roles
- ✅ Sub-admin permissions
- ✅ Club announcements
- ✅ Discussion boards

**Engagement:**
- ✅ Activity chart (detailed)
- ✅ Extra-curricular credits calculation
- ✅ Achievements/badges

#### **Success Metrics (Phase 2):**
- **Adoption**: 10 colleges using platform
- **Revenue**: $5,000 MRR (Monthly Recurring Revenue)
- **Engagement**: 70%+ WAU (Weekly Active Users)
- **Event Volume**: 500+ events/month across platform
- **Assignment Usage**: 60%+ faculty adoption

#### **Deliverables for Funding:**
- ✅ Working product with 10 colleges
- ✅ Case studies (3-5 detailed)
- ✅ User testimonials (students + faculty)
- ✅ Financial model with projections
- ✅ Pitch deck
- ✅ Demo video

**Target Funding**: $50,000 - $150,000 (Pre-Seed/Seed)

---

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

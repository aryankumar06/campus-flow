# Master Implementation Plan: College Event & Academic Platform (CEAP) V.101

This roadmap upgrades your current prototype into a full university engagement + academic management ecosystem.

---

## Phase 1: Core Events + Personalization (Foundation)

**Goal:** Make “Events” addictive, modern, and socially relevant.

### 1) UX Upgrade

* Implement **Swipeable Event Cards** (discovery feed style)
* Add **Calendar View** for club-specific events
  *(Recommended: `fullcalendar` or `react-day-picker`)*

### 2) Registration 2.0 (Dynamic Forms)

* Add `customFields` (JSON) inside the `Event` model to support **dynamic registration forms**
* Implement **Save to Calendar** by generating `.ics` files

### 3) Social Layer

* Add **friendsAttending** logic (based on department + year matching)
* Create **Post-Event Photo Gallery**
  *(Uploadthing / Cloudinary)*

### 4) Organizer Tools

* **Attendance Certificate Generator** (template-based PDF generation)
* **Recurring Events** support
  Fields: `isRecurring`, `frequency`

---

## Phase 2: Academic Core + Digital Classroom (Utility)

**Goal:** Make CEAP the daily-use app for every student.

### 1) Database Expansion

Add new models:

* `Course`
* `Assignment`
* `Submission`

### 2) Assignment Portal

* Faculty dashboard to post:

  * assignment brief
  * due date
  * attachments
* Student portal to:

  * upload submissions
  * track timestamps
  * view submission history

### 3) Exams + Attendance Alerts

* Automatic notifications for:

  * PT (Periodical Tests)
  * Sessionals
* Attendance dashboard with:

  * subject-wise view
  * color-coded warnings (Low Attendance)

### 4) Notes Repository

* Subject-wise resource sharing
* Folder-based structure for clean organization

---

## Phase 3: Community + Communication + Verified Identity (Engagement)

**Goal:** Verified student identity + fast announcements + open community.

### 1) Verified Registration

* Validate **University Roll No / File No**
  *(Regex validation or mock DB lookup)*
* Remove phone number requirement (privacy-first)

### 2) Three-Tier Announcement System

* **Tier 1 (Admin):** Broadcast to everyone (push notifications)
* **Tier 2 (Clubs):** Only to registered members
* **Tier 3 (Community):**

  * discussion threads
  * anonymous Q&A

### 3) Seating Arrangement System

* Algorithm to distribute students across halls/rooms using roll numbers
* Export seating charts:

  * PDF
  * Excel

---

## Phase 4: Credit System + Activity Tracking (Gamification)

**Goal:** Turn participation into measurable academic value (your USP).

### 1) Automated Credit Engine

* Background worker assigns points after QR check-in:

  * Attended → **1 pt**
  * Volunteered → **2 pts**
  * Organized → **3 pts**

### 2) Personal Activity Dashboard

* Charts using **Recharts**
* Track:

  * participation history
  * progress toward semester credit targets

### 3) Extra-Curricular Transcript

* Downloadable official-style transcript for placements
* Auto-generated from credit + event history

---

## Phase 5: Specialized Initiatives + Mentorship (Value-Add)

**Goal:** Career growth + grievance support + mentorship ecosystem.

### 1) Coding Hub

* GitHub API integration for contribution tracking
* **Coding Duels**

  * weekly challenges
  * leaderboard system

### 2) Grievance System

* Anonymous complaint submission + routing
* Categories:

  * Academics
  * Harassment
  * Infrastructure
* Status tracking without exposing identity to intermediate staff

### 3) Mentor Network

* Senior–Junior matching based on:

  * department
  * skills
  * interests
* 1:1 booking system for:

  * career sessions
  * alumni mentoring

---

# Technical Stack (Updated)

* **Database:** PostgreSQL + Prisma *(new migrations required)*
* **Storage:** Uploadthing *(notes, photos, assignments)*
* **Real-time:** Pusher or Socket.io *(announcements + notifications)*
* **PDF Generation:** `react-pdf` or `puppeteer-core` *(certificates + transcripts)*
* **Analytics/UI Charts:** `recharts`


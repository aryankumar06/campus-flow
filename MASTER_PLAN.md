# Master Implementation Plan: College Event & Academic Platform (CEAP)

This plan outlines the roadmap to transform the current prototype into a comprehensive university management and engagement ecosystem.

## Phase 1: Core Event Enhancement & Personalization (Foundation)
*Focus: Strengthening the "Events" pillar and adding social/personal layers.*

1.  **UX Overhaul**:
    *   Implement **Swipeable Cards** for event discovery.
    *   Add **Calendar View** (using `fullcalendar` or `react-day-picker`) for club-specific events.
2.  **Registration 2.0**:
    *   Add `customFields` JSON column to `Event` model for dynamic forms.
    *   Implement "Save to Calendar" (generate `.ics` files).
3.  **Social Integration**:
    *   Add `friendsAttending` logic based on department/year matchups.
    *   Create a **Photo Gallery** for post-event memories (Uploadthing/Cloudinary).
4.  **Organizing Tools**:
    *   Attendance certificate generator (Template-based PDF generation).
    *   Recurring event logic (`isRecurring`, `frequency`).

## Phase 2: Academic Core & Digital Classroom (Utility)
*Focus: Becoming the daily driver for students via academic tools.*

1.  **Database Expansion**:
    *   Create `Assignment`, `Course`, and `Submission` models.
2.  **Assignment Portal**:
    *   Faculty dashboard to post briefs and due dates.
    *   Student upload portal with timestamp tracking and history.
3.  **Exam & Attendance Alerts**:
    *   Automatic notifications for PT (Periodical Test) and Sessional schedules.
    *   Attendance dashboard with color-coded "Low Attendance" warnings.
4.  **Notes Repository**:
    *   Resource sharing system (Subject-wise folders).

## Phase 3: Community, Communication & Identity (Engagement)
*Focus: Frictionless communication and verified identity.*

1.  **Verified Registration**:
    *   Update signup to validate University Roll No. / File No. (Regex or mock DB validation).
    *   Remove phone number requirement to prioritize privacy as requested.
2.  **Three-Tier Announcement System**:
    *   **Tier 1: Admin**: Broadcast to all (Push notifications).
    *   **Tier 2: Club**: To registered members.
    *   **Tier 3: Community**: Open discussion threads and Anonymous Q&A.
3.  **Seating Arrangement Algorithm**:
    *   Logic to distribute students across Hall/Room based on roll numbers.
    *   Generate exportable seating charts (PDF/Excel).

## Phase 4: Credit System & Activity Tracking (Gamification)
*Focus: Turning participation into academic value (The USP).*

1.  **Automated Credit Engine**:
    *   Implement a worker that adds points upon QR check-in:
        *   Attended: 1 pt | Organized: 3 pts | Volunteered: 2 pts.
2.  **Personal Activity Chart**:
    *   Visual dashboard (Recharts) showing participation history and progress towards semester credit goals.
3.  **Transcript Generator**:
    *   Feature to download an official "Extra-Curricular Transcript" for placements.

## Phase 5: Specialized Initiatives & Mentorship (Value-Add)
*Focus: Career growth and grievance redressal.*

1.  **Coding Hub**:
    *   Integration with **GitHub API** for contribution tracking.
    *   **Coding Duels**: Leaderboard-driven weekly challenges.
2.  **Grievance System**:
    *   **Anonymous Complaint Routing**: Category-based logic (Academics, Harassment, Infrastructure).
    *   Status tracking for students without exposing identity to intermediate staff.
3.  **Mentor Network**:
    *   Senior-Junior matching algorithm based on department and skills.
    *   1:1 booking system for career/alumni sessions.

---

## Technical Stack Adjustments
*   **Database**: PostgreSQL (Prisma) - *Needs migrations for new models.*
*   **Storage**: Uploadthing (for notes/photos/assignments).
*   **Real-time**: Pusher or Socket.io (for announcements/notifications).
*   **PDF Gen**: `react-pdf` or `puppeteer-core` (for certificates/transcripts).
*   **Analytics**: `recharts` for dashboards.

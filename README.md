# SkillConnect – Peer Skill-Sharing & Exchange Platform

> **"Share What You Know. Learn What You Love."**  
> SkillConnect is a modern, community-based skill-sharing and peer-exchange web application built with React, Vite, and Tailwind CSS. Everyone on the platform can act as both a **Teacher** and a **Learner**.

---

## 🚀 Key Features

### 1. Modern SaaS Landing Page
- **Hero Section**: High-impact messaging, community stats (12,400+ members, 1,850+ skills), dual CTAs (*Explore Skills* and *Become a Teacher*).
- **10 Core Sections**:
  1. Popular Skill Categories (18 categories with live filtering)
  2. How SkillConnect Works (4-step visual flow)
  3. Trending Skills Marketplace
  4. Featured Community Mentors & Teachers
  5. Why Choose SkillConnect (The Peer Advantage)
  6. Success Stories & Real Case Studies
  7. Verified Testimonials & Star Ratings
  8. Interactive FAQ Accordion
  9. High-conversion CTA banner
  10. Full-featured product footer with Reset Demo Data control

### 2. Dual Authentication Flow
- **Login**: Email/password authentication, show/hide password, "Remember Me", demo credentials banner, and 1-click test persona quick-switcher.
- **Registration**: Dual profile creation specifying skills you can teach (tag input) and skills you want to learn, experience level, preferred learning method, avatar selector, and location.
- **Additional Auth Screens**:
  - Forgot Password
  - Reset Password
  - 6-Digit Email Verification UI
  - Registration Success Onboarding screen

### 3. Personalized User Dashboard
- **Welcome Banner**: Dynamic greeting, summary of pending proposals, upcoming sessions, and profile completion bar.
- **KPI Stats Cards**: Skills taught, skills learned, completed sessions, learning hours, and mentor star rating.
- **Visual Analytics**: Interactive Weekly Learning Activity chart (teaching hours vs learning hours).
- **Upcoming Sessions Cards**: Direct meeting link launcher, completion, and rescheduling.
- **Recent Notifications Feed**: Real-time alert list with direct navigation.
- **Mutual Skill Exchange Widget**: Highlights matching members.

### 4. Skill Discovery Marketplace
- **18 Filterable Categories**: Web Development, UI/UX Design, Programming, Languages, Music, Photography, Cooking, Finance, Communication, Video Editing, etc.
- **Search & Filters**: Search by skill title, category, or teacher name; filter by skill level (Beginner/Intermediate/Advanced), learning format (Online/In-Person/Hybrid), minimum star rating, and sorting (Popularity, Highest Rated, Newest).
- **Interactive Skill Cards**: Wishlist heart bookmarking, teacher profile preview, format badge, and direct *Connect* / *View Details* actions.

### 5. Detailed Skill Overview
- Cover photo, comprehensive description, learning outcomes checklist, session-by-session topics covered, prerequisites, schedule, and teacher bio.
- **Request to Learn Modal**: Personal intro, goals, schedule, and preferred format.
- **Direct Messaging Shortcut** and **Skill Exchange Proposal Modal**.
- **Verified Reviews & Teacher Responses**.
- **Similar Skills Recommendation Carousel**.

### 6. Teacher Portal – My Teaching
- Manage published listings (Active/Paused/Draft).
- Add new skills with multi-field validation, topic breakdown, and cover image selection.
- Edit and delete listings with confirmation modals.
- Incoming learner proposals management: Accept and immediately schedule sessions, or decline requests.

### 7. Learner Portal – My Learning
- Track enrolled courses, active learning progress bars, and upcoming sessions.
- Sent proposal tracker with cancel capability.
- Completed session history with direct review submission modal.
- Saved Wishlist skills with 1-click access.

### 8. The Skill Exchange System (Killer Feature)
- Algorithmic mutual matching logic: Matches users where *User A offers what User B wants* and *User B offers what User A wants*.
- **100% Mutual Match Badges** with transparent breakdown ("They teach Figma, you teach React!").
- Propose exchanges, track completed swap sessions, and schedule swap meetings.

### 9. Interactive Sessions & Scheduling
- **List View & Interactive Monthly Calendar View**.
- Reschedule, mark as completed, cancel, or join meeting rooms (*Open Google Meet / Zoom placeholder*).
- Automatic review prompt upon session completion with duplicate review prevention.

### 10. Direct Messaging Interface
- Real-time simulated chat with local state persistence.
- Conversation list with live search and unread badges.
- Message history with timestamps and quick-reply suggestion pills.

### 11. Community Reviews & Ratings
- 1 to 5 star ratings, written reviews, reviewer profiles, and average rating breakdown.
- **Teacher Response UI**: Instructors can reply directly to learner feedback.

### 12. Notification Center
- Dropdown bell menu in top navigation + full notification center page.
- Mark as read, mark all as read, unread filtering, and notification deletion.

### 13. Progress Tracking & Personal Goals
- Total logged learning hours counter.
- **Personal Learning Goals Checklist**: Add custom goals, toggle completion, and track percentage progress.
- Community badges display (Top Rated Teacher, Super Exchanger, Fast Responder, etc.).

### 14. Settings & Preferences
- Account details (avatar, name, email, headline, bio, location, availability).
- Privacy controls (public profile toggle, schedule visibility, direct message permissions).
- Alert settings.
- Platform preferences (language, format).
- **Reset All Demo Data** and **Sign Out** actions.

---

## 🛠️ Architecture & Folder Structure

```
skillconnect/
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── cards/
│   │   │   ├── ExchangeMatchCard.jsx
│   │   │   ├── SessionCard.jsx
│   │   │   ├── SkillCard.jsx
│   │   │   └── TeacherCard.jsx
│   │   ├── common/
│   │   │   ├── Badge.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── ConfirmationModal.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── Select.jsx
│   │   ├── forms/
│   │   │   ├── ExchangeRequestModal.jsx
│   │   │   ├── RequestLearnModal.jsx
│   │   │   ├── ReviewModal.jsx
│   │   │   ├── ScheduleSessionModal.jsx
│   │   │   └── SkillFormModal.jsx
│   │   └── layout/
│   │       ├── DashboardLayout.jsx
│   │       ├── DashboardSidebar.jsx
│   │       ├── DashboardTopNav.jsx
│   │       ├── Footer.jsx
│   │       └── Navbar.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── SkillContext.jsx
│   │   └── ToastContext.jsx
│   ├── data/
│   │   └── mockData.js
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── EmailVerifyPage.jsx
│   │   │   ├── ForgotPasswordPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── RegisterSuccessPage.jsx
│   │   │   └── ResetPasswordPage.jsx
│   │   ├── dashboard/
│   │   │   ├── DashboardOverviewPage.jsx
│   │   │   ├── LearnerPortalPage.jsx
│   │   │   ├── LearningRequestsPage.jsx
│   │   │   ├── NotificationsPage.jsx
│   │   │   ├── ProgressPage.jsx
│   │   │   ├── ReviewsPage.jsx
│   │   │   ├── SkillExchangePage.jsx
│   │   │   └── TeacherPortalPage.jsx
│   │   ├── discover/
│   │   │   └── DiscoverPage.jsx
│   │   ├── messages/
│   │   │   └── MessagesPage.jsx
│   │   ├── profile/
│   │   │   └── UserProfilePage.jsx
│   │   ├── public/
│   │   │   └── LandingPage.jsx
│   │   ├── sessions/
│   │   │   └── SessionsPage.jsx
│   │   ├── settings/
│   │   │   └── SettingsPage.jsx
│   │   └── skills/
│   │       └── SkillDetailsPage.jsx
│   ├── routes/
│   │   └── AppRoutes.jsx
│   ├── services/
│   │   ├── authService.js
│   │   ├── exchangeService.js
│   │   ├── messageService.js
│   │   ├── notificationService.js
│   │   ├── requestService.js
│   │   ├── reviewService.js
│   │   ├── sessionService.js
│   │   ├── skillService.js
│   │   └── userService.js
│   ├── utils/
│   │   └── storage.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── eslint.config.js
├── index.html
├── package.json
└── vite.config.js
```

---

## 🎨 Design System

| Role | Color Value | Description |
|---|---|---|
| **Primary** | `#4F46E5` (Indigo-600) | Brand primary buttons, active links, accents |
| **Secondary** | `#7C3AED` (Purple-600) | Secondary CTAs, badges, exchange highlights |
| **Accent** | `#14B8A6` (Teal-600) | Status badges, highlights, success tags |
| **Background** | `#F8FAFC` (Slate-50) | App surface canvas |
| **Card Background** | `#FFFFFF` | Cards, modals, dialogs |
| **Main Text** | `#0F172A` (Slate-900) | High-contrast headers and primary body |
| **Secondary Text** | `#64748B` (Slate-500) | Labels, hints, timestamps |
| **Success** | `#16A34A` (Emerald-600) | Completed statuses, confirmation toasts |
| **Error** | `#DC2626` (Rose-600) | Decline, errors, validation alerts |

---

## 🧪 Demo Personas Available

You can instantly switch accounts using the **Demo Switcher** in the dashboard top navigation:
1. **Priya Sharma** (`priya.sharma@example.com`): Senior Frontend Engineer (Teaches React & Tailwind, wants UI/UX & Spanish).
2. **Alex Chen** (`alex.chen@example.com`): Product Designer (Teaches Figma & UI/UX, wants React & Python).
3. **Rohan Patel** (`rohan.patel@example.com`): Full Stack Python Dev (Teaches FastAPI & Backend, wants Figma).
4. **Elena Rostova** (`elena.r@example.com`): Polyglot Tutor (Teaches Spanish & French, wants Web Dev).
5. **Vikram Malhotra** (`vikram.m@example.com`): Acoustic Guitarist (Teaches fingerstyle guitar, wants Video Editing).
6. **Marcus Johnson** (`marcus.j@example.com`): Video Editor & Motion Designer (Teaches Premiere Pro, wants Guitar & Finance).

---

## 💻 Getting Started

### Installation
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

### Production Build & Verification
```bash
npm run build
npm run preview
```

### Linting
```bash
npm run lint
```

# ConsultHub — FSKTM Student Consultation Booking System

A Progressive Web App (PWA) for managing consultation appointments between students and lecturers at the Faculty of Computing and Information Technology (FSKTM).

## 🚀 Features

### Student
- Browse lecturers by name, department, or specialization
- View real-time availability and book consultation slots
- Cancel and reschedule bookings
- Track booking history and status

### Lecturer
- Set and manage weekly availability slots
- Approve / reject student booking requests
- View daily and weekly schedule
- Mark student attendance (Attended / No-Show)

### Administrator
- Manage student and lecturer accounts
- View all system bookings with filters
- Generate usage reports and analytics
- Publish system-wide announcements

## 🛠️ Tech Stack

| Layer | Current | Planned |
|---|---|---|
| Frontend | HTML, CSS, JavaScript | Next.js + React |
| Styling | Vanilla CSS (Custom Design System) | CSS Modules / Tailwind |
| Data | In-memory mock data | Database (TBD) |
| PWA | Service Worker + Manifest | next-pwa |

## 📱 PWA Support

ConsultHub is installable as a Progressive Web App:
- **Offline-capable** — works without internet after first load
- **Installable** — add to home screen on mobile and desktop
- **Responsive** — adapts to all screen sizes

## 🏗️ Project Structure

```
consulthub/
├── index.html          # Main SPA shell
├── styles.css          # Design system & all styles
├── data.js             # Mock data (students, lecturers, bookings)
├── app.js              # Application logic & page renderers
├── sw.js               # Service worker (PWA offline)
├── manifest.json       # PWA manifest
├── package.json        # Project config
├── icons/
│   └── icon-512.jpg    # App icon
└── README.md
```

## 🔄 Next.js Migration Guide

This project is structured for easy migration to Next.js:

| Current File | Next.js Equivalent |
|---|---|
| `index.html` | `app/layout.tsx` (shell) |
| `styles.css` | `app/globals.css` |
| `data.js` | `lib/mock-data.ts` |
| `app.js` page renderers | Individual page components in `app/` |
| `sw.js` | `next-pwa` plugin |
| `manifest.json` | `public/manifest.json` |

### Component Mapping

| Current JS Function | Next.js Page/Component |
|---|---|
| `renderStudentDashboard()` | `app/dashboard/page.tsx` |
| `renderBrowseLecturers()` | `app/lecturers/page.tsx` |
| `renderLecturerDetail()` | `app/lecturers/[id]/page.tsx` |
| `renderMyBookings()` | `app/bookings/page.tsx` |
| `renderBookingConfirmation()` | `app/bookings/confirmation/page.tsx` |
| `renderManageBookings()` | `app/manage/page.tsx` |
| `renderSetAvailability()` | `app/availability/page.tsx` |
| `renderMySchedule()` | `app/schedule/page.tsx` |
| `renderUserManagement()` | `app/admin/users/page.tsx` |
| `renderAllBookings()` | `app/admin/bookings/page.tsx` |
| `renderReports()` | `app/admin/reports/page.tsx` |
| `renderAnnouncements()` | `app/admin/announcements/page.tsx` |
| `renderNotifications()` | `app/notifications/page.tsx` |
| `renderProfile()` | `app/profile/page.tsx` |

## 🏃 Running Locally

```bash
# Quick start (no install needed)
npx serve .

# Or simply open index.html in your browser
```

## 📄 License

MIT

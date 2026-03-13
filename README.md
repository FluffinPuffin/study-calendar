# StudyCalendar

A weekly study session planner and tracker built with React and Firebase. Plan your study sessions, track your progress, and visualize how you spend your study time — all synced to the cloud.

## Live Demo

[Deployed URL here]

## Features

1. **Weekly Calendar Grid** — 7-day view showing all study sessions at a glance
2. **Create / Edit / Delete Sessions** — Add sessions with subject, start time, duration, notes, and color
3. **Drag and Drop** — Drag sessions between days to reschedule
4. **Mark Complete** — Check off sessions as you finish them, with bulk "mark all complete" and "clear week" actions
5. **Search and Filter** — Search sessions by subject name or filter to a specific subject
6. **Weekly Progress Tracker** — Completion percentage and total study hours for the week
7. **Study Time Chart** — Bar chart breaking down study hours by subject
8. **User Authentication** — Sign up, log in, and log out with email and password; session persists on refresh

## Technologies Used

- **React** + **Vite** — Frontend framework and build tool
- **Firebase Authentication** — Email/password auth with session persistence
- **Firebase Firestore** — Cloud database for user-specific session and subject data
- **@dnd-kit** — Drag-and-drop between calendar days
- **Recharts** — Bar chart for study time visualization
- **React Router** — Client-side routing with protected routes
- **CSS Custom Properties** — Consistent theming and responsive layout

## Architecture

**Frontend:** React SPA with React Router. Protected routes redirect unauthenticated users to login. Auth state is managed via a context provider (`AuthContext`) so all components have access to the current user.

**Backend:** Firebase (no custom server).
- `AuthContext.jsx` wraps Firebase Auth and exposes `currentUser`, `login`, `signup`, and `logout`
- `useSessions` and `useSubjects` hooks handle all Firestore reads/writes with real-time `onSnapshot` listeners

**Database Structure:**
```
users/
  {uid}/
    sessions/
      {sessionId}/
        subject: string
        date: string        // "YYYY-MM-DD"
        startTime: string   // "HH:MM"
        duration: number    // minutes
        notes: string
        color: string       // hex color
        completed: boolean
        createdAt: timestamp
    subjects/
      {subjectName}/
        color: string       // hex color
```

Security rules enforce that users can only read and write their own data (`request.auth.uid == userId`).

## Setup Instructions

1. Clone the repo
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the project root (see `.env.example` for the required variables) and fill in your Firebase project credentials
4. Start the dev server:
   ```bash
   npm run dev
   ```

## Known Bugs / Limitations

- The weekly view is fixed to the current week — there is no navigation to past or future weeks
- No recurring sessions (each session must be created individually)
- No mobile drag-and-drop support (touch events not implemented)

## What I Learned

Building this project taught me how to work with AI as a real development partner rather than just a code generator. I learned to give Claude specific context — error messages, expected behavior, and constraints — instead of vague requests, which made the responses much more useful. I also learned when to push back: Claude suggested adding a state management library early on, but I kept the architecture simpler since the state was mostly local to one component. The biggest growth was in debugging — learning to describe what I expected versus what actually happened made AI-assisted debugging much faster than just pasting errors and hoping for a fix.

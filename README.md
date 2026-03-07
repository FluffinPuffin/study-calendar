# StudyCalendar

## Project Description

StudyCalendar is a browser-based web app that helps students schedule and track their study sessions throughout the week. Users can create study blocks by subject, mark sessions as complete, and monitor their weekly progress — with all data saved automatically via localStorage, no account or backend required.

## Planned Features

1. **Weekly Calendar View** — Display study sessions organized by day so students can see their full schedule at a glance.
2. **Add / Edit / Delete Sessions** — Create study blocks with a subject name, start time, duration, and optional notes; update or remove them at any time.
3. **Subject Color Coding** — Assign a unique color to each subject for quick visual identification across the calendar.
4. **Session Completion Tracking** — Check off finished sessions and view a weekly completion percentage to stay motivated.
5. **localStorage Persistence** — All session data is saved directly in the browser; no login or server needed.

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Markup | HTML5 |
| Styling | CSS3 (custom properties, CSS Grid, Flexbox) |
| Logic | Vanilla JavaScript (ES6+) |
| Storage | Web localStorage API |
| Fonts | Google Fonts — Inter |
| Deployment | GitHub Pages / Netlify |

## Project Goals

- Build a practical tool that solves a real student problem: keeping study sessions organized
- Practice structuring a vanilla JS app without relying on frameworks
- Use the browser's localStorage API to persist data without a backend
- Create a clean, responsive UI that works on both desktop and mobile
- Deliver a complete, deployable project within a two-week development window

## Deployment Plan

The app is a fully static site (HTML + CSS + JS) with no build step required, which makes deployment straightforward.

**GitHub Pages (primary)**
1. Push the repository to GitHub (public repo)
2. Go to Settings → Pages → Deploy from branch `main`, root `/`
3. GitHub will publish the site at `https://<username>.github.io/study-calendar/`

**Netlify (alternative)**
1. Drag the project folder into the Netlify drop zone at netlify.com/drop
2. Netlify generates a live URL instantly — no configuration needed

Both options are free and update automatically when new commits are pushed to `main`.

# Bugsy

A collaborative bug tracking platform for engineering teams, built on the MERN stack. Report bugs, discuss them in-thread, assign and track them through their lifecycle, and get AI-assisted debugging suggestions when you're stuck — all with real-time updates so nobody's staring at a stale dashboard.

I built this to actually be used, not just to sit in a portfolio — it's currently running with real users.

**Live:** [frontend link](https://bugsy-peach.vercel.app/) · [API](https://bugsy-backend.onrender.com/)

---

## What it does

**Auth** — JWT-based auth plus Google OAuth, with bcrypt password hashing and persistent sessions. Routes are protected and role-aware.

**Teams** — Create a team or join one with an invite code. Bugs are scoped to teams, and there's a history view so you can see what's happened over time.

**Bug tracking** — Create, update, assign, and delete bugs, with status, priority, and category fields. Nothing exotic, but it covers the actual workflow a small team needs.

**Discussion threads** — Every bug has its own comment thread, so debugging conversations stay attached to the bug instead of scattered across Slack.

**AI debugging assistance** — Bugs can be run through an LLM (via OpenRouter) to get suggested causes and fixes — useful as a first pass before a human digs in.

**Attachments** — Screenshots and images upload via Cloudinary, which matters more than you'd think for UI bugs where a picture says more than a description ever will.

**Real-time sync** — Socket.IO pushes updates to everyone on a team instantly — no refreshing to see if someone already picked up the bug you were about to grab.

**Profile management** — Edit your username, profile picture, and password; works whether you signed up via email or Google.

The UI is responsive and dark-themed by default — nothing fancy, just clean enough that it doesn't feel like a class project.

## Tech stack

- **Frontend:** React, React Router, Tailwind CSS, DaisyUI, Vite, Socket.IO client
- **Backend:** Node.js, Express, MongoDB/Mongoose, JWT, Passport.js, Google OAuth 2.0, Socket.IO
- **Infra:** Cloudinary for media, Render (backend) + Vercel (frontend) for hosting

## Project structure

```
Bugsy
├── frontend
│   ├── src
│   ├── components
│   ├── pages
│   └── lib
├── backend
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── middleware
│   ├── config
│   └── utils
└── README.md
```

## Running it locally

Clone the repo:

```bash
git clone https://github.com/yourusername/bugsy.git
cd bugsy
```

Backend:

```bash
cd backend
npm install
npm run dev
```

Frontend (separate terminal):

```bash
cd frontend
npm install
npm run dev
```

### Environment variables

**Backend `.env`**

```
PORT=
MONGO_URI=
JWT_SECRET=
CLIENT_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
OPENROUTER_API_KEY=
```

**Frontend `.env`**

```
VITE_API_BASE_URL=
```

## Screenshots

<!-- TODO: replace with actual screenshots, see instructions below -->
![Landing page](.//frontend/public/landing page.png)
![Dashboard](.//frontend/public/dashboard.png)
![Discussion](.//frontend/public/discussion section.png)
![AI suggestions](.//frontend/public/ai.png)
![Team page](.//frontend/public/team page.png)
![Bug Details](.//frontend/public/bug details.png)

## Demo

<!-- TODO: link demo video once uploaded -->
[Watch a walkthrough](https://www.linkedin.com/feed/update/urn:li:activity:7480631560942039040/)

## What's next

A few things I'd add with more time: email notifications, better search/filtering, a Kanban view, and some basic analytics on bug resolution time.

## Contributing

Open to PRs — fork it and go.

---

**Sujal Bhardwaj** — [GitHub](https://github.com/sujal-io) · [LinkedIn](https://www.linkedin.com/in/sujal-bhardwaj-8332b92b1/)

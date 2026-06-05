# 🐞 Bugsy — Catch Bugs Before Users Do

A **production-ready MERN stack application** designed to help teams **track, manage, and resolve bugs collaboratively** through structured workflows, role-based access control, real-time collaboration, AI-assisted debugging, and complete activity tracking.

---

## 🚀 Why This Project Matters

Most beginner bug trackers stop at CRUD functionality.

Bugsy goes beyond that by implementing:

* **Real-world workflow constraints** (who can update what)
* **Team-based data isolation**
* **Role-based permissions**
* **Real-time collaboration**
* **AI-assisted debugging**
* **Comprehensive audit logging**
* **Activity tracking and accountability**

👉 Built to simulate how actual software engineering teams manage bugs throughout their lifecycle.

---

## ✨ Core Features

### 🔐 Authentication & Security

* Secure signup/login using **JWT authentication**
* Protected routes and middleware-based authorization
* Persistent user sessions
* Team-specific access control

---

### 👥 Team Collaboration System

* Create teams and invite members using unique invite codes
* Join existing teams seamlessly
* Team-scoped bug visibility and collaboration
* Role-based access system:

  * **Admin**
  * **Member**
* Team history and rejoining support

---

### 🐛 Bug Lifecycle Management

Create and manage bugs with:

* Title
* Description
* Priority
* Status
* Assignee

Supported workflow:

```text
Open → In Progress → Fixed
```

Features include:

* My Bugs
* Team Bugs
* Assigned To Me
* Creator/Admin-only deletion

---

### 🎯 Assignment & Ownership

* Assign bugs to team members
* Clear ownership and accountability
* Assignment tracking throughout the bug lifecycle
* Authorization checks before assignment updates

---

### 🔒 Role-Based Workflow Control (RBAC)

Implements realistic engineering constraints:

#### Assigned User Can:

* Mark bug as Fixed
* Add bug solution

#### Creator Can:

* Edit bug details

#### Admin Can:

* Manage team-level actions

This prevents unrealistic state transitions and enforces ownership.

---

### ⚡ Real-Time Collaboration

Built using **Socket.IO** and team-specific rooms.

Instant synchronization for:

* Bug creation
* Bug updates
* Bug deletion
* Comments
* Activity timeline events

Benefits:

* No manual refresh required
* Team-wide visibility of changes
* Event-driven architecture
* Team-isolated realtime communication

👉 Implemented using Socket.IO rooms to ensure only relevant team members receive updates.

---

### 💬 Collaborative Comments

* Discussion threads for each bug
* Team communication directly within bug reports
* Collapsible UI for better readability
* Real-time comment synchronization

---

### 📜 Activity Timeline (Audit Logs)

Every important action is automatically tracked.

Examples:

* Bug created
* Bug assigned
* Status updated
* Solution added
* Comment added
* Bug fixed

Benefits:

* Accountability
* Auditability
* Debugging workflow visibility
* Complete bug history tracking

Inspired by professional tools like Jira and GitHub Issues.

---

### 🧠 AI-Powered Bug Assistance

Integrated using **OpenRouter**.

Provides:

* Potential root causes
* Debugging suggestions
* Step-by-step fix recommendations

Additional Features:

* Structured response formatting
* Copy-to-clipboard support
* Dismissible UI
* Fallback handling when AI requests fail

---

### 🎛️ Advanced Filtering & UX

Filter bugs by:

* Status
* Priority
* Title search

Additional capabilities:

* Sorting (Newest / Oldest)
* Pagination
* Responsive layouts
* Optimized user experience

---

### 🎨 UI/UX Highlights

* Modern glassmorphism-inspired design
* Fully responsive interface
* Loading states and skeleton loaders
* Toast notifications
* Clean and distraction-free workflow
* Reusable React component architecture

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Tailwind CSS
* DaisyUI
* React Router
* Socket.IO Client
* Custom API abstraction layer

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* Socket.IO

### Integrations

* JWT Authentication
* OpenRouter AI
* LocalStorage
* Render Deployment
* Vercel Deployment

---

## 📁 Project Structure

```text
/backend
 ├── controllers
 ├── models
 ├── routes
 ├── middlewares
 ├── config
 └── server.js

/frontend
 ├── components
 ├── pages
 ├── lib
 ├── hooks
 └── main.jsx
```

---

## 🧠 System Design Highlights

* Role-Based Access Control (RBAC)
* Team-based Multi-Tenancy
* Controlled Workflow State Transitions
* Real-Time Event-Driven Architecture
* Activity Logging & Audit Trail
* Modular Backend Architecture
* Reusable Frontend Components
* AI + Fallback Hybrid Architecture
* Socket.IO Team Rooms

---

## 🔄 Application Flow

1. User signs up or logs in
2. User creates or joins a team
3. User creates a bug
4. Bug is assigned to a team member
5. Activity is automatically logged
6. Team members collaborate through comments
7. Updates are synchronized in real time
8. Assigned user fixes the bug and adds a solution
9. Complete activity history remains available through the timeline

---

## 🌐 Deployment

### Frontend

https://bugsy-peach.vercel.app

### Backend

https://bugsy-backend.onrender.com

---

## ⚙️ Local Setup

### Clone Repository

```bash
git clone https://github.com/your-username/bugsy.git
cd bugsy
```

### Backend Setup

```bash
cd backend
npm install
```

Create `.env`

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
OPENROUTER_API_KEY=your_api_key
```

Run:

```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 📌 Future Enhancements

* Real-time notification system
* User presence indicators (online/offline)
* Email notifications
* Analytics dashboard
* File & image attachments
* Advanced search capabilities
* Team productivity insights

---

## 🤝 Contributing

Contributions are welcome.

Feel free to fork the repository and submit pull requests.

---

## 🙌 Acknowledgements

* OpenRouter
* Socket.IO
* MongoDB Atlas
* Tailwind CSS
* DaisyUI
* Render
* Vercel

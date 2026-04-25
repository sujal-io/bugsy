# 🐞 Bug Tracking & Team Collaboration System

A **production-ready MERN stack application** designed to help teams **track, manage, and resolve bugs collaboratively** with structured workflows, role-based access control, AI-assisted debugging, and full activity tracking.

---

## 🚀 Why This Project Matters

Most beginner bug trackers are just CRUD apps.

This system goes beyond that by implementing:

* **Real-world workflow constraints** (who can update what)
* **Team-based data isolation**
* **Role-based permissions**
* **AI-assisted debugging with fallback reliability**
* **Audit logging system (activity timeline)**

👉 Built to simulate how actual engineering teams manage bugs.

---

## ✨ Core Features

### 🔐 Authentication & Security

* Secure signup/login using **JWT authentication**
* Persistent sessions via localStorage
* Protected routes & middleware-based authorization

---

### 👥 Team Collaboration System

* Create or join teams using **invite codes**
* **Team-scoped bug visibility**
* Role system:

  * **Admin**
  * **Member**
* View team history and rejoin previously joined teams for seamless continuity

---

### 🐛 Bug Lifecycle Management

* Create bugs with:

  * Title, description, priority
* Organized views:

  * My Bugs
  * Team Bugs
  * Assigned to Me
* Status workflow:

  ```
  Open → In Progress → Fixed
  ```
* Deletion restricted to **creator/admin only**

---

### 🎯 Assignment & Ownership

* Assign bugs to team members
* Enforces **clear ownership**
* Only authorized users can assign bugs

---

### 🔒 Role-Based Workflow Control

Implements **strict real-world constraints**:

* Only **assigned user** can:

  * Mark bug as Fixed
  * Add solution
* Only **creator** can:

  * Edit bug details
* Prevents invalid or unrealistic state transitions

---

### 🧠 AI-Powered Bug Assistance

* AI-generated debugging suggestions using **OpenRouter**
* Structured output:

  * Root cause
  * Step-by-step fix
* **Fallback mechanism** ensures reliability if AI fails
* Clean UI with:

  * Copy to clipboard
  * Dismiss option
  * Structured formatting

---

### 💬 Collaborative Comments

* Threaded discussion under each bug
* Enables team communication
* Collapsible UI for better readability

---

### 📜 Activity Timeline (Audit Logs)

* Tracks **who did what and when** for every bug
* Logs key actions such as:

  * Bug created
  * Bug assigned
  * Status changed
  * Solution added
  * Comments added
* Displays a **chronological history per bug**
* Helps in:

  * Debugging workflows
  * Team accountability
  * Understanding bug lifecycle

👉 Inspired by real-world tools like Jira and GitHub Issues.

---

### 🎛️ Advanced Filtering & UX

* Filter by:

  * Status
  * Priority
  * Search (title)
* Sorting:

  * Newest / Oldest
* Pagination for scalability

---

### 🎨 UI/UX Highlights

* Modern **glassmorphism-inspired design**
* Responsive layout
* Toast notifications (success/error)
* Skeleton loaders & loading states
* Clean, minimal, distraction-free interface

---

## 🛠️ Tech Stack

### Frontend

* **React.js**
* **Tailwind CSS + DaisyUI**
* React Router
* Custom API abstraction layer

### Backend

* **Node.js + Express.js**
* **MongoDB + Mongoose**

### Integrations

* JWT Authentication
* OpenRouter (AI)
* LocalStorage (session persistence)

---

## 📁 Project Structure

```
/backend
  /controllers   → Business logic
  /models        → Database schemas
  /routes        → API endpoints
  /middlewares   → Auth & access control

/frontend
  /components    → Reusable UI components
  /pages         → Route-level views
  /lib           → API client & utilities
```

---

## ⚙️ Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/your-username/bug-tracker.git
cd bug-tracker
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env`:

```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
OPENROUTER_API_KEY=your_api_key
```

Run:

```bash
npm run dev
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🧠 System Design Highlights

* **Role-Based Access Control (RBAC)**
* **Team-based multi-tenancy**
* **Controlled state transitions (finite workflow)**
* **Activity logging system (audit trail for all actions)**
* **Separation of concerns (modular backend + reusable frontend)**
* **AI + fallback hybrid architecture**

---

## 🔄 Application Flow

1. User authenticates and joins a team
2. Creates a bug with required details
3. Bug is assigned to a team member
4. Assigned user works and updates status
5. **All actions are recorded in Activity Timeline**
6. Bug is marked as **Fixed** with solution
7. Team collaborates via comments and tracks full history

---

## 📌 Future Enhancements

* Real-time updates using WebSockets
* Notifications system
* Analytics dashboard (team productivity insights)
* File/image attachments for bugs

---

## 🌐 Deployment

The application is fully deployed and accessible online:

* **Frontend** deployed on Vercel
* **Backend API** deployed on Render

```bash
Frontend: https://your-app.vercel.app  
Backend: https://your-api.onrender.com
```


## 🤝 Contributing

Contributions are welcome!
Feel free to fork and submit a pull request.

---

## 🙌 Acknowledgements

* OpenRouter (AI API)
* Tailwind CSS & DaisyUI
* MongoDB Atlas


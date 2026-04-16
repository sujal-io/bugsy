# 🐞 Bug Tracking & Team Collaboration System

A full-stack MERN application that allows teams to collaboratively track, manage, and resolve bugs efficiently with role-based workflows and AI assistance.

---

## 🚀 Features

### 🔐 Authentication

* User signup & login
* JWT-based authentication
* Persistent login using localStorage

---

### 👥 Team Collaboration

* Create or join teams using invite codes
* Team-based bug visibility
* Admin and member roles

---

### 🐛 Bug Management

* Create bugs with title, description, priority
* View bugs in:

  * My Bugs
  * Team Bugs
  * Assigned to Me
* Update bug status:

  * Open → In Progress → Fixed
* Delete bugs (only creator or admin)

---

### 🎯 Bug Assignment System

* Assign bugs to team members
* Only creator/admin can assign bugs
* Assigned user becomes responsible

---

### 🔒 Workflow Control (Role-Based)

* Only assigned user can:

  * Mark bug as **Fixed**
  * Add solution
* Only creator can:

  * Edit bug details (title/description)
* Controlled and realistic bug lifecycle

---

### 🧠 AI Bug Assistance

* Get AI-generated suggestions for bugs
* Structured output:

  * Cause
  * Fix steps
* Fallback logic ensures reliability even if AI fails
* Clean UI with:

  * Copy button
  * Close button
  * Structured formatting

---

### 💬 Comments System

* Add comments to bugs
* Team discussions under each bug
* Collapsible comments section for clean UI

---

### 🎛️ Filters, Sorting & Pagination

* Filter by:

  * Status
  * Priority
  * Search (title)
* Sorting:

  * Newest / Oldest
* Pagination support

---

### 🎨 UI/UX Features

* Modern glassmorphism design
* Toast notifications (success/error)
* Loading states & skeleton UI
* Collapsible sections (comments)
* Clean, responsive layout

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Tailwind CSS + DaisyUI
* React Router
* Custom API client

### Backend

* Node.js
* Express.js
* MongoDB + Mongoose

### Other Tools

* JWT (Authentication)
* OpenRouter (AI integration)
* LocalStorage (state persistence)

---

## 📁 Project Structure

```
/backend
  /controllers
  /models
  /routes
  /middlewares

/frontend
  /components
  /pages
  /lib
```

---

## ⚙️ Installation & Setup

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

Create `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
OPENROUTER_API_KEY=your_api_key
```

Run backend:

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

## 🔑 Key Concepts Implemented

* Role-based access control
* Team-based data isolation
* Controlled workflow system
* Modular API design
* Reusable frontend architecture
* AI + fallback hybrid system

---

## 🧠 How It Works

1. User logs in and joins/creates a team
2. User creates a bug
3. Bug is assigned to a team member
4. Assigned user works on it
5. Only assigned user can mark it as Fixed
6. Solution is added and visible to all
7. Team collaborates via comments

---

## 📌 Future Improvements

* Activity Timeline (who did what)
* Notifications system
* Real-time updates (Socket.io)
* File/image attachments for bugs
* Advanced analytics dashboard

---

## 🤝 Contributing

Contributions are welcome!
Feel free to fork the repo and submit a pull request.

---

## 📄 License

This project is open-source and available under the MIT License.

---

## 🙌 Acknowledgements

* OpenRouter (AI API)
* Tailwind CSS & DaisyUI
* MongoDB Atlas

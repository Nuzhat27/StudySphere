<<<<<<< HEAD
# 📚 StudySphere — MERN Stack SaaS Learning Platform

A multi-user learning platform with JWT auth, role-based access control (Student / Educator / Admin), course + lesson management, file/video uploads, quizzes with auto-grading, lesson discussions, email notifications, and a dark/light themed React frontend.

## Tech Stack
`React` `Node.js` `Express.js` `MongoDB` `JWT` `RBAC` `Cloudinary` `Nodemailer` `Tailwind CSS`

## Project Structure
```
studysphere/
├── backend/
│   ├── config/         # MongoDB + Cloudinary setup
│   ├── models/         # User, Course, Enrollment, Quiz, Comment
│   ├── middleware/      # JWT auth, RBAC, file upload, error handling
│   ├── controllers/    # Business logic per resource
│   ├── routes/         # Express route definitions
│   └── server.js
└── frontend/
    ├── src/
    │   ├── api/          # Axios instance with JWT interceptor
    │   ├── context/       # Auth + Theme (dark/light) context
    │   ├── components/    # Navbar, CourseCard, QuizPlayer, CommentSection, etc.
    │   └── pages/         # Login, Dashboard, CourseCatalog, CourseDetail, AdminPanel...
```

## Features
- **Auth & RBAC** — JWT auth, bcrypt password hashing, 3 roles (student/educator/admin) enforced via middleware
- **Courses** — create/edit/delete, admin approval workflow, search & filter, ratings
- **Lessons** — video/PDF/image uploads via Cloudinary, ordered within a course
- **Progress tracking** — per-student completion tracking, aggregation pipeline for course analytics (enrollment count, avg progress, completion rate)
- **Quizzes** — per-lesson quizzes with auto-grading and pass/fail scoring
- **Discussions** — threaded comments per lesson
- **Email notifications** — enrollment confirmation, course approval/rejection (via Nodemailer)
- **Dark/light theme** — persisted toggle across the app

## Local Setup

### 1. Backend
```bash
cd backend
cp .env.example .env   # fill in MongoDB URI, JWT secret, Cloudinary + email creds
npm install
npm run dev             # runs on http://localhost:5000
```

### 2. Frontend
```bash
cd frontend
cp .env.example .env   # set VITE_API_URL if backend isn't on localhost:5000
npm install
npm run dev             # runs on http://localhost:5173
```

### 3. MongoDB
Create a free cluster at MongoDB Atlas, whitelist your IP (or `0.0.0.0/0` for dev), and paste the connection string into `backend/.env` as `MONGO_URI`.

### 4. Cloudinary (file/video uploads)
Sign up at cloudinary.com, grab your cloud name, API key, and API secret from the dashboard, and add them to `backend/.env`.

### 5. Email (Nodemailer)
For Gmail: enable 2FA and generate an "App Password" — use that as `EMAIL_PASS`. Alternatively use a transactional provider like Mailtrap (for testing) or SendGrid.

## Deployment
- **Backend** → Render / Railway (Node web service). Set the same env vars as `.env`, set `CLIENT_URL` to your deployed frontend URL for CORS.
- **Frontend** → Vercel / Netlify. Set `VITE_API_URL` to your deployed backend's `/api` URL.
- **Database** → MongoDB Atlas (already cloud-hosted, no extra deployment needed).
- **File storage** → Cloudinary (already cloud-hosted).

## Creating an Admin Account
Public registration only allows `student` or `educator`. To get an admin:
1. Register a normal account.
2. In MongoDB Atlas (or Compass), manually change that user's `role` field to `"admin"`.
3. Log in again — the Admin panel link will appear in the navbar.

## API Overview
| Resource | Base route |
|---|---|
| Auth | `/api/auth` (register, login, me) |
| Courses | `/api/courses` (CRUD, lessons, enroll, ratings) |
| Enrollments | `/api/enrollments` (my courses, progress, analytics) |
| Quizzes | `/api/quizzes` (create, fetch, submit) |
| Comments | `/api/comments` (per lesson) |
| Admin | `/api/admin` (users, course review, platform stats) |
=======
# StudySphere
Free, all-in-one MERN learning platform for universities — semester-organized courses, lessons with auto-graded quizzes, doubts answered by faculty, deadline-tracked assignments, and chapter-wise notes/PYQs. Built with React, Node/Express, and MongoDB.
>>>>>>> dca8234b55e3d43590c563f1c8b483f9c626d095

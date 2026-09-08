# Campus Voice — Student Feedback Management System

A full-stack MERN application: students submit feedback about teachers, and
admins manage student records and review feedback ratings.

**Stack:** React (Vite) + Node.js/Express + MongoDB + JWT auth + bcrypt.

```
student-feedback-system/
├── backend/     Express API, MongoDB models, JWT auth
├── frontend/    React app (Vite)
└── README.md
```

---

## 1. Prerequisites

- Node.js 18+ and npm
- A MongoDB database — either:
  - Local MongoDB running on `mongodb://127.0.0.1:27017`, or
  - A free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas) (get a connection string)

---

## 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and set your own values:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/student_feedback_db
JWT_SECRET=replace_this_with_a_long_random_secret
JWT_EXPIRES_IN=7d
```

Create demo accounts (one admin, one student) so you have something to log in with:

```bash
node seed.js
```

This prints the demo credentials:
- **Admin:** `admin@campus.edu` / `Admin@123`
- **Student:** `student@campus.edu` / `Student@123`

Start the API:

```bash
npm run dev      # auto-restarts on changes (requires the nodemon devDependency)
# or
npm start        # plain node
```

You should see:

```
MongoDB connected: ...
Server running on http://localhost:5000
```

Visit `http://localhost:5000` in a browser — you should see a small JSON health-check message.

---

## 3. Frontend setup

Open a **second terminal**:

```bash
cd frontend
npm install
npm run dev
```

Vite will print a local URL, typically `http://localhost:5173`. Open it in your browser.

> The frontend is hard-coded to call the API at `http://localhost:5000/api`
> (see `frontend/src/services/api.js`). Change that base URL if your backend
> runs on a different port or host.

---

## 4. Using the app

1. Go to `http://localhost:5173/login`.
2. **Log in as the student** (`student@campus.edu` / `Student@123`) to reach
   the feedback form. Fill in department, teacher, feedback text, and a
   1–5 rating, then submit.
3. **Log out**, then **log in as the admin** (`admin@campus.edu` / `Admin@123`)
   to reach the Admin Dashboard. From the sidebar you can:
   - **Add Student** — register new students (roll number and email must be unique)
   - **Students** — search, edit, or delete student records
   - **Feedback** — view the rating summary, filter by rating/department/teacher, and search
   - **Dashboard** — see summary cards and charts (rating distribution, feedback by department, average rating by teacher)

To create more accounts, call the register API directly (there is no public
sign-up page by design, since a college feedback system usually provisions
accounts centrally):

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Priya","email":"priya@campus.edu","password":"Priya@123","role":"student"}'
```

---

## 5. Testing each feature

| Feature | How to test |
|---|---|
| Login | Try wrong password → see error message. Try correct credentials → redirected by role. |
| Feedback submission | Submit with an empty field → validation blocks it. Submit valid data → success message + row appears in admin's Feedback page. |
| Add Student | Try a duplicate roll number/email → server returns a 409 conflict with a clear message. |
| Search Student | Type into the search box on Student Management → table filters as you type (name, branch, email, phone, roll number). |
| Edit Student | Click Edit → modal opens pre-filled → change a field → Update → table refreshes and a toast confirms. |
| Delete Student | Click Delete → confirmation modal → Yes, Delete → row disappears + toast confirms. |
| Filter Feedback by rating | On Feedback Management, choose a star rating from the dropdown → table narrows to that rating only. |
| Search Feedback | Type a student, department, or teacher name in the feedback search box. |
| Admin Dashboard | Confirm the summary cards and charts match the number of feedback entries you've submitted. |
| Route protection | Log in as a student and manually visit `/admin/dashboard` in the URL bar → you're redirected away. Log out and visit any protected page → redirected to `/login`. |
| Logout | Click "Log out" in the top bar → redirected to login, and protected pages become inaccessible until you log back in. |

---

## 6. API reference

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Create a user account |
| POST | `/api/auth/login` | Public | Log in, returns a JWT |
| POST | `/api/students` | Admin | Add a student |
| GET | `/api/students?search=` | Admin | List/search students |
| GET | `/api/students/:id` | Admin | Get one student |
| PUT | `/api/students/:id` | Admin | Update a student |
| DELETE | `/api/students/:id` | Admin | Delete a student |
| POST | `/api/feedback` | Logged-in user | Submit feedback |
| GET | `/api/feedback?search=&department=&teacherName=&rating=` | Admin | List/filter feedback |
| GET | `/api/feedback/rating/:rating` | Admin | Feedback for one rating |
| GET | `/api/feedback/student/:studentId` | Logged-in user | A student's own feedback history |
| GET | `/api/dashboard/stats` | Admin | Aggregated dashboard numbers |

All protected routes require an `Authorization: Bearer <token>` header — the
frontend attaches this automatically once you're logged in (see
`frontend/src/services/api.js`).

---

## 7. Deploying so it's always live (no local setup needed)

This puts the app on the internet at a permanent link, using free tiers of
Render (backend), Vercel (frontend), and Atlas (database, which you may
already have set up). Total cost: $0.

### 7.1 Push the code to GitHub
1. Create a free account at github.com if you don't have one.
2. Create a new empty repository (e.g. `campus-voice`).
3. Upload this whole `student-feedback-system` folder to it — either via
   GitHub's "upload files" button in the browser, or with git:
   ```bash
   cd student-feedback-system
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/campus-voice.git
   git push -u origin main
   ```

### 7.2 Deploy the backend on Render
1. Go to render.com, sign up, and click **New +** → **Web Service**.
2. Connect your GitHub account and pick the repo you just pushed.
3. Set:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Under **Environment Variables**, add the same values from your local `.env`:
   - `MONGO_URI` → your Atlas connection string
   - `JWT_SECRET` → your secret
   - `JWT_EXPIRES_IN` → `7d`
   - (leave `PORT` unset — Render sets it automatically)
5. Click **Create Web Service**. After it builds, Render gives you a URL like
   `https://campus-voice-api.onrender.com`. Test it by visiting that URL —
   you should see the health-check JSON message.

### 7.3 Deploy the frontend on Vercel
1. Go to vercel.com, sign up, and click **Add New** → **Project**.
2. Import the same GitHub repo.
3. Set:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite (should auto-detect)
4. Under **Environment Variables**, add:
   - `VITE_API_URL` → `https://campus-voice-api.onrender.com/api` (your Render URL + `/api`)
5. Click **Deploy**. Vercel gives you a permanent link like
   `https://campus-voice.vercel.app` — that's the link you open from any
   laptop or phone, no setup required.

### 7.4 Seed demo accounts on the live database
Run the seed script once, pointed at your Atlas database (the same one
Render uses), from your own computer:
```bash
cd backend
node seed.js
```
(Your local `.env` already has the Atlas `MONGO_URI`, so this creates the
demo admin/student accounts in the same cloud database your live app uses.)

### Notes on the free tiers
- Render's free web services "sleep" after 15 minutes of no traffic, so the
  very first request after a break can take 30–60 seconds to wake up — that's
  normal, not a bug.
- Any time you push new code to GitHub, Render and Vercel automatically
  rebuild and redeploy — you don't need to repeat these steps.

---

## 8. Notes on the design

- Passwords are hashed with bcrypt before being stored — never stored in plain text.
- JWTs carry the user's id, name, email, and role, and are verified on every protected request.
- Admin-only routes are enforced **both** in the UI (`ProtectedRoute`) and on the server (`adminMiddleware`) — the UI check is for user experience, the server check is what actually secures the data.
- Roll numbers and emails are enforced unique at the database level (MongoDB unique index) as well as checked before insert/update, so race conditions still surface a clean error instead of a crash.

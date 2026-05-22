# 🐛 DebugAI — AI-Powered Debugging Assistant

> Paste logs. Get instant AI root-cause analysis, code fixes, and follow-up chat.

![Tech Stack](https://img.shields.io/badge/React-18-blue) ![Node](https://img.shields.io/badge/Node.js-20-green) ![Groq AI](https://img.shields.io/badge/groq-AI-orange)

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js v18+
- An [Groq API Key](https://console.groq.com)

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/ai-debug-assistant.git
cd ai-debug-assistant
```

### 2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
npm run dev
# Backend runs on http://localhost:5000
```

### 3. Setup Frontend
```bash
cd ../frontend
npm install
cp .env.example .env
# .env already has VITE_API_URL=http://localhost:5000/api
npm run dev
# Frontend runs on http://localhost:3000
```

Open http://localhost:3000 — you're live! 🎉

---

## 📁 Project Structure

```
ai-debug-assistant/
├── backend/
│   ├── middleware/
│   │   └── sessionStore.js     # In-memory session storage
│   ├── routes/
│   │   ├── analyze.js          # POST /api/analyze — AI log analysis
│   │   ├── chat.js             # POST /api/chat — Follow-up chat
│   │   └── sessions.js         # GET/DELETE /api/sessions — History
│   ├── server.js               # Express entry point
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx          # Sidebar + top bar
│   │   │   ├── AnalysisResult.jsx  # AI analysis display
│   │   │   └── ChatPanel.jsx       # Follow-up chat UI
│   │   ├── pages/
│   │   │   ├── HomePage.jsx        # Landing/hero page
│   │   │   ├── AnalyzePage.jsx     # Main log input + results
│   │   │   ├── SessionsPage.jsx    # History list
│   │   │   └── SessionDetailPage.jsx # Single session view
│   │   ├── utils/
│   │   │   └── api.js              # Axios API helpers
│   │   ├── App.jsx                 # React Router setup
│   │   ├── main.jsx                # ReactDOM entry
│   │   └── index.css               # Global styles + Tailwind
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── render.yaml                 # Render.com backend deployment
├── vercel.json                 # Vercel frontend deployment
└── README.md
```

---

## 🌐 Deployment to Live Links

### Option A: Vercel (Frontend) + Render (Backend) — Recommended Free Tier

#### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit: AI Debug Assistant"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ai-debug-assistant.git
git push -u origin main
```

#### Step 2: Deploy Backend on Render
1. Go to [render.com](https://render.com) → Sign up / Log in
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repo
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
5. Add **Environment Variables**:
   - `GROQ_API_KEY` = your key from console.anthropic.com
   - `FRONTEND_URL` = (add after Vercel deploy, e.g. `https://your-app.vercel.app`)
   - `NODE_ENV` = `production`
6. Click **Deploy** → Copy the URL (e.g., `https://ai-debug-backend.onrender.com`)

#### Step 3: Deploy Frontend on Vercel
1. Go to [vercel.com](https://vercel.com) → Sign up / Log in
2. Click **"New Project"** → Import your GitHub repo
3. Configure:
   - **Framework**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add **Environment Variables**:
   - `VITE_API_URL` = `https://your-render-backend-url.onrender.com/api`
5. Click **Deploy** → Get your live URL!

#### Step 4: Update CORS on Backend
Go back to Render → Environment Variables → Update:
- `FRONTEND_URL` = `https://your-app.vercel.app`
Then redeploy.

---

### Option B: Railway (Full Stack, One Platform)
1. Go to [railway.app](https://railway.app)
2. **New Project** → Deploy from GitHub
3. Add two services: one for `backend/`, one for `frontend/`
4. Set env vars as above

---

## 🔑 Environment Variables Reference

### Backend (`backend/.env`)
| Variable | Description | Example |
|----------|-------------|---------|
| `ANTHROPIC_API_KEY` | Your Groq API key | `sk-ant-...` |
| `PORT` | Server port | `5000` |
| `FRONTEND_URL` | Allowed CORS origin | `http://localhost:3000` |

### Frontend (`frontend/.env`)
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/analyze` | Analyze log (form-data: `logText` or `logFile`) |
| `POST` | `/api/chat` | Chat follow-up (body: `{ sessionId, message }`) |
| `GET` | `/api/sessions` | List all sessions |
| `GET` | `/api/sessions/:id` | Get single session |
| `DELETE` | `/api/sessions/:id` | Delete session |
| `GET` | `/health` | Health check |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| Routing | React Router v6 |
| HTTP Client | Axios |
| AI | Groq API |
| Backend | Node.js, Express |
| File Upload | Multer |
| Session Storage | In-memory Map (upgrade to Redis for production) |
| Deployment | Vercel + Render |

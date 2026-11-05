# OAuthPilot — AI OAuth Setup Assistant

OAuthPilot is an AI-powered OAuth setup assistant that helps developers understand the effort, requirements, approval process, and potential blockers involved in integrating third-party applications using OAuth 2.0.

It provides a curated library of OAuth integration guides and an AI-powered research feature for applications that are not already available in the library.

- Live Demo:https://oauthpilot-git-main-nikhios-projects.vercel.app/
- API Documentation: https://oauthpilot.onrender.com/docs
- GitHub Repository:https://github.com/Nikhil5178/oauthpilot

## ✨ Features

### 1. Searchable OAuth Guide Library
Explore OAuth setup guides for:
- GitHub
- Slack
- Notion
- Google
- Salesforce

### 2. Detailed OAuth Setup Guides
Each guide provides:
- Integration difficulty level.
- Estimated hands-on development effort.
- Approval and waiting-time information.
- Prerequisites and setup requirements.
- Step-by-step implementation checklist.
- Potential blockers and challenges.
- Official documentation and source links.

### 3. AI-Powered Application Research
Research unfamiliar applications by entering an application name or website URL.

The AI research assistant:
- Researches available application documentation.
- Prioritizes official provider sources.
- Generates structured OAuth setup guides.
- Identifies potential integration blockers.
- Separates verified information from estimates.
- Highlights information that could not be verified.

### 4. Progress Tracking
- Interactive setup checklist.
- Automatic progress calculation.
- Individual checklist progress saved in browser localStorage.
- Progress retained when navigating away and returning to a guide.

### 5. Shareable Guide Links
Each guide has its own URL that can be shared with other developers.

### 6. Responsive User Interface
Built with React and Tailwind CSS to support desktop and mobile screens.

---

## 🛠️ Technology Stack

| Component | Technology |
|---|---|
| Frontend | React.js |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| Backend | Python, FastAPI |
| AI Integration | Google Gemini API |
| Database | SQLite |
| Frontend Hosting | Vercel |
| Backend Hosting | Render |
| Version Control | Git and GitHub |

## 🏗️ Architecture

```text
                 Developer
                     |
                     v
             React Frontend
                (Vercel)
                     |
                     v
              FastAPI Backend
                (Render)
                     |
          +----------+----------+
          |                     |
          v                     v
     Gemini API             SQLite
   AI Research          Guide Storage
          |
          v
   OAuth Research
   and Guide Generation
```

## 📁 Project Structure

```text
oauthpilot/
│
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── .env.example
│   └── oauthpilot.db
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   └── GuideView.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   └── App.jsx
│   ├── package.json
│   └── vercel.json
│
└── README.md
```

## ⚙️ Requirements

- Python 3.10 or later.
- Node.js 18 or later.
- npm.
- Google Gemini API key for AI-powered research.

The curated guide library can be accessed without an AI API key.

## 💻 Run Locally

### 1. Clone the Repository

```bash
git clone https://github.com/Nikhil5178/oauthpilot.git
cd oauthpilot
```

### 2. Start the Backend

```bash
cd backend

python -m venv .venv
```

Activate the virtual environment.

**Windows:**

```powershell
.venv\Scripts\activate
```

**macOS/Linux:**

```bash
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file in the backend directory and configure:

```env
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=your_supported_gemini_model
CORS_ORIGINS=http://localhost:5173
```

Start the FastAPI server:

```bash
uvicorn main:app --reload --port 8000
```

Backend API documentation:

http://localhost:8000/docs

### 3. Start the Frontend

Open another terminal:

```bash
cd frontend
npm install
```

Create a `.env` file inside the frontend directory:

```env
VITE_API_URL=http://localhost:8000
```

Start the development server:

```bash
npm run dev
```

Open:

http://localhost:5173

---

## 🌐 Deployment

### Frontend — Vercel

The React frontend is deployed using Vercel.

Configuration:

- Root Directory: `frontend`
- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`

Environment variable:

```env
VITE_API_URL=https://oauthpilot.onrender.com
```

### Backend — Render

The FastAPI backend is deployed using Render.

Environment variables:

```env
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=your_supported_gemini_model
CORS_ORIGINS=https://oauthpilot-git-main-nikhios-projects.vercel.app
```

For persistent SQLite storage, configure a persistent disk and set `DATABASE_PATH` to a location on that disk.

Never commit API keys or other secrets to GitHub.

---

## 🔐 Security Considerations

- API keys are configured on the backend, not exposed in frontend code.
- OAuth client secrets are not requested or stored by OAuthPilot.
- Developers must manage their own provider credentials securely.
- Official provider documentation should be reviewed before implementing an integration.

## 🧠 Key Design Decisions

1. **Curated starter library:** Focuses on five applications instead of presenting an unverified directory of providers.
2. **Effort versus approval time:** Separates developer implementation effort from external provider approval timelines.
3. **Evidence-aware research:** Prioritizes official documentation and distinguishes verified information from estimates.
4. **Agent and developer responsibilities:** AI assists with research and guidance, while developers handle account creation, identity verification, approvals, and credentials.
5. **Provider-specific OAuth considerations:** Highlights differences between OAuth application types, including GitHub OAuth Apps and GitHub Apps.

## ⚠️ Limitations

- Effort estimates are directional and not guaranteed timelines.
- AI research depends on Gemini API availability, quota, and accessible provider documentation.
- Generated sources should be reviewed before relying on a guide.
- The application does not create provider applications, submit approval requests, or manage OAuth credentials.
- SQLite is suitable for this prototype; larger production deployments may benefit from PostgreSQL.
- This project is a take-home prototype and has not undergone a full production security audit.

## 🎯 Project Objective

OAuthPilot aims to reduce the uncertainty involved in OAuth integrations by helping developers understand what needs to be done, how much effort may be required, what could block progress, and which tasks require human intervention.

**Built as an APM Integrations take-home assignment.**

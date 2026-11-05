# OAuthPilot — AI OAuth Setup Assistant

OAuthPilot helps developers understand the work involved in creating and getting an OAuth integration ready. It includes a small curated guide library and an AI research flow for apps that are not already in the library.

## Features

- Searchable starter library: GitHub, Slack, Notion, Google, Salesforce.
- App guide pages with difficulty, estimated hands-on effort, approval/wait-time uncertainty, prerequisites, steps, blockers, and official sources.
- Live AI research endpoint for an unfamiliar app name or website.
- Evidence-aware generation: the agent is instructed to prefer official provider documentation, attach source URLs, distinguish facts from estimates, and mark unknowns.
- Shareable guide URLs using generated guide IDs.
- SQLite persistence for generated guides.
- Responsive React + Tailwind UI.

## Architecture

- `frontend/`: React, Vite, Tailwind.
- `backend/`: FastAPI, SQLite, OpenAI Responses API with web search.
- The backend never asks users to paste OAuth client secrets. The product is a guide/research assistant, not an OAuth credential vault.

## Requirements

- Node.js 18+
- Python 3.10+
- An OpenAI API key for live research. The library works without it.

## Run locally

### 1. Backend

```bash
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
# Add OPENAI_API_KEY to backend/.env for live AI research
uvicorn main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

### 2. Frontend

In a second terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:5173

The Vite dev server proxies `/api` to `http://localhost:8000`.

## Live research

Enter an app name or URL in the search box and choose **Research an app**. The backend uses the OpenAI Responses API with the `web_search` tool. Set:

```env
OPENAI_API_KEY=your_key
OPENAI_MODEL=gpt-5
```

If your account does not support the configured model or web search tool, set `OPENAI_MODEL` to a model available to your API account. The app returns a clear error if the key is missing or the research call fails.

## Deployment

- Frontend: deploy `frontend/` to Vercel. Set `VITE_API_BASE_URL` to your deployed backend URL (for example `https://your-api.example.com`).
- Backend: deploy `backend/` to Render or another Python host. Set `OPENAI_API_KEY`, `OPENAI_MODEL`, and `DATABASE_PATH` if needed.
- For a persistent SQLite database on Render, attach a persistent disk and set `DATABASE_PATH` to a path on that disk. For multi-instance production use, replace SQLite with Postgres.
- Configure CORS using `CORS_ORIGINS` on the backend.

## Key decisions

1. **Small verified-by-source starter library instead of pretending to cover 100 apps.** The assignment asks for a working slice, not a fabricated directory.
2. **Separate developer effort from provider approval time.** Approval timelines are often conditional and not publicly guaranteed.
3. **Sources and uncertainty are first-class fields.** A generated guide should say what it could not verify.
4. **Agent vs. developer handoff is explicit.** The agent can research and draft; the developer must create provider accounts, accept terms, handle identity/business verification, and keep credentials secure.
5. **OAuth app vs. provider-specific app types.** For GitHub, the guide flags that a GitHub App may be a better fit than an OAuth App depending on permissions and installation model.

## Limitations

- Starter guide effort estimates are directional estimates, not provider SLAs.
- Live research quality depends on the provider's public documentation and the model's web-search availability.
- The agent does not log into provider consoles, create applications, request approvals, or handle secrets.
- Sources should be reviewed before relying on a generated guide. Some providers change their UI and policies.
- This is a take-home prototype, not a security-reviewed production service.

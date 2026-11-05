import json
import os
import re
import sqlite3
import uuid
from pathlib import Path
from datetime import datetime, timezone
from typing import Any
from urllib.parse import urlparse

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Load .env from the same folder as main.py
# Load .env from the same folder as main.py
ENV_PATH = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=ENV_PATH, override=True)

print("ENV FILE FOUND:", ENV_PATH.exists())
print("GEMINI API KEY LOADED:", bool(os.getenv("GEMINI_API_KEY")))

DB_PATH = os.getenv("DATABASE_PATH", "./oauthpilot.db")

app = FastAPI(title="OAuthPilot API", version="1.0.0")


origins = [
    x.strip()
    for x in os.getenv(
        "CORS_ORIGINS", "http://localhost:5173"
    ).split(",")
    if x.strip()
]

print("CORS ORIGINS LOADED:", origins)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


SEED_GUIDES: list[dict[str, Any]] = [
    {
        "id": "github",
        "name": "GitHub",
        "website": "https://github.com",
        "category": "Developer tools",
        "difficulty": "Easy–Medium",
        "effort": "About 30–90 minutes for a basic implementation",
        "approval": "No general public-app review is normally required just to register a standard OAuth App; organization policies and the selected app model can add constraints.",
        "summary": "Register an OAuth App for user-authorized access, or consider a GitHub App when you need fine-grained repository permissions, installation-based access, or automation independent of a user.",
        "prerequisites": ["A GitHub account", "Application homepage URL", "Authorization callback URL", "A secure backend to store the client secret"],
        "steps": [
            "Decide whether an OAuth App or GitHub App is the better fit. GitHub Apps provide more granular permissions and installation-based access.",
            "Open GitHub Settings → Developer settings → OAuth Apps.",
            "Choose New OAuth App and provide the application name, homepage URL, and callback URL.",
            "Register the app and note the Client ID.",
            "Generate a client secret and store it only on your backend in a secret manager or environment variable.",
            "Implement the authorization-code flow, validate state, exchange the code server-side, and request only the scopes you need.",
            "Test authorization, callback handling, token storage, revocation behavior, and error cases."
        ],
        "blockers": ["Incorrect callback URL or scheme", "Requesting more scopes than the product needs", "Leaking the client secret in frontend code", "Choosing an OAuth App when a GitHub App is more appropriate"],
        "agent_can": ["Find current GitHub documentation", "Draft a least-privilege scope checklist", "Review callback URL format", "Prepare an implementation checklist"],
        "developer_must": ["Create the app while signed in", "Accept provider terms", "Generate and protect credentials", "Test with the intended account and repositories"],
        "sources": [
            {"title": "Creating an OAuth app", "url": "https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app", "type": "official"},
            {"title": "Scopes for OAuth apps", "url": "https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/scopes-for-oauth-apps", "type": "official"},
            {"title": "About creating GitHub Apps", "url": "https://docs.github.com/en/apps/creating-github-apps", "type": "official"}
        ],
        "confidence": "High for the documented registration flow; confirm current scopes and product fit before implementation.",
        "updated_at": "2026-11-05"
    },
    {
        "id": "slack",
        "name": "Slack",
        "website": "https://slack.com",
        "category": "Communication",
        "difficulty": "Medium",
        "effort": "About 1–3 hours for a basic workspace installation flow",
        "approval": "Internal testing and distribution within a workspace differ from public distribution. Marketplace submission and review may add substantial waiting time; check current Slack requirements.",
        "summary": "Create a Slack app, configure OAuth scopes and redirect URLs, then install it into a workspace. Public distribution has additional considerations.",
        "prerequisites": ["Slack account", "App name and development workspace", "Redirect URL", "List of required bot and/or user scopes"],
        "steps": [
            "Open the Slack API apps dashboard and create a new app.",
            "Choose the development workspace and configure basic app information.",
            "Open OAuth & Permissions and add the exact redirect URL.",
            "Add the minimum required bot or user token scopes.",
            "Install or reinstall the app to the workspace to apply scope changes.",
            "Handle the OAuth callback securely and store tokens server-side.",
            "Test in a development workspace before considering distribution."
        ],
        "blockers": ["Missing or mismatched redirect URL", "Confusing bot scopes with user scopes", "Forgetting to reinstall after scope changes", "Assuming public distribution is the same as internal workspace testing"],
        "agent_can": ["Map requested actions to likely Slack scopes for developer review", "Find current distribution guidance", "Draft a test checklist"],
        "developer_must": ["Create the Slack app", "Select scopes and approve installation", "Complete any required public distribution process"],
        "sources": [
            {"title": "Slack OAuth documentation", "url": "https://api.slack.com/authentication/oauth-v2", "type": "official"},
            {"title": "Slack app distribution", "url": "https://api.slack.com/docs/apps/production-readiness", "type": "official"}
        ],
        "confidence": "Medium–High; public distribution and Marketplace policies can change.",
        "updated_at": "2026-11-05"
    },
    {
        "id": "notion",
        "name": "Notion",
        "website": "https://www.notion.so",
        "category": "Productivity",
        "difficulty": "Medium",
        "effort": "About 1–3 hours for a basic public OAuth integration",
        "approval": "Private/internal integrations and public integrations have different distribution paths. Public listing or review requirements should be checked against current Notion guidance.",
        "summary": "Notion integrations can be internal to a workspace or public OAuth integrations. Choose the type based on who needs to connect.",
        "prerequisites": ["Notion account", "Workspace for testing", "Integration name and redirect URI", "Required capabilities"],
        "steps": [
            "Open the Notion integrations dashboard and create an integration.",
            "Choose the appropriate internal or public integration type.",
            "Configure the redirect URI and integration details.",
            "Select only the capabilities the integration needs.",
            "For public OAuth, configure the OAuth settings and obtain the client credentials.",
            "Implement the authorization callback and token exchange on the backend.",
            "Test connection, access boundaries, and disconnect behavior."
        ],
        "blockers": ["Choosing internal integration when external users must connect", "Incorrect redirect URI", "Requesting capabilities that do not match the product", "Misunderstanding workspace access boundaries"],
        "agent_can": ["Compare internal and public integration paths", "Extract capability requirements", "Prepare a consent and testing checklist"],
        "developer_must": ["Create and configure the integration", "Authorize access to the workspace", "Complete any applicable public integration review"],
        "sources": [
            {"title": "Notion integrations", "url": "https://developers.notion.com/docs/getting-started", "type": "official"},
            {"title": "Authorization", "url": "https://developers.notion.com/docs/authorization", "type": "official"}
        ],
        "confidence": "Medium–High; verify the current dashboard options and public integration requirements.",
        "updated_at": "2026-11-05"
    },
    {
        "id": "google",
        "name": "Google",
        "website": "https://developers.google.com",
        "category": "Developer platform",
        "difficulty": "Hard",
        "effort": "Several hours to multiple days depending on APIs, consent configuration, and verification needs",
        "approval": "Sensitive or restricted scopes can trigger verification and, in some cases, a security assessment. Timelines depend on scope and review feedback; do not assume a fixed SLA.",
        "summary": "Configure a Google Cloud project, OAuth consent screen, credentials, and scopes. Verification requirements depend heavily on the requested scopes and publishing audience.",
        "prerequisites": ["Google account", "Google Cloud project", "Authorized domains where applicable", "Privacy policy and application homepage for relevant external use cases", "Exact API and scope requirements"],
        "steps": [
            "Create or select a project in Google Cloud Console.",
            "Enable the APIs the integration needs.",
            "Configure the OAuth consent screen and user type.",
            "Set app name, support email, authorized domains, and required application links where applicable.",
            "Add only the necessary OAuth scopes and identify whether any are sensitive or restricted.",
            "Create the appropriate OAuth client and configure authorized redirect URIs.",
            "Implement and test the authorization-code flow.",
            "If required, prepare and submit the app for verification; respond to reviewer feedback."
        ],
        "blockers": ["Sensitive or restricted scopes", "Missing privacy policy or domain verification", "Consent screen configuration errors", "Verification review and security assessment requirements"],
        "agent_can": ["Classify scopes using official scope documentation", "Create a verification-preparation checklist", "Identify likely policy dependencies"],
        "developer_must": ["Own the Cloud project", "Verify domains and provide legal/policy links", "Submit verification and respond to reviewers"],
        "sources": [
            {"title": "Google OAuth consent screen", "url": "https://developers.google.com/workspace/guides/configure-oauth-consent", "type": "official"},
            {"title": "OAuth app verification", "url": "https://support.google.com/cloud/answer/9110914", "type": "official"},
            {"title": "OAuth 2.0 scopes", "url": "https://developers.google.com/identity/protocols/oauth2/scopes", "type": "official"}
        ],
        "confidence": "Medium; exact verification requirements depend on the APIs, scopes, and publishing model.",
        "updated_at": "2026-11-05"
    },
    {
        "id": "salesforce",
        "name": "Salesforce",
        "website": "https://www.salesforce.com",
        "category": "CRM",
        "difficulty": "Hard",
        "effort": "Several hours to multiple days depending on org configuration and distribution",
        "approval": "Org administrators can restrict connected app access. AppExchange or broader distribution may involve additional review; verify the intended distribution route.",
        "summary": "Configure an OAuth-enabled Connected App or the current Salesforce-supported equivalent in the target org, define callback and OAuth scopes, and account for administrator policies.",
        "prerequisites": ["Salesforce developer or target org", "Appropriate permissions", "Callback URL", "Required OAuth scopes and target distribution model"],
        "steps": [
            "Confirm the target Salesforce org and current supported app configuration path.",
            "Create the OAuth-enabled app configuration in Setup.",
            "Set the callback URL and select minimum required OAuth scopes.",
            "Configure permitted users and admin-approved access policies as appropriate.",
            "Retrieve the consumer key and protect the consumer secret where applicable.",
            "Implement authorization and token handling on a secure backend.",
            "Test with a sandbox or development org and confirm administrator access policies."
        ],
        "blockers": ["Insufficient setup permissions", "Admin approval or connected-app access policies", "Callback URL mismatch", "Org-specific security restrictions", "Confusing internal org setup with AppExchange distribution"],
        "agent_can": ["Find current Salesforce setup documentation", "Draft an admin request", "Prepare a scope and org-testing checklist"],
        "developer_must": ["Configure the target org", "Obtain administrator approval where required", "Complete any applicable distribution review"],
        "sources": [
            {"title": "Salesforce OAuth documentation", "url": "https://help.salesforce.com/s/articleView?id=sf.remoteaccess_oauth_web_server_flow.htm&type=5", "type": "official"},
            {"title": "Salesforce Platform API", "url": "https://developer.salesforce.com/docs/platform/mobile-sdk/guide/oauth-intro.html", "type": "official"}
        ],
        "confidence": "Medium; Salesforce setup terminology and recommended configuration paths evolve. Verify in the target org.",
        "updated_at": "2026-11-05"
    }
]

def db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    os.makedirs(os.path.dirname(DB_PATH) or ".", exist_ok=True)
    with db() as conn:
        conn.execute("""CREATE TABLE IF NOT EXISTS guides (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            website TEXT,
            guide_json TEXT NOT NULL,
            created_at TEXT NOT NULL
        )""")

init_db()

class ResearchRequest(BaseModel):
    app: str = Field(min_length=2, max_length=300)

class GuideResponse(BaseModel):
    guide: dict[str, Any]

@app.get("/api/health")
def health():
    return {"status": "ok", "service": "oauthpilot-api"}

@app.get("/api/apps")
def list_apps():
    return [{"id": g["id"], "name": g["name"], "website": g["website"], "category": g["category"], "difficulty": g["difficulty"], "summary": g["summary"]} for g in SEED_GUIDES]

@app.get("/api/guides/{guide_id}")
def get_guide(guide_id: str):
    seed = next((g for g in SEED_GUIDES if g["id"] == guide_id), None)
    if seed:
        return {"guide": seed}
    with db() as conn:
        row = conn.execute("SELECT guide_json FROM guides WHERE id = ?", (guide_id,)).fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Guide not found")
    return {"guide": json.loads(row["guide_json"])}


@app.post("/api/research", response_model=GuideResponse)
def research_app(payload: ResearchRequest):
    app_name = payload.app.strip()

    if not app_name:
        raise HTTPException(
            status_code=400,
            detail="Enter an app name or website."
        )

    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        raise HTTPException(
            status_code=503,
            detail="Gemini API key is missing. Add GEMINI_API_KEY to backend/.env."
        )

    try:
        from google import genai
        from google.genai import types

        client = genai.Client(api_key=api_key)

        prompt = f"""
You are OAuthPilot, a careful OAuth integration research agent.
Investigate this app/provider: {app_name}

Use Google Search. Prefer official provider developer documentation,
official support pages, and official app registration portals.

Return a JSON object only, with this schema:
{{
  "name": "provider/app name",
  "website": "official homepage URL or empty string",
  "category": "category",
  "difficulty": "Easy | Medium | Hard | Unknown",
  "effort": "estimated hands-on developer effort",
  "approval": "provider review requirements; say Unknown if not verified",
  "summary": "short description of OAuth setup",
  "prerequisites": ["..."],
  "steps": ["ordered actionable steps"],
  "blockers": ["likely blockers"],
  "agent_can": ["tasks the AI agent can perform"],
  "developer_must": ["tasks requiring a human"],
  "sources": [
    {{"title": "source title", "url": "https://...", "type": "official"}}
  ],
  "confidence": "High | Medium | Low",
  "verification_notes": ["what was verified and what was not"]
}}

Rules:
- Do not invent registration URLs, scopes, approval requirements or timelines.
- Separate developer effort from external approval waiting time.
- Never promise an approval SLA.
- Never ask users for client secrets, access tokens or passwords.
- Include direct source URLs.
- Return valid JSON only.
"""

        response = client.models.generate_content(
            model="gemini-3.8-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                tools=[
                    types.Tool(
                        google_search=types.GoogleSearch()
                    )
                ]
            )
        )

        raw = (response.text or "").strip()
        raw = re.sub(
            r"^```(?:json)?\s*|\s*```$",
            "",
            raw,
            flags=re.IGNORECASE
        )

        match = re.search(r"\{.*\}", raw, flags=re.DOTALL)

        if not match:
            raise ValueError(
                "The research agent did not return structured JSON."
            )

        guide = json.loads(match.group(0))

        guide["id"] = str(uuid.uuid4())[:8]
        guide["created_at"] = datetime.now(timezone.utc).isoformat()

        guide.setdefault(
            "verification_notes",
            ["Generated from available public sources; review source links."]
        )
        guide.setdefault("sources", [])
        guide.setdefault("prerequisites", [])
        guide.setdefault("steps", [])
        guide.setdefault("blockers", [])
        guide.setdefault("agent_can", [])
        guide.setdefault("developer_must", [])

        with db() as conn:
            conn.execute(
                """INSERT INTO guides
                (id, name, website, guide_json, created_at)
                VALUES (?, ?, ?, ?, ?)""",
                (
                    guide["id"],
                    guide.get("name", app_name),
                    guide.get("website", ""),
                    json.dumps(guide),
                    guide["created_at"]
                )
            )

        return {"guide": guide}

    except HTTPException:
        raise

    except Exception as exc:
        error = str(exc)

    if "429" in error or "RESOURCE_EXHAUSTED" in error:
        raise HTTPException(
            status_code=503,
            detail="Live research quota is currently unavailable. Please use the built-in OAuth guides."
        )

    raise HTTPException(
        status_code=502,
        detail=f"Research failed: {error}"
    )
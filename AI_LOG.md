# AI Log — Smart Shopping List

A summary of how AI tools were used to accelerate development of this project.

---

## Tools Used

| Tool   | Purpose                                         |
|--------|-------------------------------------------------|
| Claude | Architecture planning, boilerplate generation, debugging |
| Copilot| Inline code completions in VS Code              |

---

## Key AI Contributions

### Architecture & Boilerplate
- Used Claude to scaffold the ASP.NET Core project structure (controllers, services, EF Core DbContext) from a single prompt describing the requirements.
- Generated the initial React component tree and MUI theme configuration.

### LLM Service
- Prompted Claude to write the `AnthropicLlmService`, including the structured JSON prompt that instructs the model to return `{ price, category, icon, reasoning }`.
- Iterated with AI on the JSON extraction regex to safely parse the LLM response even when wrapped in markdown code fences.

### Frontend
- Used Claude to generate the MUI `theme.js` with a custom dark palette, typography scale, and component overrides.
- AI drafted the `AddItemDialog` component; manually refined animations and loading states.
- Generated the service worker (`sw.js`) cache strategy (cache-first for static assets, network-first for API calls with fallback).

### Database
- AI suggested using EF Core with SQLite for local dev and explained how to swap the connection string for Azure SQL in production with zero code changes.

### Debugging
-  diagnose a CORS issue between Vite dev server (port 5173) and the .NET API (port 5000) — resolved by adding the correct `WithOrigins` policy.
- Dobble slash issue resolved.

---
## What Basheer Decided

The following architectural and infrastructure decisions were made independently by Basheer, not AI-generated:

### Database Choice — SQLite
Basheer chose SQLite for local and production use due to its simplicity and zero-configuration setup. EF Core abstracts the provider, so swapping to Azure SQL or Postgres in the future requires only a connection string change and a package swap — no application code changes.

### Deployment Architecture — Vercel + Railway
Basheer evaluated multiple deployment options and chose Vercel for the frontend and Railway for the backend based on the following analysis:

---

## Deployment Decision — Pros & Cons

### Vercel (Frontend)

| Pros | Cons |
|---|---|
| Deploys in ~60 seconds | Frontend only — can't host .NET backend |
| Auto-deploys on every `git push` | Build-time env vars need a redeploy to update |
| Global CDN out of the box | Limited control over server-side config |
| Free HTTPS and custom domains | |
| Perfect fit for Vite/React apps | |

**Verdict:** Best-in-class for static/SPA frontends. No better free option for a React PWA.

---

### Railway (Backend)

| Pros | Cons |
|---|---|
| Runs Docker natively — no config needed | Free tier has a $5/month usage limit |
| Always-on (no cold starts unlike Render free tier) | Smaller community than Heroku/Render |
| Auto-deploys from GitHub on push | Persistent volumes require manual setup |
| Clean dashboard, easy env var management | |
| Supports any language/runtime via Docker | |

**Verdict:** The most developer-friendly platform for Dockerized backends. The always-on behaviour was the deciding factor over Render, which spins down free services after 15 minutes of inactivity — a poor experience for a live demo.

---

### Alternatives Considered

| Platform | Why Not Chosen |
|---|---|
| Azure | More setup overhead; better suited for production enterprise apps |
| Render | Free tier spins down after 15 min inactivity — bad for demos |
| Fly.io | More complex config for a simple challenge submission |
| Heroku | No longer has a meaningful free tier |

---

## Time Estimate

| Task | Without AI | With AI |
|---|---|---|
| Backend scaffolding | ~4 hrs | ~30 min |
| LLM service + prompt | ~3 hrs | ~30 min |
| Frontend components | ~5 hrs | ~1.5 hrs |
| PWA / service worker | ~3 hrs | ~30 min |
| Debugging | ~4 hrs | ~1 hr |
| Deployment | ~3 hrs | ~1.5 hrs |
| **Total** | **~22 hrs** | **~6 hrs** |

**Estimated saving: ~70%**


AI assistance reduced estimated development time from ~20 hours to ~6 hours (70% reduction), primarily by eliminating repetitive boilerplate and accelerating debugging cycles.

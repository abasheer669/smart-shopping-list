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
- Used Claude to diagnose a CORS issue between Vite dev server (port 5173) and the .NET API (port 5000) — resolved by adding the correct `WithOrigins` policy.
- AI identified a missing `await` in the service method causing silent failures.

---

## Estimate

AI assistance reduced estimated development time from ~20 hours to ~6 hours (70% reduction), primarily by eliminating repetitive boilerplate and accelerating debugging cycles.

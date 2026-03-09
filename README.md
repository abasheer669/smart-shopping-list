# Smart Shopping List — AI Price Oracle

> Pre-Interview Technical Challenge Submission | React + ASP.NET Core + Gemini AI

---

## Live Deployment

| Service | URL |
|---|---|
| **Frontend (PWA)** | https://smart-shopping-list-eta.vercel.app |
| **Backend API** | https://smart-shopping-list-production-8d5c.up.railway.app |
| **Swagger Docs** | https://smart-shopping-list-production-8d5c.up.railway.app/swagger |

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React 18 + Material UI v5 | Mobile-first PWA interface |
| Build Tool | Vite + vite-plugin-pwa | Fast builds, Workbox service worker |
| Backend | ASP.NET Core 8 Web API | REST API with Swagger |
| AI / LLM | Google Gemini API | Price estimation + categorisation |
| Database | SQLite via EF Core | Persistent storage (swappable for Azure SQL) |
| Frontend Host | Vercel | Global CDN, auto-deploys on push |
| Backend Host | Railway | Docker-based, always-on |
| Containers | Docker | Consistent local + cloud environments |

---

## Requirements Coverage

| Requirement (from brief) | Implementation |
|---|---|
| React + Material UI frontend | React 18 with MUI v5 — cards, dialogs, FAB, chips, skeletons |
| Mobile-first PWA | Responsive layout, manifest.json, service worker via vite-plugin-pwa |
| MUI cards with AI category icon | `ItemCard` with dynamic MUI icon resolved by name from LLM response |
| Estimated Oracle Price displayed | LLM returns price in AUD, displayed with category colour coding |
| Offline support (cached list) | Workbox NetworkFirst caches `/api/items`; offline banner via `useOnlineStatus` hook |
| ASP.NET Core Web API | `ItemsController` with GET, POST, DELETE; Swagger at `/swagger` |
| LLM service for price + category | `AnthropicLlmService` (Gemini-backed) with structured JSON prompt |
| Database persistence | EF Core + SQLite; swap to Azure SQL with one connection string change |
| AI tools used in development | See [AI Log](#ai-development-log) below |
| Executable locally | `dotnet run` + `npm run dev` — full steps below |
| Docker support | `Dockerfile` in both `backend/` and `frontend/`; `docker-compose.yml` at root |

---

## Project Structure

```
smart-shopping-list/
├── backend/                        ASP.NET Core 8 Web API
│   ├── Controllers/
│   │   └── ItemsController.cs      GET, POST, DELETE /api/items
│   ├── Data/
│   │   └── AppDbContext.cs         EF Core DbContext
│   ├── DTOs/
│   │   └── ItemDtos.cs             Request / Response / LLM data shapes
│   ├── Models/
│   │   └── ShoppingItem.cs         Entity model
│   ├── Services/
│   │   ├── ILlmService.cs          Service interface
│   │   └── AnthropicLlmService.cs  Gemini API integration
│   ├── Program.cs                  DI, CORS, middleware pipeline
│   ├── appsettings.json            Config (API keys, DB connection)
│   └── Dockerfile
│
├── frontend/                       React 18 PWA
│   ├── public/
│   │   ├── icons/                  PWA icons (192px, 512px)
│   │   └── manifest.json
│   ├── src/
│   │   ├── components/
│   │   │   ├── AddItemDialog.jsx   Add item modal with loading state
│   │   │   ├── ItemCard.jsx        Dynamic MUI icon, price, category
│   │   │   ├── ItemList.jsx        Skeletons, empty state
│   │   │   └── OfflineBanner.jsx   Shown when network is offline
│   │   ├── hooks/
│   │   │   └── useOnlineStatus.js  Detects online/offline state
│   │   ├── services/
│   │   │   └── api.js              Fetch wrapper for backend
│   │   ├── theme/
│   │   │   └── theme.js            Dark MUI theme
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vite.config.js              PWA + proxy config
│   └── Dockerfile
│
├── docker-compose.yml
├── AI_LOG.md
└── README.md
```

---

## Running Locally

### Prerequisites

| Tool | Version | Link |
|---|---|---|
| Node.js | v18+ | https://nodejs.org |
| .NET SDK | v8 | https://dotnet.microsoft.com/download/dotnet/8 |
| Gemini API Key | Free | https://aistudio.google.com/apikey |

---

### 1. Backend

```bash
cd backend
cp appsettings.example.json appsettings.json
```

Edit `appsettings.json`:
```json
{
  "Gemini": {
    "ApiKey": "YOUR_GEMINI_KEY_HERE",
    "Model": "gemini-2.0-flash-lite"
  },
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=shopping.db"
  }
}
```

```bash
dotnet restore
dotnet run
# API    → http://localhost:5000
# Swagger → http://localhost:5000/swagger
```

---

### 2. Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
# App → http://localhost:5173
```

---

### 3. Testing PWA / Offline Mode

Offline features only work in the production build:

```bash
cd frontend
npm run build
npm run preview   # http://localhost:4173
```

To verify offline:
1. Open **DevTools → Application → Service Workers**
2. Check **"Offline"**
3. Refresh — the cached list loads with the offline banner

---

## API Reference

| Method | Endpoint | Description | Response |
|---|---|---|---|
| `GET` | `/api/items` | Fetch all items ordered by date | `200 Array<ItemResponse>` |
| `GET` | `/api/items/{id}` | Fetch a single item | `200 ItemResponse` / `404` |
| `POST` | `/api/items` | Create item + trigger AI estimation | `201 ItemResponse` |
| `DELETE` | `/api/items/{id}` | Delete an item | `204` / `404` |

### POST /api/items — Request Body
```json
{ "name": "Gaming Laptop" }
```

### ItemResponse Shape
```json
{
  "id": 1,
  "name": "Gaming Laptop",
  "estimatedPrice": 2499,
  "category": "Electronics",
  "iconName": "LaptopMac",
  "priceReasoning": "Mid-range gaming laptops in Australia typically cost between $2,000–$3,000.",
  "createdAt": "2026-03-09T10:00:00Z"
}
```

---

## AI / LLM Integration

The LLM service is abstracted behind `ILlmService`, making it easy to swap providers.

### How It Works

1. User submits an item name via the frontend
2. `POST /api/items` received by `ItemsController`
3. `AnthropicLlmService` sends a structured prompt to the Gemini API
4. LLM returns JSON with `price`, `category`, `iconName`, `reasoning`
5. Item saved to SQLite with AI-enriched fields
6. Frontend renders `ItemCard` with dynamic icon and formatted price

### Prompt Strategy

The prompt instructs Gemini to respond **only** with a JSON object — no markdown, no preamble. A regex safely extracts the JSON block even if the model wraps it in code fences. LLM failure is **non-fatal** — the item is saved without price data if the API is unavailable.

### Supported Categories

`Electronics` · `Clothing` · `Food` · `Books` · `Home` · `Sports` · `Beauty` · `Toys` · `Automotive` · `Other`

Each category is colour-coded with a matching Material UI icon in the frontend.

---

## PWA & Offline Support

- **Web App Manifest** — name, icons, theme colour, `display: standalone`
- **Service worker** — registered automatically via `vite-plugin-pwa` (Workbox)
- **Installable** — shows "Add to Home Screen" on mobile and desktop Chrome
- **Offline banner** — displayed via `useOnlineStatus` hook when network is lost

### Caching Strategy

| Resource | Strategy | Details |
|---|---|---|
| Static assets (JS, CSS, HTML) | CacheFirst | Instant loads after first visit, 7-day expiry |
| `/api/items` | NetworkFirst | Live data when online, cached list when offline, 5s timeout |

> **Note:** The service worker is active only in the production build (`npm run build`). The Vite dev server disables it to prevent cache conflicts during development.

---

## Deployment

| Service | Platform | Method |
|---|---|---|
| Frontend | Vercel | Vite build, auto-deploy on git push |
| Backend | Railway | Docker build from `backend/Dockerfile` |

### Environment Variables

**Backend (Railway):**

| Key | Value |
|---|---|
| `Gemini__ApiKey` | Your Gemini API key |
| `Gemini__Model` | `gemini-2.0-flash-lite` |
| `ConnectionStrings__DefaultConnection` | `Data Source=shopping.db` |
| `ASPNETCORE_ENVIRONMENT` | `Production` |

**Frontend (Vercel):**

| Key | Value |
|---|---|
| `VITE_API_BASE_URL` | `https://your-backend.up.railway.app` |

Both services auto-redeploy on every `git push` to `main`.

---

## AI Development Log

| Area | AI Contribution | Tool |
|---|---|---|
| Architecture | Scaffolded ASP.NET Core project, suggested `ILlmService` interface pattern | Claude |
| LLM Service | Wrote Gemini API integration, structured JSON prompt, regex JSON extraction | Claude |
| MUI Theme | Generated dark theme with custom palette and component overrides | Claude |
| Components | Drafted `AddItemDialog`, `ItemCard`, `OfflineBanner` | Claude |
| Service Worker | Generated Workbox caching strategy (NetworkFirst + CacheFirst) | Claude |
| Debugging | Resolved CORS config, SQLite path on Railway, Workbox file size limit | Claude |
| Deployment | Guided Railway + Vercel setup, Docker build args for `VITE_API_BASE_URL` | Claude |

**Estimated time saving: ~70%** — primarily from eliminating boilerplate and accelerating debugging.

---

## ADD ONS

### "How would you swap SQLite for Azure SQL?"

Change the connection string and EF Core provider package. Zero application code changes needed.

```bash
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
```
```csharp
// Program.cs — swap one line
options.UseSqlServer(connectionString); // was UseSqlite
```

### "How would you swap Gemini for a different LLM?"

Create a new class implementing `ILlmService` (e.g. `OpenAiLlmService`), register it in `Program.cs`, add the API key to config. The controller depends on the interface — no other changes needed.

### "How would you add user authentication?"

Add ASP.NET Core Identity or JWT bearer auth to the backend. Add an `Authorization` header to frontend API calls. Add a `UserId` field to `ShoppingItem` and filter queries to scope items per user.

### "How would you add real-time price updates?"

Add an `IHostedService` background worker that periodically re-estimates prices via the LLM. Push updates to the frontend via SignalR so the UI refreshes without a page reload.
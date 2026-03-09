# Smart Shopping List — AI Price Oracle

A Progressive Web App that uses an LLM to estimate market prices and categorize shopping items.

## Tech Stack

| Layer    | Technology                              |
|----------|-----------------------------------------|
| Frontend | React 18, Material UI v5, Vite, PWA     |
| Backend  | ASP.NET Core 8 Web API                  |
| Database | SQLite (swappable for Azure SQL)        |
| AI       | Anthropic Claude API (claude-sonnet-4)  |

---

## Quick Start

### Prerequisites
- Node.js ≥ 18
- .NET 8 SDK
- An Anthropic API key (https://console.anthropic.com)

---

### 1. Backend

```bash
cd backend
cp appsettings.example.json appsettings.json
# Edit appsettings.json and add your Anthropic API key
dotnet restore
dotnet run
# API runs at http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
# App runs at http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Project Structure

```
smart-shopping-list/
├── backend/                  # ASP.NET Core Web API
│   ├── Controllers/
│   │   └── ItemsController.cs
│   ├── Data/
│   │   └── AppDbContext.cs
│   ├── DTOs/
│   │   └── ItemDtos.cs
│   ├── Models/
│   │   └── ShoppingItem.cs
│   ├── Services/
│   │   ├── ILlmService.cs
│   │   └── AnthropicLlmService.cs
│   ├── appsettings.example.json
│   ├── Program.cs
│   └── backend.csproj
│
├── frontend/                 # React PWA
│   ├── public/
│   │   ├── manifest.json
│   │   └── sw.js
│   ├── src/
│   │   ├── components/
│   │   │   ├── AddItemDialog.jsx
│   │   │   ├── ItemCard.jsx
│   │   │   ├── ItemList.jsx
│   │   │   └── OfflineBanner.jsx
│   │   ├── hooks/
│   │   │   └── useOnlineStatus.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── theme/
│   │   │   └── theme.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── AI_LOG.md
└── README.md
```

---

## PWA / Offline Support

The app registers a service worker (`sw.js`) that caches the app shell and the `/api/items` response. When offline, the cached list is shown and an offline banner appears.

---

## Environment Variables

### Backend — `appsettings.json`

```json
{
  "Anthropic": {
    "ApiKey": "YOUR_KEY_HERE"
  },
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=shopping.db"
  }
}
```

### Frontend — optional `.env`

```
VITE_API_BASE_URL=http://localhost:5000
```

---

## Docker (optional)

```bash
docker compose up --build
```

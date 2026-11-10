# Elo — Front-End

The Elo SPA: login and dashboard in a dark theme (black and green). It consumes the monorepo's Spring Boot API.

## Interface

### Authentication
You create an account or sign in. The root `/` opens the login page.

### Dashboard
You see total earnings, clients this month, average ticket and earnings by source.

### Clients
You search and filter by source and month. You add, edit and delete.

### Sources
You register and delete sources such as Referral and Instagram.

### Settings
You change your name and password, manage sources, export CSV and sign out.

## Tech Stack

| Layer | Technology |
|--------|-----------|
| **UI** | React 19 + TypeScript |
| **Build** | Vite 6 |
| **Styling** | Tailwind CSS 4 + shadcn/ui |
| **Icons** | Lucide React |
| **Charts** | Recharts |
| **Animations** | Motion (Framer Motion) |
| **Font** | Geist Variable |

## Running Locally

**Prerequisites:** Node.js 20+ and the API running (see the root README).

1. Install the dependencies:
   ```bash
   npm install
   ```
2. Set up the `.env` file (use `.env.example` as a base):
   ```bash
   cp .env.example .env
   ```
   In dev, `VITE_PROXY_TARGET` points to the backend (default `http://localhost:8080`).
3. Start the development server:
   ```bash
   npm run dev
   ```
   Go to `http://localhost:3000` (login at `/login`, sign-up at `/registro`).

### Production build

```bash
npm run build       # generates the dist/ folder (uses VITE_API_URL)
npm run preview     # serves the build locally
```

### Lint

```bash
npm run lint        # tsc --noEmit
```

### Docker

From the monorepo root, with the database and API together:

```bash
docker compose up -d --build
# Front at http://localhost:3000; nginx forwards /api to backend:8080
```

## Scripts

| Command | Description |
|---------|-----------|
| `npm run dev` | Dev server on port 3000 (`/api` proxy) |
| `npm run build` | Production build (Vite) |
| `npm run preview` | Serves the build locally |
| `npm run lint` | Type check (`tsc --noEmit`) |

## Folder structure

```
src/
├── auth/             # Login, sign-up and AuthContext
├── crm/              # CrmContext (clients/sources) + ClienteFormContext
├── dashboard/        # Dashboard home
├── clientes/         # Client list and form
├── origens/          # Sources CRUD
├── profile/          # Profile settings
├── layout/           # Dashboard sidebar and header
└── shared/           # Components, types, services and constants
```

## Routes

| Route | Access | Screen |
|------|--------|------|
| `/` | public | Redirects to `/login` |
| `/login` | public | Login |
| `/registro` | public | Sign-up |
| `/dashboard` | authenticated | Dashboard |
| `/clientes` | authenticated | Clients |
| `/origens` | authenticated | Sources |
| `/configuracoes` | authenticated | Settings |

## Environment variables

| Variable | Description | Default |
|----------|-----------|--------|
| `VITE_API_URL` | API base URL (production build) | `/api` (Nginx proxy) |
| `VITE_PROXY_TARGET` | Proxy target in dev | `http://localhost:8080` |

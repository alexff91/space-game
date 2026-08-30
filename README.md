# AstroQuest - Astronomy Image Annotation Platform

> Browse NASA's picture of the day, explore a star chart built from catalogue positions, and check what happens in the sky this year. With its backend running, it also records image annotations in its own database.

**AstroQuest is not a citizen-science project.** Nothing recorded here is forwarded to any observatory, survey or research group. If you want your work to count towards published research, use [Zooniverse](https://www.zooniverse.org/).

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)
![React](https://img.shields.io/badge/React-18-61DAFB.svg)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933.svg)
![Vitest](https://img.shields.io/badge/tested%20with-Vitest-6E9F18.svg)
![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)

---

## What is AstroQuest?

AstroQuest is a React front end plus an optional Express/Postgres backend. What it does depends on whether that backend is running.

**Deployed without a backend (the default static build):**
- NASA's Astronomy Picture of the Day, fetched live from `api.nasa.gov` on every page load. If NASA does not answer, the page says "No data" rather than showing something else.
- An interactive sky map of seven constellations, drawn from J2000 catalogue positions and visual magnitudes.
- A 2026 event calendar where every date carries a link to the source it was checked against.
- A permanent banner stating that there is no backend, nothing is saved and nothing is sent anywhere. Annotation, scores, missions, the leaderboard and sign-in are switched off, because without a server every number on those pages would be invented.

**With the backend running (`VITE_API_URL` pointing at it):** accounts, image annotation with confidence scoring, missions, streaks and a leaderboard. Annotations are stored in this platform's own database and go nowhere else.

### Screenshots

<!-- 
To add real screenshots:
1. Run the app locally (npm run dev)
2. Take screenshots of each page
3. Save them to docs/screenshots/
4. Uncomment the images below
-->

| Home Page | Interactive Sky Map |
|:-:|:-:|
| Animated hero with NASA APOD gallery showcase | Stereographic-projection star chart with constellation data |
| ![Home](docs/screenshots/home.png) | ![Sky Map](docs/screenshots/skymap.png) |

| Image Annotation | Leaderboard |
|:-:|:-:|
| Konva canvas with zoom/pan, category selection, confidence scoring | Podium-style top 3 with full ranked list |
| ![Annotate](docs/screenshots/annotate.png) | ![Leaderboard](docs/screenshots/leaderboard.png) |

| Space Gallery | Event Calendar |
|:-:|:-:|
| NASA APOD collection with lightbox and search | Rarity-tiered badges: Common, Rare, Epic, Legendary |
| ![Gallery](docs/screenshots/gallery.png) | ![Events](docs/screenshots/events.png) |

---

## Features

### Real Astronomical Data
- **NASA Image & Video Library API** and **ESA/Hubble API** integration
- Thousands of authentic deep-space images from Hubble, JWST, GALEX, Cassini
- Rich metadata: coordinates (RA/Dec), wavelength, telescope, observation date
- **NASA APOD Gallery** with lightbox viewer, search, and HD downloads

### Interactive Sky Map
- Canvas-based star chart using **stereographic projection**
- 7 major constellations with accurate RA/Dec star positions
- 800+ background stars with realistic magnitude rendering
- Color-coded star temperatures (blue/hot to red/cool)
- Click constellations for descriptions and notable star data
- Smooth pan, zoom, and coordinate grid overlay

### Image Annotation System
- **Konva.js canvas** with zoom, pan, and multi-tool annotation
- Tools: Point marker, Rectangle selection (polygon/freeform planned)
- 9 scientific categories: Galaxy, Nebula, Star Cluster, Supernova, Black Hole, Asteroid, Quasar, Anomaly, Artifact
- Confidence scoring (1-5) and consensus validation
- Responsive canvas that adapts to screen size

### Gamification
- **10-level progression** with exponential XP curve (0 to 16,000 XP)
- **Daily streaks** with streak-freeze mechanic
- **Missions** with difficulty tiers, progress bars, point + XP rewards
- **Daily challenges** with 24-hour rotating objectives
- **Leaderboard** with podium-style top 3 and "YOU" indicator

### Astronomical Events Calendar
- Timeline view of meteor showers, eclipses, oppositions, solstices
- Filter by event type with color-coded badges
- Visibility info (naked eye, binoculars, telescope)
- Best-region recommendations and countdown timers

### Educational Content
- Contextual learning panels for every celestial category
- Identification tips and fascinating astronomical facts
- 7-step interactive onboarding tutorial

### Running without a backend
- Works with no backend and no API key (NASA's shared `DEMO_KEY` is used by default, ~30 requests/hour per address).
- A permanent, non-dismissible banner on every page states that nothing is saved or sent anywhere.
- Gallery images come live from NASA; a failed request shows "No data", never a substitute image.
- Sky map and event calendar work offline of the backend because they are static reference data with cited sources.
- Annotation, sign-in, profile, missions and the leaderboard are switched off and explain why.

> Earlier versions filled these pages with invented data instead: a signed-in user with 4,250 points, a twelve-person leaderboard of people who do not exist, counters reading "10K+ images analysed", and eight NASA image links whose filenames were made up (all eight returned 404). None of that is in the codebase any more, and `frontend/src/__tests__/honesty.test.tsx` fails if it comes back.

### Arcade: Star Defender
A juicy, self-contained canvas mini-game at **`/arcade`** — a quick break from
the science, no backend required.

- **Escalating difficulty waves** with more (and tougher) enemies each round,
  plus a **mini-boss every 5th wave**
- **"Juice" pass**: screen shake on impacts, particle explosions, a subtle
  parallax starfield, and a synthesized WebAudio soundtrack of effects
- **Persistent local leaderboard** — top 10 scores with 3-letter initials,
  saved to `localStorage` so they survive reloads
- **Pause/resume** and a **mute** toggle
- **Frame-rate independent**: the entire simulation is delta-time based, so it
  plays consistently on 60 Hz, 120 Hz, or throttled background tabs

```
┌──────── Star Defender ────────┐
│  *      .       *      ▲      │   ▲ enemy   ◣ mini-boss
│      ◣◣◣◣◣      .         *   │   △ you     · bullets/stars
│   ·   ·    *        ·         │
│  *        △        .     *    │   Survive the waves, beat the boss,
│        ·  ‖  ·                │   and carve your initials into the
│   *           .      *        │   top of the leaderboard.
└───────────────────────────────┘
```

#### Controls

| Action          | Keys                          |
| --------------- | ----------------------------- |
| Move            | `←` `↑` `↓` `→` or `W` `A` `S` `D` |
| Fire            | `Space`                       |
| Pause / Resume  | `P` (or the on-screen button) |
| Mute / Unmute   | `M` (or the on-screen button) |

> Tip: the screenshot above is ASCII art for now — drop a real GIF at
> `docs/arcade.gif` and reference it here to show the game in motion.

---

## Architecture

```
                                   AstroQuest Architecture
 ┌──────────────────────────────────────────────────────────────────────┐
 │                           Frontend (React SPA)                       │
 │                                                                      │
 │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────┐           │
 │  │  Pages   │  │Components│  │ Services │  │   Store   │           │
 │  │          │  │          │  │          │  │ (Zustand) │           │
 │  │ Home     │  │ Navbar   │  │ api.ts   │  │           │           │
 │  │ SkyMap   │  │ ImageView│  │ apodSvc  │  │ authStore │           │
 │  │ Gallery  │  │ DemoBannr│  │ refData  │  └───────────┘           │
 │  │ Events   │  │ Mission  │  │ authSvc  │                          │
 │  │ Explore  │  │ Educate  │  │ imageSvc │     Tailwind CSS         │
 │  │ Annotate │  │ Layout   │  │ userSvc  │     Framer Motion        │
 │  │ Missions │  │ Private  │  │ annotSvc │     Konva Canvas         │
 │  │ Profile  │  └──────────┘  └──────────┘     React Router v6      │
 │  │ Leader   │                                  React Query          │
 │  │ Login    │      No backend? Gallery, sky map and events only.    │
 │  └──────────┘                                                       │
 └─────────────────────────┬────────────────────────────────────────────┘
                           │  REST API (JSON)
 ┌─────────────────────────▼────────────────────────────────────────────┐
 │                        Backend (Express + TypeScript)                 │
 │                                                                      │
 │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────┐           │
 │  │  Routes  │  │Controllers│ │  Models  │  │ Services  │           │
 │  │          │  │          │  │(Sequelize)│ │           │           │
 │  │ /auth    │  │ auth     │  │ User     │  │ nasaSvc   │           │
 │  │ /images  │  │ image    │  │ Image    │  │ esaSvc    │           │
 │  │ /annotate│  │ annotate │  │ Annotate │  │ consensus │           │
 │  │ /missions│  │ mission  │  │ Mission  │  │           │           │
 │  │ /users   │  │ user     │  │ Achieve  │  └───────────┘           │
 │  │ /streak  │  │ streak   │  │ Streak   │                          │
 │  │ /comments│  │ comment  │  │ Comment  │  JWT Auth + RBAC         │
 │  └──────────┘  └──────────┘  │ Challenge│  Rate Limiting           │
 │                              └──────────┘  Helmet + CORS           │
 └──────────┬──────────────────────────┬────────────────────────────────┘
            │                          │
    ┌───────▼───────┐          ┌───────▼───────┐
    │  PostgreSQL   │          │    Redis      │
    │  (Primary DB) │          │   (Cache)     │
    └───────────────┘          └───────────────┘
            │
    ┌───────▼───────────────────────────┐
    │     External APIs                  │
    │  - NASA Image Library API          │
    │  - NASA APOD API                   │
    │  - ESA/Hubble API                  │
    └────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript 5.3, Vite 5, Tailwind CSS 3 |
| **State** | Zustand (auth), React Query (server state) |
| **Canvas** | Konva / react-konva for annotations, custom Canvas API for sky map |
| **Animation** | Framer Motion |
| **Routing** | React Router v6 with protected routes |
| **Backend** | Node.js, Express, TypeScript |
| **Database** | PostgreSQL 14+ (Sequelize ORM), Redis 7+ (caching) |
| **Auth** | JWT with bcrypt hashing, role-based access control |
| **APIs** | NASA Image Library, NASA APOD, ESA/Hubble |
| **Testing** | Vitest, React Testing Library, happy-dom (111+ tests) |
| **Deploy** | Docker Compose, Vercel (frontend), Railway (backend) |

---

## Project Structure

```
space-game/
├── frontend/                    # React SPA
│   ├── src/
│   │   ├── components/          # Navbar, ImageViewer, MissionCard, Tutorial, EducationalPanel
│   │   ├── pages/               # Home, SkyMap, Gallery, Events, Explore, Missions,
│   │   │                        # ImageDetail, Profile, Leaderboard, Login, Register
│   │   ├── services/            # API client (api.ts), NASA APOD client (apodService.ts),
│   │   │                        # sourced reference data (referenceData.ts), appMode.ts,
│   │   │                        # auth, image, annotation, user services
│   │   ├── store/               # Zustand auth store
│   │   ├── types/               # TypeScript interfaces
│   │   ├── utils/               # Constants, game logic, level calculations
│   │   ├── test/                # Test setup and utilities
│   │   └── styles/              # Tailwind CSS + custom animations
│   ├── vite.config.ts           # Vite + code splitting + Vitest config
│   └── tsconfig.json
├── backend/                     # Express API server
│   ├── src/
│   │   ├── routes/              # REST API endpoints
│   │   ├── controllers/         # Request handlers
│   │   ├── models/              # Sequelize models (User, Image, Annotation, etc.)
│   │   ├── services/            # NASA/ESA API integration, consensus algorithm
│   │   ├── middleware/          # Auth, validation, error handling, rate limiting
│   │   └── config/              # Database and Redis configuration
│   └── tests/
├── docs/                        # API docs, deployment guide, contributing guide
├── docker-compose.yml           # Full-stack containerized setup
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **PostgreSQL** 14+ (for backend, not needed for demo mode)
- **Redis** 7+ (for caching, optional)

### Quick Start (Demo Mode -- No Backend Needed)

```bash
# Clone the repository
git clone https://github.com/alexff91/space-game.git
cd space-game/frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
# Open http://localhost:3000

# With no VITE_API_URL configured the app runs without a backend: gallery,
# sky map and event calendar work; everything that would need a server is
# switched off and says so.
```

### Full-Stack with Docker

```bash
docker-compose up -d

# Frontend:  http://localhost:3000
# Backend:   http://localhost:5000
# Database:  PostgreSQL on port 5432
# Cache:     Redis on port 6379
```

### Manual Full-Stack Setup

```bash
# Install everything
npm run install:all

# Configure environment
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# Edit both .env files with your settings

# Set up the database
cd backend && npm run db:migrate && npm run db:seed && cd ..

# Start both servers
npm run dev
```

### Environment Variables

| Variable | Description | Required |
|----------|------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Backend only |
| `REDIS_URL` | Redis connection string | Optional |
| `JWT_SECRET` | Secret for JWT token signing | Backend only |
| `NASA_API_KEY` | NASA API key ([api.nasa.gov](https://api.nasa.gov)) | Optional (demo works without) |
| `VITE_API_URL` | Backend API URL for frontend | Optional (demo mode if absent) |
| `VITE_DEMO_MODE` | Force demo mode (`true`) | Optional |
| `VITE_NASA_API_KEY` | NASA API key for APOD gallery | Optional |

---

## Testing

```bash
cd frontend

npm test              # Run all 111+ tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

| Area | Tests | Coverage |
|------|-------|---------|
| Utility/Helpers | 37 | Level thresholds, XP, progress, categories |
| Game Logic | 14 | Streaks, missions, scoring, difficulty |
| API Services | 26 | Auth, images, annotations, users (mocked HTTP) |
| Components | 21 | EducationalPanel, MissionCard, PrivateRoute |
| Pages | 18 | Home, Login, Register (render + interaction) |
| Types | 9 | TypeScript interface validation |
| **Total** | **111+** | |

---

## Building for Production

```bash
cd frontend
npm run build     # TypeScript check + Vite production build
npm run preview   # Preview locally
```

Output (code-split):
```
dist/react-vendor.js    ~163 KB (gzip: 53 KB)  -- React, Router
dist/ui-vendor.js       ~155 KB (gzip: 55 KB)  -- Framer Motion, Zustand, Axios
dist/canvas-vendor.js   ~293 KB (gzip: 89 KB)  -- Konva, react-konva
dist/index.js           ~170 KB (gzip: 44 KB)  -- Application code
dist/index.css           ~37 KB (gzip:  7 KB)  -- Tailwind CSS
```

---

## API Documentation

### Key Endpoints

| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Authenticate, receive JWT |
| GET | `/api/images` | List images (paginated, filtered) |
| GET | `/api/images/random` | Random image for annotation |
| POST | `/api/annotations` | Submit annotation |
| GET | `/api/annotations/consensus/:id` | Consensus annotations |
| GET | `/api/users/leaderboard` | Global leaderboard |
| GET | `/api/missions` | Active missions |
| POST | `/api/streak/check` | Daily streak check-in |

See [docs/API.md](docs/API.md) for complete documentation.

---

## Deployment

### Vercel (Frontend)
```bash
cd frontend && npx vercel --prod
```

### Railway / Render (Backend)
```bash
railway login && railway new space-game-api && railway deploy
```

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed instructions.

---

## Security

- HTTPS encryption for all data in transit
- Bcrypt password hashing with configurable salt rounds
- JWT-based stateless authentication with expiration
- Role-based access control (user / researcher / admin)
- Rate limiting (express-rate-limit)
- CORS and Helmet protection
- Input validation and sanitization (Joi)

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Write tests for your changes
4. Ensure all tests pass and the build succeeds
5. Open a Pull Request

See [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines.

---

## License

MIT License. See [LICENSE](LICENSE) for details.

---

## Acknowledgments

- [NASA](https://api.nasa.gov/) for open access to astronomical imagery
- [ESA/Hubble](https://esahubble.org/) for space telescope data
- [James Webb Space Telescope](https://webbtelescope.org/) for next-generation observations
- The global citizen-science community for inspiration

---

*Built with curiosity about the cosmos and a love for open science.*

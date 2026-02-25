# AstroQuest - Astronomy Discovery Game

> A citizen-science platform that turns real astronomical image analysis into an engaging game, empowering the public to contribute to actual space research.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)
![React](https://img.shields.io/badge/React-18-61DAFB.svg)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933.svg)
![Vitest](https://img.shields.io/badge/tested%20with-Vitest-6E9F18.svg)

---

## Overview

AstroQuest transforms deep-space image analysis into a rewarding experience. Users examine authentic astronomical images from **NASA**, **ESA**, and the **Hubble Space Telescope**, identify celestial objects, and earn points---all while contributing meaningful data to ongoing research. Consensus-based annotation validation ensures scientific rigor.

<!-- Screenshots placeholder -->
<!--
<p align="center">
  <img src="docs/screenshots/home.png" width="45%" alt="Home page" />
  <img src="docs/screenshots/annotate.png" width="45%" alt="Image annotation" />
</p>
<p align="center">
  <img src="docs/screenshots/leaderboard.png" width="45%" alt="Leaderboard" />
  <img src="docs/screenshots/missions.png" width="45%" alt="Missions" />
</p>
-->

---

## Features

### Real Astronomical Data
- Integrates with **NASA Image and Video Library API** and **ESA/Hubble API**
- Browse thousands of authentic deep-space images from world-class telescopes
- Rich metadata including coordinates (RA/Dec), wavelength, and observation date

### Interactive Image Annotation
- Canvas-based viewer with zoom, pan, and multiple annotation tools (point, rectangle, polygon, freeform)
- 9 scientific categories: Galaxy, Nebula, Star Cluster, Supernova, Black Hole, Asteroid, Quasar, Anomaly, Artifact
- Confidence scoring and consensus validation across multiple users

### Gamification System
- **Points and Levels**: 10-level progression system with exponential XP curve (0 to 16,000 XP)
- **Daily Streaks**: Maintain consecutive-day activity for bonus rewards, with weekly streak-freeze
- **Missions**: Short-term and long-term objectives with difficulty tiers (Beginner through Expert)
- **Daily Challenges**: Rotating category-specific tasks that reset every 24 hours
- **Leaderboard**: Ranked competition among citizen scientists
- **Achievements**: Unlockable badges across categories (common, rare, epic, legendary)

### Social Features
- Comment and discuss findings on images
- Like and share community observations
- Profile pages with stats, annotation history, and achievement showcase

### Educational Content
- Contextual learning panels for every celestial category
- Identification tips and fascinating facts about galaxies, nebulae, quasars, and more
- 7-step interactive tutorial for new users

### Research Tools
- Researcher/admin dashboard for reviewing and validating annotations
- Consensus annotation system that aggregates crowd-sourced data
- Data export capabilities for downstream analysis

---

## Tech Stack

| Layer        | Technology                                          |
| ------------ | --------------------------------------------------- |
| **Frontend** | React 18, TypeScript 5, Vite, Tailwind CSS          |
| **State**    | Zustand (auth), React Query (server state)          |
| **Canvas**   | Konva / react-konva for image annotation             |
| **Routing**  | React Router v6 with protected routes               |
| **Backend**  | Node.js, Express, PostgreSQL, Redis                  |
| **Auth**     | JWT-based authentication with role system            |
| **APIs**     | NASA Image Library, ESA/Hubble Space Telescope       |
| **Testing**  | Vitest, React Testing Library, happy-dom             |
| **Deploy**   | Docker Compose, Vercel (frontend), Railway (backend) |

---

## Project Structure

```
space-game/
├── frontend/                 # React SPA
│   ├── src/
│   │   ├── components/       # Reusable UI (Navbar, MissionCard, Tutorial, ...)
│   │   ├── pages/            # Route pages (Home, Explore, Login, Missions, ...)
│   │   ├── services/         # API client layer (auth, images, annotations, users)
│   │   ├── store/            # Zustand state management
│   │   ├── types/            # TypeScript interfaces
│   │   ├── utils/            # Constants, game logic, helpers
│   │   ├── test/             # Test setup and utilities
│   │   └── styles/           # Tailwind CSS entry point
│   ├── vite.config.ts        # Vite + Vitest configuration
│   └── tsconfig.json
├── backend/                  # Express API server
│   ├── src/
│   │   ├── routes/           # API route definitions
│   │   ├── controllers/      # Request handlers
│   │   ├── models/           # Sequelize database models
│   │   ├── services/         # Business logic
│   │   ├── middleware/       # Auth, validation, rate limiting
│   │   └── utils/            # Helpers and constants
│   └── tests/
├── docs/                     # Additional documentation
├── docker-compose.yml        # Full-stack containerized setup
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **PostgreSQL** 14+ (for backend)
- **Redis** 7+ (for caching, optional for dev)

### Quick Start (Frontend Only)

```bash
# Clone the repository
git clone https://github.com/alexff91/space-game.git
cd space-game

# Install frontend dependencies
cd frontend
npm install

# Start the dev server (proxies API calls to localhost:5000)
npm run dev
# Open http://localhost:3000
```

### Full-Stack with Docker

```bash
# From the repository root
docker-compose up -d

# Frontend:  http://localhost:3000
# Backend:   http://localhost:5000
# Database:  PostgreSQL on port 5432
# Cache:     Redis on port 6379
```

### Manual Full-Stack Setup

```bash
# 1. Clone and install everything
git clone https://github.com/alexff91/space-game.git
cd space-game
npm run install:all

# 2. Configure environment
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# Edit both .env files with your settings

# 3. Set up the database
cd backend
npm run db:migrate
npm run db:seed

# 4. Start both servers
cd ..
npm run dev
```

### Environment Variables

Copy `.env.example` files and configure:

| Variable            | Description                     | Required |
| ------------------- | ------------------------------- | -------- |
| `DATABASE_URL`      | PostgreSQL connection string    | Yes      |
| `REDIS_URL`         | Redis connection string         | No       |
| `JWT_SECRET`        | Secret for JWT token signing    | Yes      |
| `NASA_API_KEY`      | NASA API key (get from api.nasa.gov) | Yes |
| `VITE_API_URL`      | Backend API URL for frontend    | No       |

---

## Testing

The project uses **Vitest** with **React Testing Library** and **happy-dom**.

```bash
cd frontend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage report
npm run test:coverage
```

### Test Coverage

| Area                | Files | Tests | What is tested                                              |
| ------------------- | ----- | ----- | ----------------------------------------------------------- |
| **Utility/Helpers** | 2     | 37    | Level thresholds, XP calculation, progress, categories, difficulty |
| **Game Logic**      | 1     | 14    | Streak mechanics, mission progress, scoring, difficulty mapping |
| **API Services**    | 4     | 26    | Auth, images, annotations, users (all with mocked HTTP)     |
| **Components**      | 3     | 21    | EducationalPanel, MissionCard, PrivateRoute                 |
| **Pages**           | 3     | 18    | Home, Login, Register (render + interaction)                |
| **Types**           | 1     | 9     | TypeScript interface validation                             |
| **Total**           | **13**| **111+**| Full frontend coverage                                     |

---

## Building for Production

```bash
cd frontend

# TypeScript check + Vite production build
npm run build

# Preview the production build locally
npm run preview
```

The production build outputs optimized static files to `frontend/dist/` (~700 KB JS, ~22 KB CSS).

---

## API Documentation

When the backend is running, API docs are available at `/api/docs`.

### Key Endpoints

| Method | Endpoint                      | Description                        |
| ------ | ----------------------------- | ---------------------------------- |
| POST   | `/api/auth/register`          | Create a new account               |
| POST   | `/api/auth/login`             | Authenticate and receive JWT       |
| GET    | `/api/images`                 | List images (paginated, filtered)  |
| GET    | `/api/images/random`          | Get a random image for annotation  |
| POST   | `/api/annotations`            | Submit a new annotation            |
| GET    | `/api/annotations/consensus/:id` | Get consensus annotations       |
| GET    | `/api/users/leaderboard`      | Global leaderboard                 |
| GET    | `/api/missions`               | Active missions                    |
| POST   | `/api/streak/check`           | Check in for daily streak          |

---

## Deployment

### Vercel (Frontend)

```bash
cd frontend
npx vercel --prod
```

### Railway / Render (Backend)

The backend requires PostgreSQL and Redis. Deploy to a container-friendly platform:

```bash
railway login
railway new space-game-api
railway deploy
```

See [SETUP.md](SETUP.md) for detailed deployment instructions.

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Write tests for your changes
4. Ensure all tests pass (`npm test`) and the build succeeds (`npm run build`)
5. Commit your changes (`git commit -m "Add amazing feature"`)
6. Push to your branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

---

## Security

- HTTPS encryption for all data in transit
- Bcrypt password hashing with salt rounds
- JWT-based stateless authentication
- Role-based access control (user / researcher / admin)
- Rate limiting and CORS protection
- Input validation and sanitization on all endpoints

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

## Acknowledgments

- [NASA](https://api.nasa.gov/) for open access to astronomical imagery
- [ESA/Hubble](https://esahubble.org/) for space telescope data
- The global citizen-science community for inspiration

---

*Built with curiosity about the cosmos.*

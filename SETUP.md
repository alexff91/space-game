# Quick Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18 or higher
- npm or yarn
- PostgreSQL 14 or higher
- Redis 7 or higher

Alternatively, you can use Docker and Docker Compose.

## Quick Start (Docker - Recommended)

The easiest way to get started is using Docker Compose:

```bash
# Clone the repository
git clone <repository-url>
cd astronomy-discovery-game

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- Health Check: http://localhost:5000/health

## Manual Setup

If you prefer to run without Docker:

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Set Up PostgreSQL

```bash
# Create database
createdb astronomy_game

# Or using psql
psql -U postgres
CREATE DATABASE astronomy_game;
```

### 3. Configure Environment Variables

```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with your database credentials and API keys

# Frontend
cd ../frontend
echo "VITE_API_URL=http://localhost:5000/api" > .env
```

### 4. Start Services

#### Option A: Start everything at once (from root directory)
```bash
npm run dev
```

#### Option B: Start services separately

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

### 5. Load Sample Data (Optional)

To populate the database with sample astronomical images:

1. Get a NASA API key (free) from: https://api.nasa.gov/
2. Update your `.env` file with the API key
3. Log in to the application as an admin
4. Navigate to the admin panel and click "Fetch NASA Images"

## First Steps

1. Open http://localhost:3000
2. Click "Get Started" to create an account
3. Log in with your credentials
4. Click "Explore" to start annotating images!

## Testing the Application

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Common Issues

### Port Already in Use
If ports 3000 or 5000 are already in use, you can change them in:
- Frontend: `vite.config.ts`
- Backend: `.env` file (PORT variable)

### Database Connection Failed
- Ensure PostgreSQL is running
- Check database credentials in `.env`
- Verify database exists: `psql -l`

### Redis Connection Failed
- Ensure Redis is running: `redis-cli ping`
- Check Redis configuration in `.env`

### Module Not Found
- Delete `node_modules` folders
- Run `npm install` again

## API Keys

### NASA API Key (Required for fetching images)

1. Visit https://api.nasa.gov/
2. Sign up for a free API key
3. Add to `backend/.env`: `NASA_API_KEY=your_key_here`

Note: The DEMO_KEY has limited requests. Get your own key for development.

## Next Steps

- Read [README.md](README.md) for project overview
- Check [API.md](docs/API.md) for API documentation
- See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for production deployment
- Read [CONTRIBUTING.md](docs/CONTRIBUTING.md) to contribute

## Need Help?

- Check the documentation in the `docs/` folder
- Open an issue on GitHub
- Review the troubleshooting section in DEPLOYMENT.md

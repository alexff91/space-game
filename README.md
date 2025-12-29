# Astronomy Discovery Game Platform

An online game that engages users in analyzing real astronomical images to identify unusual objects or patterns, contributing to ongoing space research.

## Overview

This platform transforms space image analysis into an engaging game, empowering the public to contribute to real astronomical research while ensuring scientific rigor and data integrity.

## Features

### Core Features
- **Real Astronomical Data**: Integration with NASA, ESA, and Hubble image databases
- **Interactive Annotation**: Web-based image viewer with zoom, pan, and annotation tools
- **Consensus Building**: Aggregate user annotations to identify potential discoveries
- **Educational Content**: Learn about astronomy while contributing to research

### Gamification & Engagement
- **Points & Levels**: Earn points for annotations, level up to unlock achievements
- **Daily Challenges**: New challenges every day with special rewards
- **Missions System**: Long-term objectives with progress tracking
- **Streak System**: Daily login rewards with streak freezing
- **Leaderboard**: Compete with other citizen scientists

### Social Features
- **Comments**: Discuss findings with other users
- **Likes**: Engage with community observations
- **Sharing**: Share interesting discoveries

### User Experience
- **Interactive Tutorial**: 7-step onboarding for new users
- **Educational Panels**: Contextual learning about celestial objects
- **Progress Tracking**: Detailed stats and achievements
- **Responsive Design**: Works on desktop, tablet, and mobile

### Research Tools
- **Researcher Dashboard**: Admin interface for scientists to review findings
- **Annotation Validation**: Expert verification system
- **Data Export**: Export annotations for analysis

## Tech Stack

### Frontend
- React 18 with TypeScript
- Canvas-based image viewer with annotation tools
- Responsive design for desktop, tablet, and mobile
- Accessibility features (WCAG 2.1 compliant)

### Backend
- Node.js with Express
- PostgreSQL for data storage
- Redis for caching
- JWT-based authentication
- RESTful API design

### External APIs
- NASA Image and Video Library API
- ESA/Hubble Space Telescope API
- Additional astronomy data sources

## Project Structure

```
astronomy-discovery-game/
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API clients
│   │   ├── utils/         # Utility functions
│   │   └── types/         # TypeScript types
│   └── public/
├── backend/           # Node.js backend application
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── controllers/   # Request handlers
│   │   ├── models/        # Database models
│   │   ├── services/      # Business logic
│   │   ├── middleware/    # Express middleware
│   │   └── utils/         # Utility functions
│   └── tests/
└── docs/              # Documentation
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 14+
- Redis 7+

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd astronomy-discovery-game
```

2. Install dependencies:
```bash
npm run install:all
```

3. Set up environment variables:
```bash
# Backend (.env in backend/)
cp backend/.env.example backend/.env
# Edit backend/.env with your configuration
```

4. Set up the database:
```bash
cd backend
npm run db:migrate
npm run db:seed
```

5. Start the development servers:
```bash
npm run dev
```

The frontend will be available at http://localhost:3000 and the backend API at http://localhost:5000.

## Deployment

### Vercel Deployment (Recommended)

This project is optimized for Vercel deployment with pre-configured `vercel.json` files.

**Quick Deploy:**
1. Push to GitHub
2. Import to Vercel
3. Configure environment variables
4. Deploy!

See [VERCEL_DEPLOYMENT.md](docs/VERCEL_DEPLOYMENT.md) for detailed instructions.

### Docker Deployment

```bash
docker-compose up -d
```

See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for production deployment guide.

## Development

### Running Tests
```bash
npm test
```

### Building for Production
```bash
npm run build
```

### Database Migrations
```bash
cd backend
npm run db:migrate
npm run db:rollback  # Rollback last migration
```

## New Features (v2.0)

### 🎯 Daily Challenges
Complete daily objectives to earn bonus rewards:
- Rotate automatically each day
- Category-specific challenges (galaxies, nebulae, etc.)
- Bonus points and experience
- Track progress in real-time

### 🔥 Streak System
Build your daily streak for increasing rewards:
- Login daily to maintain your streak
- Earn bonus points based on streak length
- Freeze your streak once per week
- Track your longest streak ever

### 📚 Educational Content
Learn while you explore:
- Detailed information for each celestial category
- Fascinating facts about space objects
- Identification tips and guidelines
- Contextual learning panels

### 🎓 Interactive Tutorial
New users get a comprehensive onboarding:
- 7-step interactive guide
- Learn annotation tools and categories
- Understand the point system
- Skip anytime, resume later

### 💬 Social Features
Engage with the community:
- Comment on images
- Like other users' comments
- Share interesting discoveries
- Discuss findings with fellow astronomers

### 🏆 Enhanced Missions
Long-term objectives with rewards:
- Multiple active missions
- Progress tracking
- Difficulty levels (Easy, Medium, Hard)
- Rich rewards for completion

## API Documentation

API documentation is available at `/api/docs` when running the backend server.

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## Security

- HTTPS encryption for all data in transit
- Bcrypt password hashing
- JWT-based authentication
- OAuth 2.0 support
- Rate limiting and CORS protection
- Input validation and sanitization

## Privacy

User data is collected and stored in accordance with our Privacy Policy. Users must consent to data collection, and all data can be deleted upon request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- NASA for providing open access to astronomical imagery
- ESA and Hubble Space Telescope for data access
- The citizen science community for inspiration

## Contact

For questions or support, please open an issue on GitHub.

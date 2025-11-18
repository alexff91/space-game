# Deployment Guide

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Redis 7+
- Docker and Docker Compose (optional)

## Development Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd astronomy-discovery-game
```

### 2. Install Dependencies

```bash
npm run install:all
```

### 3. Configure Environment Variables

#### Backend
```bash
cd backend
cp .env.example .env
# Edit .env with your configuration
```

#### Frontend
```bash
cd frontend
# Create .env file
echo "VITE_API_URL=http://localhost:5000/api" > .env
```

### 4. Set Up Database

```bash
# Start PostgreSQL
# Create database
createdb astronomy_game

# Run migrations (in backend directory)
cd backend
npm run db:migrate
```

### 5. Start Development Servers

```bash
# From root directory
npm run dev
```

Frontend: http://localhost:3000
Backend API: http://localhost:5000/api

## Docker Deployment

### Development with Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production Docker Build

```bash
# Build images
docker-compose -f docker-compose.prod.yml build

# Start services
docker-compose -f docker-compose.prod.yml up -d
```

## Production Deployment

### Environment Configuration

1. Set `NODE_ENV=production`
2. Use strong JWT secret
3. Configure CORS for your domain
4. Set up SSL/HTTPS
5. Use environment-specific database credentials

### Database Migrations

```bash
cd backend
NODE_ENV=production npm run db:migrate
```

### Build Frontend

```bash
cd frontend
npm run build
# Deploy dist/ folder to CDN or static hosting
```

### Build Backend

```bash
cd backend
npm run build
# Deploy dist/ folder to Node.js server
```

## Cloud Deployment

### AWS Deployment

1. **Database**: Amazon RDS (PostgreSQL)
2. **Cache**: Amazon ElastiCache (Redis)
3. **Backend**: AWS Elastic Beanstalk or ECS
4. **Frontend**: Amazon S3 + CloudFront
5. **Storage**: Amazon S3 for user uploads

### Google Cloud Platform

1. **Database**: Cloud SQL (PostgreSQL)
2. **Cache**: Memorystore for Redis
3. **Backend**: Cloud Run or App Engine
4. **Frontend**: Cloud Storage + Cloud CDN

### Heroku Deployment

```bash
# Backend
cd backend
heroku create astronomy-api
heroku addons:create heroku-postgresql:hobby-dev
heroku addons:create heroku-redis:hobby-dev
git push heroku main

# Frontend
cd frontend
# Deploy to Vercel, Netlify, or similar
```

## Environment Variables (Production)

### Backend Required Variables

```env
NODE_ENV=production
PORT=5000
DB_HOST=<database-host>
DB_PORT=5432
DB_NAME=astronomy_game
DB_USER=<database-user>
DB_PASSWORD=<database-password>
REDIS_HOST=<redis-host>
REDIS_PORT=6379
REDIS_PASSWORD=<redis-password>
JWT_SECRET=<strong-secret-key>
JWT_EXPIRE=7d
NASA_API_KEY=<your-nasa-api-key>
CORS_ORIGIN=https://yourdomain.com
```

### Frontend Required Variables

```env
VITE_API_URL=https://api.yourdomain.com/api
```

## SSL/HTTPS Setup

### Using Let's Encrypt with Nginx

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/fullchain.pem;
    ssl_certificate_key /path/to/privkey.pem;

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        root /var/www/astronomy-game;
        try_files $uri /index.html;
    }
}
```

## Monitoring and Logging

### Recommended Tools

- **Application Monitoring**: New Relic, DataDog
- **Error Tracking**: Sentry
- **Logging**: Winston (included), CloudWatch, Papertrail
- **Uptime Monitoring**: Pingdom, UptimeRobot

### Health Check Endpoint

```
GET /health
```

Returns server status and timestamp.

## Backup Strategy

### Database Backups

```bash
# PostgreSQL backup
pg_dump astronomy_game > backup_$(date +%Y%m%d).sql

# Automated backups (cron)
0 2 * * * pg_dump astronomy_game > /backups/db_$(date +\%Y\%m\%d).sql
```

### Redis Persistence

Configure Redis AOF (Append Only File) or RDB snapshots in redis.conf.

## Performance Optimization

1. **Enable Compression**: Gzip/Brotli for static assets
2. **CDN**: Use CloudFront, CloudFlare, or similar for frontend
3. **Database Indexing**: Ensure proper indexes on frequently queried fields
4. **Caching**: Redis caching for API responses
5. **Image Optimization**: Use CDN with image optimization (imgix, Cloudinary)

## Security Checklist

- [ ] Use HTTPS everywhere
- [ ] Set strong JWT secret
- [ ] Enable CORS with specific origins
- [ ] Use environment variables for secrets
- [ ] Enable rate limiting
- [ ] Sanitize user inputs
- [ ] Use prepared statements for database queries
- [ ] Keep dependencies updated
- [ ] Enable Helmet.js security headers
- [ ] Set up WAF (Web Application Firewall)

## Scaling Considerations

1. **Horizontal Scaling**: Load balancer + multiple backend instances
2. **Database**: Read replicas for read-heavy operations
3. **Caching**: Redis cluster for distributed caching
4. **Queue System**: Bull or RabbitMQ for background jobs
5. **Microservices**: Split into auth, images, annotations services

## Troubleshooting

### Database Connection Issues
- Check database credentials
- Verify network connectivity
- Check firewall rules

### Redis Connection Issues
- Verify Redis is running
- Check Redis password configuration

### CORS Errors
- Ensure CORS_ORIGIN matches frontend domain
- Check for protocol mismatch (http vs https)

### Build Failures
- Clear node_modules and reinstall
- Check Node.js version compatibility
- Verify all environment variables are set

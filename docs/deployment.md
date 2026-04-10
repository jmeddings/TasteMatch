# TasteMatch Deployment Guide

## Overview

This guide covers deployment procedures for the TasteMatch application across different environments.

## Architecture

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Client    │    │     API     │    │  Supabase   │
│  (Vite/     │◄──►│ (Express)   │◄──►│ (PostgreSQL)│
│   React)    │    │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘
```

## Environment Setup

### Environment Variables

#### Client (.env)
```bash
VITE_API_URL=http://localhost:3001/api
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-key
```

#### API (.env)
```bash
PORT=3001
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Supabase
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_KEY=your-supabase-service-key

# JWT
JWT_SECRET=your-jwt-secret

# External APIs
GOOGLE_MAPS_API_KEY=your-google-maps-key
OPENAI_API_KEY=your-openai-key-for-image-analysis
```

## Local Development

### Prerequisites
- Node.js 18+
- npm or yarn
- Git
- Supabase CLI (optional)

### Setup Steps

1. **Clone Repository**
```bash
git clone https://github.com/jmeddings/TasteMatch.git
cd TasteMatch
```

2. **Install Dependencies**
```bash
# Client
cd client
npm install

# API
cd ../api
npm install
```

3. **Set Up Supabase**
- Create Supabase project at https://supabase.com
- Run migrations from `/supabase/migrations`
- Run seeds from `/supabase/seeds`

4. **Configure Environment**
- Copy `.env.example` to `.env` in both client and api
- Fill in your configuration values

5. **Start Development Servers**
```bash
# API (terminal 1)
cd api
npm run dev

# Client (terminal 2)
cd client
npm run dev
```

## Production Deployment

### Client Deployment (Vercel)

1. **Prepare for Deployment**
```bash
cd client
npm run build
```

2. **Deploy to Vercel**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

3. **Environment Variables in Vercel**
- Add all client environment variables
- Set build command: `npm run build`
- Set output directory: `dist`

### API Deployment (Railway/Render)

#### Option 1: Railway
1. **Install Railway CLI**
```bash
npm install -g @railway/cli
```

2. **Deploy**
```bash
cd api
railway login
railway init
railway up
```

3. **Configure Environment**
- Set environment variables in Railway dashboard
- Configure port (default: 3001)

#### Option 2: Render
1. **Connect GitHub Repository**
- Go to https://render.com
- Connect your GitHub repository
- Select "Web Service"

2. **Configuration**
- Build Command: `npm run build`
- Start Command: `npm start`
- Environment Variables: Add all required variables

### Database (Supabase)

Supabase handles database deployment automatically:

1. **Production Setup**
- Create production project
- Run migrations via Supabase dashboard
- Configure RLS policies
- Set up authentication providers

2. **Backup Strategy**
- Enable daily backups in Supabase
- Set up point-in-time recovery
- Monitor storage usage

## CI/CD Pipeline

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy TasteMatch

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd client && npm ci
          cd ../api && npm ci
      
      - name: Run tests
        run: |
          cd client && npm test
          cd ../api && npm test

  deploy-client:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./client

  deploy-api:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        uses: railway-app/railway-action@v1
        with:
          api-token: ${{ secrets.RAILWAY_TOKEN }}
          service: tastematch-api
```

## Monitoring and Logging

### Application Monitoring

1. **Client Monitoring**
- Vercel Analytics
- Sentry for error tracking
- Performance monitoring

2. **API Monitoring**
- Railway/Render logs
- Health check endpoint: `/api/health`
- Error tracking with Sentry

3. **Database Monitoring**
- Supabase dashboard
- Query performance analysis
- Storage usage tracking

### Log Management

```javascript
// API logging example
import winston from 'winston'

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
})
```

## Security Considerations

### Environment Security
- Use strong, unique secrets
- Rotate API keys regularly
- Never commit secrets to Git

### API Security
- Rate limiting implemented
- CORS properly configured
- Input validation and sanitization
- SQL injection prevention via Supabase RLS

### Client Security
- Secure cookie handling
- XSS prevention
- Content Security Policy headers

## Performance Optimization

### Client Optimization
- Code splitting with React.lazy()
- Image optimization and lazy loading
- Service worker for offline capability
- Bundle size analysis

### API Optimization
- Response caching
- Database query optimization
- Compression middleware
- CDN for static assets

## Scaling Considerations

### Horizontal Scaling
- Load balancer for API instances
- Read replicas for database
- CDN for static content

### Database Scaling
- Connection pooling
- Query optimization
- Index strategy review

## Backup and Recovery

### Automated Backups
- Daily database backups
- File storage backups
- Configuration backups

### Disaster Recovery
- Multi-region deployment
- Failover procedures
- Recovery time objectives

## Troubleshooting

### Common Issues

1. **Build Failures**
- Check Node.js version compatibility
- Verify all dependencies installed
- Review environment variables

2. **Database Connection Issues**
- Verify Supabase credentials
- Check network connectivity
- Review RLS policies

3. **API Performance**
- Monitor response times
- Check database query performance
- Review rate limiting settings

### Debug Commands

```bash
# Check API health
curl https://api.tastematch.com/api/health

# Test database connection
cd api && npm run test:db

# Client build analysis
cd client && npm run analyze
```

## Maintenance

### Regular Tasks
- Update dependencies monthly
- Review and rotate secrets quarterly
- Monitor storage usage weekly
- Backup verification monthly

### Update Process
1. Test in staging environment
2. Create backup before deployment
3. Deploy with zero downtime
4. Monitor post-deployment
5. Rollback plan if needed

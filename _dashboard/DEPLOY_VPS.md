# VPS Deployment Instructions

## Prerequisites
- Node.js 18+ installed
- PM2 installed globally: `npm install -g pm2`

## Deployment Steps

1. **Install dependencies**
   ```bash
   npm install --production
   ```

2. **Set up environment**
   ```bash
   cp .env.production.example .env.production
   # Edit .env.production with your actual values
   ```

3. **Build the application**
   ```bash
   npm run build
   ```

4. **Start with PM2**
   ```bash
   pm2 start ecosystem.config.cjs
   pm2 save
   pm2 startup
   ```

## Required Environment File
- File: `.env.production`
- Path: `_dashboard/.env.production`
- Must contain: NEXTAUTH_SECRET, NEXTAUTH_URL, DASH_USER, DASH_PASS

## Production Commands
- Build: `npm run build`
- Start: `npm start`
- PM2 start: `pm2 start ecosystem.config.cjs`
- App runs on port: 3100

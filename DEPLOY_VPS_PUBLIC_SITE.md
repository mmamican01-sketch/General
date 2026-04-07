# VPS Public Site Deployment Instructions

## Overview
Deploy the Astro public website to the same Hostinger VPS that runs the dashboard.
The site will be served from `/var/www/afgtglobal/` via Nginx.

## Prerequisites
- VPS with Node.js 18+ installed
- Nginx configured to serve from `/var/www/afgtglobal/`
- rsync installed on VPS
- Repository cloned on VPS
- Dashboard already deployed and running

## Initial VPS Setup

1. **Create web root directory**
   ```bash
   sudo mkdir -p /var/www/afgtglobal
   sudo chown $USER:$USER /var/www/afgtglobal
   ```

2. **Clone repository (if not already done)**
   ```bash
   cd ~
   git clone <repository-url> al-farhan
   cd al-farhan
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

## Build and Publish Flow

### Manual Publish (First Time)
```bash
cd ~/al-farhan
git pull origin main
npm install
npm run build:publish
```

### Semi-Automatic Publish (Dashboard-Triggered)
The dashboard can trigger a rebuild by running:
```bash
npm run build:publish
```

This will:
1. Build the Astro site (`npm run build`)
2. Sync `dist/` to `/var/www/afgtglobal/` using rsync with delete

## Available Scripts

- `npm run build` - Build Astro site to `dist/`
- `npm run publish:vps` - Sync `dist/` to `/var/www/afgtglobal/`
- `npm run build:publish` - Build and publish in one command

## Nginx Configuration

Ensure Nginx is configured to serve from `/var/www/afgtglobal/`:

```nginx
server {
    listen 80;
    server_name afgtglobal.com www.afgtglobal.com;
    
    root /var/www/afgtglobal;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## Post-Deployment Verification

1. Check build output:
   ```bash
   ls -la /var/www/afgtglobal/
   ```

2. Verify site is accessible:
   ```bash
   curl http://afgtglobal.com
   ```

## Dashboard Integration

The dashboard can trigger site rebuilds via:
```bash
cd ~/al-farhan && npm run build:publish
```

This enables semi-automatic publishing when content is updated through the dashboard.

## Troubleshooting

- **Permission denied**: Ensure `/var/www/afgtglobal/` is owned by your user
- **rsync not found**: Install with `sudo apt install rsync`
- **Build fails**: Check Node.js version (requires 18+)
- **Site not updating**: Clear browser cache or check Nginx logs

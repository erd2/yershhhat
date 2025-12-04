# Deployment Guide

This guide covers various deployment options for your personal portfolio website.

## 🌐 Frontend Deployment (Static Site)

### 1. GitHub Pages

**Setup:**
```bash
# Push to GitHub
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

**Configure GitHub Pages:**
1. Go to repository Settings > Pages
2. Source: Deploy from a branch
3. Branch: main / (root)
4. Save

**Access:** `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

### 2. Netlify

**Method 1: Git Integration**
1. Connect GitHub repository to Netlify
2. Build settings:
   - Build command: `echo "Static site"`
   - Publish directory: `/`
3. Deploy automatically

**Method 2: Drag & Drop**
1. Create a zip file of your project
2. Drag to Netlify deploy area
3. Get instant URL

**Custom Domain (optional):**
1. Add domain in Netlify settings
2. Update DNS records:
   ```
   Type: CNAME
   Name: www
   Value: your-site.netlify.app
   ```

### 3. Vercel

**Setup:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project directory
vercel

# Follow prompts:
# - Set up and deploy: Y
# - Which scope: (your account)
# - Link to existing project: N
# - Project name: portfolio
# - Directory: ./
```

**Access:** `https://your-project.vercel.app`

### 4. Firebase Hosting

**Setup:**
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize project
firebase init hosting

# Build and deploy
npm run build  # if using build process
firebase deploy
```

### 5. Surge.sh

**Setup:**
```bash
# Install Surge
npm install -g surge

# Deploy from project directory
surge

# Follow prompts to set domain
```

### 6. Traditional Web Hosting (cPanel/FTP)

**Steps:**
1. Compress your project files
2. Upload via FTP/cPanel File Manager
3. Extract to public_html or www folder
4. Set index.html as the default page

**Common hosting providers:**
- Hostinger
- GoDaddy
- Bluehost
- SiteGround

## 🚀 Backend Deployment (API)

### 1. Heroku

**Setup:**
```bash
# Install Heroku CLI
# Create Procfile in backend/ directory
echo "web: node server.js" > backend/Procfile

# Initialize git in backend (if not already done)
cd backend
git init
git add .
git commit -m "Backend setup"

# Create Heroku app
heroku create your-portfolio-api

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set FRONTEND_URL=https://your-frontend-url.com

# Deploy
git subtree push --prefix backend heroku main
```

**Access:** `https://your-portfolio-api.herokuapp.com`

### 2. Railway

**Setup:**
1. Connect GitHub repository to Railway
2. Set root directory to `backend/`
3. Configure environment variables
4. Deploy automatically

**Access:** `https://your-project.railway.app`

### 3. Render

**Setup:**
1. Create new Web Service on Render
2. Connect GitHub repository
3. Settings:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Root Directory: `backend`
4. Add environment variables

### 4. DigitalOcean App Platform

**Setup:**
1. Create new app
2. Connect repository
3. Configure:
   - Source Directory: `backend`
   - Run Command: `npm start`
4. Add environment variables

### 5. AWS (Elastic Beanstalk)

**Setup:**
```bash
# Install EB CLI
pip install awsebcli

# Initialize
cd backend
eb init

# Create environment
eb create production

# Deploy
eb deploy
```

### 6. VPS/Dedicated Server

**Using PM2 (Process Manager):**

```bash
# Install PM2
npm install -g pm2

# Install dependencies
cd backend
npm install --production

# Create ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'portfolio-api',
    script: 'server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    }
  }]
}
EOF

# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save
pm2 startup
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔧 Environment Configuration

### Environment Variables

**Production .env:**
```bash
# Server
PORT=3001
NODE_ENV=production

# Frontend URL (your deployed frontend)
FRONTEND_URL=https://your-portfolio.netlify.app

# Database
DATABASE_PATH=./production.db

# Security
JWT_SECRET=your-super-secure-jwt-secret-here
SESSION_SECRET=your-super-secure-session-secret-here

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Email (if using contact form)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# GitHub API (optional)
GITHUB_TOKEN=your-github-token
GITHUB_USERNAME=your-github-username

# Analytics (optional)
GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
```

### Security Checklist

**Before deploying:**
- [ ] Change all default passwords
- [ ] Use strong JWT secrets
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable security headers
- [ ] Use environment variables for secrets

## 📊 Performance Optimization

### Frontend Optimization

**Image Optimization:**
```bash
# Install imagemin
npm install -g imagemin-cli imagemin-webp

# Convert images to WebP
imagemin assets/images/* --out-dir=assets/images --plugin=webp
```

**CSS/JS Minification:**
```bash
# Install minifiers
npm install -g clean-css-cli uglify-js

# Minify CSS
cleancss -o styles.min.css styles.css

# Minify JavaScript
uglifyjs script.js -o script.min.js
```

**GZIP Compression:**
- Enable on your hosting platform
- Most modern hosts support it by default

### Backend Optimization

**Database Optimization:**
```sql
-- Add indexes for better performance
CREATE INDEX idx_profiles_updated_at ON profiles(updated_at);
CREATE INDEX idx_contact_messages_created_at ON contact_messages(created_at);
```

**Caching:**
```javascript
// Add caching middleware
const cache = require('memory-cache');
app.use('/api/profile', cache('10 minutes'));
```

## 🔍 Monitoring & Analytics

### Health Checks

**Basic health endpoint:**
```javascript
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: '1.0.0'
  });
});
```

### Logging

**Add structured logging:**
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

logger.info('API request', { method: req.method, url: req.url });
```

### Error Tracking

**Sentry Integration:**
```javascript
const Sentry = require('@sentry/node');

Sentry.init({ dsn: 'YOUR_SENTRY_DSN' });

app.use(Sentry.Handlers.errorHandler());
```

## 🌟 SSL/HTTPS Setup

### Let's Encrypt (Free SSL)

**Using Certbot:**
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Cloudflare (Free SSL + CDN)

**Setup:**
1. Create Cloudflare account
2. Add your domain
3. Update nameservers
4. Enable SSL/TLS:
   - Encryption mode: Full (strict)
   - Edge Certificates: Enabled

## 📱 PWA Setup

### Service Worker

**sw.js:**
```javascript
const CACHE_NAME = 'portfolio-v1';
const urlsToCache = [
  '/',
  '/styles.css',
  '/script.js',
  '/assets/images/profile.jpg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
```

**Register in index.html:**
```html
<script>
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
</script>
```

## 🔧 Troubleshooting

### Common Issues

**CORS Errors:**
- Check FRONTEND_URL in backend .env
- Ensure proper CORS configuration
- Verify deployed frontend URL

**Database Issues:**
- Check file permissions
- Verify database path
- Ensure proper schema creation

**Build Failures:**
- Check Node.js version compatibility
- Verify all dependencies are installed
- Review build logs for specific errors

### Debug Commands

**Check API health:**
```bash
curl https://your-api-domain.com/api/health
```

**Check logs:**
```bash
# Heroku logs
heroku logs --tail

# PM2 logs
pm2 logs portfolio-api

# System logs
tail -f /var/log/nginx/error.log
```

### Performance Testing

**Load testing with Artillery:**
```bash
npm install -g artillery

# Create config
cat > load-test.yml << EOF
config:
  target: 'https://your-api-domain.com'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: "API Health Check"
    requests:
      - get:
          url: "/api/health"
EOF

# Run test
artillery run load-test.yml
```

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] Code review and testing
- [ ] Environment variables configured
- [ ] Database schema ready
- [ ] SSL certificates obtained
- [ ] Domain name configured
- [ ] CDN setup (if needed)

### Post-Deployment
- [ ] Health checks passing
- [ ] All pages loading correctly
- [ ] Forms working (contact, profile)
- [ ] Mobile responsiveness verified
- [ ] Performance optimized
- [ ] Analytics tracking working
- [ ] Error monitoring active

### Maintenance
- [ ] Regular dependency updates
- [ ] Database backups configured
- [ ] Monitoring alerts set up
- [ ] SSL certificate renewal
- [ ] Security audits scheduled

---

**Need help with deployment?** Check the documentation or create an issue in the repository.
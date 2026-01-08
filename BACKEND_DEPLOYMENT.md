# Backend Deployment Guide - Node.js API Only

## Prerequisites
- Node.js 16+
- MongoDB Atlas account
- Git repository

## Environment Variables Required

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/bhasha_check
PORT=3001
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-64-characters-minimum
```

---

## Render.com Deployment (Recommended - Free Tier)

### Step 1: Prepare Repository
Ensure your code is pushed to GitHub/GitLab.

### Step 2: Create Web Service
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub/GitLab repository
4. Select the `BhashaCheck` repository

### Step 3: Configure Service

**Basic Settings:**
- **Name:** `bhasha-check-api`
- **Region:** Choose closest to your users
- **Branch:** `main`
- **Root Directory:** Leave blank (or specify if backend is in subdirectory)
- **Environment:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm start`

### Step 4: Add Environment Variables
In Render dashboard, add these variables:

```
MONGO_URI = mongodb+srv://your-connection-string
PORT = 10000
NODE_ENV = production
JWT_SECRET = <generate-secure-64-char-string>
```

**Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Step 5: Deploy
1. Click **"Create Web Service"**
2. Wait for build to complete (2-3 minutes)
3. Your API will be live at: `https://bhasha-check-api.onrender.com`

### Step 6: Create Admin User
1. In Render dashboard, go to your service
2. Click **"Shell"** tab
3. Run:
```bash
npm run create-admin
```

**Default Admin Credentials:**
- Email: admin@example.com
- Password: admin123

### Step 7: Test API
```bash
# Test connection
curl https://bhasha-check-api.onrender.com/api/batches

# Should return authentication error (expected - means API is working)
```

---

## Railway.app Deployment (Alternative)

### Step 1: Deploy
1. Go to [Railway.app](https://railway.app)
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repository

### Step 2: Configure
Railway auto-detects Node.js. Add environment variables in dashboard:
- `MONGO_URI`
- `JWT_SECRET`
- `NODE_ENV=production`

### Step 3: Custom Start Command (if needed)
In Railway dashboard:
- Settings → Deploy → Start Command: `npm start`

### Step 4: Get URL
Railway provides a URL like: `https://bhasha-check-production.up.railway.app`

---

## Heroku Deployment

### Step 1: Install Heroku CLI
```bash
# Download from https://devcenter.heroku.com/articles/heroku-cli
# Or using npm
npm install -g heroku
```

### Step 2: Login and Create App
```bash
heroku login
heroku create bhasha-check-api
```

### Step 3: Set Environment Variables
```bash
heroku config:set MONGO_URI="mongodb+srv://..."
heroku config:set JWT_SECRET="your-secret-key-here"
heroku config:set NODE_ENV=production
```

### Step 4: Deploy
```bash
git push heroku main
```

### Step 5: Create Admin
```bash
heroku run npm run create-admin
```

### Step 6: View Logs
```bash
heroku logs --tail
```

Your API: `https://bhasha-check-api.herokuapp.com`

---

## DigitalOcean App Platform

### Step 1: Create App
1. Go to [DigitalOcean Apps](https://cloud.digitalocean.com/apps)
2. Click **"Create App"**
3. Connect GitHub repository

### Step 2: Configure
- **Type:** Web Service
- **Build Command:** `npm install`
- **Run Command:** `npm start`
- **HTTP Port:** 3001 (or 8080)

### Step 3: Environment Variables
Add in App Platform settings:
- `MONGO_URI`
- `JWT_SECRET`
- `NODE_ENV=production`

### Step 4: Deploy
Click **"Create Resources"** → Deploy starts automatically

---

## VPS Deployment (Ubuntu/Debian)

### Step 1: Connect to Server
```bash
ssh user@your-server-ip
```

### Step 2: Install Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Step 3: Install PM2
```bash
sudo npm install -g pm2
```

### Step 4: Clone Repository
```bash
cd /var/www
git clone https://github.com/yourusername/BhashaCheck.git
cd BhashaCheck
```

### Step 5: Install Dependencies
```bash
npm install
```

### Step 6: Configure Environment
```bash
nano .env
```
Add your environment variables, then save (Ctrl+X, Y, Enter)

### Step 7: Import Data (Optional)
```bash
npm run import
npm run create-admin
```

### Step 8: Start with PM2
```bash
pm2 start server.js --name bhasha-api
pm2 save
pm2 startup
# Run the command PM2 outputs
```

### Step 9: Configure Firewall
```bash
sudo ufw allow 3001
# Or if using nginx as reverse proxy
sudo ufw allow 80
sudo ufw allow 443
```

### Step 10: Setup Nginx Reverse Proxy (Optional)
```bash
sudo nano /etc/nginx/sites-available/bhasha-api
```

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

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

```bash
sudo ln -s /etc/nginx/sites-available/bhasha-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 11: SSL Certificate
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourdomain.com
```

---

## Docker Deployment (Optional)

### Create Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3001

CMD ["npm", "start"]
```

### Build and Run
```bash
# Build image
docker build -t bhasha-api .

# Run container
docker run -d \
  -p 3001:3001 \
  -e MONGO_URI="mongodb+srv://..." \
  -e JWT_SECRET="your-secret" \
  -e NODE_ENV=production \
  --name bhasha-api \
  bhasha-api
```

---

## API Endpoints Reference

Once deployed, your API will have these endpoints:

### Public
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Protected (Requires JWT Token)
- `GET /api/auth/me` - Get current user
- `GET /api/batches` - Get all batches
- `GET /api/batch/:batch/files` - Get files in batch
- `GET /api/batch/:batch/file/:file` - Get segments
- `POST /api/save` - Save RSML annotation

### Admin Only
- `GET /api/auth/pending-users` - Get pending users
- `PUT /api/auth/approve/:userId` - Approve user
- `DELETE /api/auth/reject/:userId` - Reject user

---

## Testing Deployment

### 1. Health Check
```bash
curl https://your-api-url.com/api/batches
```

### 2. Login Test
```bash
curl -X POST https://your-api-url.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

### 3. Protected Endpoint Test
```bash
curl https://your-api-url.com/api/batches \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## CORS Configuration for Frontend

If your frontend is on a different domain, update `server.js`:

```javascript
const corsOptions = {
  origin: 'https://your-frontend-domain.com',
  credentials: true
};

app.use(cors(corsOptions));
```

Or allow multiple origins:

```javascript
const allowedOrigins = [
  'https://your-frontend.com',
  'http://localhost:5173'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));
```

---

## Monitoring & Logs

### Render
- View logs in Render dashboard → Your service → Logs

### Heroku
```bash
heroku logs --tail
```

### PM2 (VPS)
```bash
pm2 logs bhasha-api
pm2 monit
pm2 restart bhasha-api
```

---

## Database Management

### Backup MongoDB
```bash
mongodump --uri="your-mongodb-uri" --out=./backup
```

### Restore MongoDB
```bash
mongorestore --uri="your-mongodb-uri" ./backup
```

---

## Security Checklist

- ✅ JWT_SECRET is strong and unique
- ✅ MongoDB connection string is secured
- ✅ Environment variables not in code
- ✅ HTTPS enabled
- ✅ CORS properly configured
- ⚠️ Change default admin password
- ⚠️ Add rate limiting (recommended)
- ⚠️ Implement request validation
- ⚠️ Add logging middleware

---

## Quick Deploy Commands

### Render (Recommended)
```
Build: npm install
Start: npm start
Add env vars in dashboard
```

### Heroku
```bash
heroku create bhasha-check-api
heroku config:set MONGO_URI="..." JWT_SECRET="..." NODE_ENV=production
git push heroku main
heroku run npm run create-admin
```

### VPS
```bash
git clone <repo>
cd BhashaCheck
npm install
nano .env  # Add environment variables
npm run create-admin
pm2 start server.js --name bhasha-api
pm2 save && pm2 startup
```

---

## Troubleshooting

**Port Issues:**
- Use `process.env.PORT || 3001` in server.js (already configured)
- Most platforms auto-assign PORT

**MongoDB Connection:**
- Whitelist IP: 0.0.0.0/0 in MongoDB Atlas
- Check connection string format
- Ensure network access is enabled

**JWT Errors:**
- Verify JWT_SECRET is set
- Check token expiration (currently 7 days)

**CORS Errors:**
- Update origin in corsOptions
- Ensure credentials: true if using cookies

---

Your backend API is now live and ready to receive requests from any frontend application!

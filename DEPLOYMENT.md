# Deployment Steps for RSML Speech Annotator

## Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB)
- Git

## Step 1: Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd BhashaCheck

# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

## Step 2: Environment Configuration

Create `.env` file in the root directory:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/bhasha_check
PORT=3001
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-change-in-production-2024
```

## Step 3: Database Setup

```bash
# Import CSV data to MongoDB (if needed)
npm run import

# Create admin user
npm run create-admin
```

Default admin credentials:
- Email: admin@example.com
- Password: admin123

## Step 4: Build Frontend

```bash
# Build React frontend for production
cd client
npm run build
cd ..
```

This creates optimized static files in the `public` folder.

## Step 5: Start Application

```bash
# Start the Node.js server
npm start
```

The application will be available at `http://localhost:3001`

## Deployment Options

### Option 1: Render.com (Recommended)

1. **Create a new Web Service on Render**
   - Connect your GitHub repository
   - Select "Node" environment

2. **Configure Build Settings**
   ```
   Build Command: npm install && cd client && npm install && npm run build && cd ..
   Start Command: npm start
   ```

3. **Environment Variables**
   Add in Render dashboard:
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `PORT`: 10000 (Render's default, or auto-detect)
   - `NODE_ENV`: production
   - `JWT_SECRET`: Generate a secure random string

4. **Static Files**
   - Root Directory: Leave empty (root)
   - Publish Directory: public

### Option 2: Heroku

1. **Create Heroku App**
   ```bash
   heroku create your-app-name
   ```

2. **Set Environment Variables**
   ```bash
   heroku config:set MONGO_URI="your-mongodb-uri"
   heroku config:set JWT_SECRET="your-secret-key"
   heroku config:set NODE_ENV=production
   ```

3. **Deploy**
   ```bash
   git push heroku main
   ```

4. **Create Admin User**
   ```bash
   heroku run npm run create-admin
   ```

### Option 3: DigitalOcean App Platform

1. **Create New App**
   - Connect GitHub repository
   - Select Node.js

2. **Build Settings**
   - Build Command: `npm install && cd client && npm install && npm run build && cd ..`
   - Run Command: `npm start`

3. **Environment Variables**
   Set in App Platform dashboard:
   - MONGO_URI
   - JWT_SECRET
   - NODE_ENV=production

### Option 4: VPS (Ubuntu/Debian)

1. **Install Node.js and PM2**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   sudo npm install -g pm2
   ```

2. **Clone and Setup**
   ```bash
   git clone <repo-url>
   cd BhashaCheck
   npm install
   cd client && npm install && npm run build && cd ..
   ```

3. **Configure Environment**
   ```bash
   nano .env
   # Add your environment variables
   ```

4. **Start with PM2**
   ```bash
   pm2 start server.js --name bhasha-check
   pm2 save
   pm2 startup
   ```

5. **Setup Nginx Reverse Proxy** (Optional)
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## Step 6: Post-Deployment

1. **Create Admin Account**
   - If using cloud platform: Run script via CLI
   - Or register via UI and manually promote in MongoDB

2. **Test Authentication**
   - Visit your deployment URL
   - Login with admin credentials
   - Create a test user and approve it

3. **Test Annotation Flow**
   - Select batch and file
   - Load segments
   - Test RSML annotation
   - Save changes

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| MONGO_URI | MongoDB connection string | mongodb+srv://user:pass@cluster.mongodb.net/db |
| PORT | Server port | 3001 (or auto-detect) |
| NODE_ENV | Environment mode | production |
| JWT_SECRET | Secret key for JWT tokens | Random 64-char string |

## Health Check Endpoint

The server automatically serves the frontend at `/` and API at `/api/*`

Check server health:
```bash
curl https://your-app.com/api/batches
```

## Troubleshooting

### Build Fails
- Ensure Node.js version is 16+
- Check that all dependencies are in package.json
- Verify MongoDB connection string

### 404 Errors
- Check that frontend build completed successfully
- Verify `public` folder exists with built files
- Check server.js static file configuration

### Authentication Issues
- Verify JWT_SECRET is set
- Check MongoDB connection
- Ensure admin user exists

### CORS Errors
- In production, frontend is served from same origin
- No CORS needed when deployed together

## Database Backup

```bash
# Export data
mongodump --uri="<your-mongodb-uri>" --out=./backup

# Import data
mongorestore --uri="<your-mongodb-uri>" ./backup
```

## Monitoring

### Using PM2 (VPS)
```bash
pm2 logs bhasha-check
pm2 monit
pm2 restart bhasha-check
```

### Using Render/Heroku
- Check platform dashboard for logs
- Set up monitoring alerts
- Configure auto-scaling if needed

## SSL/HTTPS

Most platforms (Render, Heroku, DigitalOcean) provide automatic SSL certificates.

For VPS with Nginx:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

## Performance Optimization

1. **Enable compression** (already configured in server.js)
2. **Use CDN** for static assets
3. **Enable MongoDB indexes** (already configured in models)
4. **Set up caching** for API responses
5. **Monitor database queries**

## Security Checklist

- ✅ JWT tokens for authentication
- ✅ Password hashing with bcrypt
- ✅ Environment variables for secrets
- ✅ HTTPS in production
- ✅ CORS properly configured
- ✅ MongoDB connection string secured
- ⚠️ Change default admin password
- ⚠️ Implement rate limiting (recommended)
- ⚠️ Add CSRF protection (recommended)

## Scaling Considerations

1. **Horizontal Scaling**: Deploy multiple instances behind load balancer
2. **Database**: Use MongoDB Atlas auto-scaling
3. **Static Assets**: Serve via CDN
4. **Session Storage**: Use Redis for JWT blacklisting (if needed)

## Maintenance

```bash
# Update dependencies
npm update
cd client && npm update

# Security audit
npm audit fix

# Database maintenance
# Regular backups
# Monitor disk usage
# Optimize indexes
```

---

## Quick Deploy to Render (Recommended)

1. Push code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Click "New +" → "Web Service"
4. Connect your repository
5. Configure:
   - Name: bhasha-check
   - Environment: Node
   - Build: `npm install && cd client && npm install && npm run build && cd ..`
   - Start: `npm start`
6. Add environment variables
7. Click "Create Web Service"
8. Once deployed, run: `npm run create-admin` via Render Shell

Your app will be live at: `https://bhasha-check.onrender.com`

# Frontend Deployment to Vercel

## Quick Deploy Steps

### 1. Push Code to GitHub
```bash
git add .
git commit -m "Configure frontend for Vercel deployment"
git push origin main
```

### 2. Deploy to Vercel

#### Option A: Vercel Dashboard (Easiest)
1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

5. Add Environment Variable:
   - Key: `VITE_API_BASE_URL`
   - Value: `https://bhasharsml.onrender.com/api`

6. Click **"Deploy"**

#### Option B: Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy from client directory
cd client
vercel

# Follow prompts:
# - Set root to current directory
# - Framework: Vite
# - Build command: npm run build
# - Output directory: dist

# Set environment variable
vercel env add VITE_API_BASE_URL
# Enter: https://bhasharsml.onrender.com/api
# Select: Production

# Deploy to production
vercel --prod
```

### 3. Update Backend CORS on Render

1. Go to your Render dashboard
2. Select your backend service
3. Go to **Environment** tab
4. Add new environment variable:
   - Key: `CORS_ORIGINS`
   - Value: `https://your-app.vercel.app`
   
   **Replace** `your-app.vercel.app` with your actual Vercel domain (you'll get this after deployment)

5. Example with multiple origins:
   ```
   CORS_ORIGINS=https://your-app.vercel.app,https://your-app-git-main.vercel.app,https://bhasharsml.onrender.com
   ```

6. Save - Render will automatically redeploy

### 4. Test Deployment

Visit your Vercel URL (e.g., `https://your-app.vercel.app`)

**Test Flow:**
1. Should see login page
2. Try logging in with admin credentials
3. Check browser console for any CORS errors
4. Verify API calls are going to your Render backend

## Environment Variables Reference

### Frontend (.env files)

**Development** (`client/.env.development`):
```env
VITE_API_BASE_URL=http://localhost:3001/api
```

**Production** (`client/.env.production`):
```env
VITE_API_BASE_URL=https://bhasharsml.onrender.com/api
```

**Vercel Dashboard**:
- `VITE_API_BASE_URL` = `https://bhasharsml.onrender.com/api`

### Backend (Render)

**CORS Configuration**:
```env
CORS_ORIGINS=https://your-app.vercel.app,https://your-app-git-main.vercel.app
```

## Custom Domain (Optional)

### Add Custom Domain to Vercel
1. Go to Vercel dashboard → Your project → Settings → Domains
2. Add your domain (e.g., `annotator.yourdomain.com`)
3. Follow DNS configuration instructions

### Update Backend CORS
Add your custom domain to `CORS_ORIGINS`:
```
CORS_ORIGINS=https://annotator.yourdomain.com,https://your-app.vercel.app
```

## Troubleshooting

### CORS Errors
**Problem:** `Access to XMLHttpRequest has been blocked by CORS policy`

**Solution:**
1. Verify `CORS_ORIGINS` is set correctly on Render
2. Check that your Vercel URL matches exactly (include https://)
3. Wait for Render to redeploy after env var change

### API Calls Failing
**Problem:** API returns 404 or doesn't connect

**Solution:**
1. Check `VITE_API_BASE_URL` in Vercel environment variables
2. Verify Render backend is running: `https://bhasharsml.onrender.com`
3. Test backend directly: `curl https://bhasharsml.onrender.com/api/batches`

### Login Not Working
**Problem:** Login returns 401 or fails

**Solution:**
1. Verify JWT tokens are being sent
2. Check browser console for errors
3. Ensure admin user exists: Run `npm run create-admin` on Render shell

### Build Fails on Vercel
**Problem:** Build command fails

**Solution:**
1. Ensure `Root Directory` is set to `client`
2. Verify `package.json` exists in client folder
3. Check build logs for missing dependencies
4. Try building locally: `cd client && npm run build`

### 404 on Page Refresh
**Problem:** Refreshing page shows 404

**Solution:**
- `vercel.json` should already be configured for SPA routing
- Verify `vercel.json` exists in `client` folder
- Redeploy if needed

## File Structure

```
BhashaCheck/
├── client/                      # Frontend (Vercel)
│   ├── .env.development        # Local API URL
│   ├── .env.production         # Production API URL (template)
│   ├── vercel.json             # Vercel SPA config
│   ├── src/
│   │   └── services/
│   │       └── api.js          # Uses VITE_API_BASE_URL
│   └── ...
├── server.js                    # Backend with CORS config
└── ...
```

## Deployment Checklist

- [ ] Push code to GitHub
- [ ] Deploy frontend to Vercel
- [ ] Set `VITE_API_BASE_URL` in Vercel
- [ ] Get Vercel deployment URL
- [ ] Add Vercel URL to `CORS_ORIGINS` on Render
- [ ] Wait for Render to redeploy
- [ ] Test login functionality
- [ ] Test API calls
- [ ] (Optional) Add custom domain

## Preview Deployments

Vercel automatically creates preview deployments for:
- Every pull request
- Every push to non-main branches

Each preview gets its own URL. To allow them:
```env
CORS_ORIGINS=https://*.vercel.app
```
Or add specific preview URLs to CORS_ORIGINS.

## Production vs Development

**Development (localhost:5173):**
- Uses Vite dev server
- API calls proxied through Vite (vite.config.js)
- Or directly to localhost:3001/api

**Production (Vercel):**
- Optimized static build
- API calls to Render backend
- CDN-cached assets
- Automatic HTTPS

## Monitoring

### Vercel
- View deployment logs in Vercel dashboard
- Real-time function logs (if using serverless functions)
- Analytics available in Pro plan

### Check API Connection
```bash
# From browser console on Vercel deployment
fetch('https://bhasharsml.onrender.com')
  .then(r => r.json())
  .then(console.log)
```

## Updating Deployment

### Update Code
```bash
git add .
git commit -m "Update frontend"
git push origin main
# Vercel auto-deploys
```

### Update Environment Variables
1. Vercel Dashboard → Project → Settings → Environment Variables
2. Edit variable
3. Redeploy (or auto-redeploys on next push)

### Force Redeploy
```bash
vercel --prod --force
```

## Cost

**Vercel Free Tier:**
- 100GB bandwidth/month
- Unlimited websites
- Automatic SSL
- Global CDN
- Perfect for this project

**Render Free Tier (Backend):**
- Spins down after 15 min inactivity
- First request after sleep takes ~30-60 seconds
- Fine for development/testing

---

## Your URLs After Deployment

- **Frontend (Vercel):** `https://your-app.vercel.app`
- **Backend (Render):** `https://bhasharsml.onrender.com`
- **API Endpoint:** `https://bhasharsml.onrender.com/api`

**Remember to:**
1. Update `CORS_ORIGINS` on Render with your actual Vercel URL
2. Test the complete authentication flow after deployment
3. Change admin password after first login

🎉 Your app is now deployed and accessible worldwide!

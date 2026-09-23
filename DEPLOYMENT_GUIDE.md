# CareConnect Deployment Guide

## Prerequisites
- GitHub account
- Render account (free tier available)
- Vercel account (free tier available)
- MongoDB Atlas account (free tier available)
- Domain name (optional)

## Step 1: Setup GitHub Repository

### 1.1 Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `careconnect`
3. Description: `AI-Powered Home Services Booking Platform`
4. Make it **Private** (recommended for security)
5. Don't initialize with README (we have one)
6. Click "Create repository"

### 1.2 Push Code to GitHub
```bash
cd "D:\Mern Projects\CareConnect"
git add .
git commit -m "Initial commit - CareConnect MERN application"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/careconnect.git
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username**

## Step 2: Setup MongoDB Atlas

### 2.1 Create MongoDB Atlas Cluster
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up/login
3. Create a new cluster:
   - Choose "Free" tier (M0)
   - Select a region closest to your users
   - Cluster name: `careconnect-cluster`
4. Wait for cluster creation (2-5 minutes)

### 2.2 Configure Database Access
1. Go to "Database Access" → "Add New Database User"
2. Username: `careconnect_admin`
3. Password: (generate a strong password - **save this!**)
4. Database User Privileges: "Read and write to any database"
5. Click "Add User"

### 2.3 Configure Network Access
1. Go to "Network Access" → "Add IP Address"
2. For development: "Allow Access from Anywhere" (0.0.0.0/0)
3. For production: Add specific IP addresses or use VPC peering
4. Click "Confirm"

### 2.4 Get Connection String
1. Go to "Database" → "Connect" → "Connect your application"
2. Choose "Node.js" and version
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Save this string: `mongodb+srv://careconnect_admin:PASSWORD@careconnect-cluster.xxxxx.mongodb.net/careconnect?retryWrites=true&w=majority`

## Step 3: Deploy Backend to Render

### 3.1 Create Render Account
1. Go to https://render.com
2. Sign up/login with GitHub
3. Authorize Render to access your GitHub

### 3.2 Create Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub `careconnect` repository
3. Configure the service:

**Name**: `careconnect-backend`

**Root Directory**: `backend`

**Build Command**: `npm install`

**Start Command**: `npm start`

**Environment Variables** (add these):
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://careconnect_admin:YOUR_PASSWORD@careconnect-cluster.xxxxx.mongodb.net/careconnect?retryWrites=true&w=majority
CLIENT_ORIGINS=https://YOUR_FRONTEND_URL.vercel.app
CORS_CREDENTIALS=false
JWT_SECRET=GENERATE_LONG_RANDOM_SECRET_HERE
JWT_EXPIRES_IN=1d
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
GEMINI_MODEL=gemini-2.5-flash
```

4. Click "Create Web Service"
5. Wait for deployment (5-10 minutes)
6. Copy the backend URL: `https://careconnect-backend.onrender.com`

### 3.3 Verify Backend Deployment
1. Go to the Render dashboard
2. Click on your service
3. Check the logs for any errors
4. Test the health endpoint: `https://careconnect-backend.onrender.com/api/v1/health`

## Step 4: Deploy Frontend to Vercel

### 4.1 Create Vercel Account
1. Go to https://vercel.com
2. Sign up/login with GitHub
3. Authorize Vercel to access your GitHub

### 4.2 Import Project
1. Click "Add New..." → "Project"
2. Select your `careconnect` repository
3. Configure the project:

**Framework Preset**: Vite

**Root Directory**: `frontend`

**Environment Variables** (add these):
```
VITE_API_BASE_URL=https://careconnect-backend.onrender.com/api/v1
VITE_APP_NAME=CareConnect
```

4. Click "Deploy"
5. Wait for deployment (2-5 minutes)
6. Copy the frontend URL: `https://careconnect.vercel.app`

### 4.3 Update Backend CORS
1. Go back to Render dashboard
2. Click on `careconnect-backend` service
3. Go to "Environment" section
4. Update `CLIENT_ORIGINS` to include your Vercel URL:
   ```
   CLIENT_ORIGINS=https://careconnect.vercel.app
   ```
5. Save changes (this will trigger a redeploy)

## Step 5: Configure Domain (Optional)

### 5.1 Configure Custom Domain on Vercel
1. Go to Vercel project settings
2. Domains → Add Domain
3. Add your custom domain
4. Update DNS records as instructed

### 5.2 Update Frontend Environment Variable
1. If using custom domain, update `VITE_API_BASE_URL` in Vercel
2. Update `CLIENT_ORIGINS` in Render

## Step 6: Test Deployment

### 6.1 Test Backend
```bash
curl https://careconnect-backend.onrender.com/api/v1/health
```

### 6.2 Test Frontend
1. Open your Vercel URL in browser
2. Try to register a new user
3. Try to login
4. Try to create a service request

### 6.3 Test Integration
1. Create service request from frontend
2. Check if it appears in backend database
3. Test API endpoints
4. Check browser console for errors

## Step 7: Post-Deployment Setup

### 7.1 Seed Database
1. SSH into Render backend (optional) or use seeding endpoint
2. Run seeding script to populate initial categories
3. Create test users for different roles

### 7.2 Monitor Logs
- **Render**: Check logs in dashboard
- **Vercel**: Check logs in deployment dashboard
- **MongoDB Atlas**: Check database metrics

### 7.3 Set Up Monitoring (Optional)
- Render provides basic monitoring
- Consider setting up error tracking (Sentry)
- Set up uptime monitoring

## Troubleshooting

### Common Issues

**Backend deployment fails:**
- Check logs in Render dashboard
- Verify environment variables are set correctly
- Ensure MongoDB connection string is correct
- Check if MongoDB Atlas allows access from Render IPs

**Frontend can't connect to backend:**
- Verify `VITE_API_BASE_URL` is correct
- Check CORS settings in backend
- Ensure backend is running
- Check browser console for CORS errors

**Database connection fails:**
- Verify MongoDB Atlas connection string
- Check network access settings in Atlas
- Ensure database user has correct permissions
- Check if cluster is running

**Environment variables not working:**
- Restart services after adding environment variables
- Verify variable names match exactly
- Check for typos in variable values

## Security Considerations

1. **Never commit .env files** - they're in .gitignore
2. **Use strong secrets** for JWT_SECRET
3. **Rotate secrets regularly**
4. **Use environment-specific configurations**
5. **Enable HTTPS** (automatic on Render/Vercel)
6. **Regularly update dependencies**
7. **Monitor for security vulnerabilities**

## Continuous Deployment

Both Render and Vercel support automatic deployments:
- Push to GitHub main branch
- Services automatically redeploy
- Frontend builds automatically
- Backend installs dependencies and restarts

## Production Checklist

- [ ] GitHub repository created and pushed
- [ ] MongoDB Atlas cluster configured
- [ ] Backend deployed to Render
- [ ] Frontend deployed to Vercel
- [ ] Environment variables configured
- [ ] CORS settings updated
- [ ] Health endpoint tested
- [ ] User registration tested
- [ ] Service request creation tested
- [ ] Database seeded with initial data
- [ ] Logs monitored for errors
- [ ] Security best practices reviewed

## Next Steps After Deployment

1. **Monitor initial traffic** - Check logs and performance
2. **Gather user feedback** - Test core functionality
3. **Deploy updates** - Continue development and push changes
4. **Scale as needed** - Upgrade tiers if needed
5. **Set up CI/CD** - Automated testing and deployment

## Support Links

- Render Documentation: https://render.com/docs
- Vercel Documentation: https://vercel.com/docs
- MongoDB Atlas Documentation: https://docs.atlas.mongodb.com
- GitHub Documentation: https://docs.github.com

---

**Note**: This deployment focuses on getting the core application live. Additional features and improvements can be deployed progressively through continuous deployment.

# Deployment Guide - Vercel

## Quick Start Deployment

### Step 1: Prepare for Deployment
1. Make sure all changes are committed to Git:
   ```bash
   git add .
   git commit -m "Final UI redesign with professional styling"
   git push -u origin master
   ```

### Step 2: Deploy to Vercel

**Option A: Using Vercel CLI (Recommended)**
```bash
npm install -g vercel
vercel
```
Follow the interactive prompts to:
- Login to your Vercel account (create one at vercel.com if needed)
- Select "Retail Locator" as project name
- Choose framework: **Vite**
- Build command: `npm run build` (default)
- Output directory: `dist` (default)
- Root directory: `.` (default)

**Option B: Using GitHub (Easiest)**
1. Push your code to GitHub (https://github.com)
2. Go to https://vercel.com
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Vite configuration
6. Click "Deploy"

### Step 3: Environment Variables (Already Configured)
Your Firebase credentials are already in the code, so the app will work immediately without additional setup.

**Note:** For production, consider moving Firebase config to environment variables:
- Go to Vercel Project Settings → Environment Variables
- Add: `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, etc.

### Step 4: Share with Your Instructor
Once deployed, Vercel will provide you with a live URL like:
```
https://retail-locator-xxxxx.vercel.app
```

Share this link with your instructor - the app is fully functional!

---

## What's Included in This Deployment

✅ **Professional UI Design**
- 3-tone color palette (Navy, Teal, Light Gray)
- Responsive layout with sidebar navigation
- Professional icons using react-icons
- Consistent spacing and shadows

✅ **Full Features**
- User authentication (Login/Register with Firebase)
- Dashboard with KPI cards and charts
- Branch management with filtering and search
- Map view for location visualization
- Branch details with risk assessment
- Real-time data with Firestore

✅ **Optimized Performance**
- Vite for fast build times
- Minified production bundle
- Optimized dependencies

---

## Troubleshooting

**Issue: Build fails**
- Clear cache: `npm cache clean --force`
- Reinstall dependencies: `rm -r node_modules && npm install`
- Run build locally: `npm run build`

**Issue: App shows blank page**
- Check browser console (F12) for errors
- Verify Firebase config is correct
- Ensure all dependencies are installed

**Issue: Features not working**
- Check Firestore database rules allow read/write
- Verify Firebase Authentication is enabled
- Check browser console for specific errors

---

## Local Development
```bash
npm install          # Install dependencies
npm run dev          # Start development server (http://localhost:5173)
npm run build        # Build for production
npm run preview      # Preview production build locally
```

---

## After Deployment

1. **Test the app:**
   - Create a test account
   - View dashboard
   - Add/edit branches
   - Check map functionality

2. **Monitor performance:**
   - Visit Vercel Analytics dashboard
   - Check for errors in Real-time logs

3. **Share access:**
   - Provide instructor with the URL
   - They can create their own account or use demo credentials

---

Good luck with your deployment! 🚀

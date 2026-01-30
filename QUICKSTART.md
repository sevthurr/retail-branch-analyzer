# ⚡ QUICK START - How to Run

## 🎯 For First-Time Setup

### 1️⃣ Install Dependencies
```powershell
npm install
```
**Wait:** ~2-3 minutes for all packages to download

### 2️⃣ Configure Firebase
1. Create Firebase project at https://console.firebase.google.com/
2. Enable **Firestore** (test mode)
3. Enable **Authentication** (Email/Password)
4. Copy your `firebaseConfig` object
5. Paste into `src/firebase/config.js`

### 3️⃣ Start Development Server
```powershell
npm run dev
```

### 4️⃣ Open in Browser
```
http://localhost:5173
```

### 5️⃣ Register & Add Demo Data
- Click "Register" on login page
- Create account (email + password)
- On Dashboard, click "Add Demo Data"

**✅ You're ready!**

---

## 🔄 For Daily Development

### Start the App
```powershell
npm run dev
```

### Stop the App
Press `Ctrl + C` in terminal

### View in Browser
```
http://localhost:5173
```

---

## 📦 Production Build

### Create Build
```powershell
npm run build
```
Output: `dist/` folder

### Test Production Build
```powershell
npm run preview
```

---

## 🆘 Troubleshooting

### Problem: "Firebase is not defined"
**Fix:** Edit `src/firebase/config.js` with your Firebase credentials

### Problem: Map not showing
**Fix:** Check internet connection (OpenStreetMap tiles)

### Problem: Can't login
**Fix:** Verify Firebase Auth Email/Password is enabled

### Problem: npm install fails
**Fix:** Ensure Node.js 18+ is installed: `node --version`

### Problem: Port 5173 already in use
**Fix:** Kill process or Vite will suggest port 5174

---

## 📱 Access URLs

| Page | URL |
|------|-----|
| Login | `http://localhost:5173/login` |
| Dashboard | `http://localhost:5173/dashboard` |
| Branches | `http://localhost:5173/branches` |
| Map | `http://localhost:5173/map` |
| Branch Detail | `http://localhost:5173/branch/:id` |

---

## 🔑 Test Account

Create your own or use:
- **Email:** `demo@example.com`
- **Password:** `demo123`

(You'll need to register this in the app first)

---

## 📊 Demo Data

Click **"Add Demo Data"** button on Dashboard to create:
- ✅ 5 branches in Davao City
- ✅ 3 months of performance data each
- ✅ Mix of risk levels (low/medium/high)

---

## 🛠️ Available Scripts

```powershell
npm install      # Install dependencies
npm run dev      # Start dev server (port 5173)
npm run build    # Build for production
npm run preview  # Preview production build
```

---

## 📂 Key Files to Know

| File | Purpose |
|------|---------|
| `src/firebase/config.js` | ⚠️ **YOU MUST EDIT THIS** - Add your Firebase config |
| `src/App.jsx` | Main app routing |
| `src/pages/` | All page components |
| `src/components/` | Reusable UI components |
| `src/utils/` | Helper functions |
| `package.json` | Dependencies list |

---

## ✅ Pre-Demo Checklist

Before your presentation:

- [ ] Firebase configured correctly
- [ ] `npm install` completed
- [ ] `npm run dev` running
- [ ] Demo data loaded
- [ ] All pages accessible
- [ ] No console errors
- [ ] Internet connection stable

---

## 🎓 For Defense/Presentation

### Open These Tabs Before You Start:
1. `http://localhost:5173/dashboard` - Dashboard
2. `http://localhost:5173/branches` - Branches list
3. `http://localhost:5173/map` - Map view
4. Firebase Console (to show database)

### Demo Flow (10 min):
1. **Login** (30 sec)
2. **Dashboard** - Show cards & chart (2 min)
3. **Branches** - Search, filter, CRUD (2 min)
4. **Map** - Markers, filters, popups (2 min)
5. **Branch Detail** - Analytics, risk, chart (3 min)
6. **Questions** (remaining time)

---

## 🚀 Ready to Go?

```powershell
# Run this command:
npm run dev

# Then open:
http://localhost:5173

# Create account → Add demo data → Explore!
```

---

**Need help?** Check the full README.md for detailed instructions.

**Project working?** You should see:
- ✅ Login page
- ✅ Clean blue header after login
- ✅ Sidebar navigation
- ✅ Dashboard with cards
- ✅ Map with markers
- ✅ Charts displaying data

**Good luck with your demo! 🎉**

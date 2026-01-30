# 🚀 QUICK SETUP CHECKLIST

Follow these steps in order to get your app running:

## ☑️ Step 1: Install Dependencies (2 minutes)

```powershell
cd retail_locator
npm install
```

Wait for all packages to download and install.

## ☑️ Step 2: Create Firebase Project (5 minutes)

1. Go to https://console.firebase.google.com/
2. Click **"Add project"**
3. Name it: `retail-locator`
4. Skip Google Analytics (click Continue)
5. Click **"Create project"**
6. Wait for setup to complete

## ☑️ Step 3: Enable Firestore (2 minutes)

1. In Firebase Console, click **"Firestore Database"**
2. Click **"Create database"**
3. Select **"Start in test mode"**
4. Choose your location (closest region)
5. Click **"Enable"**

## ☑️ Step 4: Enable Authentication (1 minute)

1. Click **"Authentication"** in sidebar
2. Click **"Get started"**
3. Select **"Email/Password"**
4. Toggle it **ON**
5. Click **"Save"**

## ☑️ Step 5: Get Firebase Config (3 minutes)

1. Click **gear icon** (⚙️) > **"Project settings"**
2. Scroll down to **"Your apps"**
3. Click **Web icon** (</>)
4. Register app nickname: `retail-locator-web`
5. DON'T check hosting
6. Click **"Register app"**
7. **COPY the firebaseConfig object**

It looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "retail-locator-xxxxx.firebaseapp.com",
  projectId: "retail-locator-xxxxx",
  storageBucket: "retail-locator-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

## ☑️ Step 6: Configure Your App (1 minute)

1. Open `src/firebase/config.js`
2. Replace the placeholder values:

```javascript
// REPLACE THESE VALUES ⬇️
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",              // ← Paste your apiKey
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",  // ← Paste your authDomain
  projectId: "YOUR_PROJECT_ID",        // ← Paste your projectId
  storageBucket: "YOUR_PROJECT_ID.appspot.com",   // ← Paste your storageBucket
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",  // ← Paste your messagingSenderId
  appId: "YOUR_APP_ID"                 // ← Paste your appId
};
```

3. **Save the file** (Ctrl+S)

## ☑️ Step 7: Run the App (30 seconds)

```powershell
npm run dev
```

You should see:

```
➜  Local:   http://localhost:5173/
```

## ☑️ Step 8: Open in Browser (10 seconds)

1. Open your browser
2. Go to: **http://localhost:5173/**
3. You should see the Login page!

## ☑️ Step 9: Create Your Account (30 seconds)

1. Click **"Don't have an account? Register"**
2. Enter email: `admin@test.com`
3. Enter password: `admin123`
4. Click **"Register"**
5. You're logged in! 🎉

## ☑️ Step 10: Add Demo Data (15 seconds)

1. You'll see the Dashboard
2. Click **"+ Add Demo Data"** button
3. Click **"OK"** on the confirmation
4. Wait 5 seconds
5. You should see summary cards populate with data!

## ✅ YOU'RE DONE!

Now explore:

- **📊 Dashboard**: See overview and charts
- **🏢 Branches**: View/edit the 5 demo branches
- **🗺️ Map View**: See branches on the map (colored by risk)
- **Click any branch** to see detailed analytics

---

## 🆘 Quick Troubleshooting

### "npm install" fails?
→ Make sure you have Node.js 18+ installed: `node --version`

### Map doesn't show?
→ Check internet connection (map tiles load from OpenStreetMap)

### "Firebase not defined" error?
→ Double-check Step 6 - make sure you pasted YOUR config values

### Can't login?
→ Make sure Firebase Auth Email/Password is enabled (Step 4)

### "Permission denied" in Firestore?
→ Check that Firestore is in "test mode" (Step 3)

---

## 📊 What the Demo Data Creates

- **5 Branches** in Davao City:
  - SM City Davao (Low Risk) ✅
  - Matina Town Square (Medium Risk) ⚠️
  - UP Mindanao (Low Risk) ✅
  - J.P. Laurel Ave (High Risk) 🔴
  - Abreeza Mall (Low Risk) ✅

- **3 Months** of performance data per branch (Nov 2025 - Jan 2026)

- **Diverse scenarios**:
  - Profitable branches
  - Struggling branches
  - Seasonal performance
  - Different risk levels

---

## 🎯 Next Steps

1. ✅ Explore the Dashboard charts
2. ✅ View branches on the Map
3. ✅ Click "View Details" on any branch
4. ✅ Try adding a new branch manually
5. ✅ Add a performance record to an existing branch
6. ✅ Watch the risk score update in real-time!

---

**Total Setup Time: ~15 minutes** ⏱️

**Happy analyzing! 🎉📍**

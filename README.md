# Retail Branch Location Performance Analyzer

A GIS-lite Decision Support System for analyzing retail branch performance with interactive maps, risk scoring, and business analytics.

## 🎯 Overview

This web application helps retail business owners and managers:
- Monitor branch performance across multiple locations
- Visualize branches on an interactive map
- Assess risk levels using data-driven scoring
- Make informed decisions about branch operations
- Track key metrics like profit, rent ratio, and sales trends

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Routing**: React Router v6
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth (Email/Password)
- **Maps**: Leaflet + React-Leaflet + OpenStreetMap
- **Charts**: Recharts
- **Styling**: Plain CSS

## 📋 Prerequisites

Before you begin, ensure you have:
- **Node.js** (v18 or higher) and npm installed
- A **Firebase account** (free tier works fine)
- A **code editor** (VS Code recommended)
- Basic knowledge of React

## 🚀 Quick Start Guide

### Step 1: Install Dependencies

Open a terminal in the project directory and run:

```powershell
npm install
```

This will install all required packages:
- react, react-dom, react-router-dom
- firebase
- leaflet, react-leaflet
- recharts
- vite and build tools

### Step 2: Set Up Firebase

#### 2.1 Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter a project name (e.g., "retail-locator")
4. Accept terms and click **Continue**
5. Disable Google Analytics (optional for this project)
6. Click **Create project** and wait for setup to complete

#### 2.2 Enable Firestore Database

1. In your Firebase project, click **"Firestore Database"** in the left sidebar
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development)
4. Select a Cloud Firestore location (choose one closest to you)
5. Click **Enable**

#### 2.3 Enable Authentication

1. Click **"Authentication"** in the left sidebar
2. Click **"Get started"**
3. Click on **"Email/Password"** provider
4. Toggle **Enable** to ON
5. Click **Save**

#### 2.4 Register a Web App

1. In Project Overview, click the **Web icon** (</>) to add a web app
2. Enter an app nickname (e.g., "retail-locator-web")
3. Do NOT check "Also set up Firebase Hosting"
4. Click **Register app**
5. You'll see a `firebaseConfig` object - **COPY THIS!**

#### 2.5 Configure Your App

1. Open `src/firebase/config.js` in your code editor
2. Replace the placeholder values with your Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

3. **Save the file**

### Step 3: Run the Application

Start the development server:

```powershell
npm run dev
```

You should see output like:

```
VITE v5.0.8  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

Open your browser and go to: **http://localhost:5173/**

### Step 4: Create Your First Account

1. You'll see the Login page
2. Click **"Don't have an account? Register"**
3. Enter an email and password (minimum 6 characters)
4. Click **Register**
5. You'll be automatically logged in and redirected to the Dashboard

### Step 5: Add Demo Data

1. On the Dashboard, click the **"+ Add Demo Data"** button
2. Confirm the dialog
3. This will create:
   - 5 sample branches in Davao City
   - 3 months of performance data for each branch
   - Mix of high-performing and struggling branches

### Step 6: Explore the Features

Now you can:

✅ **Dashboard**: View summary cards, charts, and insights  
✅ **Branches**: Add, edit, delete branches; search and filter  
✅ **Map View**: See branches on an interactive map with risk indicators  
✅ **Branch Details**: Click any branch to see detailed analytics and performance records

## 📁 Project Structure

```
retail_locator/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── Layout.jsx        # Main app layout with header & sidebar
│   │   ├── ProtectedRoute.jsx # Route guard for authentication
│   │   ├── BranchForm.jsx    # Form for adding/editing branches
│   │   ├── PerformanceForm.jsx # Form for performance records
│   │   └── RiskBadge.jsx     # Visual risk level indicator
│   │
│   ├── pages/                # Main application pages
│   │   ├── Login.jsx         # Login & registration page
│   │   ├── Dashboard.jsx     # Overview with cards & charts
│   │   ├── Branches.jsx      # Branch list & management
│   │   ├── MapView.jsx       # Interactive Leaflet map
│   │   └── BranchDetail.jsx  # Single branch detailed view
│   │
│   ├── firebase/             # Firebase configuration & helpers
│   │   ├── config.js         # Firebase initialization (YOU EDIT THIS)
│   │   ├── auth.js           # Authentication functions
│   │   └── db.js             # Firestore CRUD operations
│   │
│   ├── utils/                # Utility functions
│   │   ├── analytics.js      # Business metrics calculations
│   │   ├── riskScore.js      # Risk scoring algorithm
│   │   └── format.js         # Formatting helpers
│   │
│   ├── App.jsx               # Main app component with routing
│   ├── main.jsx              # React entry point
│   └── index.css             # Global styles
│
├── package.json              # Dependencies & scripts
├── vite.config.js            # Vite configuration
├── index.html                # HTML template
└── README.md                 # This file
```

## 🗄️ Data Model

### Branches Collection

```javascript
{
  id: "auto-generated",
  name: "SM City Davao Branch",
  address: "SM City Davao, Ecoland, Davao City",
  lat: 7.0731,
  lng: 125.6128,
  branchType: "mall", // mall | roadside | campus | commercial
  openingDate: "2023-01-15", // YYYY-MM-DD
  createdAt: timestamp
}
```

### Performance Records Collection

```javascript
{
  id: "auto-generated",
  branchId: "reference-to-branch",
  month: "2026-01", // YYYY-MM
  sales: 580000,
  rentCost: 120000,
  staffCount: 9,
  operatingHours: 12,
  complaints: 1,
  competitorCount: 3,
  nearbyEstablishments: ["mall", "office", "residential"],
  areaClass: "commercial", // residential | mixed | commercial
  createdAt: timestamp
}
```

## 📊 Analytics & Risk Scoring

### Computed Metrics

- **Profit** = sales - rentCost
- **Rent Ratio** = rentCost / sales (optimal < 35%)
- **Sales per Staff** = sales / staffCount
- **Competition Density** = competitorCount

### Risk Scoring Algorithm (0-100)

The system calculates a risk score based on:

| Condition | Points |
|-----------|--------|
| Profit < 0 | +35 |
| Rent Ratio > 35% | +20 |
| Competitors ≥ 5 | +15 |
| Complaints ≥ 10 | +10 |
| Sales decreasing 3 months | +20 |

**Risk Levels:**
- **Low Risk**: 0-33 points (🟢)
- **Medium Risk**: 34-66 points (🟡)
- **High Risk**: 67-100 points (🔴)

## 🎨 Features Checklist

### ✅ Authentication
- [x] Email/password login
- [x] User registration
- [x] Protected routes
- [x] Logout functionality

### ✅ Branch Management (CRUD)
- [x] Add new branches
- [x] Edit branch information
- [x] Delete branches (cascades to performance records)
- [x] Search by name or address
- [x] Filter by branch type

### ✅ Performance Records (CRUD)
- [x] Add performance records per month
- [x] Edit existing records
- [x] Delete records
- [x] View records sorted by month

### ✅ Map Visualization
- [x] Interactive Leaflet map with OpenStreetMap tiles
- [x] Markers for each branch
- [x] Color-coded by risk level
- [x] Click markers for popups with branch info
- [x] Filter by branch type
- [x] Filter by risk level
- [x] Sidebar with branch list
- [x] Fly-to location on branch selection

### ✅ Analytics & Decision Support
- [x] Dashboard summary cards
- [x] Average profit calculation
- [x] Best branch type identification
- [x] High-risk branch count
- [x] Profit by branch type bar chart
- [x] Sales trend line chart per branch
- [x] Risk factor breakdown
- [x] Detailed metrics on branch detail page

### ✅ Demo Data
- [x] One-click demo data insertion
- [x] 5 branches with diverse performance
- [x] 3 months of data per branch

## 🧪 Testing the Application

### Test Scenario 1: New Branch
1. Go to **Branches** page
2. Click **+ Add Branch**
3. Fill in all required fields
4. Submit and verify it appears in the list

### Test Scenario 2: Performance Tracking
1. Go to a branch detail page
2. Click **+ Add Record**
3. Enter performance data for a month
4. Check that profit and metrics update correctly

### Test Scenario 3: Risk Assessment
1. Create a branch with poor performance (low sales, high rent)
2. Add multiple records showing declining sales
3. Verify the risk badge shows "High Risk"
4. Check that risk factors are listed correctly

### Test Scenario 4: Map Interaction
1. Go to **Map View**
2. Filter by "High Risk"
3. Click a red marker
4. Click "View Details" in popup
5. Verify navigation to detail page

## 🐛 Troubleshooting

### Issue: "Firebase is not defined" error
**Solution**: Make sure you edited `src/firebase/config.js` with your Firebase credentials

### Issue: Map not showing
**Solution**: 
1. Check browser console for errors
2. Ensure you have internet connection (map tiles come from OpenStreetMap)
3. Try refreshing the page

### Issue: Can't login/register
**Solution**: 
1. Verify Firebase Authentication is enabled in Firebase Console
2. Check that Email/Password provider is turned ON
3. Check browser console for specific error messages

### Issue: Firestore permission denied
**Solution**: 
1. Go to Firebase Console > Firestore Database > Rules
2. Make sure you're in "test mode" with these rules:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2025, 3, 1);
    }
  }
}
```

### Issue: Styles look broken
**Solution**: 
1. Clear browser cache
2. Make sure `src/index.css` is imported in `main.jsx`
3. Check that Leaflet CSS is loaded in `index.html`

## 📝 Building for Production

To create a production build:

```powershell
npm run build
```

This creates an optimized build in the `dist/` folder.

To preview the production build locally:

```powershell
npm run preview
```

## 🔐 Security Notes (Important for Production)

⚠️ **Before deploying to production:**

1. **Update Firestore Security Rules** in Firebase Console:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /branches/{branchId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    match /performanceRecords/{recordId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

2. **Enable Firebase App Check** for additional security
3. **Set up proper user roles** if needed
4. **Review Firebase Authentication settings**

## 🎓 Explaining This Project (For Defense)

### Key Technical Concepts

1. **React Components**: Modular, reusable UI pieces
2. **State Management**: Using useState and useEffect hooks
3. **Firebase Integration**: Real-time database with Firestore
4. **Authentication**: Secure user login with Firebase Auth
5. **Routing**: Client-side navigation with React Router
6. **GIS Visualization**: Leaflet library for interactive maps
7. **Data Analytics**: Custom algorithms for business metrics
8. **Responsive Design**: CSS Grid and Flexbox for mobile support

### Business Value

- **Decision Support**: Helps identify underperforming branches
- **Risk Management**: Early warning system for struggling locations
- **Performance Tracking**: Monthly metrics for trend analysis
- **Spatial Analysis**: Geographic visualization of branch network
- **Data-Driven**: Objective scoring based on multiple factors

### Future Enhancements

- Export reports to PDF or Excel
- Email alerts for high-risk branches
- Predictive analytics with machine learning
- Mobile app version
- Multi-user collaboration with roles
- Advanced spatial analysis (heatmaps, clusters)

## 📞 Support

If you encounter issues:
1. Check this README's Troubleshooting section
2. Review browser console for error messages
3. Verify Firebase configuration
4. Check that all dependencies are installed

## 📄 License

This project is created for educational purposes.

---

**Built with ❤️ for retail business optimization**

# System Architecture

## High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐   │
│  │                    React Application                    │   │
│  │                                                          │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │   │
│  │  │   Pages      │  │  Components  │  │   Utils      │ │   │
│  │  │              │  │              │  │              │ │   │
│  │  │ - Login      │  │ - Layout     │  │ - analytics  │ │   │
│  │  │ - Dashboard  │  │ - Forms      │  │ - riskScore  │ │   │
│  │  │ - Branches   │  │ - RiskBadge  │  │ - format     │ │   │
│  │  │ - MapView    │  │ - Protected  │  │              │ │   │
│  │  │ - Detail     │  │              │  │              │ │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘ │   │
│  │         │                  │                  │         │   │
│  │         └──────────────────┼──────────────────┘         │   │
│  │                            │                            │   │
│  │                    ┌───────▼────────┐                  │   │
│  │                    │  Firebase SDK  │                  │   │
│  │                    └───────┬────────┘                  │   │
│  └────────────────────────────┼──────────────────────────┘   │
│                                │                               │
└────────────────────────────────┼───────────────────────────────┘
                                 │
                  ┌──────────────┴──────────────┐
                  │                             │
         ┌────────▼─────────┐         ┌────────▼─────────┐
         │  Firebase Auth   │         │    Firestore     │
         │                  │         │    Database      │
         │ - Email/Pass     │         │                  │
         │ - User Sessions  │         │ - branches       │
         │ - Protected      │         │ - performance    │
         │   Resources      │         │   Records        │
         └──────────────────┘         └──────────────────┘
```

## Component Hierarchy

```
App
├── Router
│   ├── Layout (Header + Sidebar)
│   │   └── Routes
│   │       ├── /login → Login
│   │       ├── /dashboard → Dashboard (Protected)
│   │       │   ├── Summary Cards
│   │       │   ├── Bar Chart (Recharts)
│   │       │   └── Insights List
│   │       ├── /branches → Branches (Protected)
│   │       │   ├── Filters Bar
│   │       │   ├── Branch Table
│   │       │   └── BranchForm (Modal)
│   │       ├── /map → MapView (Protected)
│   │       │   ├── Sidebar (Filters + Branch List)
│   │       │   ├── Leaflet Map
│   │       │   │   └── Markers (with Popups)
│   │       │   └── Legend
│   │       └── /branch/:id → BranchDetail (Protected)
│   │           ├── Branch Info Card
│   │           ├── Metrics Grid
│   │           ├── Risk Factors
│   │           ├── Line Chart (Sales Trend)
│   │           ├── Performance Table
│   │           └── PerformanceForm (Modal)
```

## Data Flow

### 1. Authentication Flow

```
User Input (email/password)
    │
    ▼
Login.jsx (handleSubmit)
    │
    ▼
firebase/auth.js (loginUser)
    │
    ▼
Firebase Authentication Service
    │
    ├─ Success ──▶ Set auth.currentUser ──▶ Navigate to /dashboard
    │
    └─ Error ────▶ Display error message
```

### 2. Branch Data Flow

```
Component Mount
    │
    ▼
firebase/db.js (subscribeToBranches)
    │
    ▼
Firestore onSnapshot listener
    │
    ▼
Real-time updates ──▶ setState(branches)
    │
    ▼
Component Re-renders
    │
    ▼
Display updated branch list
```

### 3. Risk Calculation Flow

```
Branch Detail Page loads
    │
    ▼
Get performance records for branch
    │
    ▼
Sort by month DESC ──▶ Get latest record
    │
    ▼
utils/riskScore.js (calculateRiskScore)
    │
    ├─ Check profit < 0 ────────▶ +35 points
    ├─ Check rentRatio > 0.35 ───▶ +20 points
    ├─ Check competitors >= 5 ───▶ +15 points
    ├─ Check complaints >= 10 ───▶ +10 points
    └─ Check sales declining ────▶ +20 points
          │
          ▼
    Total Risk Score (0-100)
          │
          ▼
    getRiskLevel() ──▶ low/medium/high
          │
          ▼
    Display RiskBadge with color
```

### 4. Map Interaction Flow

```
MapView loads
    │
    ▼
Get all branches + performance records
    │
    ▼
Calculate risk for each branch
    │
    ▼
Apply filters (type, risk level)
    │
    ▼
Create Leaflet markers with custom icons
    │
    ▼
User clicks marker
    │
    ▼
Show Popup with branch info
    │
    ▼
User clicks "View Details" in popup
    │
    ▼
Navigate to /branch/:id
```

## Database Schema

### Firestore Collections

```
firestore/
│
├── branches/
│   ├── {branchId1}
│   │   ├── name: "SM City Davao Branch"
│   │   ├── address: "SM City Davao, Ecoland, Davao City"
│   │   ├── lat: 7.0731
│   │   ├── lng: 125.6128
│   │   ├── branchType: "mall"
│   │   ├── openingDate: "2023-01-15"
│   │   └── createdAt: Timestamp
│   │
│   ├── {branchId2}
│   └── ...
│
└── performanceRecords/
    ├── {recordId1}
    │   ├── branchId: {branchId1}
    │   ├── month: "2026-01"
    │   ├── sales: 580000
    │   ├── rentCost: 120000
    │   ├── staffCount: 9
    │   ├── operatingHours: 12
    │   ├── complaints: 1
    │   ├── competitorCount: 3
    │   ├── nearbyEstablishments: ["mall", "office", "residential"]
    │   ├── areaClass: "commercial"
    │   └── createdAt: Timestamp
    │
    ├── {recordId2}
    └── ...
```

## State Management

### Local Component State (useState)

```javascript
// Example in Branches.jsx
const [branches, setBranches] = useState([]);
const [filteredBranches, setFilteredBranches] = useState([]);
const [searchTerm, setSearchTerm] = useState('');
const [filterType, setFilterType] = useState('all');
const [showForm, setShowForm] = useState(false);
const [editingBranch, setEditingBranch] = useState(null);
```

### Global Auth State

```javascript
// In App.jsx
const [user, setUser] = useState(null);

// Updated by Firebase listener
useEffect(() => {
  const unsubscribe = subscribeToAuthChanges((currentUser) => {
    setUser(currentUser);
  });
  return () => unsubscribe();
}, []);
```

## API Layer (Firebase Functions)

### Authentication (firebase/auth.js)

```
loginUser(email, password) → Promise<{success, user}>
registerUser(email, password) → Promise<{success, user}>
logoutUser() → Promise<{success}>
subscribeToAuthChanges(callback) → unsubscribe function
```

### Database (firebase/db.js)

```
Branches:
  addBranch(data) → Promise<{success, id}>
  updateBranch(id, data) → Promise<{success}>
  deleteBranch(id) → Promise<{success}>
  getBranch(id) → Promise<{success, data}>
  subscribeToBranches(callback) → unsubscribe function

Performance:
  addPerformanceRecord(data) → Promise<{success, id}>
  updatePerformanceRecord(id, data) → Promise<{success}>
  deletePerformanceRecord(id) → Promise<{success}>
  subscribeToPerformanceRecords(branchId, callback) → unsubscribe
  subscribeToAllPerformanceRecords(callback) → unsubscribe

Demo:
  addDemoData() → Promise<{success, message}>
```

## Technology Stack Integration

```
┌─────────────────────────────────────────────────────────┐
│                    Browser Runtime                       │
│                                                          │
│  ┌────────────────────────────────────────────────┐   │
│  │              React 18                           │   │
│  │  - Virtual DOM                                  │   │
│  │  - Hooks (useState, useEffect)                  │   │
│  │  - Component Lifecycle                          │   │
│  └─────────────────┬──────────────────────────────┘   │
│                    │                                    │
│  ┌─────────────────▼──────────────────────────────┐   │
│  │          React Router v6                        │   │
│  │  - Client-side routing                          │   │
│  │  - Protected routes                             │   │
│  │  - Navigation hooks                             │   │
│  └─────────────────┬──────────────────────────────┘   │
│                    │                                    │
│  ┌─────────────────▼──────────────┬─────────────┐   │
│  │                                │             │   │
│  │  ┌──────────────┐  ┌──────────▼─────────┐  │   │
│  │  │  Recharts    │  │  React-Leaflet     │  │   │
│  │  │  - Bar Chart │  │  - Map Container   │  │   │
│  │  │  - Line Chart│  │  - Markers         │  │   │
│  │  │  - Tooltips  │  │  - Popups          │  │   │
│  │  └──────────────┘  └────────────────────┘  │   │
│  │                                              │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
│  ┌──────────────────────────────────────────────┐  │
│  │           Firebase SDK v10                    │  │
│  │  - Authentication                             │  │
│  │  - Firestore (Real-time listeners)            │  │
│  │  - Security Rules                             │  │
│  └──────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

## Build & Development Tools

```
Development:
  Vite → Fast HMR, ES modules
  ESLint → Code quality
  
Build Process:
  1. npm run dev → Vite dev server
  2. npm run build → Production bundle
  3. npm run preview → Test production build

Output:
  dist/
    ├── index.html
    ├── assets/
    │   ├── index-[hash].js
    │   └── index-[hash].css
    └── ...
```

## Security Architecture

```
┌─────────────────────────────────────────────┐
│           Frontend (React App)               │
│                                              │
│  ┌────────────────────────────────────┐    │
│  │   ProtectedRoute Component         │    │
│  │   - Checks auth.currentUser        │    │
│  │   - Redirects to /login if null    │    │
│  └────────────────────────────────────┘    │
│                    │                        │
└────────────────────┼────────────────────────┘
                     │
         ┌───────────▼──────────┐
         │  Firebase Auth       │
         │  - Manages sessions  │
         │  - Returns tokens    │
         └───────────┬──────────┘
                     │
         ┌───────────▼──────────┐
         │  Firestore Rules     │
         │  - Validate auth     │
         │  - Check permissions │
         │  - Deny/Allow access │
         └──────────────────────┘
```

## Performance Optimizations

1. **Real-time listeners** - Only re-render when data changes
2. **Client-side filtering** - Instant search results
3. **Lazy loading** - Branch details loaded on demand
4. **Efficient queries** - Indexed Firestore fields
5. **Memoization** - Charts re-render only when data changes
6. **Code splitting** - Vite handles automatically

## Error Handling

```
User Action
    │
    ▼
Try/Catch in async functions
    │
    ├─ Success ──▶ Update UI with result
    │
    └─ Error ────▶ Log to console
                 ▶ Show user-friendly message
                 ▶ Maintain app stability
```

---

**This architecture supports:**
- ✅ Scalability (Firebase auto-scales)
- ✅ Real-time updates (Firestore listeners)
- ✅ Offline capability (Firebase cache)
- ✅ Security (Firebase Auth + Rules)
- ✅ Maintainability (Modular code structure)
- ✅ Performance (Optimized queries & rendering)

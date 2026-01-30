# 🧪 Testing Guide

## Manual Testing Checklist

Use this checklist to verify all features are working correctly before your demo/defense.

---

## ✅ Pre-Testing Setup

- [ ] Firebase project created
- [ ] Firestore enabled (test mode)
- [ ] Authentication enabled (Email/Password)
- [ ] Firebase config added to `src/firebase/config.js`
- [ ] Dependencies installed (`npm install`)
- [ ] Dev server running (`npm run dev`)
- [ ] Browser open to `http://localhost:5173`

---

## 🔐 Authentication Tests

### Test 1: User Registration
**Steps:**
1. Navigate to `/login`
2. Click "Don't have an account? Register"
3. Enter email: `test@example.com`
4. Enter password: `test123`
5. Click "Register"

**Expected:**
- [ ] User is created in Firebase Auth
- [ ] Automatically logged in
- [ ] Redirected to `/dashboard`
- [ ] No error messages

### Test 2: User Login
**Steps:**
1. Logout (click Logout button)
2. Navigate to `/login`
3. Enter credentials from Test 1
4. Click "Login"

**Expected:**
- [ ] Successfully logs in
- [ ] Redirected to `/dashboard`
- [ ] Email displayed in header
- [ ] Sidebar navigation visible

### Test 3: Protected Routes
**Steps:**
1. Logout
2. Try to access `/dashboard` directly
3. Try to access `/branches` directly

**Expected:**
- [ ] Automatically redirected to `/login`
- [ ] Cannot access protected pages while logged out

### Test 4: Logout
**Steps:**
1. Login
2. Click "Logout" button in header

**Expected:**
- [ ] User logged out
- [ ] Redirected to `/login`
- [ ] Cannot access protected routes

---

## 📊 Dashboard Tests

### Test 5: Dashboard Display
**Steps:**
1. Login
2. Navigate to `/dashboard`
3. Click "Add Demo Data"
4. Confirm dialog

**Expected:**
- [ ] 4 summary cards display
- [ ] Total Branches shows 5
- [ ] Average Profit calculated
- [ ] High Risk count shows 1
- [ ] Best Branch Type shows "Mall"
- [ ] Bar chart displays with data
- [ ] Insights list shows items
- [ ] No loading/error states

### Test 6: Dashboard Insights
**Steps:**
1. On Dashboard
2. Read insights list

**Expected:**
- [ ] Shows "You have 5 branches being monitored"
- [ ] Shows warning about 1 high-risk branch
- [ ] Shows best performing branch type

---

## 🏢 Branch Management Tests

### Test 7: View Branch List
**Steps:**
1. Navigate to `/branches`
2. Observe the table

**Expected:**
- [ ] 5 demo branches displayed
- [ ] Table shows: name, address, type, coordinates, opening date
- [ ] Each row has View/Edit/Delete buttons
- [ ] Branch types shown with colored badges

### Test 8: Search Branches
**Steps:**
1. On Branches page
2. Type "Davao" in search box

**Expected:**
- [ ] Table filters in real-time
- [ ] Shows only branches matching "Davao"
- [ ] Filter results count updates

### Test 9: Filter by Type
**Steps:**
1. On Branches page
2. Select "Mall" from Type dropdown

**Expected:**
- [ ] Shows only mall branches (2)
- [ ] Filter count shows "Showing 2 of 5"
- [ ] Search still works with filter

### Test 10: Add New Branch
**Steps:**
1. On Branches page
2. Click "+ Add Branch"
3. Fill form:
   - Name: "Test Branch"
   - Address: "123 Test St"
   - Lat: 7.1234
   - Lng: 125.5678
   - Type: Roadside
   - Date: Today's date
4. Click "Add Branch"

**Expected:**
- [ ] Form validates required fields
- [ ] Modal closes on submit
- [ ] Success alert appears
- [ ] New branch appears in table
- [ ] Total count increases to 6

### Test 11: Edit Branch
**Steps:**
1. On Branches page
2. Click "Edit" on any branch
3. Change name to "Updated Name"
4. Click "Update Branch"

**Expected:**
- [ ] Form pre-fills with existing data
- [ ] Changes save successfully
- [ ] Modal closes
- [ ] Table updates with new name
- [ ] Success alert appears

### Test 12: Delete Branch
**Steps:**
1. On Branches page
2. Click "Delete" on test branch
3. Confirm deletion

**Expected:**
- [ ] Confirmation dialog appears
- [ ] Branch removed from table
- [ ] Count decreases
- [ ] Success alert appears

### Test 13: Form Validation
**Steps:**
1. Click "+ Add Branch"
2. Click "Add Branch" without filling anything
3. Try invalid coordinates (lat: 100)

**Expected:**
- [ ] Shows "required" errors for empty fields
- [ ] Shows "valid latitude" error for invalid values
- [ ] Form doesn't submit until valid

---

## 🗺️ Map View Tests

### Test 14: Map Display
**Steps:**
1. Navigate to `/map`
2. Wait for map to load

**Expected:**
- [ ] Leaflet map displays
- [ ] OpenStreetMap tiles load
- [ ] All branch markers visible
- [ ] Markers colored by risk (green/yellow/red)
- [ ] Sidebar shows branch list
- [ ] Legend displays at bottom

### Test 15: Map Marker Interaction
**Steps:**
1. On Map View
2. Click any marker

**Expected:**
- [ ] Popup opens
- [ ] Shows branch name, type, latest sales, risk level
- [ ] "View Details" button visible
- [ ] Colors match risk level

### Test 16: Map Filter - Type
**Steps:**
1. On Map View
2. Select "Mall" from Type filter

**Expected:**
- [ ] Only mall markers visible
- [ ] Sidebar list filters
- [ ] Shows "Showing 2 of 5"
- [ ] Other markers hidden

### Test 17: Map Filter - Risk
**Steps:**
1. On Map View
2. Select "High Risk" from Risk filter

**Expected:**
- [ ] Only red markers visible
- [ ] Shows J.P. Laurel branch (high risk)
- [ ] Sidebar updates
- [ ] Shows "Showing 1 of 5"

### Test 18: Sidebar Branch Selection
**Steps:**
1. On Map View
2. Click a branch in sidebar list

**Expected:**
- [ ] Map flies to that location
- [ ] Marker becomes highlighted
- [ ] Smooth animation
- [ ] Can click another branch to fly again

### Test 19: Navigate to Detail from Map
**Steps:**
1. On Map View
2. Click marker popup
3. Click "View Details" in popup

**Expected:**
- [ ] Navigates to `/branch/:id`
- [ ] Branch detail page loads
- [ ] Shows correct branch data

---

## 📈 Branch Detail Tests

### Test 20: Branch Detail Display
**Steps:**
1. Navigate to any branch (click View from Branches page)

**Expected:**
- [ ] Branch name in header
- [ ] Risk badge displayed
- [ ] Branch info card shows address, type, coordinates, opening date
- [ ] Latest performance metrics show (profit, rent ratio, etc.)
- [ ] Performance records table displays
- [ ] Sales trend chart shows

### Test 21: Add Performance Record
**Steps:**
1. On Branch Detail
2. Click "+ Add Record"
3. Fill form:
   - Month: Next month
   - Sales: 500000
   - Rent: 100000
   - Staff: 8
   - Operating Hours: 12
   - Complaints: 2
   - Competitors: 3
   - Nearby: "mall, office"
   - Area: Commercial
4. Click "Add Record"

**Expected:**
- [ ] Form validates
- [ ] Record added to table
- [ ] Metrics update
- [ ] Chart updates with new data point
- [ ] Risk score recalculates
- [ ] Modal closes

### Test 22: Edit Performance Record
**Steps:**
1. On Branch Detail
2. Click "Edit" on any record
3. Change sales to 600000
4. Click "Update Record"

**Expected:**
- [ ] Form pre-fills with data
- [ ] Changes save
- [ ] Table updates
- [ ] Chart updates
- [ ] Metrics recalculate

### Test 23: Delete Performance Record
**Steps:**
1. On Branch Detail
2. Click "Delete" on a record
3. Confirm deletion

**Expected:**
- [ ] Confirmation dialog
- [ ] Record removed from table
- [ ] Chart updates
- [ ] Metrics update

### Test 24: Risk Score Calculation
**Steps:**
1. On Branch Detail for "J.P. Laurel Ave" (high risk)
2. Check risk score and factors

**Expected:**
- [ ] Risk score is 67-100
- [ ] Badge shows "High Risk" (red)
- [ ] Risk Factors section displays
- [ ] Lists specific issues:
  - Negative profit
  - High rent ratio
  - High competition
  - High complaints
  - Declining sales (if applicable)
- [ ] Each factor shows points contributed

### Test 25: Sales Trend Chart
**Steps:**
1. On Branch Detail
2. View sales trend chart

**Expected:**
- [ ] Line chart displays
- [ ] X-axis shows months
- [ ] Y-axis shows sales values
- [ ] Line connects data points
- [ ] Hover shows exact values
- [ ] Minimum 3 data points visible

### Test 26: Metrics Calculation
**Steps:**
1. On Branch Detail
2. Check metrics cards

**Expected:**
- [ ] Profit = Sales - Rent (correct math)
- [ ] Rent Ratio = Rent / Sales (shows %)
- [ ] Sales per Staff = Sales / Staff count
- [ ] Competitors shows count
- [ ] Negative profit shows in red
- [ ] High rent ratio (>35%) shows warning color

---

## 🔄 Real-time Updates Tests

### Test 27: Real-time Branch Updates
**Steps:**
1. Open app in two browser tabs
2. In Tab 1: Add a new branch
3. Switch to Tab 2

**Expected:**
- [ ] Tab 2 automatically shows new branch
- [ ] No page refresh needed
- [ ] Update appears within 1-2 seconds

### Test 28: Real-time Performance Updates
**Steps:**
1. Open same branch detail in two tabs
2. In Tab 1: Add a performance record
3. Switch to Tab 2

**Expected:**
- [ ] Tab 2 shows new record automatically
- [ ] Chart updates
- [ ] Metrics update
- [ ] No refresh needed

---

## 📱 Responsive Design Tests

### Test 29: Mobile View
**Steps:**
1. Open browser dev tools (F12)
2. Toggle device toolbar
3. Select iPhone or similar mobile device
4. Navigate through all pages

**Expected:**
- [ ] Layout adjusts to narrow screen
- [ ] Sidebar becomes horizontal/collapsible
- [ ] Tables scroll horizontally
- [ ] Forms stack vertically
- [ ] Buttons remain clickable
- [ ] Text remains readable
- [ ] No horizontal scrolling (except tables)

---

## 🎯 End-to-End Workflow Tests

### Test 30: Complete User Journey
**Steps:**
1. Start logged out
2. Register new account
3. Add demo data
4. View dashboard
5. Navigate to Map
6. Filter by high risk
7. Click high-risk marker
8. View details
9. Add performance record with better numbers
10. Watch risk score decrease
11. Logout

**Expected:**
- [ ] Smooth flow through all steps
- [ ] No errors or crashes
- [ ] Data persists across navigation
- [ ] Risk score updates correctly
- [ ] Logout successful

---

## 🐛 Error Handling Tests

### Test 31: Invalid Login
**Steps:**
1. Try to login with wrong password

**Expected:**
- [ ] Shows error message
- [ ] Doesn't crash
- [ ] User stays on login page
- [ ] Can retry

### Test 32: Network Error Simulation
**Steps:**
1. Open dev tools → Network tab
2. Set to "Offline"
3. Try to load data

**Expected:**
- [ ] Shows loading state
- [ ] Eventually shows error or cached data
- [ ] Doesn't crash
- [ ] Recovers when back online

### Test 33: Invalid Form Data
**Steps:**
1. Add branch with lat: 999 (invalid)
2. Try to submit

**Expected:**
- [ ] Shows validation error
- [ ] Prevents submission
- [ ] Error message clear
- [ ] Can correct and resubmit

---

## 📊 Data Integrity Tests

### Test 34: Demo Data Integrity
**Steps:**
1. Click "Add Demo Data"
2. Check all 5 branches
3. Check each has 3 performance records

**Expected:**
- [ ] Exactly 5 branches created
- [ ] Each has 3 months of data (Nov, Dec, Jan)
- [ ] Data is realistic
- [ ] Risk levels vary (low/medium/high)
- [ ] No duplicate records

### Test 35: Cascade Delete
**Steps:**
1. Note branch with performance records
2. Delete the branch
3. Check Firestore (Firebase Console)

**Expected:**
- [ ] Branch deleted from database
- [ ] All its performance records also deleted
- [ ] No orphaned records
- [ ] Other branches unaffected

---

## 🎨 UI/UX Tests

### Test 36: Visual Consistency
**Steps:**
1. Navigate through all pages
2. Observe styling

**Expected:**
- [ ] Consistent color scheme
- [ ] Buttons same size/style
- [ ] Fonts consistent
- [ ] Cards have same shadow/border
- [ ] Spacing uniform
- [ ] Icons/emojis display correctly

### Test 37: User Feedback
**Steps:**
1. Perform various actions (add, edit, delete)

**Expected:**
- [ ] Loading states show during async operations
- [ ] Success messages after actions
- [ ] Error messages if something fails
- [ ] Confirmation dialogs for destructive actions
- [ ] Smooth transitions

---

## 🔍 Analytics Tests

### Test 38: Profit Calculation
**Steps:**
1. Create branch
2. Add record: Sales 1000, Rent 300
3. Check profit

**Expected:**
- [ ] Profit = 700
- [ ] Shows in green (positive)
- [ ] Displayed correctly on detail page

### Test 39: Rent Ratio Warning
**Steps:**
1. Create record: Sales 1000, Rent 400
2. Check rent ratio

**Expected:**
- [ ] Ratio = 40%
- [ ] Shows in warning color (>35%)
- [ ] Contributes to risk score

### Test 40: Sales Trend Detection
**Steps:**
1. Add 3 records with declining sales:
   - Month 1: 1000
   - Month 2: 900
   - Month 3: 800
2. Check risk factors

**Expected:**
- [ ] "Declining Sales" appears in risk factors
- [ ] Adds +20 to risk score
- [ ] Shows in factor description

---

## 🚀 Performance Tests

### Test 41: Large Dataset
**Steps:**
1. Add demo data multiple times (5 branches × 5 = 25 branches)
2. Navigate to Branches page
3. Open Map

**Expected:**
- [ ] Page loads within 2-3 seconds
- [ ] Table renders smoothly
- [ ] Map displays all markers
- [ ] No lag when filtering
- [ ] Search is instant

### Test 42: Real-time Performance
**Steps:**
1. Open branch detail
2. Add 10 performance records quickly

**Expected:**
- [ ] Each record appears immediately
- [ ] Chart updates smoothly
- [ ] No stuttering
- [ ] UI remains responsive

---

## 📝 Testing Notes Template

Use this to record your test results:

```
Date: __________
Tester: __________

Test #: ____
Result: PASS / FAIL
Issues: _________________________________
Screenshot: (if applicable)

Notes:
_______________________________________
_______________________________________
```

---

## ✅ Pre-Demo Final Checklist

Before your demonstration/defense:

- [ ] All authentication tests pass
- [ ] All CRUD operations work
- [ ] Map displays correctly
- [ ] Charts render properly
- [ ] Demo data loads successfully
- [ ] Risk scoring calculates correctly
- [ ] Forms validate properly
- [ ] No console errors
- [ ] Clean, professional UI
- [ ] Firebase connection stable

---

## 🎓 Demo Script Suggestion

**For your defense, follow this flow:**

1. **Introduction (1 min)**
   - Project purpose
   - Technologies used

2. **Authentication (1 min)**
   - Show login
   - Show protected routes

3. **Dashboard (2 min)**
   - Load demo data
   - Explain summary cards
   - Show bar chart

4. **Branch Management (2 min)**
   - Show list
   - Add new branch
   - Demonstrate search/filter

5. **Map Visualization (2 min)**
   - Show markers
   - Explain color coding
   - Filter by risk level
   - Click marker → popup

6. **Analytics Deep Dive (3 min)**
   - Open high-risk branch
   - Explain risk factors
   - Show sales trend chart
   - Add new performance record
   - Watch risk score update

7. **Technical Explanation (2 min)**
   - Firebase real-time updates
   - Risk algorithm
   - React components

8. **Questions (remaining time)**

---

**Total Tests: 42**  
**Estimated Testing Time: 2-3 hours for complete run**  
**Recommended: Test at least 2 days before demo**

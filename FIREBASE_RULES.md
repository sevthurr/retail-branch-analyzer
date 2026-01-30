# Firebase Firestore Security Rules

## Development Rules (Current - Test Mode)

These are the rules set during initial setup. They allow **anyone** to read/write your database.  
⚠️ **These expire automatically** - check the timestamp in your Firebase Console.

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2025, 3, 1);
    }
  }
}
```

## Production Rules (Recommended)

Use these rules before deploying to production. They require authentication.

### Option 1: Require Authentication Only

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Branches collection - any authenticated user can read/write
    match /branches/{branchId} {
      allow read: if request.auth != null;
      allow create, update, delete: if request.auth != null;
    }
    
    // Performance records - any authenticated user can read/write
    match /performanceRecords/{recordId} {
      allow read: if request.auth != null;
      allow create, update, delete: if request.auth != null;
    }
  }
}
```

### Option 2: User-Specific Data (Enhanced Security)

If you want each user to only see their own branches:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Branches - users can only access their own branches
    match /branches/{branchId} {
      allow read: if request.auth != null && 
                     request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
                       request.auth.uid == request.resource.data.userId;
      allow update, delete: if request.auth != null && 
                               request.auth.uid == resource.data.userId;
    }
    
    // Performance records - linked to branch owner
    match /performanceRecords/{recordId} {
      allow read: if request.auth != null && 
                     request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
                       request.auth.uid == request.resource.data.userId;
      allow update, delete: if request.auth != null && 
                               request.auth.uid == resource.data.userId;
    }
  }
}
```

**Note**: If using Option 2, you'll need to modify the code to add `userId: auth.currentUser.uid` when creating branches and records.

## How to Update Rules

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click **"Firestore Database"** in the left sidebar
4. Click the **"Rules"** tab at the top
5. Replace the existing rules with the new rules
6. Click **"Publish"**

## Testing Rules

Firebase provides a Rules Simulator in the console:

1. Go to Firestore Database > Rules
2. Click the **"Rules playground"** tab
3. Choose "Authenticated" or "Unauthenticated"
4. Test read/write operations

## Common Rule Functions

```javascript
// Check if user is authenticated
request.auth != null

// Check if user owns the document
request.auth.uid == resource.data.userId

// Check if user is admin (requires custom claims)
request.auth.token.admin == true

// Validate data types
request.resource.data.sales is number

// Validate field exists
request.resource.data.keys().hasAll(['name', 'address'])

// Validate string length
request.resource.data.name.size() <= 100

// Allow only specific fields to be updated
request.resource.data.diff(resource.data).affectedKeys()
  .hasOnly(['sales', 'rentCost', 'staffCount'])
```

## Recommended Production Checklist

- [ ] Update Firestore security rules (use Option 1 or 2 above)
- [ ] Set up Firebase Authentication email verification
- [ ] Enable Firebase App Check for additional security
- [ ] Review and test all CRUD operations
- [ ] Monitor Firebase usage and quotas
- [ ] Set up billing alerts (if using paid plan)
- [ ] Enable audit logging
- [ ] Review Firebase Auth settings (password requirements, etc.)

---

**For this student project, Option 1 (Require Authentication Only) is sufficient.**

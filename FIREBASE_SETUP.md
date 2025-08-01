# Firebase Setup Guide

## 🔥 **Firebase Configuration Issues**

The "Missing or insufficient permissions" error indicates that your Firebase Firestore security rules are too restrictive. Here's how to fix it:

### **Step 1: Install Firebase CLI**
```bash
npm install -g firebase-tools
```

### **Step 2: Login to Firebase**
```bash
firebase login
```

### **Step 3: Initialize Firebase in your project**
```bash
firebase init firestore
```

### **Step 4: Deploy the Security Rules**
```bash
firebase deploy --only firestore:rules
```

## 🔧 **Alternative: Manual Rules Update**

If you can't use Firebase CLI, manually update your Firestore rules in the Firebase Console:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `resume2portfolio`
3. Go to **Firestore Database** → **Rules**
4. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read and write their own portfolios
    match /portfolios/{portfolioId} {
      allow read, write: if request.auth != null;
    }
    
    // Allow authenticated users to read and write their own resume data
    match /resumes/{resumeId} {
      allow read, write: if request.auth != null && request.auth.uid == resumeId;
    }
    
    // Allow authenticated users to read and write their own preferences
    match /userPreferences/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

5. Click **Publish**

## 🚀 **Test the Fix**

After updating the rules:
1. Refresh your application
2. Try publishing a portfolio again
3. Check the browser console for any remaining errors

## 📋 **Troubleshooting**

- **Still getting permission errors?** Make sure you're logged in to the app
- **Network errors?** Check your internet connection
- **Firebase not initialized?** Check the browser console for initialization errors 
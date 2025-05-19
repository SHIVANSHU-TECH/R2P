// src/lib/firebase-admin.js
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// Don't import the entire admin package as it may include browser-specific code
// import * as admin from 'firebase-admin'; <- removing this import

// Make sure environment variables are properly set
const firebaseAdminConfig = {
  credential: cert({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
};

// Check if any Firebase apps have been initialized
const apps = getApps();

// Initialize Firebase Admin if no apps exist
const firebaseAdmin = apps.length === 0 
  ? initializeApp(firebaseAdminConfig) 
  : apps[0];

// Export the admin auth instance
export const adminAuth = getAuth(firebaseAdmin);

// Export a named auth property for compatibility with your middleware
export const auth = adminAuth;
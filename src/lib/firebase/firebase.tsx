// src/lib/firebase/firebase.tsx
'use client';

import { initializeApp, FirebaseApp } from "firebase/app";
import { 
  getAuth, 
  Auth, 
  initializeAuth, 
  browserLocalPersistence 
} from "firebase/auth";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCXTmajGc2DqBtPzJKKWJDCcdy8hsmoSyk",
  authDomain: "resume2portfolio.firebaseapp.com",
  projectId: "resume2portfolio",
  storageBucket: "resume2portfolio.appspot.com", // Fix was needed here
  messagingSenderId: "755501777444",
  appId: "1:755501777444:web:8d3ec7fde6bdd071edceb1",
  measurementId: "G-C6H3G9PKXP"
};

let app: FirebaseApp;
let auth: Auth;
let storage: FirebaseStorage;
let db: Firestore;

if (typeof window !== 'undefined') {
  app = initializeApp(firebaseConfig);
  
  try {
    auth = getAuth(app);
  } catch (e) {
    // Fallback initialization if getAuth fails
    auth = initializeAuth(app, {
      persistence: browserLocalPersistence
    });
  }
  
  storage = getStorage(app);
  db = getFirestore(app);
} else {
  // Server-side dummy values
  app = {} as FirebaseApp;
  auth = {} as Auth;
  storage = {} as FirebaseStorage;
  db = {} as Firestore;
}

export { app, auth, storage, db };
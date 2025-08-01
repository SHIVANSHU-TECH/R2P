// src/lib/firebase/firebase-server.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCXTmajGc2DqBtPzJKKWJDCcdy8hsmoSyk",
  authDomain: "resume2portfolio.firebaseapp.com",
  projectId: "resume2portfolio",
  storageBucket: "resume2portfolio.appspot.com",
  messagingSenderId: "755501777444",
  appId: "1:755501777444:web:8d3ec7fde6bdd071edceb1",
  measurementId: "G-C6H3G9PKXP"
};

// Initialize Firebase for server-side usage
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

export { storage, db }; 
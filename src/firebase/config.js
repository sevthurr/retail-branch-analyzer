// Firebase configuration
// INSTRUCTIONS: Replace these values with your own from Firebase Console
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project (or use existing)
// 3. Add a Web app to your project
// 4. Copy the firebaseConfig object values here

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBUijWFAH_PuSI_DsCEufpTLOQ2hXiqn0w",
  authDomain: "retail-locator-85ac8.firebaseapp.com",
  projectId: "retail-locator-85ac8",
  storageBucket: "retail-locator-85ac8.firebasestorage.app",
  messagingSenderId: "433195423814",
  appId: "1:433195423814:web:2cd70a25ab743c29881247",
  measurementId: "G-GBK31VWBLZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;

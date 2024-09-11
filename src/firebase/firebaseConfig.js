import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth'; // Import Firebase Auth

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD5-PNATFMnDkJ0paCFgQUHywzWbpQAGAM",
  authDomain: "lms-thesis-af928.firebaseapp.com",
  databaseURL: "https://lms-thesis-af928-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "lms-thesis-af928",
  storageBucket: "lms-thesis-af928.appspot.com",
  messagingSenderId: "11348995028",
  appId: "1:11348995028:web:84ca373fe394af01e48441",
  measurementId: "G-HRY7XW7ZZG"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Storage
const storage = getStorage(app);

// Initialize Firebase Auth
const auth = getAuth(app); // This is the added part

// Export Firestore, Storage, and Auth
export { db, storage, auth };

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
const auth = getAuth(app);
const db = getFirestore(app);

// Export auth and db for use in your components
export { auth, db };

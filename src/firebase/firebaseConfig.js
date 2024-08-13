import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyD5-PNATFMnDkJ0paCFgQUHywzWbpQAGAM",
    authDomain: "lms-thesis-af928.firebaseapp.com",
    projectId: "lms-thesis-af928",
    storageBucket: "lms-thesis-af928.appspot.com",
    messagingSenderId: "11348995028",
    appId: "1:11348995028:web:84ca373fe394af01e48441",
    measurementId: "G-HRY7XW7ZZG"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

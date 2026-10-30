// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAScK7LcDFV3WJ46UL1RSVUL-ttFVSlAxO1dgo",
  authDomain: "interview-guard-for-interview.firebaseapp.com",
  projectId: "interview-guard-for-interview",
  storageBucket: "interview-guard-for-interview.firebasestorage.app",
  messagingSenderId: "28130660849",
  appId: "1:28130660849:web:cd5d71c92f4cc86a16b450"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db,storage, app };
export default app;


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // Import Firestore functions
import { getDatabase } from 'firebase/database';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBppriz7eiH_3edRTg3Riyj6TmmvfFhsKA",
  authDomain: "chatbomber-c172f.firebaseapp.com",
  projectId: "chatbomber-c172f",
  storageBucket: "chatbomber-c172f.appspot.com",
  messagingSenderId: "401553152175",
  appId: "1:401553152175:web:d999a4aa7429a2f0925c5a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app); // Get the database object

const db = getFirestore(app); // Initialize Firestore


export { auth, db, database }; // Export both auth and database

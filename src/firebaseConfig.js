// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBhG3aI_r16XsSe7n3xQ5V7r01pP41FHZE",
  authDomain: "autosnip-7948b.firebaseapp.com",
  projectId: "autosnip-7948b",
  storageBucket: "autosnip-7948b.firebasestorage.app",
  messagingSenderId: "166558743492",
  appId: "1:166558743492:web:3888012c736e393a480291",
  measurementId: "G-GDGEPRNL6F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { app, db, analytics };
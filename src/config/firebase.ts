// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAK0E3IaWlmgnxg7Do4oQoAHvoClEcJi5U",
  authDomain: "freight-file-tracker-v2.firebaseapp.com",
  projectId: "freight-file-tracker-v2",
  storageBucket: "freight-file-tracker-v2.firebasestorage.app",
  messagingSenderId: "596797154216",
  appId: "1:596797154216:web:442936d536ecddb6d8f39d",
  measurementId: "G-ER8X8NHC9W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDv3j-WvzJPdlYbrndAAhdPzcTkd77wQkk",
  authDomain: "soup-inbox.firebaseapp.com",
  projectId: "soup-inbox",
  storageBucket: "soup-inbox.firebasestorage.app",
  messagingSenderId: "966988397775",
  appId: "1:966988397775:web:0f5bc9f206a9959e720bba",
  measurementId: "G-M62VP0X1QY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

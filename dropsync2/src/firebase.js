// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAxC2-_wlmrUixLl_n9nuvJAkCghpZcU6Y",
  authDomain: "autods-88833.firebaseapp.com",
  projectId: "autods-88833",
  storageBucket: "autods-88833.firebasestorage.app",
  messagingSenderId: "639937065457",
  appId: "1:639937065457:web:0db668c8ec519c544e5450",
  measurementId: "G-2D25PLGF80"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

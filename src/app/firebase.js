// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCgkFfSMVEd9M2NlCoA1R6q7MvYDJ5O_bc",
  authDomain: "connect-india-enterprise-1ce10.firebaseapp.com",
  projectId: "connect-india-enterprise-1ce10",
  storageBucket: "connect-india-enterprise-1ce10.firebasestorage.app",
  messagingSenderId: "659319915230",
  appId: "1:659319915230:web:22d55d4a9babe77994f84f",
  measurementId: "G-C9SKML1BMZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
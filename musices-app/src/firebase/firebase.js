// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCDzHh-HS6OLIvb-_XO5ptQ7dKKgHdZgGY",
  authDomain: "musices-app.firebaseapp.com",
  projectId: "musices-app",
  storageBucket: "musices-app.appspot.com",
  messagingSenderId: "984749932392",
  appId: "1:984749932392:web:c50295d0d36e19a2b6a0dd",
  measurementId: "G-7VCY6270PT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
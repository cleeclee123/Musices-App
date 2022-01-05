import * as firebase from "firebase/app"
import 'firebase/auth';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCDzHh-HS6OLIvb-_XO5ptQ7dKKgHdZgGY",
  authDomain: "musices-app.firebaseapp.com",
  projectId: "musices-app",
  storageBucket: "musices-app.appspot.com",
  messagingSenderId: "984749932392",
  appId: "1:984749932392:web:c50295d0d36e19a2b6a0dd",
  measurementId: "G-7VCY6270PT"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default { app };
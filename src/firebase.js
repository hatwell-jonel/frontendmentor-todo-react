import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//   authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_FIREBASE_APP_ID,
//   measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
// };

const firebaseConfig = {
  apiKey: "AIzaSyD1QqDNhkRPaVJlRMRPCIwo5t3a_A4HVlk",
  authDomain: "todo-app-d8fd5.firebaseapp.com",
  databaseURL: "https://todo-app-d8fd5-default-rtdb.firebaseio.com",
  projectId: "todo-app-d8fd5",
  storageBucket: "todo-app-d8fd5.appspot.com",
  messagingSenderId: "100911143398",
  appId: "1:100911143398:web:6c8adbc986ecd6d7ce5e27",
  measurementId: "G-78WEY2GG5W",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);

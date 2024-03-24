import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAr6lxIZZ_T2-mWCOV1j-NzlLcr8j3i56Q",
  authDomain: "ncd-mangement-system.firebaseapp.com",
  projectId: "ncd-mangement-system",
  storageBucket: "ncd-mangement-system.appspot.com",
  messagingSenderId: "531691875421",
  appId: "1:531691875421:web:ef1f67a96c6180863eb1b4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getFirestore(app);

export { app, database };
// src/services/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCgTbNKmYBFbBgE0ZA8DtrA7u4zSHSp8qU",
    authDomain: "project-management-app-a06a4.firebaseapp.com",
    projectId: "project-management-app-a06a4",
    storageBucket: "project-management-app-a06a4.appspot.com",
    messagingSenderId: "125016169985",
    appId: "1:125016169985:web:e80bdbf42ea38dc084ea00",
    measurementId: "G-7QGTR1YHFW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Services
const auth = getAuth(app);
const db = getFirestore(app);
export { auth, db };

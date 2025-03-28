import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCV9NApI5q4c8O7VT-DkN2WRQGeNe-tsyY",
    authDomain: "muktimorcha-429fc.firebaseapp.com",
    projectId: "muktimorcha-429fc",
    storageBucket: "muktimorcha-429fc.firebasestorage.app",
    messagingSenderId: "1008093757080",
    appId: "1:1008093757080:web:b72f8c47407798cb3e5aed",
};

// Prevent initializing Firebase multiple times
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };

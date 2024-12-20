// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FB_APIKEY,
    authDomain: process.env.NEXT_PUBLIC_FB_AUTHDOMAIN,
    projectId: process.env.NEXT_PUBLIC_FB_PROJECTID,
    storageBucket: process.env.NEXT_PUBLIC_FB_STORAGEBUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FB_MESSAGINGSENDERID,
    appId: process.env.FB_APPID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, db, auth };
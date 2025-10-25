
import { initializeApp } from "firebase/app";

import { getAuth, GoogleAuthProvider } from "firebase/auth";



const firebaseConfig = {
  apiKey: "AIzaSyDzmMBH4VaHskX6-Tc-8vxkchok25XGGPQ",
  authDomain: "innovathon-d112f.firebaseapp.com",
  projectId: "innovathon-d112f",
  storageBucket: "innovathon-d112f.firebasestorage.app",
  messagingSenderId: "899428158073",
  appId: "1:899428158073:web:1c47d39bc5f17e380ae2a8",
  measurementId: "G-KF4GHBYX7M"
};


const app = initializeApp(firebaseConfig);

 const auth = getAuth(app);
 const googleProvider = new GoogleAuthProvider()
 
 export {app, auth, googleProvider}
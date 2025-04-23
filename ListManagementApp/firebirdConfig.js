// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAiSn71yjvTqL_gWzo95A0-sLEFyLUnJwk",
  authDomain: "birdsiveseen-834d2.firebaseapp.com",
  projectId: "birdsiveseen-834d2",
  storageBucket: "birdsiveseen-834d2.firebasestorage.app",
  messagingSenderId: "480968440799",
  appId: "1:480968440799:web:7de1f676b735cd1851626a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration (replace with your actual config)
const firebaseConfig = {
    apiKey: "AIzaSyDXWHEZM4Q893tLi4TQMuUQWd65yAnKYwg",
    authDomain: "resume-chatbot-25207.firebaseapp.com",
    databaseURL: "https://resume-chatbot-25207-default-rtdb.firebaseio.com",
    projectId: "resume-chatbot-25207",
    storageBucket: "resume-chatbot-25207.firebasestorage.app",
    messagingSenderId: "510885013893",
    appId: "1:510885013893:web:663820dcfec8966b40fcec",
    measurementId: "G-KT3MV5EZ89"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Export Firestore instance
export const db = getFirestore(app);
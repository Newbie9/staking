import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
    apiKey: "AIzaSyAJF4usMCpod-bH00Tw211jj3DHtu8opJI",
    authDomain: "staking-2a1ce.firebaseapp.com",
    projectId: "staking-2a1ce",
    storageBucket: "staking-2a1ce.appspot.com",
    messagingSenderId: "3455903179",
    appId: "1:3455903179:web:614a3e3e18c8a61cab024e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
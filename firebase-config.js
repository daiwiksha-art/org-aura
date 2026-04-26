import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyATn95ESnzITVBGO0_AGsK32ffASdYz1Bk",
  authDomain: "org-aure.firebaseapp.com",
  projectId: "org-aure",
  storageBucket: "org-aure.firebasestorage.app",
  messagingSenderId: "601794577088",
  appId: "1:601794577088:web:31fa6def6c2dfa77bc6325"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
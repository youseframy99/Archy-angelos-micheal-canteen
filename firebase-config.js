// ===== إعدادات Firebase =====
// هتلاقي الإعدادات دي في: Firebase Console > Project settings > عام > "Your apps"
// انسخ القيم من هناك والصقها هنا بدل القيم التجريبية دي

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAygng0_QOZaqcIQIkTniSnRcXL70JSkww",
  authDomain: "canteen-elmalak.firebaseapp.com",
  projectId: "canteen-elmalak",
  storageBucket: "canteen-elmalak.firebasestorage.app",
  messagingSenderId: "769779016973",
  appId: "1:769779016973:web:2300d35c2652dcede93c44",
  measurementId: "G-HJCKESPBP5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };

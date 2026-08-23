import { auth } from "./firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// كل اسم مستخدم بيتحول لإيميل داخلي بالشكل ده عشان Firebase Authentication
// (المستخدم عمره ما هيشوف أو يكتب الجزء ده - بيحصل تلقائي)
const ADMIN_EMAIL_DOMAIN = "@admin.stmikhail-kanisa.local";

const loginForm = document.getElementById('loginForm');
const errorMsg = document.getElementById('errorMsg');
const loginBtn = document.getElementById('loginBtn');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorMsg.textContent = '';

  const username = document.getElementById('username').value.trim().toLowerCase();
  const password = document.getElementById('password').value;

  if (!username || !password) return;

  loginBtn.disabled = true;
  loginBtn.textContent = 'جاري الدخول...';

  const email = username + ADMIN_EMAIL_DOMAIN;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    // لما الدخول ينجح، ننتقل للوحة التحكم
    window.location.href = 'admin-dashboard.html';
  } catch (err) {
    errorMsg.textContent = 'اسم المستخدم أو كلمة السر غلط';
    loginBtn.disabled = false;
    loginBtn.textContent = 'دخول';
  }
});

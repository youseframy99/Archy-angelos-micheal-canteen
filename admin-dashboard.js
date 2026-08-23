import { auth } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const welcomeMsg = document.getElementById('welcomeMsg');
const logoutBtn = document.getElementById('logoutBtn');

// حماية الصفحة: لو مفيش أدمن مسجل دخول، رجّعه لصفحة الدخول فوراً
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = 'admin-login.html';
    return;
  }

  // بنستخرج اسم المستخدم من الإيميل الداخلي (نشيل جزء @admin...)
  const username = user.email.split('@')[0];
  welcomeMsg.textContent = `أهلاً بيك، ${username} 👋`;
});

logoutBtn.addEventListener('click', async () => {
  await signOut(auth);
  window.location.href = 'admin-login.html';
});

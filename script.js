// ===== فتح/قفل القائمة في الموبايل =====
const navToggle = document.getElementById('navToggle');
const siteNav = document.getElementById('siteNav');

navToggle.addEventListener('click', () => {
  const isOpen = siteNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
});

// قفل القائمة تلقائياً لما تدوس على أي رابط (مفيد في الموبايل)
siteNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    siteNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', false);
  });
});

// ===== فلترة الكتالوج =====
// دلوقتي شغالة على بيانات تجريبية بسيطة، وهنستبدلها ببيانات حقيقية من Firebase بعدين
const filterButtons = document.querySelectorAll('.filter-btn');
const catalogGrid = document.getElementById('catalogGrid');

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    renderCatalog(filter);
  });
});

// دالة لعرض المنتجات حسب الفلتر المختار
// لسه من غير بيانات حقيقية - هنوصلها بـ Firebase في الخطوة الجاية
function renderCatalog(filter) {
  // مكان مؤقت لحد ما نضيف مصدر البيانات الحقيقي
  console.log('عرض الكتالوج حسب:', filter);
}
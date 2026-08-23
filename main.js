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

// ===== عرض المنتجات من Firestore =====
import { db } from "./firebase-config.js";
import { collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const categoryLabels = { products: 'منتج', books: 'كتاب', gifts: 'هدية' };
const newArrivalsEl = document.getElementById('newArrivals');
const catalogGridEl = document.getElementById('catalogGrid');
const filterButtons = document.querySelectorAll('.filter-btn');

let allProducts = [];
let currentFilter = 'all';

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderCatalog();
  });
});

function productCard(p) {
  return `
    <div class="product-card">
      ${p.image ? `<img src="${p.image}" alt="${p.name}" class="product-img">` : '<div class="product-img product-img--empty"></div>'}
      <div class="product-info">
        <h4>${p.name}</h4>
        <span class="product-category">${categoryLabels[p.category] || ''}</span>
        <div class="product-bottom">
          <span class="product-price">${p.price} ج.م</span>
          ${p.inStock === false ? '<span class="stock-badge out">نفذت الكمية</span>' : ''}
        </div>
      </div>
    </div>
  `;
}

function renderNewArrivals() {
  const newOnes = allProducts.filter(p => p.isNew);
  if (newOnes.length === 0) {
    newArrivalsEl.innerHTML = '<p class="empty-note">لسه مفيش منتجات جديدة مضافة.</p>';
    return;
  }
  newArrivalsEl.innerHTML = newOnes.map(productCard).join('');
}

function renderCatalog() {
  const filtered = currentFilter === 'all'
    ? allProducts
    : allProducts.filter(p => p.category === currentFilter);

  if (filtered.length === 0) {
    catalogGridEl.innerHTML = '<p class="empty-note">لا يوجد منتجات في هذا القسم حالياً.</p>';
    return;
  }
  catalogGridEl.innerHTML = filtered.map(productCard).join('');
}

// الاستماع لأي تغيير في المنتجات وتحديث الصفحة تلقائياً
onSnapshot(collection(db, "products"), (snapshot) => {
  allProducts = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  renderNewArrivals();
  renderCatalog();
});
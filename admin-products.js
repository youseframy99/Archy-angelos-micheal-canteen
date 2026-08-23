import { db } from "./firebase-config.js";
import { IMGBB_API_KEY } from "./imgbb-config.js";
import {
  collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const productsCol = collection(db, "products");

// عناصر الفورم
const form = document.getElementById('productForm');
const formTitle = document.getElementById('formTitle');
const productIdField = document.getElementById('productId');
const nameField = document.getElementById('pName');
const priceField = document.getElementById('pPrice');
const categoryField = document.getElementById('pCategory');
const stockField = document.getElementById('pStock');
const imageField = document.getElementById('pImage');
const imagePreview = document.getElementById('imagePreview');
const isNewField = document.getElementById('pIsNew');
const formStatus = document.getElementById('formStatus');
const saveBtn = document.getElementById('saveBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const tableBody = document.getElementById('productsTableBody');

let currentImageUrl = ''; // بتتحدث بعد كل رفع صورة ناجح

// عرض معاينة الصورة فور اختيارها
imageField.addEventListener('change', () => {
  const file = imageField.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    imagePreview.src = e.target.result;
    imagePreview.hidden = false;
  };
  reader.readAsDataURL(file);
});

// رفع صورة لـ ImgBB وإرجاع الرابط
async function uploadImageToImgBB(file) {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
    method: 'POST',
    body: formData
  });

  const result = await response.json();
  if (!result.success) throw new Error('فشل رفع الصورة');
  return result.data.url;
}

// حفظ المنتج (إضافة جديد أو تعديل موجود)
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  formStatus.textContent = '';
  formStatus.className = 'form-status';
  saveBtn.disabled = true;
  saveBtn.textContent = 'جاري الحفظ...';

  try {
    let imageUrl = currentImageUrl;

    // لو الأدمن اختار صورة جديدة، ارفعها الأول
    const file = imageField.files[0];
    if (file) {
      formStatus.textContent = 'جاري رفع الصورة...';
      imageUrl = await uploadImageToImgBB(file);
    }

    const productData = {
      name: nameField.value.trim(),
      price: Number(priceField.value),
      category: categoryField.value,
      stock: Number(stockField.value),
      inStock: Number(stockField.value) > 0,
      isNew: isNewField.checked,
      image: imageUrl || ''
    };

    const editingId = productIdField.value;

    if (editingId) {
      await updateDoc(doc(db, "products", editingId), productData);
      formStatus.textContent = 'تم تعديل المنتج بنجاح ✅';
    } else {
      await addDoc(productsCol, productData);
      formStatus.textContent = 'تم إضافة المنتج بنجاح ✅';
    }

    formStatus.className = 'form-status success';
    resetForm();
  } catch (err) {
    formStatus.textContent = 'حصل خطأ، حاول تاني';
    formStatus.className = 'form-status error';
    console.error(err);
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = 'حفظ المنتج';
  }
});

function resetForm() {
  form.reset();
  productIdField.value = '';
  currentImageUrl = '';
  imagePreview.hidden = true;
  formTitle.textContent = 'إضافة منتج جديد';
  cancelEditBtn.hidden = true;
}

cancelEditBtn.addEventListener('click', resetForm);

const LOW_STOCK_THRESHOLD = 5; // أي منتج كميته أقل من أو يساوي الرقم ده يعتبر "قرب يخلص"
const lowStockAlert = document.getElementById('lowStockAlert');
const lowStockList = document.getElementById('lowStockList');

// عرض قائمة المنتجات لحظياً (أي تغيير في Firestore بيتحدث هنا تلقائياً)
onSnapshot(productsCol, (snapshot) => {
  // تحديث تنبيه المخزون المنخفض
  const lowStockItems = [];
  snapshot.forEach((docSnap) => {
    const p = docSnap.data();
    const stock = p.stock ?? 0;
    if (stock > 0 && stock <= LOW_STOCK_THRESHOLD) {
      lowStockItems.push({ name: p.name, stock });
    }
  });

  if (lowStockItems.length > 0) {
    lowStockList.innerHTML = lowStockItems
      .map(item => `<li>${item.name} — باقي ${item.stock} بس</li>`)
      .join('');
    lowStockAlert.hidden = false;
  } else {
    lowStockAlert.hidden = true;
  }

  if (snapshot.empty) {
    tableBody.innerHTML = '<tr><td colspan="7" class="empty-note">لسه مفيش منتجات مضافة.</td></tr>';
    return;
  }

  tableBody.innerHTML = '';
  snapshot.forEach((docSnap) => {
    const p = docSnap.data();
    const id = docSnap.id;

    const categoryLabels = { products: 'منتج', books: 'كتاب', gifts: 'هدية' };

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${p.image ? `<img src="${p.image}" class="table-thumb" alt="">` : '-'}</td>
      <td>${p.name}</td>
      <td>${p.price} ج.م</td>
      <td>${categoryLabels[p.category] || p.category}</td>
      <td>${p.stock ?? 0}</td>
      <td>
        <button class="status-pill ${p.inStock ? 'in-stock' : 'out-stock'}" data-id="${id}" data-instock="${p.inStock}">
          ${p.inStock ? 'متوفر' : 'نفذت الكمية'}
        </button>
      </td>
      <td>
        <div class="row-actions">
          <button class="edit-btn" data-id="${id}">تعديل</button>
          <button class="delete-btn" data-id="${id}">حذف</button>
        </div>
      </td>
    `;
    tableBody.appendChild(row);

    // تعديل
    row.querySelector('.edit-btn').addEventListener('click', () => {
      productIdField.value = id;
      nameField.value = p.name;
      priceField.value = p.price;
      categoryField.value = p.category;
      stockField.value = p.stock ?? 0;
      isNewField.checked = !!p.isNew;
      currentImageUrl = p.image || '';
      if (p.image) {
        imagePreview.src = p.image;
        imagePreview.hidden = false;
      } else {
        imagePreview.hidden = true;
      }
      formTitle.textContent = 'تعديل منتج';
      cancelEditBtn.hidden = false;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // حذف
    row.querySelector('.delete-btn').addEventListener('click', async () => {
      if (!confirm(`متأكد إنك عايز تمسح "${p.name}"؟`)) return;
      await deleteDoc(doc(db, "products", id));
    });

    // تبديل الحالة (متوفر / نفذت الكمية) بضغطة واحدة
    row.querySelector('.status-pill').addEventListener('click', async () => {
      await updateDoc(doc(db, "products", id), { inStock: !p.inStock });
    });
  });
});

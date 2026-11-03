/* Read-only public product data from FastAPI (Firestore-backed).
 * The frontend never reads/writes Firestore directly.
 */
const BASE = (window.THAO_API_BASE_URL || '').trim().replace(/\/$/, '');
const API_READY = /^https?:\/\/[^/]+/i.test(BASE) && !/TEN-BACKEND-CUA-BAN/i.test(BASE);
let current = [];
function broadcast(items) {
  current = Array.isArray(items) ? items : [];
  window.__SHOP_LATEST_POSTS = current;
  window.dispatchEvent(new CustomEvent('shop:products', {detail: current}));
}
async function loadProducts() {
  if (!API_READY) {
    document.querySelectorAll('[data-shop-status]').forEach(el => {
      el.textContent='Chưa cấu hình API Render trong api-config.js';
    });
    return;
  }
  try {
    const response = await fetch(`${BASE}/api/products?limit=200`, {cache: 'no-store', headers:{'Accept':'application/json'}});
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data.items)) throw new Error('Dữ liệu sản phẩm không đúng định dạng');
    broadcast(data.items);
    document.querySelectorAll('[data-shop-status]').forEach(el => {el.textContent='Đã cập nhật sản phẩm';});
  } catch (error) {
    console.warn('Không lấy được sản phẩm từ FastAPI:', error);
    // Do not erase last known products or pretend the backend saved anything.
    document.querySelectorAll('[data-shop-status]').forEach(el => {el.textContent='Không kết nối được máy chủ sản phẩm';});
  }
}
loadProducts();
setInterval(()=>{if(!document.hidden)loadProducts();},60000);
window.addEventListener('focus',()=>loadProducts());
